// Client ID and API key from the Developer Console
var CLIENT_ID = '405209705968-vpb5ad8ans3mlpj6ei85u7uu2bhlb67q.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];

// Authorization scopes required by the API. If using multiple scopes,
// separated them with spaces.
var SCOPES = 'https://www.googleapis.com/auth/youtube';

var authorizeButton = document.getElementById('authorize-button');
var signoutButton = document.getElementById('signout-button');

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
    authorizeButton.style.display = 'none';
    signoutButton.style.display = 'block';
    getChannel();

  } else {
    authorizeButton.style.display = 'block';
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
 * Append text to a pre element in the body, adding the given message
 * to a text node in that element. Used to display info from API response.
 *
 * @param {string} message Text to be placed in pre element.
 */
function appendPre(message) {
  var pre = document.getElementById('content');
  var textContent = document.createTextNode(message + '\n');
  pre.appendChild(textContent);
}

/**
 * Print files.
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
  }
  
  gapi.client.youtube.channels.list(params).then(function(response) {
    console.log(response);
    var channel = response.result.items[0];
    if (channel) {
      var channel_title = document.getElementById('channel_title');
      channel_title.innerHTML = channel.snippet.title;
      var channel_thumbnail = document.getElementById('channel_thumbnail');
      channel_thumbnail.src = channel.snippet.thumbnails.default.url;
      getPlaylists(channel.id);
    } else {
      console.log("Aucun utilisateur avec ce pseudo");
    }
  });
}

/**
 * Print files.
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
    loader.style.display = 'none';
    var playlists = response.result.items;
    console.log("playlist", playlists);
    playlists.forEach(function(playlist, index){
      index++;
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
      console.log("Status", status);
      if (status == "private") {
        console.log('inIf');
        var cadenas = document.createElement('div');
        cadenas.classList.add("cadenas");
        cadenas.innerHTML = "<i class='fa fa-lock' aria-hidden='true' title='Playlist privée'></i>";
        content.appendChild(cadenas);
      }
      li.appendChild(content);
      li.addEventListener("click", function(){
        selectPlaylist(li, String(playlist.id))
      });
      list.appendChild(li);
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
    'part': 'snippet,contentDetails',
    'id': playlist_id
  }).then(function(response) {
    var selectedPlaylist = response.result.items[0];
    document.querySelector("#selectedPlaylistTitle").innerHTML = selectedPlaylist.snippet.title;
  });

  //Appel API pour récuperer les vidéos de la playlist selectionnée;
  var list = document.getElementById('selectedPlaylistVideos');
  list.innerHTML = "";
  gapi.client.youtube.playlistItems.list({
    'maxResults': '25',
    'part': 'snippet,contentDetails',
    'playlistId': playlist_id
  }).then(function(response) {
    var videos = response.result.items;
    videos.forEach(function(video){
      var li = document.createElement('li');
      var span = document.createElement('span');
      li.innerHTML = '<img src="'+ video.snippet.thumbnails.default.url + '" /> ';
      span.innerHTML = video.snippet.title;
      li.appendChild(span);
      list.appendChild(li);
    });
  });
}

/**
 * Create Playlist
 */
function createPlaylist(title) { //Ajouter également Description et Privacy en paramètres
  if (!title) {
    title = "Sans titre"
  }
  var request = gapi.client.youtube.playlists.insert({
    part: 'snippet,status',
    resource: {
      snippet: {
        title: title,
        description: 'A private playlist created with the YouTube API'
      },
      status: {
        privacyStatus: 'private'
      }
    }
  });
  request.execute(function(response) {
    var result = response.result;
    if (result) {
      console.log("RESULT : ", result);
      getPlaylists();
    } else {
      console.log('Could not create playlist');
    }
  });
}