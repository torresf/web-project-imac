// Client ID and API key from the Developer Console
var CLIENT_ID = '405209705968-vpb5ad8ans3mlpj6ei85u7uu2bhlb67q.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];

// Authorization scopes required by the API. If using multiple scopes,
// separated them with spaces.
var SCOPES = 'https://www.googleapis.com/auth/youtube';

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');
var authorize_modal = document.getElementById('authorize_modal');
var left_aside = document.getElementById('left_aside');
var main_content = document.getElementById('main_content');
var video_search = document.getElementById('video_search');


/**
 *  On load, called to load the auth2 library and API client library.
 */
function handleClientLoad() {
  gapi.load('client:auth2', initClient);
}

/**
 *  Initializes the API client library and sets up sign-in state
 *  listeners.
 */
function initClient() {
  gapi.client.init({
    discoveryDocs: DISCOVERY_DOCS,
    clientId: CLIENT_ID,
    scope: SCOPES
  }).then(function () {
    // Listen for sign-in state changes.
    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

    // Handle the initial sign-in state.
    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    authorizeButton.onclick = handleAuthClick;
    signoutButton.onclick = handleSignoutClick;
  });
}

/**
 *  Called when the signed in status changes, to update the UI
 *  appropriately. After a sign-in, the API is called.
 */
function updateSigninStatus(isSignedIn) {
  if (isSignedIn) {
    authorize_modal.style.display = 'none';
    signoutButton.style.display = 'block';
    left_aside.classList.remove("filter");
    main_content.classList.remove("filter");
    video_search.classList.remove("filter");
    initContent();
  } else {
    authorize_modal.style.display = 'block';
    signoutButton.style.display = 'none';
    left_aside.classList.add("filter");
    main_content.classList.add("filter");
    video_search.classList.add("filter");
  }
}

/**
 *  Sign in the user upon button click.
 */
function handleAuthClick(event) {
  gapi.auth2.getAuthInstance().signIn();
}

/**
 *  Sign out the user upon button click.
 */
function handleSignoutClick(event) {
  gapi.auth2.getAuthInstance().signOut();
}


/**
 * Global Variables 
 */
var addPlaylistBlock = document.getElementById('addPlaylist');
var delete_playlist_button = document.getElementById('delete_playlist_button');

var my_account = document.getElementById('myaccount');
var channel_thumbnail = document.getElementById('channel_thumbnail');
var channel_title = document.getElementById('channel_title');
var username = document.getElementById("username");

var search_result = document.getElementById('search_result');
var searched_channel_thumbnail = document.getElementById('searched_channel_thumbnail');
var searched_channel_title = document.getElementById('searched_channel_title');

var selectedPlaylistTitle = document.getElementById("selectedPlaylistTitle");
var selectedPlaylistDescription = document.getElementById("selectedPlaylistDescription");

var editPlaylistTitleInput = document.getElementById("edit_playlist_title");
var editPlaylistDescriptionInput = document.getElementById("edit_playlist_description");
var editPlaylistTitleSelect = document.getElementById("edit_playlist_privacy_status");
var editPlaylistButton = document.getElementById("edit_playlist_button");
var editPlaylistBlock = document.getElementById("editPlaylist");

var load_more_button = document.createElement('button');

var selectedPlaylist; //Objet JS correpondant à la playlist selectionnée
var myChannel = true; //Permet de savoir si on est sur notre compte ou sur une recherche différente

/**
 * Init Content
 */
function initContent(){
  getMyChannel();
  edit_playlist_button.onclick = function(){
    toggle(editPlaylistBlock);
    toggleClass(editPlaylistButton, "clicked");
  }
  hide(search_result);
  show(addPlaylistBlock);
  my_account.classList.remove('mini');
  show(channel_title);
  document.getElementById("playlists_list").innerHTML = "";
  defineRequest();
  username.value = "";
}

/**
 * Get my Channel
 */
function getMyChannel() {
  var params = {
      'part': 'snippet,contentDetails,statistics',
      'mine': true
  }
  myChannel = true;
  gapi.client.youtube.channels.list(params).then(function(response) {
    var channel = response.result.items[0];
    if (channel) {
      channel_title.innerHTML = channel.snippet.title;
      channel_thumbnail.src = channel.snippet.thumbnails.medium.url;
      channel_thumbnail.onclick = function(){
        initContent();
      }
      getPlaylists(channel.id);
    } else {
      initContent();
      console.log("Aucun utilisateur avec ce pseudo");
    }
  });
}

/**
 * Get Channel (search by username)
 */
