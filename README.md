# Drill Maker

Outil web statique pour créer des visuels JPG dans des formats prédéfinis.

## Fonctionnalites

- Choix du format de sortie.
- Fond en couleur pleine via sélecteur de couleur.
- Fond image local avec recadrage automatique.
- Texte configurable avec position 3 x 3, couleur, taille et interligne.
- Export JPG optimisé pour le web.
- Aucune donnée envoyée sur un serveur : tout se fait dans le navigateur.

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
