>>> Idée : Gestionnaire de Playlists
- Recherche un utilisateur : on garde ? Si oui -> notification lorsque l'utilisateur n'existe pas
- Faire le responsive
	FORMAT TABLETTE AVEC ASIDE + SECTION PLAYLIST. On tej la section vidéo et on met un bouton ajouter qui donne sur l'appartition d'une modal pour rechercher puis ajouter un élément. FAIT

BUGS A CORRIGER :
- Pas de scroll bar sur le aside en mode tablette (incompréhensible je pète un plomb mdr)
- Enlever le bouton ajouter une vidéo quand on est sur un utilisateur autre que celui connecté (sinon problèmes lol)
- Bug lié à l'ordre des fonctions qui ajoutent la class show à la section #video_search au chargement initial (si on refresh la page en mode tablette la section #video_search est déjà affichée c nul)
- Il faut rajouter un && dans la condition ligne 23 du myscript.js qui dit : if (modalAddVideo.classList.contains('hide') &&  L'UTILISATEUR DONT ON REGARDE LA PLAYLIST EST L'UTILISATEUR CONNECTE ET PAS UN UTILISATEUR QUE L'ON A RECHERCHER)


- Supprimer tous les console.log inutiles FAIT
- Remplacer la photo de profil par défaut par un chargement (ex: une image qui tourne) FAIT

- Valeurs par défaut du main content : rectangles gris à la place de "Titre de la playlist"

- Tous les commentaires en français ?
- Tri des playlist (date de création, modification, dernière vidéo ajoutée, etc -> voir les possibilités) (? Pas indispensable)
- Notification validation / erreur pour chaque fonctionnalité (?)


- Ouverture : Drag and drop pour changer la position des vidéos dans la playlist (possible mais très long)


>>> Lancer le serveur
- 		PYTHON 2.X : 	python -m SimpleHTTPServer 8000
-		PYTHON 3.X : 	py -m http.server 8000
-							OU
-						python3 -m http.server 8000