function getChannel(username) {
  params = {
    'part': 'snippet,contentDetails,statistics',
    'forUsername': username,
  }
  console.log(username, myChannel);
  myChannel = username ? false : true;

  console.log(username, myChannel);

  gapi.client.youtube.channels.list(params).then(function(response) {
    var channel = response.result.items[0];
    if (channel) {
      searched_channel_title.innerHTML = channel.snippet.title;
      searched_channel_thumbnail.src = channel.snippet.thumbnails.medium.url;
      show(search_result);
      getPlaylists(channel.id);
      my_account.classList.add('mini');
      hide(channel_title);
      hide(addPlaylistBlock);
    } else {
      initContent();
      hide(search_result);
      console.log("Aucun utilisateur avec ce pseudo");
    }
  });
}


/**
 * Get all playlists from current channel
 */
function getPlaylists(id) {
  var loader = document.getElementById('loader');
  loader.style.display = 'block';   //On affiche le loader

  var list = document.getElementById('playlists_list');
  list.innerHTML = "";    //On vide la liste de playlist

  var params = {
    'maxResults': '25',
    'part': 'snippet,contentDetails,status',
    'mine': true
  }
  if (id) {
    params = {
      'maxResults': '25',
      'part': 'snippet,contentDetails,status',
      "channelId": id
    }
  }

  gapi.client.youtube.playlists.list(params).then(function(response) {
    loader.style.display = 'none'; //On cache le loader dès qu'on obtient une réponse
    var playlists = response.result.items;
    var time = 0;
    playlists.forEach(function(playlist, index){
      var li = document.createElement('li');
      var span = document.createElement('span');
      var content = document.createElement('div');
      content.classList.add("content");
      var numberOfVideos = document.createElement('span');
      var status = playlist.status.privacyStatus;
      li.innerHTML = '<img src="'+ playlist.snippet.thumbnails.medium.url + '" /> ';
      span.innerHTML = playlist.snippet.title;
      if (playlist.contentDetails.itemCount > 1) {
        numberOfVideos.innerHTML = playlist.contentDetails.itemCount + " vidéos";
      } else {
        numberOfVideos.innerHTML = playlist.contentDetails.itemCount + " vidéo";
      }
      numberOfVideos.classList.add("numberOfVideos");
      content.appendChild(span);
      content.appendChild(numberOfVideos);
      if (status == "private") {
        var cadenas = document.createElement('div');
        cadenas.classList.add("cadenas");
        cadenas.innerHTML = "<i class='fa fa-lock' aria-hidden='true' title='Playlist privée'></i>";
        content.appendChild(cadenas);
      }
      li.appendChild(content);
      li.addEventListener("click", function(){
        selectPlaylist(li, String(playlist.id))
      });
      setTimeout(function(){    //Permet un affichage progressif des éléments de la liste
        list.appendChild(li);
      }, time);
      time+=100; //Temps d'attente entre chaque élément de la liste (en ms)
      if (index == 0) {
        selectPlaylist(li, String(playlist.id)); //Selectionne la première playlist au chargement
      }
    });
  });
}


/**
 * Select Playlist
 */
