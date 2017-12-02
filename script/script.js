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
    initContent();
    getChannel();
  } else {
    authorize_modal.style.display = 'block';
    signoutButton.style.display = 'none';
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
var channel_thumbnail = document.getElementById('channel_thumbnail');
var channel_title = document.getElementById('channel_title');
var selectedPlaylistTitle = document.getElementById("selectedPlaylistTitle");
var editPlaylistTitleInput = document.getElementById("edit_playlist_title");
var editPlaylistTitleSelect = document.getElementById("edit_playlist_privacy_status");
var editPlaylistButton = document.getElementById("edit_playlist_button");
var editPlaylistBlock = document.getElementById("editPlaylist");

var selectedPlaylist; //Objet JS correpondant à la playlist selectionnée
var myChannel = true; //Permet de savoir si on est sur notre compte ou sur une recherche différente

/**
 * Init Content
 */
function initContent(){
  channel_thumbnail.src = "img/default_picture.png";
  channel_title.innerHTML = "Pas de résultat";
  edit_playlist_button.onclick = function(){
    toggle(editPlaylistBlock);
  }
}


/**
 * Get Channel 
 */
function getChannel(username) {
  var params = {
      'part': 'snippet,contentDetails,statistics',
      'mine': true
    }
  if (username) {
    params = {
      'part': 'snippet,contentDetails,statistics',
      'forUsername': username,
    }
    myChannel = false;
  } else {
    myChannel = true;
  }

  gapi.client.youtube.channels.list(params).then(function(response) {
    console.log(response);
    var channel = response.result.items[0];
    if (channel) {
      channel_title.innerHTML = channel.snippet.title;
      channel_thumbnail.src = channel.snippet.thumbnails.default.url;
      getPlaylists(channel.id);

      if (myChannel == false) {
        addPlaylistBlock.classList.add("hide");
        addPlaylistBlock.classList.remove("show");
      } else {
        addPlaylistBlock.classList.add("show");
        addPlaylistBlock.classList.remove("hide");
      }
    } else {
      initContent();
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
    console.log("playlist", playlists);
    var time = 0;
    playlists.forEach(function(playlist, index){
      var li = document.createElement('li');
      var span = document.createElement('span');
      var content = document.createElement('div');
      content.classList.add("content");
      var numberOfVideos = document.createElement('span');
      var status = playlist.status.privacyStatus;
      li.innerHTML = '<img src="'+ playlist.snippet.thumbnails.default.url + '" /> ';
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
function selectPlaylist(clicked_li, playlist_id) { //element correspond au li sur lequel l'utilisateur a cliqué
  
  //Changement de class pour le li selectionné
  allLi = document.querySelectorAll("#playlists_list li");
  Array.from(allLi).forEach(function(li){ //allLi est un nodeList et non un array. forEach ne marchAIT pas pour les nodelist sur les anciens navigateurs donc il faut les transformer en array.
    li.classList.remove('selected');
  })
  clicked_li.classList.add('selected');

  //Appel API pour récuperer la playlist selectionnée;
  gapi.client.youtube.playlists.list({
    'maxResults': '25',
    'part': 'snippet,contentDetails,status',
    'id': playlist_id
  }).then(function(response) {
    selectedPlaylist = response.result.items[0];
    console.log("selectedPlaylist", selectedPlaylist);
    selectedPlaylistTitle.innerHTML = selectedPlaylist.snippet.title;
    editPlaylistTitleInput.value = selectedPlaylist.snippet.title;
    editPlaylistTitleSelect.value = selectedPlaylist.status.privacyStatus;
  });
  if (myChannel) {
    delete_playlist_button.innerHTML = "Supprimer la playlist";
    delete_playlist_button.onclick = function(){
      deletePlaylist(playlist_id);
    }
  } else {
    delete_playlist_button.classList.add("hide");
    delete_playlist_button.classList.remove("show");
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
    videos.forEach(function(video){
      var a = document.createElement('a');
      var li = document.createElement('li');
      var videoTitle = document.createElement('span');
      a.setAttribute('href', "https://www.youtube.com/watch?v=" + video.contentDetails.videoId);
      a.setAttribute('target', "_blank");
      li.innerHTML = '<img src="'+ video.snippet.thumbnails.default.url + '" /> ';
      videoTitle.innerHTML = video.snippet.title;
      li.appendChild(videoTitle);
      a.appendChild(li);
      setTimeout(function(){    //Permet un affichage progressif des éléments de la liste
        list.appendChild(a);
      }, time);
      time+= 50;
    });
  });
}

/**
 * Create Playlist
 */
function createPlaylist(title = "Sans Titre", privacyStatus = "private") { //Valeurs par défaut

  var request = gapi.client.youtube.playlists.insert({
    part: 'snippet,status,contentDetails',
    resource: {
      snippet: {
        title: title,
        description: 'Playlist created with the YouTube API'
      },
      status: {
        privacyStatus: privacyStatus
      }
    }
  });

  request.execute(function(response) {
    var result = response.result;
    if (result) {
      console.log("createPlaylist Result : ", result);
      playlist = result;
      var li = document.createElement('li');
      var span = document.createElement('span');
      var content = document.createElement('div');
      content.classList.add("content");
      var numberOfVideos = document.createElement('span');
      var status = playlist.status.privacyStatus;
      li.innerHTML = '<img src="'+ playlist.snippet.thumbnails.default.url + '" /> ';
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
      console.log('Could not create playlist');
    }
  });
}

/**
 * Edit Playlist
 */
function editPlaylist(title = "Sans Titre", privacyStatus = "private") { //Valeurs par défaut

  var request = gapi.client.youtube.playlists.update({
    part: 'snippet,status',
    snippet: {
      title: title,
      description: 'New description'
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
    } else {
      console.log('Could not edit playlist');
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
    console.log("Playlist supprimée", response);
    getPlaylists();
  });
}


function toggle(element){
  var classList = element.classList;
  if (classList.contains('hide')){
    classList.remove('hide');
  } else {
    classList.add('hide');
  }
}