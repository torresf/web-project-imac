Client ID : 405209705968-vpb5ad8ans3mlpj6ei85u7uu2bhlb67q.apps.googleusercontent.com
Code Secret Client : wC0F_HMGO9Pb-t12dus_XpGF

>>> Idée : Gestionnaire de Playlists
- Recherche un utilisateur : on garde ? Si oui, notification si l'utilisateur n'existe pas
- Load more panneau central (si longue playlist (supérieure à 25 item))
- Changer playlists_list en variable globale
- Faire le responsive
- add item : actualiser image de la playlist
- remove item, actualiser le numéro devant (faire un forEach sur les li, et actualiser l'index)
- Bug au selectPlaylist à la création de la playlist

- Valeurs par défaut du main content : rectangles gris à la place de "Titre de la playlist" etc. OU valeurs grisées

- Tous les commentaires en français ?
- Tri des playlist (date de création, modification, dernière vidéo ajoutée, etc -> voir les possibilités) (? Pas indispensable)
- Notification validation / erreur pour chaque fonctionnalité (?)

- Ouverture : Drag and drop pour changer la position des vidéos dans la playlist (possible mais très long)

>>> Idée TOM :
-		Connexion (popup sur fond blanc)
-		Un champ de recherche de chaine YT
-		3 pages/boutons (Playlists, Info Chaine, Infos Vidéos)


>>> Lancer le serveur
- 		PYTHON 2.X : 	python -m SimpleHTTPServer 8000
-		PYTHON 3.X : 	py -m http.server 8000
-							OU
-						python3 -m http.server 8000


>>> Bug
-		Ajout de playlist sans titre (valeurs par défaut)

