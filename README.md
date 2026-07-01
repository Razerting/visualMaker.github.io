# Drill Maker

Outil web statique pour créer des visuels JPG dans des formats prédéfinis.

## Fonctionnalites

- Choix du format de sortie.
- Formats configurés dans `js/config/appConfig.js`, avec multiplicateur retina/iOS.
- Fond en couleur pleine via sélecteur de couleur.
- Fond image local avec recadrage automatique, zoom et repositionnement.
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
- `js/main.js` : point d'entrée.
- `js/config/` : formats, polices, qualité JPG et futurs flags.
- `js/models/` : état central de l'éditeur.
- `js/views/` : rendu DOM et canvas.
- `js/controllers/` : événements utilisateur et orchestration.
- `js/services/` : upload image, export JPG, layout texte et points d'intégration.

## Extension IA prévue

La génération de fond n'est pas active pour l'instant. Le point d'extension est préparé dans `js/services/backgroundGenerationService.js` et la configuration associée dans `js/config/appConfig.js`.

L'idée prévue : envoyer l'image, le format cible, les zones manquantes et un prompt optionnel à un service externe, puis récupérer une image utilisable par le service de fond existant. Cette partie nécessitera probablement un backend ou une fonction serverless pour protéger les clés API.
