# Développement

## Prérequis

- Node.js **18 ou plus**, uniquement pour les tests. Il n'y a aucune dépendance npm.
- Chrome ou Brave avec l'extension chargée en mode développeur (voir [Installation](installation.md)).
- `zip`, pour générer l'archive.

## Arborescence

```
sign-search/
├── manifest.json        Manifest V3
├── package.json         scripts npm (test, zip)
├── icons/               icônes 16/32/48/128 px
├── src/
│   ├── background.js    service worker : icône + raccourci clavier
│   ├── core.js          logique pure, testée sous Node
│   ├── content.js       panneau injecté dans sign.com
│   └── panel.css        styles du panneau (chargés dans le Shadow DOM)
├── tests/
│   └── core.test.js     tests unitaires (node:test), données fictives
└── docs/                cette documentation
```

## Commandes

```bash
npm test        # lance tests/*.test.js avec node --test
npm run zip     # produit sign-search.zip (manifest, src, icons)
```

## Cycle de travail

1. Modifier le code.
2. Lancer `npm test` si `core.js` a changé.
3. Dans `brave://extensions`, cliquer sur **↻** sur la carte de l'extension.
4. Recharger l'onglet sign.com.

Pour le débogage :

- **Content script** : F12 sur l'onglet sign.com. Les erreurs de `content.js` apparaissent dans la console de la page. Le panneau s'inspecte dans l'onglet Elements, sous `#signsearch-host` → `#shadow-root`.
- **Service worker** : lien « service worker » sur la carte de l'extension.
- **Tester la logique dans la page** : en sélectionnant le contexte de l'extension dans la console, `SignSearchCore` est disponible.

## Conventions

- **Toute logique testable va dans `core.js`** : parsing, recherche, formats d'API, CSV. `content.js` ne s'occupe que de l'affichage et des requêtes.
- **Pas d'`innerHTML` avec des données.** Construire le DOM avec `h(tag, attrs, ...enfants)`. Les chaînes deviennent des nœuds texte.
- **Pas de dépendance externe**, ni bibliothèque ni CDN. L'extension doit rester lisible et vérifiable d'un coup d'œil.
- **Pas de stockage des données sign.com**, ni de nouvelle permission sans en discuter (voir [sécurité](securite.md)).
- **Tests sur données fictives uniquement** : aucun vrai nom ni email dans le dépôt.
- Textes de l'interface et commentaires en **français**.

## Recettes

### Ajouter une filière

Les sigles avec numéro (`XYZ1`) sont reconnus automatiquement s'ils sont en majuscules. Pour qu'un sigle **sans numéro** soit reconnu (`XYZ - Convention…`), ajoutez-le à `KNOWN_FILIERES` dans `src/core.js` :

```js
const KNOWN_FILIERES = [
  "SIO", "SISR", "SLAM", "CG", "DCG", /* … */ "XYZ",
];
```

Ajoutez ensuite un cas dans le test « parseClasse reconnaît les préfixes de classe ».

### Ajouter un statut

Ajoutez la clé normalisée (en minuscules) et son libellé dans `STATUS_LABELS` (`core.js`). Le badge utilise la classe CSS `st-<clé>`. Ajoutez la couleur correspondante dans `panel.css` si besoin.

### Ajouter une colonne à l'export CSV

Dans `toCsv()`, ajoutez l'en-tête dans `header` et la valeur au même rang dans la ligne. Mettez à jour le test « CSV » et le tableau du [guide](guide-utilisateur.md#exporter-en-csv).

### Adapter à un changement de sign.com

Voir [Architecture → Si sign.com change](architecture.md#si-signcom-change).

## Publier une version

1. Mettre à jour `version` dans `manifest.json` **et** dans `package.json` (format `MAJEUR.MINEUR.CORRECTIF`).
2. `npm test`.
3. Commit, puis tag :
   ```bash
   git commit -am "Version 0.2.0"
   git tag v0.2.0
   git push && git push --tags
   ```
4. `npm run zip`. Joindre `sign-search.zip` à une *Release* GitHub si on veut une archive téléchargeable.

## Pistes d'évolution

- Mémoriser les derniers filtres choisis (nécessiterait la permission `storage`, pour des préférences uniquement, jamais pour des données de documents).
- Filtre « signature manquante de… » : ne montrer que les documents où une personne précise n'a pas signé.
- Relancer depuis le panneau un signataire en retard (action en écriture : à valider avant de l'ajouter).
- Version Firefox (Manifest V3 avec `browser_specific_settings`).
