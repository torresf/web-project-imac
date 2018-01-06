# Projet d'application web : Gestionnaire de Playlists Youtube
Cette application permet à un utilisateur de se connecter avec son compte Youtube/Google et de **gérer ses playlists Youtube**. Différentes possibilités s'offrent à lui : Tout d'abord, l'application récupère ses playlists dans le panneau de gauche. Il peut les sélectionner pour **voir leur contenu**, **modifier** les informations de la playlist (titre, description et statut : publique ou privée), **supprimer** la playlist.
Ensuite, il peut **créer une nouvelle playlist** avec le titre et le statut de son choix. Pour chaque playlist, l'utilisateur peut **supprimer des éléments** ou en **ajouter**. Pour l'ajout, il suffit de **rechercher une vidéo** dans le panneau de droite et de cliquer sur le bouton *plus* pour ajouter un élément à la playlist sélectionnée.
Enfin, grâce à cette application, on peut visualiser les playlists publiques de n'importe quel utilisateur en recherchant le nom de sa chaîne dans le panneau de gauche. Par contre, les fonctionnalités de modifications sont désactivées lorsque l'on quitte notre compte. Un simple clic sur notre photo de profil permet de revenir à nos playlist.


### To Do
- Pour utilisateur recherché : Cacher le bouton supprimer
- Commenter le code en français
- Recherche un utilisateur : Notification lorsque l'utilisateur n'existe pas
- Faire le responsive (Format tablette : DONE, format portable --> SI j'ai le time)


### Idées d'amélioration
- Développer un Drag & Drop pour modifier l'ordre des vidéos dans une playlist
- Autocomplétion sur le nom d'utilisateur et la recherche de vidéo


### Lancer un serveur en python
- PYTHON 2.X
	`python -m SimpleHTTPServer 8000`
- PYTHON 3.X
	`py -m http.server 8000`
	`python3 -m http.server 8000`