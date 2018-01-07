// LOADER DE LA PAGE PENDANT LE CHARGEMENT
document.onreadystatechange = function(e) {
    if (document.readyState === 'complete')
    {
    	setTimeout(function() {
		    document.getElementById('loader').classList.add('disappear');
		}, 200);
    	
    	setTimeout(function() {
		    hide(document.getElementById('loader'));
		}, 500);
    }
};

// Execute setZize() AU CHARGEMENT INITIAL + A CHAQUE REDIMENSIONNEMENT
window.addEventListener('resize', setSize);
window.onload = function() {	
	setSize();
}

// FONCTION QUI PERMET DE GERER DES ELEMENTS RESPONSIVE ET DE DIMENSIONNER LES ELEMENTS HTML PRINCIPAUX DYNAMIQUEMENT 
function setSize() {
	// VERSIONS AUTRES QUE PC
	if (window.innerWidth<=1110) {
		mainContent.classList.remove('fullscreen');
		show(closeModalButton);
		if (!videoSearch.classList.contains('activated')) {
			hide(videoSearch);
			hide(backgroundModal);
			if (myChannel) {
				show(addVideoButton);
			}
		}
		// VERSION MOBILE
		if (window.innerWidth<=850) {
			/*A COMPLETER POUR VERSION MOBILE*/
		} 
		// VERSION TABLETTE
		else{
			leftAside.style.height = window.innerHeight + "px";
			mainContent.style.height = window.innerHeight + "px";
			videoSearch.style.height = window.innerHeight + "px";
			videoSearch.style.height = 80/100*window.innerHeight + "px";
		}
	} 
	// VERSION PC
	else {
		hide(closeModalButton);
		if (!myChannel) {
			hide(videoSearch);
			mainContent.classList.add('fullscreen');
		}
		leftAside.style.height = window.innerHeight + "px";
		mainContent.style.height = window.innerHeight + "px";
		videoSearch.style.height = window.innerHeight + "px";
		leftAside.classList.remove("filter");
		mainContent.classList.remove("filter");
		show(videoSearch);
	}
}

//Ouverture de la modal pour ajouter une vidéo
addVideoButton.addEventListener('click', function(e) {
	var modalClassList = videoSearch.classList;
	modalClassList.add('activated');
	show(videoSearch);
	hide(addVideoButton);
	show(backgroundModal);
	leftAside.classList.add("filter");
	mainContent.classList.add("filter");
});

//Fermeture de la modal de 2 façons différentes
closeModalButton.addEventListener('click', closeModal); //En cliquant sur le bouton "X"
backgroundModal.addEventListener('click', closeModal); //En cliquant en dehors de la modal

function closeModal() {
	var modalClassList = videoSearch.classList;
	modalClassList.remove('activated');
	hide(videoSearch);
	show(addVideoButton);
	hide(backgroundModal);
	leftAside.classList.remove("filter");
	mainContent.classList.remove("filter");
}