function selectPlaylist(clicked_li, playlist_id) { //clicked_li correspond au li sur lequel l'utilisateur a cliqué
  
  //Changement de class pour le li selectionné
  allLi = document.querySelectorAll("#playlists_list li");
  Array.from(allLi).forEach(function(li){ //allLi est un nodeList et non un array. forEach ne marchAIT pas pour les nodelist sur les anciens navigateurs donc il faut les transformer en array.
    li.classList.remove('selected');
  })
  if (clicked_li) {
    clicked_li.classList.add('selected');
  }

  //Appel API pour récuperer la playlist selectionnée;
  gapi.client.youtube.playlists.list({
    'maxResults': '25',
    'part': 'snippet,contentDetails,status',
    'id': playlist_id
  }).then(function(response) {
    selectedPlaylist = response.result.items[0];
    selectedPlaylistTitle.innerHTML = selectedPlaylist.snippet.title;
    selectedPlaylistDescription.innerHTML = selectedPlaylist.snippet.description;
    editPlaylistTitleInput.value = selectedPlaylist.snippet.title;
    editPlaylistDescriptionInput.value = selectedPlaylist.snippet.description;
    editPlaylistTitleSelect.value = selectedPlaylist.status.privacyStatus;
  });

  if (myChannel) {
    delete_playlist_button.onclick = function(){
      deletePlaylist(playlist_id);
    }
    editPlaylistButton.style.display = "inline-block";
  } else {
    editPlaylistButton.style.display = "none";
  }
  

  //Appel API pour récuperer les vidéos de la playlist selectionnée;
  var list = document.getElementById('selectedPlaylistVideos');
  list.innerHTML = "";
  gapi.client.youtube.playlistItems.list({
    'maxResults': '25',
    'part': 'snippet,contentDetails',
    'playlistId': playlist_id
  }).then(function(response) {
    list.innerHTML = "";
    var videos = response.result.items;
    var time = 0;
    videos.forEach(function(video, index){
      var a = document.createElement('a');
      var li = document.createElement('li');
      var img = document.createElement('img');
      var videoTitle = document.createElement('span');
      var videoNumber = document.createElement('span');
      var remove_item_button = document.createElement('i');

      a.setAttribute('href', "https://www.youtube.com/watch?v=" + video.contentDetails.videoId);
      a.setAttribute('target', "_blank");
      img.setAttribute('src', video.snippet.thumbnails.medium.url);
      videoNumber.setAttribute('class', 'index');
      videoTitle.innerHTML = video.snippet.title;
      videoNumber.innerHTML = index+1+".";
      remove_item_button.setAttribute('class', 'fa fa-trash remove_item_button');
      remove_item_button.setAttribute('aria-hidden', 'true');
      remove_item_button.onclick = function(){
        removeItem(playlist_id, video.id);
      }
      a.appendChild(videoNumber);
      a.appendChild(img);
      a.appendChild(videoTitle);
      li.appendChild(a);
      li.appendChild(remove_item_button);

      setTimeout(function(){    //Permet un affichage progressif des éléments de la liste
        list.appendChild(li);
      }, time);
      time+= 50;
    });
  });
}

/**
 * Create Playlist
 */
function createPlaylist(title = "Sans Titre", privacyStatus = "private") { //Valeurs par défaut

  if (!title) {
    title = "Sans titre";
  }
  if (!privacyStatus) {
    privacyStatus = "private";
  }
  var request = gapi.client.youtube.playlists.insert({
    part: 'snippet,status,contentDetails',
    resource: {
      snippet: {
        title: title,
        description: 'Playlist créée avec l\'API YouTube'
      },
      status: {
        privacyStatus: privacyStatus
      }
    }
  });

  request.execute(function(response) {
    var result = response.result;
    if (result) {
      playlist = result;
      var li = document.createElement('li');
      var span = document.createElement('span');
      var content = document.createElement('div');
      content.classList.add("content");
      var numberOfVideos = document.createElement('span');
      var status = playlist.status.privacyStatus;
      li.innerHTML = '<img src="'+ playlist.snippet.thumbnails.medium.url + '" /> ';
      span.innerHTML = playlist.snippet.title;
      if (playlist.contentDetails.itemCount > 1) {
        numberOfVideos.innerHTML = playlist.contentDetails.itemCount + " vidéos";
      } else {
        numberOfVideos.innerHTML = playlist.contentDetails.itemCount + " vidéo";
      }
      numberOfVideos.classList.add("numberOfVideos");
      content.appendChild(span);
      content.appendChild(numberOfVideos);
      if (status == "private") {
        var cadenas = document.createElement('div');
        cadenas.classList.add("cadenas");
        cadenas.innerHTML = "<i class='fa fa-lock' aria-hidden='true' title='Playlist privée'></i>";
        content.appendChild(cadenas);
      }
      li.appendChild(content);
      li.addEventListener("click", function(){
        selectPlaylist(li, String(playlist.id))
      });
      var list = document.getElementById('playlists_list');
      list.insertBefore(li, list.firstChild);
    } else {
      console.log('La création de la playlist a échoué');
    }
  });
}

/**
 * Edit Playlist
 */
function editPlaylist(title = "Sans Titre", description, privacyStatus = "private") { //Valeurs par défaut
  var request = gapi.client.youtube.playlists.update({
    part: 'snippet,status',
    snippet: {
      title: title,
      description: description
    },
    status: {
      privacyStatus: privacyStatus
    },
    id: selectedPlaylist.id
  });
  request.execute(function(response) {
    var result = response.result;
    if (result) {
      getPlaylists();
      toggle(editPlaylistBlock);
      editPlaylistButton.classList.remove("clicked");
    } else {
      console.log('La modification de la playlist a échoué');
    }
  });
}

/**
 * Delete Playlist
 */
function deletePlaylist(playlist_id) {
  gapi.client.youtube.playlists.delete({
    'id': playlist_id
  }).then(function(response) {
    console.log("Suppression en cours...");
    setTimeout(function(){
      getPlaylists();
      toggle(editPlaylistBlock);
      editPlaylistButton.classList.remove("clicked");
      console.log("Playlist supprimée !");
    }, 500);
  });
}

