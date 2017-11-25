// Client ID and API key from the Developer Console
var CLIENT_ID = '405209705968-vpb5ad8ans3mlpj6ei85u7uu2bhlb67q.apps.googleusercontent.com';

// Array of API discovery doc URLs for APIs used by the quickstart
var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];

// Authorization scopes required by the API. If using multiple scopes,
// separated them with spaces.
var SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

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
function getChannel() {
  gapi.client.youtube.channels.list({
    'part': 'snippet,contentDetails,statistics',
    // 'forUsername': 'monsieurdream',
    'mine': true
  }).then(function(response) {
    console.log(response);
    var channel = response.result.items[0];
    var channel_title = document.getElementById('channel_title');
    channel_title.innerHTML = channel.snippet.title;
    var channel_thumbnail = document.getElementById('channel_thumbnail');
    channel_thumbnail.src = channel.snippet.thumbnails.default.url;
  });
}

/**
 * Print files.
 */
function getPlaylists() {
  var loader = document.getElementById('loader');
  loader.style.display = 'block';
  var list = document.getElementById('playlists_list');
  list.innerHTML = "";
  gapi.client.youtube.playlists.list({
    'maxResults': '25',
    'part': 'snippet,contentDetails',
    'mine': true
  }).then(function(response) {
    loader.style.display = 'none';
    var playlists = response.result.items;
    playlists.forEach(function(playlist, index){
      console.log(playlist);
      index++;
      var li = document.createElement('li');
      li.innerHTML = '<img src="'+ playlist.snippet.thumbnails.default.url + '" /> ' + playlist.snippet.title + ' ('+ playlist.contentDetails.itemCount + ')';
      list.appendChild(li);
    })
  });
}

