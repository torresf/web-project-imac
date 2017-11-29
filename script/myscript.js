// document.getElementById('add_playlist').onclick = function(){
// 	console.log('Appel getPlaylists');
// 	getPlaylists();
// };

var form = document.getElementById('searchByUsername');

form.addEventListener("submit", function(e){
	e.preventDefault();
	var username = document.getElementById("username").value;
	getChannel(username);
});