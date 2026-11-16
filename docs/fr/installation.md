[English](../en/installation.md) · **Français**

# Installation

L'extension n'est pas publiée sur le Chrome Web Store. On l'installe en **mode développeur**, ce qui prend environ une minute.

## Prérequis

- Un navigateur compatible : Chrome, Brave, Edge ou un autre navigateur Chromium récent (voir le [tableau ci-dessous](#navigateurs-compatibles)).
- Un compte sign.com ouvert dans ce navigateur.

## Navigateurs compatibles

L'extension fonctionne dans les navigateurs basés sur **Chromium** (Manifest V3, version 88 ou plus).

| Navigateur | Compatible | Page des extensions | Remarques |
|---|---|---|---|
| Google Chrome | ✅ Oui | `chrome://extensions` | Navigateur de référence. |
| Brave | ✅ Oui | `brave://extensions` | Navigateur de référence. |
| Microsoft Edge | ✅ Oui | `edge://extensions` | Le **Mode développeur** se trouve dans le menu de gauche. |
| Opera / Opera GX | ✅ Oui | `opera://extensions` | Moteur Chromium. |
| Vivaldi | ✅ Oui | `vivaldi://extensions` | Moteur Chromium. |
| Arc | ✅ Oui | `arc://extensions` | Moteur Chromium. |
| Firefox | ❌ Non | — | Firefox n'accepte pas le *service worker* d'arrière-plan déclaré dans le manifest. Une version Firefox est une [piste d'évolution](developpement.md#pistes-dévolution). |
| Safari | ❌ Non | — | Il faudrait convertir l'extension avec Xcode et la distribuer par Apple. |
| Navigateurs mobiles (Android, iOS) | ❌ Non | — | Chrome et Safari sur mobile n'acceptent pas ce type d'extension. |

Chrome et Brave sont les navigateurs de référence. Les autres navigateurs Chromium utilisent le même moteur et les mêmes API, mais ne sont pas testés à chaque version : en cas de problème, ouvrez un ticket sur le dépôt.

## 1. Récupérer l'extension

**Méthode recommandée** : téléchargez l'archive de la dernière version, puis décompressez-la.

> https://github.com/studoo-app/sign-search/releases/latest/download/sign-search.zip

Cette archive est construite automatiquement par GitHub Actions à chaque nouvelle version. Elle contient uniquement l'extension et sa licence (`manifest.json`, `LICENSE`, `src/`, `icons/`), sans les tests ni la documentation. Les versions précédentes se trouvent sur la page **Releases** du dépôt.

> Tant que le dépôt est **privé**, il faut être connecté à GitHub avec un compte qui y a accès pour télécharger l'archive.

Autres possibilités, pour développer :

- `git clone https://github.com/studoo-app/sign-search.git` ;
- **Code → Download ZIP** sur la page du dépôt.

Placez le dossier à un endroit **stable**, par exemple `Documents/Extensions/sign-search`. Le navigateur charge l'extension depuis ce dossier à chaque démarrage : il ne faut pas le supprimer ni le déplacer.

## 2. Charger l'extension

Ouvrez la page des extensions de votre navigateur, par exemple `chrome://extensions` ou `brave://extensions` (les adresses des autres navigateurs sont dans le [tableau des navigateurs compatibles](#navigateurs-compatibles)).

1. Activez le **Mode développeur** (interrupteur en haut à droite).
2. Cliquez sur **Charger l'extension non empaquetée**.
3. Sélectionnez le dossier qui contient `manifest.json`. Attention : pas un dossier parent, ni le zip.
4. La carte « Sign Search Convention » apparaît. Activez-la si elle ne l'est pas déjà.

**Conseil** : épinglez l'icône. Cliquez sur la pièce de puzzle dans la barre d'outils, puis sur la punaise à côté de « Sign Search Convention ».

## 3. Vérifier

1. Ouvrez (ou rechargez) https://sign.com/storage/all-documents.
2. Le bouton **🔎 Rechercher** apparaît en bas à droite.
3. Cliquez dessus : le panneau s'ouvre et affiche « X / X documents ».

## Mettre à jour

1. Téléchargez de nouveau `sign-search.zip` et remplacez le contenu du dossier par celui de l'archive. Gardez le **même dossier**, pour que le navigateur retrouve l'extension. Avec Git, faites simplement `git pull`.
2. Dans la page des extensions, cliquez sur l'icône **↻** de la carte « Sign Search Convention ».
3. Rechargez l'onglet sign.com.

## Changer le raccourci clavier

Le raccourci par défaut est **Alt + Maj + S**. Pour le modifier, ouvrez `chrome://extensions/shortcuts` (ou `brave://extensions/shortcuts`). Cherchez ensuite « Sign Search Convention » → « Ouvrir / fermer le panneau de recherche ».

## Désinstaller

Dans la page des extensions, cliquez sur **Supprimer** sur la carte. L'extension n'enregistre aucune donnée : il n'y a rien d'autre à nettoyer.

## Pourquoi le mode développeur ?

Sur Windows et macOS, Chrome n'accepte une extension installée de façon permanente, sans mode développeur, que si elle vient du **Chrome Web Store**. Un fichier `.crx` glissé dans la page des extensions est refusé. Brave, basé sur Chromium, suit la même règle.

Pour s'en passer, il y a deux possibilités :

| Option | Avantages | Contraintes |
|---|---|---|
| **Chrome Web Store, publication « Non répertoriée »** | Installation en un clic depuis un lien, mises à jour automatiques. Fonctionne aussi dans Brave. | Compte développeur Google (frais uniques de 5 $), relecture par Google à chaque version, fiche de confidentialité à remplir |
| **Stratégie d'entreprise** (`ExtensionInstallForcelist`) | Déploiement imposé sur les postes gérés de l'établissement | Postes administrés par GPO ou MDM, `.crx` signé et hébergé avec un fichier `update.xml` |

En attendant, le zip publié par GitHub Actions et le mode développeur restent la solution la plus simple.

## Message « Désactiver les extensions en mode développeur »

Chrome affiche parfois ce message au démarrage. Cliquez simplement sur la croix pour le fermer, sans désactiver l'extension. Brave n'affiche pas ce message.
