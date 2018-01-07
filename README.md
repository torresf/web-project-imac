# Projet d'application web : Gestionnaire de Playlists Youtube

> Développé par Tom Samaille et Florian Torres

Cette application permet à un utilisateur de se connecter avec son compte Youtube/Google et de **gérer ses playlists Youtube**. Différentes possibilités s'offrent à lui : Tout d'abord, l'application récupère ses playlists dans le panneau de gauche. Il peut les sélectionner pour **voir leur contenu**, **modifier** les informations de la playlist (titre, description et statut : publique ou privée), **supprimer** la playlist.

Ensuite, il peut **créer une nouvelle playlist** avec le titre et le statut de son choix. Pour chaque playlist, l'utilisateur peut **supprimer des éléments** ou en **ajouter**. Pour l'ajout, il suffit de **rechercher une vidéo** dans le panneau de droite et de cliquer sur le bouton *plus* pour ajouter un élément à la playlist sélectionnée.

Enfin, grâce à cette application, on peut visualiser les playlists publiques de n'importe quel utilisateur en recherchant le nom de sa chaîne dans le panneau de gauche. Par contre, les fonctionnalités de modifications sont désactivées lorsque l'on quitte notre compte. Un simple clic sur notre photo de profil permet de revenir à nos playlists.

### Outils de réalisation du projet
Nous avons utilisé SASS pour éditer le style de l'application afin de faciliter l'intéligibilité, le poids et l'organisation de nos feuilles de style et d'utiliser une nouvelle techno pour nous y familiariser. Les fichiers .SCSS [à regarder pour la correction et la compréhension ;)] sont dans le dossier ./style tandis que les fichiers .CSS et .MIN.CSS générés à la compilation sont dans le dossier ./css

Pour le JS, nous avons séparé les fichiers (pour simplifier la correction) avec un fichier script.js (correspondant principalement à la gestion et à l'utilisation de l'API Youtube et des requêtes qui permettent d'aboutir à notre gestionnaire de Playlists) et un fichier responsive.js (correspondant à la gestion de style liée au responsive) dans le dossier ./script

### Idées d'amélioration
- Développer un Drag & Drop pour modifier l'ordre des vidéos dans une playlist
- Autocomplétion sur le nom d'utilisateur et la recherche de vidéo
- Faire le responsive (Format tablette : DONE, format portable -> Si le temps nous le permet sinon --> Idées d'amélioration)

### Lancer un serveur en python
- AVEC PYTHON 2
	`python -m SimpleHTTPServer 8000`
- AVEC PYTHON 3 (selon la version)
	`py -m http.server 8000` ou 
	`python3 -m http.server 8000`