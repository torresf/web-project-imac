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
var left_aside = document.getElementById('left_aside');
var main_content = document.getElementById('main_content');
var video_search = document.getElementById('video_search');


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
 * Global Variables 
 */
var playlists_list = document.getElementById('playlists_list');
var addPlaylistBlock = document.getElementById('addPlaylist');
var delete_playlist_button = document.getElementById('delete_playlist_button');

var my_account = document.getElementById('myaccount');
var channel_thumbnail = document.getElementById('channel_thumbnail');
var channel_title = document.getElementById('channel_title');
var username = document.getElementById("username");

var search_result = document.getElementById('search_result');
var searched_channel_thumbnail = document.getElementById('searched_channel_thumbnail');
var searched_channel_title = document.getElementById('searched_channel_title');

var selectedPlaylistTitle = document.getElementById("selectedPlaylistTitle");
var selectedPlaylistDescription = document.getElementById("selectedPlaylistDescription");

var editPlaylistTitleInput = document.getElementById("edit_playlist_title");
var editPlaylistDescriptionInput = document.getElementById("edit_playlist_description");
var editPlaylistTitleSelect = document.getElementById("edit_playlist_privacy_status");
var editPlaylistButton = document.getElementById("edit_playlist_button");
var editPlaylistBlock = document.getElementById("editPlaylist");

var addVideoButton = document.getElementById("add_video");
var modalAddVideo = document.getElementById("video_search");
var closeModalButton = document.getElementById("closemodal");
var backgroundModal = document.getElementById("background_modal");

//Forms
var create_playlist_form = document.getElementById('create_playlist_form');
var search_channel_form = document.getElementById('searchByUsername');
var edit_playlist_form = document.getElementById('edit_playlist_form');

var search_load_more_button = document.createElement('button');
var playlist_item_load_more_button = document.createElement('button');

var selectedPlaylist; //Objet JS correpondant à la playlist selectionnée
var myChannel = true; //Permet de savoir si on est sur notre compte ou sur une recherche différente

/**
 * Init Content
 */
function initContent(){
	getMyChannel();
	edit_playlist_button.onclick = function(){
		toggle(editPlaylistBlock);
		toggleClass(editPlaylistButton, "clicked");
	}
	hide(search_result);
	show(addPlaylistBlock);
	my_account.classList.remove('mini');
	show(channel_title);
	playlists_list.innerHTML = "";
	defineRequest();
	username.value = "";
}

/**
 * Get my Channel
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
			channel_title.innerHTML = channel.snippet.title;
			channel_thumbnail.src = channel.snippet.thumbnails.medium.url;
			channel_thumbnail.onclick = function(){
				initContent();
			}
			getPlaylists(channel.id);
			show(video_search);
		} else {
			initContent();
			console.log("Aucun utilisateur avec ce pseudo");
		}
	});
}



search_channel_form.addEventListener("submit", function(e){
	e.preventDefault();
	var username = document.getElementById("username").value;
	getChannel(username);
});

/**
 * Get Channel (search by username)
 */
function getChannel(username) {
	hide(addVideoButton);
	params = {
		'part': 'snippet,contentDetails,statistics',
		'forUsername': username,
	}
	myChannel = username ? false : true;

	gapi.client.youtube.channels.list(params).then(function(response) {
		var channel = response.result.items[0];
		if (channel) {
			searched_channel_title.innerHTML = channel.snippet.title;
			searched_channel_thumbnail.src = channel.snippet.thumbnails.medium.url;
			show(search_result);
			getPlaylists(channel.id);
			my_account.classList.add('mini');
			hide(channel_title);
			hide(addPlaylistBlock);
			hide(video_search);
		} else {
			initContent();
			hide(search_result);
			console.log("Aucun utilisateur avec ce pseudo");
		}
	});
}


/**
 * Get all playlists from current channel
 */