/**
 * Remove Item
 */
function removeItem(playlist_id, playlist_item_id) {
  gapi.client.youtube.playlistItems.delete({
    id: playlist_item_id,
    snippet: {
      "playlistId": playlist_id
    }
  }).then(function(response) {
    getPlaylists();
    console.log("Item supprimée !");
  });
}

/**
 * Add Item
 */
function addItem(playlist_id, video_id) {
  gapi.client.youtube.playlistItems.insert({
    part: 'snippet',
    snippet: {
      playlistId: playlist_id,
      resourceId: video_id,
    }
  }).then(function(response) {
    getPlaylists();
    console.log("Item supprimée !");
  });
}


/**
 * Search Video
 */
function searchVideo(query) {
  var list = document.getElementById('searchResults');
  list.innerHTML = "";

  gapi.client.youtube.search.list({
    q: query,
    part: 'snippet',
    maxResults: '15',
    type: 'video'
  }).then(function(response) {
    console.log("response", response);
    var videos = response.result.items;
    var time = 0;
    videos.forEach(function(video){
      var li = document.createElement('li');
      var img = document.createElement('img');
      var videoTitle = document.createElement('span');
      var add_item_button = document.createElement('i');

      img.setAttribute('src', video.snippet.thumbnails.medium.url);
      videoTitle.innerHTML = video.snippet.title;

      add_item_button.setAttribute('class', 'fa fa-plus-circle add_item_button');
      add_item_button.setAttribute('title', 'Ajouter à la playlist sélectionnée');
      add_item_button.setAttribute('aria-hidden', 'true');
      add_item_button.onclick = function(){
        // console.log(selectedPlaylist.id, video.id);
        addItem(selectedPlaylist.id, video.id);
      }
      li.appendChild(img);
      li.appendChild(videoTitle);
      li.appendChild(add_item_button);

      setTimeout(function(){    //Permet un affichage progressif des éléments de la liste
        list.appendChild(li);
      }, time);
      time+= 50;
    });
    setTimeout(function(){ //Affiche le bouton "voir plus" à la fin
      load_more_button.innerHTML = "Voir plus";
      load_more_button.onclick = function(){
        loadMore(query, response.result.nextPageToken);
      }
      list.appendChild(load_more_button);
    }, time);
    
  });
}

/**
 * Search Video
 */
function loadMore(query, pageToken) {
  var list = document.getElementById('searchResults');

  gapi.client.youtube.search.list({
    q: query,
    part: 'snippet',
    maxResults: '10',
    pageToken: pageToken,
    type: 'video'
  }).then(function(response) {
    console.log("response", response);
    var videos = response.result.items;
    var time = 0;
    videos.forEach(function(video){
      var li = document.createElement('li');
      var img = document.createElement('img');
      var videoTitle = document.createElement('span');
      var add_item_button = document.createElement('i');

      img.setAttribute('src', video.snippet.thumbnails.medium.url);
      videoTitle.innerHTML = video.snippet.title;

      add_item_button.setAttribute('class', 'fa fa-plus-circle add_item_button');
      add_item_button.setAttribute('title', 'Ajouter à la playlist sélectionnée');
      add_item_button.setAttribute('aria-hidden', 'true');
      add_item_button.onclick = function(){
        // console.log(selectedPlaylist.id, video.id);
        addItem(selectedPlaylist.id, video.id);
      }
      li.appendChild(img);
      li.appendChild(videoTitle);
      li.appendChild(add_item_button);

      setTimeout(function(){    //Permet un affichage progressif des éléments de la liste
        list.insertBefore(li, load_more_button);  //On insère les vidéos avant le bouton "Voir plus"
      }, time);
      time+= 50;
      load_more_button.onclick = function(){
        loadMore(query, response.result.nextPageToken); // On actualise le pageToken
      }
    });
  });
}


function toggle(element){
  var classList = element.classList;
  if (classList.contains('hide')){
    classList.remove('hide');
  } else {
    classList.add('hide');
  }
  if (classList.contains('show')){
    classList.remove('show');
  } else {
    classList.add('show');
  }
}

function hide(element){
  var classList = element.classList;
  classList.add('hide');
  classList.remove('show');
}

function show(element){
  var classList = element.classList;
  classList.add('show');
  classList.remove('hide');
}

function toggleClass(element, classToToggle){
  element.classList.toggle(classToToggle);
}