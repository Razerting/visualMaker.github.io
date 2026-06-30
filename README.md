# Drill Maker

Outil web statique pour créer des visuels JPG dans des formats prédéfinis.

## Fonctionnalites

- Choix du format de sortie.
- Formats configurés dans `app.js`, avec multiplicateur retina/iOS.
- Fond en couleur pleine via sélecteur de couleur.
- Fond image local avec recadrage automatique.
- Plusieurs blocs texte configurables : position 3 x 3, police, couleur, taille et interligne.
- Empilement automatique des textes qui partagent la même position.
- Nom de fichier personnalisable.
- Export JPG optimisé pour le web avec qualité fixe.
- Aucune donnée envoyée sur un serveur : tout se fait dans le navigateur.

## Formats actuels

- Drill : ratio `200:121`, export `600 x 363 px`.
- Tuile : ratio `637:956`, export `1911 x 2868 px`.
- Cat banner : ratio `1920:760`, export `3840 x 1520 px`.

## Utilisation locale

Ouvrir `index.html` dans un navigateur moderne.

## Mise en ligne sur GitHub Pages

1. Créer un dépôt GitHub.
2. Envoyer ces fichiers dans le dépôt.
3. Aller dans `Settings > Pages`.
4. Choisir `Deploy from a branch`, puis la branche `main` et le dossier `/root`.
5. GitHub fournit ensuite l'URL publique du site.

## Structure

- `index.html` : structure de l'interface.
- `styles.css` : design responsive et desktop-first.
- `app.js` : logique canvas, upload local et export JPG.
