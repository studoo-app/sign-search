# Sign.com Recherche

Extension Chrome / Brave qui ajoute un panneau de recherche à [sign.com](https://sign.com).
Elle affiche le **nom complet et l'email de chaque signataire** (la liste sign.com ne montre que des initiales). Elle indique aussi **qui a signé et qui manque** sur chaque document.

## Fonctionnalités

- **Recherche instantanée** dans le nom du fichier, les noms, prénoms et emails des signataires. La recherche ignore les accents et les majuscules. Avec plusieurs mots, un document doit tous les contenir (ex. `martin mco1`).
- **Filtres** :
  - par statut : Signé, En attente, Expiré, Annulé ;
  - par **filière**, toutes années confondues (SIO, MCO, NDRC…) ;
  - par **classe** (MCO1, SIO2…), lue au début du nom de fichier.
- **Tri** : plus récents, plus anciens ou par nom.
- **État de chaque signataire** : ✓ a signé, ⏳ en attente, ✕ annulé.
  - Vérifié automatiquement pour les documents en attente.
  - Bouton « Vérifier qui a signé » pour les autres documents affichés.
- **Vue Personnes** : chaque personne avec ses classes, son nombre de documents et ses documents en attente. Un clic sur une personne affiche ses documents.
- **Export CSV** des résultats affichés. Le fichier s'ouvre directement dans Excel (séparateur `;`, UTF-8).
- Un clic sur le nom d'un document l'ouvre dans un nouvel onglet.

## Ouvrir le panneau

- Bouton **🔎 Rechercher** en bas à droite de sign.com.
- Ou clic sur l'icône de l'extension dans la barre d'outils.
- Ou raccourci **Alt + Maj + S**. On peut le modifier dans `chrome://extensions/shortcuts`.
- **Échap** ferme le panneau.

## Installation (mode développeur)

1. Téléchargez ce dépôt : `git clone`, ou *Code → Download ZIP* puis décompressez.
2. Ouvrez `chrome://extensions` (Chrome) ou `brave://extensions` (Brave).
3. Activez le **Mode développeur** (en haut à droite).
4. Cliquez sur **Charger l'extension non empaquetée** et choisissez le dossier du projet (celui qui contient `manifest.json`).
5. Rechargez l'onglet sign.com.

Après une mise à jour du code, cliquez sur ↻ sur la carte de l'extension, puis rechargez sign.com.

## Confidentialité

- L'extension n'a accès qu'à `https://sign.com/*`.
- Elle lit les mêmes données que le site affiche déjà, avec votre session connectée :
  - `/api/documents` pour la liste ;
  - `/api/documents/:id` et `/api/sign-requests/:id` pour l'état des signatures.
- **Rien n'est envoyé ailleurs et rien n'est enregistré** : tout reste en mémoire dans l'onglet et disparaît à sa fermeture.

## Développement

```
npm test        # tests de la logique (Node ≥ 18, sans dépendance)
npm run zip     # crée sign-search.zip
```

| Fichier | Rôle |
|---|---|
| `manifest.json` | Manifest V3 (Chrome, Brave, Edge) |
| `src/core.js` | Logique pure : normalisation, recherche, classes, statuts, CSV |
| `src/content.js` | Bouton et panneau injectés dans sign.com (Shadow DOM) |
| `src/panel.css` | Styles du panneau |
| `src/background.js` | Clic sur l'icône et raccourci clavier |
| `tests/` | Tests unitaires (données fictives) |

La liste des filières reconnues sans numéro d'année est dans `KNOWN_FILIERES` (`src/core.js`).

### Limites connues

- Les API utilisées sont internes à sign.com et ne sont pas documentées. Si le site change, l'extension peut cesser de fonctionner.
- La classe est déduite du nom de fichier. Un nom sans sigle au début (ex. « Convention … ») n'a pas de classe, mais reste trouvable par la recherche.
