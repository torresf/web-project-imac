>>> Idée : Gestionnaire de Playlists
- Recherche un utilisateur : on garde ? Si oui -> notification lorsque l'utilisateur n'existe pas YES
- Faire le responsive (FORMAT PORTABLE --> SI j'ai le time)

BUGS A CORRIGER :
- Pas de scroll bar sur le aside en mode tablette (incompréhensible je pète un plomb mdr)
- Bug lié à l'ordre des fonctions qui ajoutent la class show à la section #video_search au chargement initial (si on refresh la page en mode tablette la section #video_search est déjà affichée c nul)

- Valeurs par défaut du main content : rectangles gris à la place de "Titre de la playlist"

- Tous les commentaires en français ? OUIIII
- Tri des playlist (date de création, modification, dernière vidéo ajoutée, etc -> voir les possibilités) (? Pas indispensable) NOPE
- Notification validation / erreur pour chaque fonctionnalité (?) NOPE


- Ouverture : Drag and drop pour changer la position des vidéos dans la playlist (possible mais très long)


>>> Lancer le serveur
- 		PYTHON 2.X : 	python -m SimpleHTTPServer 8000
-		PYTHON 3.X : 	py -m http.server 8000
-							OU
-						python3 -m http.server 8000