function getPlaylists(id) {
	var loader = document.getElementById('playlist_loader');
	loader.style.display = 'block';   //On affiche le loader

	var list = playlists_list;
	list.innerHTML = "";    //On vide la liste de playlist

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
		playlists.forEach(function(playlist, index){
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
			li.addEventListener("click", function(){
				selectPlaylist(li, String(playlist.id))
			});
			setTimeout(function(){    //Permet un affichage progressif des éléments de la liste
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
 * Select Playlist
 */
function selectPlaylist(clicked_li, playlist_id) { //clicked_li correspond au li sur lequel l'utilisateur a cliqué
	
	//Changement de style pour le li selectionné
	allLi = playlists_list.querySelectorAll("li");
	Array.from(allLi).forEach(function(li){		//allLi est un nodeList et non un array. forEach ne marchAIT pas pour les nodelist sur les anciens navigateurs donc il faut les transformer en array.
		li.classList.remove('selected');
	})
	if (clicked_li) {
		clicked_li.classList.add('selected');
	}

	//Appel API pour récuperer la playlist selectionnée;
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
		main_content.classList.remove('fullscreen');
		delete_playlist_button.onclick = function(){
			deletePlaylist(playlist_id);
		}
		editPlaylistButton.style.display = "inline-block";
	} else {
		editPlaylistButton.style.display = "none";
		if (window.innerWidth>=1110){
			main_content.classList.add('fullscreen');
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

			remove_item_button.setAttribute('class', 'fa fa-trash remove_item_button');
			remove_item_button.setAttribute('title', 'Supprimer de la playlist');
			remove_item_button.setAttribute('aria-hidden', 'true');
			remove_item_button.onclick = function(){
				removeItem(playlist_id, video.id, li);
			}

			a.appendChild(videoNumber);
			a.appendChild(img);
			a.appendChild(videoTitle);
			li.appendChild(a);
			li.appendChild(remove_item_button);

			setTimeout(function(){    //Permet un affichage progressif des éléments de la liste
				list.appendChild(li);
			}, time);
			time+= 50;
		});

		//Bouton "Voir plus" pour charger plus d'éléments
		if (response.result.nextPageToken) {
			setTimeout(function(){ //Affiche le bouton "voir plus" à la fin
				playlist_item_load_more_button.innerHTML = "Voir plus d'éléments";
				playlist_item_load_more_button.onclick = function(){
					loadMorePlaylistItem(playlist_id, response.result.nextPageToken);
				}
				list.appendChild(playlist_item_load_more_button);
				show(playlist_item_load_more_button);
			}, time);
		}
	});
}


/**
 * Load More Playlist Item
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

				remove_item_button.setAttribute('class', 'fa fa-trash remove_item_button');
				remove_item_button.setAttribute('title', 'Supprimer de la playlist');
				remove_item_button.setAttribute('aria-hidden', 'true');
				remove_item_button.onclick = function(){
					removeItem(playlist_id, video.id, li);
				}

				a.appendChild(videoNumber);
				a.appendChild(img);
				a.appendChild(videoTitle);
				li.appendChild(a);
				li.appendChild(remove_item_button);

				setTimeout(function(){    //Permet un affichage progressif des éléments de la liste
					list.insertBefore(li, playlist_item_load_more_button);  //On insère les vidéos avant le bouton "Voir plus"
				}, time);
				time+= 50;
			});
			if (response.result.nextPageToken) {
				playlist_item_load_more_button.onclick = function(){
					loadMorePlaylistItem(playlist_id, response.result.nextPageToken);
				}
			} else {
				hide(playlist_item_load_more_button);
			}
		});
}




create_playlist_form.addEventListener("submit", function(e){
	e.preventDefault();
	var title = document.getElementById('new_playlist_title');
	var select = document.getElementById('new_playlist_privacy_status');
	privacy_status = select.options[select.selectedIndex].value;
	createPlaylist(title.value, privacy_status);
	title.value = '';
});

/**
 * Create Playlist
 */
function createPlaylist(title = "Sans Titre", privacyStatus = "private") { //Valeurs par défaut

	if (!title) {
		title = "Sans titre";
	}
	if (!privacyStatus) {
		privacyStatus = "private";
	}
	var request = gapi.client.youtube.playlists.insert({
		part: 'snippet,status,contentDetails',
		resource: {
			snippet: {
				title: title,
				description: 'Playlist créée avec l\'API YouTube Playlists'
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
			playlists_list.insertBefore(li, playlists_list.firstChild);
		} else {
			console.log('La création de la playlist a échoué');
		}
	});
}


edit_playlist_form.addEventListener("submit", function(e){
	e.preventDefault();
	var title = editPlaylistTitleInput.value;
	var description = editPlaylistDescriptionInput.value;
	var select = editPlaylistTitleSelect;
	privacy_status = select.options[select.selectedIndex].value;
	editPlaylist(title, description, privacy_status);
});

/**
 * Edit Playlist
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
			var selected_li = playlists_list.querySelector('li.selected');
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
 * Delete Playlist
 */
function deletePlaylist(playlist_id) {
	var selected_li = playlists_list.querySelector('li.selected');
	selected_li.classList.add('deleting');
	gapi.client.youtube.playlists.delete({
		'id': playlist_id
	}).then(function(response) {
		toggle(editPlaylistBlock);
		editPlaylistButton.classList.remove("clicked");
		//Suppression de l'élément html correspondant à la plyalist supprimée
		selected_li.parentNode.removeChild(selected_li);
		//On simule un click sur le premier li de la liste des playlist pour la selectionner
		playlists_list.firstChild.click();
	});
}

/**
 * Remove Item from the selected playlist
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
		fadeOutAndRemove(li, function(){
			//On actualise de numéro de la vidéo dans la playlist
			var allIndexes = document.querySelectorAll('#selectedPlaylistVideos li .index');
			Array.from(allIndexes).forEach(function(number_in_list, index){
				index++;
				number_in_list.innerHTML = index+".";
			});
		});
		
		//on décrémente le nombre de vidéo de la playlist concernée
		var numberOfVideos = playlists_list.querySelector("li.selected .numberOfVideos .number"); //On récupère le nombre de vidéos de la playlist sélectionnée
		var exNumber = parseInt(numberOfVideos.innerHTML); //On décrémente ce nombre
		var newNumber = exNumber-1;
		//On fait attention à l'orthographe
		if (newNumber>1) {
			playlists_list.querySelector("li.selected .numberOfVideos").innerHTML = "<span class='number'>" + newNumber + "</span> vidéos";
		} else {
			playlists_list.querySelector("li.selected .numberOfVideos").innerHTML = "<span class='number'>" + newNumber + "</span> vidéo";
		}

		
		
	});
}

/**
 * Add Item to the selected playlist
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
	}).then(function(response) { //On ajoute l'élément à la suite de la playlist et on incrémente le nombre de vidéo de la playlist
		add_item_button.classList.add('fa-plus');
		add_item_button.classList.remove('fa-circle-o-notch');
		add_item_button.style.animation = "none";
		video = response.result;
		var list = document.getElementById('selectedPlaylistVideos');
		var index = list.getElementsByTagName("li").length + 1; //On récupère le nombre de vidéo déjà présentes dans la playlist pour le nouvel index
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

		remove_item_button.onclick = function(){
			removeItem(playlist_id, temp_video_id, li);
		}

		a.appendChild(videoNumber);
		a.appendChild(img);
		a.appendChild(videoTitle);
		li.appendChild(a);
		li.appendChild(remove_item_button);
		list.appendChild(li);
		
		var numberOfVideos = playlists_list.querySelector("li.selected .numberOfVideos .number"); //On récupère le nombre de vidéos de la playlist sélectionnée
		var exNumber = parseInt(numberOfVideos.innerHTML); //On incrémente ce nombre
		var newNumber = exNumber+1;
		//On fait attention à l'orthographe
		if (newNumber>1) {
			playlists_list.querySelector("li.selected .numberOfVideos").innerHTML = "<span class='number'>" + newNumber + "</span> vidéos";
		} else {
			playlists_list.querySelector("li.selected .numberOfVideos").innerHTML = "<span class='number'>" + newNumber + "</span> vidéo";
		}
		//Si c'est la première vidéo de la playlist, on actualise l'image dans la liste des playlists
		var nb_videos_in_playlist = list.querySelectorAll('li').length;
		if (nb_videos_in_playlist == 1) {
			playlists_list.querySelector('.selected img').src = list.firstChild.querySelector('img').src;
		}
	});
}


/**
 * Search Video
 */
function searchVideo(query) {
	var loader = document.getElementById('search_video_loader');
	loader.style.display = 'block';   //On affiche le loader
	var list = document.getElementById('searchResults');
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

				setTimeout(function(){    //Permet un affichage progressif des éléments de la liste
						list.appendChild(li);
					}, time);
				time+= 50;
			});

			//Bouton "Voir plus" pour charger plus d'éléments
			setTimeout(function(){ //Affiche le bouton "voir plus" à la fin
				search_load_more_button.innerHTML = "Voir plus";
				search_load_more_button.onclick = function(){
					loadMoreSearch(query, response.result.nextPageToken);
				}
				list.appendChild(search_load_more_button);
			}, time);
		}
	});
}

/**
 * Search Video
 */
function loadMoreSearch(query, pageToken) {
	var list = document.getElementById('searchResults');
	gapi.client.youtube.search.list({
		q: query,
		part: 'snippet',
		maxResults: '10',
		pageToken: pageToken,
		type: 'video'
	}).then(function(response) {
		var videos = response.result.items;
		var time = 0;
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

			setTimeout(function(){    //Permet un affichage progressif des éléments de la liste
				list.insertBefore(li, search_load_more_button);  //On insère les vidéos avant le bouton "Voir plus"
			}, time);
			time+= 50;
			search_load_more_button.onclick = function(){
				loadMoreSearch(query, response.result.nextPageToken); // On actualise le pageToken
			}
		});
	});
}


function toggle(element){
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

function hide(element){
	var classList = element.classList;
	classList.add('hide');
	classList.remove('show');
}

function show(element){
	var classList = element.classList;
	classList.add('show');
	classList.remove('hide');
}

function toggleClass(element, classToToggle){
	element.classList.toggle(classToToggle);
}


function fadeOutAndRemove(el, callback){
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