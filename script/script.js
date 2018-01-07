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
		signoutButton.style.display = 'flex';
		initContent();
	} else {
		authorize_modal.style.display = 'flex';
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
 * Éléments du DOM et variables globales 
 */

//Les trois blocs principaux, de gauche à droite
var leftAside = document.getElementById('left_aside');
var mainContent = document.getElementById('main_content'); //Contenu de la playlist selectionnée
var videoSearch = document.getElementById('video_search');

var playlistsList = document.getElementById('playlists_list');
var addPlaylistBlock = document.getElementById('addPlaylist');
var deletePlaylistButton = document.getElementById('delete_playlist_button');

var myAccountBlock = document.getElementById('my_account'); //Correspond à la section "Mon compte"
var channelThumbnail = document.getElementById('channel_thumbnail');
var channelTitle = document.getElementById('channel_title');
var username = document.getElementById("username");
var notification = document.getElementById('notification');

var userSearchResult = document.getElementById('user_search_result');
var searchedChannelThumbnail = document.getElementById('searched_channel_thumbnail');
var searchedChannelTitle = document.getElementById('searched_channel_title');

var selectedPlaylistTitle = document.getElementById("selected_playlist_title");
var selectedPlaylistDescription = document.getElementById("selected_playlist_description");

var editPlaylistTitleInput = document.getElementById("edit_playlist_title");
var editPlaylistDescriptionInput = document.getElementById("edit_playlist_description");
var editPlaylistTitleSelect = document.getElementById("edit_playlist_privacy_status");
var editPlaylistButton = document.getElementById("edit_playlist_button");
var editPlaylistBlock = document.getElementById("editPlaylist");

var addVideoButton = document.getElementById("add_video");
var closeModalButton = document.getElementById("close_modal");
var backgroundModal = document.getElementById("background_modal");

//Forms
var createPlaylistForm = document.getElementById('create_playlist_form');
var searchChannelForm = document.getElementById('search_by_username');
var editPlaylistForm = document.getElementById('edit_playlist_form');
var searchVideoForm = document.getElementById('search_video_form');

var searchLoadMoreButton = document.createElement('button'); //Bouton voir plus dans la recherche
var playlistItemLoadMoreButton = document.createElement('button'); //Bouton "voir plus" d'éléments de la playlist sélectionnée

var refresh = document.querySelector("#playlists .refresh"); //Rafraîchit la liste des playlists
var selectedPlaylist; //Objet JS correpondant à la playlist selectionnée
var myChannel = true; //Booléen pour savoir si on est sur notre compte ou sur une recherche différente

/**
 * Init Content
 */
function initContent() {
	getMyChannel();
	edit_playlist_button.onclick = function() {
		toggle(editPlaylistBlock);
		toggleClass(editPlaylistButton, "clicked");
	}
	hide(userSearchResult);
	show(addPlaylistBlock);
	myAccountBlock.classList.remove('mini');
	show(channelTitle);
	playlistsList.innerHTML = "";
	defineRequest();
	username.value = "";
}

refresh.onclick = function() {
	getPlaylists();
}

/**
 * Récupération des infos de la chaîne connectée
 */
function getMyChannel() {
	show(addVideoButton);
	var params = {
			'part': 'snippet,contentDetails,statistics',
			'mine': true
	}
	myChannel = true;
	gapi.client.youtube.channels.list(params).then(function(response) {
		var channel = response.result.items[0];
		if (channel) {
			channelTitle.innerHTML = channel.snippet.title;
			channelThumbnail.src = channel.snippet.thumbnails.medium.url;
			channelThumbnail.onclick = function() {
				initContent();
			}
			getPlaylists(channel.id);
			if (window.innerWidth>=1110) {
				show(video_search);
			}
		} else {
			initContent();
			console.log("Aucun utilisateur avec ce pseudo");
		}
	});
}


//Récupération de la valeur du champ username pour la recherche d'utilisateur et appel de la fonction correspondante
searchChannelForm.addEventListener("submit", function(e) {
	e.preventDefault();
	getChannel(username.value);
});

/**
 * Récupération des infos de la chaîne recherchée
 */
function getChannel(username) {
	hide(addVideoButton);
	params = {
		'part': 'snippet,contentDetails,statistics',
		'forUsername': username,
	}

	//Si un "username" est passé en paramètre, on sort de notre chaîne (myChannel = false), sinon myChannel = true
	myChannel = username ? false : true;

	gapi.client.youtube.channels.list(params).then(function(response) {
		var channel = response.result.items[0];
		if (channel) {
			searchedChannelTitle.innerHTML = channel.snippet.title;
			searchedChannelThumbnail.src = channel.snippet.thumbnails.medium.url;
			show(userSearchResult);
			getPlaylists(channel.id);
			myAccountBlock.classList.add('mini');
			hide(channelTitle);
			hide(addPlaylistBlock);
			hide(video_search);
		} else {
			initContent();
			hide(userSearchResult);
			notification.innerHTML = "Aucun utilisateur avec ce pseudo";
			show(notification);
			notification.style.opacity = 1;
			setTimeout(function(){
				fadeOutAndHide(notification);
			}, 2000);
			
		}
	});
}


/**
 * Récupère toutes les playlists de la chaîne actuelle
 */
function getPlaylists(id) {
	var loader = document.getElementById('playlist_loader');
	loader.style.display = 'block'; //On affiche le loader

	var list = playlistsList;
	list.innerHTML = ""; //On vide la liste de playlist

	var params = {
		'maxResults': '50',
		'part': 'snippet,contentDetails,status',
		'mine': true
	}
	if (id) {
		params = {
			'maxResults': '50',
			'part': 'snippet,contentDetails,status',
			"channelId": id
		}
	}

	gapi.client.youtube.playlists.list(params).then(function(response) {
		loader.style.display = 'none'; //On cache le loader dès qu'on obtient une réponse
		var playlists = response.result.items;
		var time = 0;
		playlists.forEach(function(playlist, index) {
			var li = document.createElement('li');
			var span = document.createElement('span');
			var content = document.createElement('div');
			content.classList.add("content");
			var numberOfVideos = document.createElement('span');
			var status = playlist.status.privacyStatus;
			li.innerHTML = '<img src="'+ playlist.snippet.thumbnails.medium.url + '" /> ';
			span.innerHTML = playlist.snippet.title;

			numberOfVideos.innerHTML = "<span class='number'>" + playlist.contentDetails.itemCount + "</span> "+ (playlist.contentDetails.itemCount > 1 ? "vidéos" : "vidéo");
			numberOfVideos.classList.add("numberOfVideos");
			content.appendChild(span);
			content.appendChild(numberOfVideos);
			var cadenas = document.createElement('div');
			cadenas.classList.add("cadenas");
			if (status == "private") {
				cadenas.innerHTML = "<i class='fa fa-lock' aria-hidden='true' title='Playlist privée'></i>";
			}
			content.appendChild(cadenas);
			li.appendChild(content);
			li.addEventListener("click", function() {
				selectPlaylist(li, String(playlist.id))
			});
			setTimeout(function() {    //Permet un affichage progressif des éléments de la liste
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
 * Sélectionne la playlist sur laquelle on a cliqué
 */
function selectPlaylist(clicked_li, playlist_id) { // "clicked_li" correspond au li sur lequel l'utilisateur a cliqué
	
	//Changement de style pour le li selectionné
	allLi = playlistsList.querySelectorAll("li");
	Array.from(allLi).forEach(function(li){		// "allLi" est un nodeList et non un array. forEach ne marchait pas pour les nodelist sur les anciens navigateurs donc il faut les transformer en array.
		li.classList.remove('selected');
	})
	if (clicked_li) {
		clicked_li.classList.add('selected');
	}

	//Appel API pour récuperer la playlist selectionnée
	gapi.client.youtube.playlists.list({
		'maxResults': '25',
		'part': 'snippet,contentDetails,status',
		'id': playlist_id
	}).then(function(response) {
		selectedPlaylist = response.result.items[0];
		//On modifie le titre et la description de la playlist (dans le panneau central)
		selectedPlaylistTitle.innerHTML = selectedPlaylist.snippet.title;
		selectedPlaylistDescription.innerHTML = selectedPlaylist.snippet.description;
		//On préremplit les champs de modification de la playlist
		editPlaylistTitleInput.value = selectedPlaylist.snippet.title;
		editPlaylistDescriptionInput.value = selectedPlaylist.snippet.description;
		editPlaylistTitleSelect.value = selectedPlaylist.status.privacyStatus;
	});

	if (myChannel) {
		mainContent.classList.remove('fullscreen');
		deletePlaylistButton.onclick = function(){
			deletePlaylist(playlist_id);
		}
		editPlaylistButton.style.display = "inline-block";
	} else {
		editPlaylistButton.style.display = "none";
		if (window.innerWidth>=1110){
			mainContent.classList.add('fullscreen');
		}
	}
	
	//Appel API pour récupérer les vidéos de la playlist selectionnée;
	var list = document.getElementById('selectedPlaylistVideos');
	list.innerHTML = "";
	gapi.client.youtube.playlistItems.list({
		'maxResults': '20',
		'part': 'snippet,contentDetails',
		'playlistId': playlist_id
	}).then(function(response) {
		list.innerHTML = "";
		var videos = response.result.items;
		var time = 0;
		videos.forEach(function(video, index){
			var a = document.createElement('a');
			var li = document.createElement('li');
			var img = document.createElement('img');
			var videoTitle = document.createElement('span');
			var videoNumber = document.createElement('span');
			var remove_item_button = document.createElement('i');

			a.setAttribute('href', "https://www.youtube.com/watch?v=" + video.contentDetails.videoId + "&list=" + playlist_id);
			a.setAttribute('target', "_blank");
			img.setAttribute('src', video.snippet.thumbnails.medium.url);
			videoNumber.setAttribute('class', 'index');
			videoTitle.innerHTML = video.snippet.title;
			videoNumber.innerHTML = index+1+".";
			if (myChannel) {
				remove_item_button.setAttribute('class', 'fa fa-trash remove_item_button');
				remove_item_button.setAttribute('title', 'Supprimer de la playlist');
				remove_item_button.setAttribute('aria-hidden', 'true');
				remove_item_button.onclick = function(){
					removeItem(playlist_id, video.id, li);
				}
			}

			a.appendChild(videoNumber);
			a.appendChild(img);
			a.appendChild(videoTitle);
			li.appendChild(a);
			if (myChannel) {
				li.appendChild(remove_item_button);
			}

			setTimeout(function(){	//Permet un affichage progressif des éléments de la liste
				list.appendChild(li);
			}, time);
			time+= 50;
		});

		//Bouton "Voir plus" pour charger plus d'éléments
		if (response.result.nextPageToken) {
			setTimeout(function(){ //Affiche le bouton "voir plus" à la fin
				playlistItemLoadMoreButton.innerHTML = "Voir plus d'éléments";
				playlistItemLoadMoreButton.onclick = function(){
					loadMorePlaylistItem(playlist_id, response.result.nextPageToken);
				}
				list.appendChild(playlistItemLoadMoreButton);
				show(playlistItemLoadMoreButton);
			}, time);
		}
	});
}


/**
 * Charge plus d'éléments dans la playlist
 */
function loadMorePlaylistItem(playlist_id, pageToken) {
	var list = document.getElementById('selectedPlaylistVideos');
	var nb_videos_in_playlist = list.querySelectorAll('li').length;
	gapi.client.youtube.playlistItems.list({
			maxResults: '10',
			part: 'snippet,contentDetails',
			playlistId: playlist_id,
			pageToken: pageToken
		}).then(function(response) {
			var videos = response.result.items;
			var time = 0;
			videos.forEach(function(video, index){
				var a = document.createElement('a');
				var li = document.createElement('li');
				var img = document.createElement('img');
				var videoTitle = document.createElement('span');
				var videoNumber = document.createElement('span');
				var remove_item_button = document.createElement('i');

				a.setAttribute('href', "https://www.youtube.com/watch?v=" + video.contentDetails.videoId + "&list=" + playlist_id);
				a.setAttribute('target', "_blank");
				img.setAttribute('src', video.snippet.thumbnails.medium.url);
				videoNumber.setAttribute('class', 'index');
				videoTitle.innerHTML = video.snippet.title;
				videoNumber.innerHTML = nb_videos_in_playlist + index + 1 + ".";

				if (myChannel) {
					remove_item_button.setAttribute('class', 'fa fa-trash remove_item_button');
					remove_item_button.setAttribute('title', 'Supprimer de la playlist');
					remove_item_button.setAttribute('aria-hidden', 'true');
					remove_item_button.onclick = function(){
						removeItem(playlist_id, video.id, li);
					}
				}

				a.appendChild(videoNumber);
				a.appendChild(img);
				a.appendChild(videoTitle);
				li.appendChild(a);
				if (myChannel) {
					li.appendChild(remove_item_button);
				}

				setTimeout(function(){    //Permet un affichage progressif des éléments de la liste
					list.insertBefore(li, playlistItemLoadMoreButton);  //On insère les vidéos avant le bouton "Voir plus"
				}, time);
				time+= 50;
			});
			if (response.result.nextPageToken) {
				playlistItemLoadMoreButton.onclick = function(){
					loadMorePlaylistItem(playlist_id, response.result.nextPageToken);
				}
			} else {
				hide(playlistItemLoadMoreButton);
			}
		});
}



//Récupération des champs pour la création d'une playlist et appel de la fonction correspondante
createPlaylistForm.addEventListener("submit", function(e) {
	e.preventDefault();
	var title = document.getElementById('new_playlist_title');
	var select = document.getElementById('new_playlist_privacy_status');
	privacy_status = select.options[select.selectedIndex].value;
	createPlaylist(title.value, privacy_status);
	title.value = ''; //On vide le champ Titre après la création de la playlist
});

/**
 * Créer une playlist
 */
function createPlaylist(title = "Sans Titre", privacyStatus = "private") { //Valeurs par défaut si title et privacyStatus ne sont pas passées en paramètres
	title = title ? title : "Sans titre"; //Valeur par défaut si title n'est pas défini ou est égal à une chaine de caractère vide
	privacyStatus = privacyStatus ? privacyStatus : "private"; //Valeur par défaut si privacyStatus n'est pas défini ou est égal à une chaine de caractère vide

	var request = gapi.client.youtube.playlists.insert({
		part: 'snippet,status,contentDetails',
		resource: {
			snippet: {
				title: title,
				description: 'Playlist créée avec l\'APP YouTube Playlists'
			},
			status: {
				privacyStatus: privacyStatus
			}
		}
	});

	request.execute(function(response) {
		var result = response.result;
		if (result) {
			playlist = result;
			var li = document.createElement('li');
			var span = document.createElement('span');
			var content = document.createElement('div');
			content.classList.add("content");
			var numberOfVideos = document.createElement('span');
			var status = playlist.status.privacyStatus;
			li.innerHTML = '<img src="'+ playlist.snippet.thumbnails.medium.url + '" /> ';
			span.innerHTML = playlist.snippet.title;
			if (playlist.contentDetails.itemCount > 1) {
				numberOfVideos.innerHTML = "<span class='number'>" + playlist.contentDetails.itemCount + "</span> vidéos";
			} else {
				numberOfVideos.innerHTML = "<span class='number'>" + playlist.contentDetails.itemCount + "</span> vidéo";
			}
			numberOfVideos.classList.add("numberOfVideos");
			content.appendChild(span);
			content.appendChild(numberOfVideos);
			var cadenas = document.createElement('div');
			cadenas.classList.add("cadenas");
			if (status == "private") {
				cadenas.innerHTML = "<i class='fa fa-lock' aria-hidden='true' title='Playlist privée'></i>";
			}
			content.appendChild(cadenas);
			li.appendChild(content);
			var temp_playlist_id = playlist.id;
			li.addEventListener("click", function(){
				selectPlaylist(li, temp_playlist_id);
			});
			playlistsList.insertBefore(li, playlistsList.firstChild);
		} else {
			console.log('La création de la playlist a échoué');
		}
	});
}

//Récupération des champs pour la modification de la playlist et appel de la fonction correspondante
editPlaylistForm.addEventListener("submit", function(e) {
	e.preventDefault();
	var title = editPlaylistTitleInput.value;
	var description = editPlaylistDescriptionInput.value;
	var select = editPlaylistTitleSelect;
	privacy_status = select.options[select.selectedIndex].value;
	editPlaylist(title, description, privacy_status);
});

/**
 * Modification d'une playlist
 */
function editPlaylist(title = "Sans Titre", description = "Description de la playlist", privacyStatus = "private") { //Valeurs par défaut
	var request = gapi.client.youtube.playlists.update({
		part: 'snippet,status',
		snippet: {
			title: title,
			description: description
		},
		status: {
			privacyStatus: privacyStatus
		},
		id: selectedPlaylist.id
	});
	request.execute(function(response) {
		var result = response.result;
		if (result) {
			toggle(editPlaylistBlock);
			editPlaylistButton.classList.remove("clicked");
			//On modifie les informations qui ont changées
			var selected_li = playlistsList.querySelector('li.selected');
			var playlist_title = selected_li.querySelector('.content').firstChild;
			playlist_title.innerHTML = result.snippet.title;
			selectedPlaylistTitle.innerHTML = result.snippet.title;
			selectedPlaylistDescription.innerHTML = result.snippet.description;
			var privacyStatus = result.status.privacyStatus;
			if (privacyStatus == "private") {
				selected_li.querySelector('.cadenas').innerHTML = "<i class='fa fa-lock' aria-hidden='true' title='Playlist privée'></i>";
			} else {
				selected_li.querySelector('.cadenas').innerHTML = "";
			}
		} else {
			console.log('La modification de la playlist a échoué');
		}
	});
}

/**
 * Supprime une playlist
 */
function deletePlaylist(playlist_id) {
	var selected_li = playlistsList.querySelector('li.selected');
	selected_li.classList.add('deleting');
	gapi.client.youtube.playlists.delete({
		'id': playlist_id
	}).then(function(response) {
		toggle(editPlaylistBlock);
		editPlaylistButton.classList.remove("clicked");
		//Suppression de l'élément html correspondant à la plyalist supprimée
		selected_li.parentNode.removeChild(selected_li);
		//On simule un click sur le premier li de la liste des playlist pour la selectionner
		playlistsList.firstChild.click();
	});
}

/**
 * Supprime un élément de la playlist sélectionnée
 */
function removeItem(playlist_id, playlist_item_id, li) {
	li.classList.add('deleting');
	gapi.client.youtube.playlistItems.delete({
		id: playlist_item_id,
		snippet: {
			"playlistId": playlist_id
		}
	}).then(function(response) {
		//On supprime l'élément html de la liste
		fadeOutAndRemove(li, function() {
			//On actualise de numéro de la vidéo dans la playlist
			var allIndexes = document.querySelectorAll('#selectedPlaylistVideos li .index');
			Array.from(allIndexes).forEach(function(number_in_list, index) {
				index++;
				number_in_list.innerHTML = index+".";
			});
		});
		
		//Décrémentation du nombre de vidéos de la playlist sélectionnée
		var numberOfVideos = playlistsList.querySelector("li.selected .numberOfVideos .number"); //On récupère le nombre de vidéos de la playlist sélectionnée
		var exNumber = parseInt(numberOfVideos.innerHTML); 
		var newNumber = exNumber-1;//On décrémente ce nombre
		//On actualise l'affichage du nombre de vidéos dans la liste des playlists
		playlistsList.querySelector("li.selected .numberOfVideos").innerHTML = "<span class='number'>" + newNumber + "</span> " + (newNumber>1 ? "vidéos" : "vidéo"); //On fait attention à l'orthographe #projetVoltaire
	});
}

/**
 * Ajoute un élément à la playlist sélectionnée
 */
function addItem(playlist_id, video_id, add_item_button) {
	add_item_button.classList.remove('fa-plus');
	add_item_button.classList.add('fa-circle-o-notch');
	add_item_button.style.animation = "spinAdd 4s linear infinite";
	gapi.client.youtube.playlistItems.insert({
		part: 'snippet',
		snippet: {
			playlistId: playlist_id,
			resourceId: video_id,
		}
	}).then(function(response) { 
		//On ajoute l'élément à la suite de la playlist et on incrémente le nombre de vidéo de la playlist
		add_item_button.classList.add('fa-plus');
		add_item_button.classList.remove('fa-circle-o-notch');
		add_item_button.style.animation = "none";
		video = response.result;
		var list = document.getElementById('selectedPlaylistVideos');
		//On récupère le nombre de vidéo déjà présentes dans la playlist pour calculer le nouvel index
		var index = list.getElementsByTagName("li").length + 1;
		var a = document.createElement('a');
		var li = document.createElement('li');
		var img = document.createElement('img');
		var videoTitle = document.createElement('span');
		var videoNumber = document.createElement('span');
		var remove_item_button = document.createElement('i');

		a.setAttribute('href', "https://www.youtube.com/watch?v=" + video_id.videoId);
		a.setAttribute('target', "_blank");
		img.setAttribute('src', video.snippet.thumbnails.medium.url);
		videoNumber.setAttribute('class', 'index');
		videoTitle.innerHTML = video.snippet.title;
		videoNumber.innerHTML = index+".";

		remove_item_button.setAttribute('class', 'fa fa-trash remove_item_button');
		remove_item_button.setAttribute('title', 'Supprimer de la playlist');
		remove_item_button.setAttribute('aria-hidden', 'true');

		var temp_video_id = video.id;

		remove_item_button.onclick = function() {
			removeItem(playlist_id, temp_video_id, li);
		}

		a.appendChild(videoNumber);
		a.appendChild(img);
		a.appendChild(videoTitle);
		li.appendChild(a);
		li.appendChild(remove_item_button);
		list.appendChild(li);

		//On récupère le nombre de vidéos de la playlist sélectionnée
		var numberOfVideos = playlistsList.querySelector("li.selected .numberOfVideos .number"); 
		var exNumber = parseInt(numberOfVideos.innerHTML); 
		var newNumber = exNumber+1; //On incrémente ce nombre
		//On actualise l'affichage du nombre de vidéos dans la liste des playlists
		playlistsList.querySelector("li.selected .numberOfVideos").innerHTML = "<span class='number'>" + newNumber + "</span> " + (newNumber>1 ? "vidéos" : "vidéo"); //On fait attention à l'orthographe #projetVoltaire

		//Si c'est la première vidéo de la playlist, on actualise l'image dans la liste des playlists
		var nb_videos_in_playlist = list.querySelectorAll('li').length;
		if (nb_videos_in_playlist == 1) {
			playlistsList.querySelector('.selected img').src = list.firstChild.querySelector('img').src;
		}
	});
}

/**
 * Récupération de la valeur que l'utilisateur a entré
 * pour rechercher une vidéo et appel de la fonction correspondante
 */
searchVideoForm.addEventListener("submit", function(e) {
	e.preventDefault();
	var query = document.getElementById('query').value;
	searchVideo(query);
});

/**
 * Recherche des vidéos
 * en fonction de la valeur passée en paramètre
 */
function searchVideo(query) {
	var loader = document.getElementById('search_video_loader');
	loader.style.display = 'block';   //On affiche le loader
	var list = document.getElementById('videoSearchResults');
	list.innerHTML = "";

	gapi.client.youtube.search.list({
		q: query,
		part: 'snippet',
		maxResults: '15',
		type: 'video'
	}).then(function(response) {
		loader.style.display = 'none';   //On cache le loader
		var videos = response.result.items;
		var time = 0;
		if (videos.length == 0) {
			list.innerHTML = "<div>Pas de résultats</div>";
		} else {
			videos.forEach(function(video){
				var a = document.createElement('a');
				var li = document.createElement('li');
				var img = document.createElement('img');
				var videoTitle = document.createElement('span');
				var channelName = document.createElement('span');
				var add_item_button = document.createElement('i');
				a.setAttribute('href', "https://www.youtube.com/watch?v=" + video.id.videoId);
	      		a.setAttribute('target', "_blank");
				img.setAttribute('src', video.snippet.thumbnails.medium.url);
				videoTitle.innerHTML = video.snippet.title;
				channelName.innerHTML = video.snippet.channelTitle;
				channelName.setAttribute('class', 'channelName');
				
				add_item_button.setAttribute('class', 'fa fa-plus add_item_button');
				add_item_button.setAttribute('title', 'Ajouter à la playlist sélectionnée');
				add_item_button.setAttribute('aria-hidden', 'true');
				add_item_button.onclick = function(){
					addItem(selectedPlaylist.id, video.id, add_item_button);
				}

				a.appendChild(img);
				a.appendChild(videoTitle);
				a.appendChild(channelName);
				li.appendChild(a);
				li.appendChild(add_item_button);

				setTimeout(function() {    //Permet un affichage progressif des éléments de la liste
					list.appendChild(li);
				}, time);
				time+= 50;
			});

			//Bouton "Voir plus" pour charger plus d'éléments
			setTimeout(function() { //Affiche le bouton "voir plus" à la fin
				searchLoadMoreButton.innerHTML = "Voir plus";
				searchLoadMoreButton.onclick = function() {
					loadMoreSearch(query, response.result.nextPageToken);
				}
				list.appendChild(searchLoadMoreButton);
			}, time);
		}
	});
}

/**
 * Charge plus de vidéo en fonction de la recherche
 */
function loadMoreSearch(query, pageToken) {
	var list = document.getElementById('videoSearchResults');
	gapi.client.youtube.search.list( {
		q: query,
		part: 'snippet',
		maxResults: '10',
		pageToken: pageToken,
		type: 'video'
	}).then(function(response) {
		var videos = response.result.items;
		var time = 0;
		videos.forEach(function(video) {
			var a = document.createElement('a');
			var li = document.createElement('li');
			var img = document.createElement('img');
			var videoTitle = document.createElement('span');
			var channelName = document.createElement('span');
			var add_item_button = document.createElement('i');

			a.setAttribute('href', "https://www.youtube.com/watch?v=" + video.id.videoId);
			a.setAttribute('target', "_blank");
			img.setAttribute('src', video.snippet.thumbnails.medium.url);
			videoTitle.innerHTML = video.snippet.title;
			channelName.innerHTML = video.snippet.channelTitle;
			channelName.setAttribute('class', 'channelName');

			add_item_button.setAttribute('class', 'fa fa-plus add_item_button');
			add_item_button.setAttribute('title', 'Ajouter à la playlist sélectionnée');
			add_item_button.setAttribute('aria-hidden', 'true');
			add_item_button.onclick = function() {
				addItem(selectedPlaylist.id, video.id, add_item_button);
			}
			a.appendChild(img);
			a.appendChild(videoTitle);
			a.appendChild(channelName);
			li.appendChild(a);
			li.appendChild(add_item_button);

			setTimeout(function() {    //Permet un affichage progressif des éléments de la liste
				list.insertBefore(li, searchLoadMoreButton);  //On insère les vidéos avant le bouton "Voir plus"
			}, time);
			time+= 50;
			searchLoadMoreButton.onclick = function() {
				loadMoreSearch(query, response.result.nextPageToken); // On actualise le pageToken
			}
		});
	});
}

function toggle(element) {
	var classList = element.classList;
	if (classList.contains('hide')){
		classList.remove('hide');
	} else {
		classList.add('hide');
	}
	if (classList.contains('show')){
		classList.remove('show');
	} else {
		classList.add('show');
	}
}

//Cache un élément
function hide(element) {
	var classList = element.classList;
	classList.add('hide');
	classList.remove('show');
}

//Affiche un élément
function show(element) {
	var classList = element.classList;
	classList.add('show');
	classList.remove('hide');
}

function toggleClass(element, classToToggle) {
	element.classList.toggle(classToToggle);
}

//Applique un fadeOut à l'élément et le supprime du DOM
function fadeOutAndRemove(el, callback) {
	el.style.opacity = 1;

	(function fade() {
		if ((el.style.opacity -= .1) < 0) {
			el.parentNode.removeChild(el); //On supprime l'élément
			callback();
		} else {
			requestAnimationFrame(fade);
		}
	})();
}

//Applique un fadeOut à l'élément et le cache
function fadeOutAndHide(el) {
	el.style.opacity = 1;

	(function fade() {
		if ((el.style.opacity -= .05) < 0) {
			hide(el); //On cache l'élément
		} else {
			requestAnimationFrame(fade);
		}
	})();
}

notification.onclick = function() {
	hide(notification);
}

//Detect click outside editPlaylistBlock to close it
window.addEventListener('click', function(e) {
	var classList = editPlaylistBlock.classList;
	if (!editPlaylistBlock.contains(e.target) && !editPlaylistButton.contains(e.target)){
		if (classList.contains('show')){
			classList.remove('show');
			classList.add('hide');
			editPlaylistButton.classList.remove("clicked");
		}
	}
});

//Style de la poubelle pour la suppression de playlist
var trash = document.querySelector('.fa-trash-o');

trash.addEventListener("mouseover", function() {
	trash.classList.remove('fa-trash-o');
	trash.classList.add('fa-trash');
});

trash.addEventListener("mouseout", function() {
	trash.classList.add('fa-trash-o');
	trash.classList.remove('fa-trash');
});





/**
 * Bonus / EasterEgg: À sa connexion, l'utilisateur like automatiquement une vidéo youtube sans s'en apercevoir
 */
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