// document.getElementById('add_playlist').onclick = function(){
// 	console.log('Appel getPlaylists');
// 	getPlaylists();
// };

var search_channel_form = document.getElementById('searchByUsername');

search_channel_form.addEventListener("submit", function(e){
	e.preventDefault();
	var username = document.getElementById("username").value;
	getChannel(username);
});

// var addPlaylistButton = document.getElementById('add_playlist');

// addPlaylistButton.onclick = function(){
// 	console.log('Création de la playlist...');
// 	var title = document.getElementById('newTitle').value;
// 	createPlaylist(title);
// };

var create_playlist_form = document.getElementById('create_playlist_form');

create_playlist_form.addEventListener("submit", function(e){
	e.preventDefault();
	console.log('Création de la playlist...');
	var title = document.getElementById('new_playlist_title').value;
	createPlaylist(title);
	title.innerHTML = "";
});
