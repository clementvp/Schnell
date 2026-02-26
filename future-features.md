# Future Features

## Fonctionnalités essentielles

- **Historique des générations** — liste des images générées en session avec leur prompt, cliquables pour les réafficher
- **Paramètres de génération** — exposer les options du modèle (taille, steps, seed, guidance scale) dans un panneau dédié
- **Copier dans le presse-papiers** — bouton "Copier" en plus du "Télécharger" dans la modale
- **Générer N variantes** — lancer plusieurs générations en parallèle et afficher une grille de résultats

## Confort d'utilisation

- **Page Paramètres** — configurer l'endpoint et le token Cloudflare depuis l'UI (plutôt que le `.env`), persisté avec `electron-store`
- **Mémoriser la taille/position de la fenêtre** entre les sessions
- **Glisser-déposer de l'image** depuis la modale vers d'autres apps (Finder, Figma, etc.)
- **Formats d'export** — PNG et WebP en plus du JPEG actuel

## Plus ambitieux

- **Galerie locale** — bibliothèque de toutes les images sauvegardées, avec recherche par prompt
- **Amélioration du prompt** — bouton pour enrichir/reformuler le prompt via l'API Claude avant génération
- **Prompts favoris** — sauvegarder des prompts récurrents
