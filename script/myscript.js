var search_channel_form = document.getElementById('searchByUsername');

search_channel_form.addEventListener("submit", function(e){
	e.preventDefault();
	var username = document.getElementById("username").value;
	getChannel(username);
});

var create_playlist_form = document.getElementById('create_playlist_form');

create_playlist_form.addEventListener("submit", function(e){
	e.preventDefault();
	console.log('Création de la playlist...');
	var title = document.getElementById('new_playlist_title').value;
	var select = document.getElementById('new_playlist_privacy_status');
	privacy_status = select.options[select.selectedIndex].value;
	console.log("privacy_status", privacy_status);
	createPlaylist(title, privacy_status);
	title.innerHTML = "";
});

var edit_playlist_form = document.getElementById('edit_playlist_form');

edit_playlist_form.addEventListener("submit", function(e){
	e.preventDefault();
	console.log('Modification de la playlist...');
	var title = document.getElementById('edit_playlist_title').value;
	var select = document.getElementById('edit_playlist_privacy_status');
	privacy_status = select.options[select.selectedIndex].value;
	editPlaylist(title, privacy_status);
	title.innerHTML = "";
});

var refresh = document.querySelector("#playlists .refresh");
refresh.onclick = function(){
	getPlaylists();
}



var left_aside = document.getElementById('left_aside');
var authorize_modal = document.getElementById('authorize_modal');

var setAsideSize = function(){
	left_aside.style.height = window.innerHeight + "px";
}

window.addEventListener('resize', setAsideSize);
window.onload = function(){	
	setAsideSize();
}

