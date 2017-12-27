Client ID : 405209705968-vpb5ad8ans3mlpj6ei85u7uu2bhlb67q.apps.googleusercontent.com
Code Secret Client : wC0F_HMGO9Pb-t12dus_XpGF

>>> Idée : Gestionnaire de Playlists
- Créer / Supprimer une nouvelle Playlist ("Êtes vous vraiment sûr de vouloir supprimer cette playlist ?")
- Modifier une playlist déjà existante (Nom, Description, etc...)
- Ajouter / Supprimer un élément à la playlist
- Popup validation / erreur pour chaque fonctionnalité
- Tri des playlist (date de création, modification, dernière vidéo ajoutée, etc -> voir les possibilités)
- Modal pour voir la vidéo au clic
- Chargement des playlists en différé (chacun son tour, avec un setTimeout)
- Ajouter un bouton Paramètres (choix de la couleur etc.)
- Recherche un utilisateur ? Si oui, notification si l'utilisateur n'existe pas
- Créer un système de notification 
- Bouton mon compte, deconnexion en haut à gauche
- Changer Le format des vignettes
- modification de la playlist : Ajouter la description + Afficher description en dessous du titre
- Ajouter bouton "mes playlists"

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

