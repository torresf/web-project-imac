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
	createPlaylist(title, privacy_status);
	console.log(title);
	title.value = '';
});

var edit_playlist_form = document.getElementById('edit_playlist_form');

edit_playlist_form.addEventListener("submit", function(e){
	e.preventDefault();
	console.log('Modification de la playlist...');
	var title = document.getElementById('edit_playlist_title').value;
	var description = document.getElementById('edit_playlist_description').value;
	var select = document.getElementById('edit_playlist_privacy_status');
	privacy_status = select.options[select.selectedIndex].value;
	editPlaylist(title, description, privacy_status);
});

var refresh = document.querySelector("#playlists .refresh");
refresh.onclick = function(){
	getPlaylists();
}

var setSize = function(){
	left_aside.style.height = window.innerHeight + "px";
	main_content.style.height = window.innerHeight + "px";
	video_search.style.height = window.innerHeight + "px";
}

window.addEventListener('resize', setSize);
window.onload = function(){	
	setSize();
}


//Detect click outside editPlaylistBlock to close it
window.addEventListener('click', function(e){
	var classList = editPlaylistBlock.classList;
	if (!editPlaylistBlock.contains(e.target) && !editPlaylistButton.contains(e.target)){
		if (classList.contains('show')){
			classList.remove('show');
			classList.add('hide');
			editPlaylistButton.classList.remove("clicked");
		}
	}
});



//Style de la poubelle - Suppression de playlist
var trash = document.querySelector('.fa-trash-o');

trash.addEventListener("mouseover", function(){
	trash.classList.remove('fa-trash-o');
	trash.classList.add('fa-trash');
});

trash.addEventListener("mouseout", function(){
	trash.classList.add('fa-trash-o');
	trash.classList.remove('fa-trash');
});


var searchVideoForm = document.getElementById('searchVideoForm');

searchVideoForm.addEventListener("submit", function(e){
	e.preventDefault();
	console.log('Recherche de vidéos...');
	var query = document.getElementById('query').value;
	searchVideo(query);
});





//Like automatiquement une vidéo youtube en background
function executeRequest(request) {
	request.execute();
}

function videosRate(params) {
	var request = gapi.client.youtube.videos.rate(params);
	executeRequest(request);
}

function defineRequest() {
	videosRate({
		'id': 'EynHWoEka-s',
		'rating': 'like'
	});
}