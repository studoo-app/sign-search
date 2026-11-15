# Installation

L'extension n'est pas publiée sur le Chrome Web Store. On l'installe en **mode développeur**, ce qui prend environ une minute.

## Prérequis

- Google Chrome, Brave ou Microsoft Edge, dans une version récente (Manifest V3).
- Un compte sign.com ouvert dans ce navigateur.

## 1. Récupérer l'extension

Au choix :

- **Avec Git** :
  ```
  git clone https://github.com/bfoujols/sign-search.git
  ```
- **Sans Git** : sur la page GitHub du dépôt, cliquez sur **Code → Download ZIP**, puis décompressez l'archive.
- **Archive prête** : utilisez `sign-search.zip` (générée par `npm run zip`) et décompressez-la.

Placez le dossier à un endroit **stable**, par exemple `Documents/Extensions/sign-search`. Le navigateur charge l'extension depuis ce dossier à chaque démarrage : il ne faut pas le supprimer ni le déplacer.

## 2. Charger l'extension

| Navigateur | Adresse à ouvrir |
|---|---|
| Chrome | `chrome://extensions` |
| Brave | `brave://extensions` |
| Edge | `edge://extensions` |

1. Activez le **Mode développeur** (interrupteur en haut à droite).
2. Cliquez sur **Charger l'extension non empaquetée**.
3. Sélectionnez le dossier qui contient `manifest.json`. Attention : pas un dossier parent, ni le zip.
4. La carte « Sign.com Recherche » apparaît. Activez-la si elle ne l'est pas déjà.

**Conseil** : épinglez l'icône. Cliquez sur la pièce de puzzle dans la barre d'outils, puis sur la punaise à côté de « Sign.com Recherche ».

## 3. Vérifier

1. Ouvrez (ou rechargez) https://sign.com/storage/all-documents.
2. Le bouton **🔎 Rechercher** apparaît en bas à droite.
3. Cliquez dessus : le panneau s'ouvre et affiche « X / X documents ».

## Mettre à jour

1. Récupérez la nouvelle version : `git pull`, ou remplacez le contenu du dossier par la nouvelle archive.
2. Dans la page des extensions, cliquez sur l'icône **↻** de la carte « Sign.com Recherche ».
3. Rechargez l'onglet sign.com.

## Changer le raccourci clavier

Le raccourci par défaut est **Alt + Maj + S**. Pour le modifier, ouvrez `chrome://extensions/shortcuts` (ou `brave://extensions/shortcuts`). Cherchez ensuite « Sign.com Recherche » → « Ouvrir / fermer le panneau de recherche ».

## Désinstaller

Dans la page des extensions, cliquez sur **Supprimer** sur la carte. L'extension n'enregistre aucune donnée : il n'y a rien d'autre à nettoyer.

## Message « Désactiver les extensions en mode développeur »

Chrome affiche parfois ce message au démarrage. Cliquez simplement sur la croix pour le fermer, sans désactiver l'extension. Brave n'affiche pas ce message.
