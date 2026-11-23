# Changelog

Toutes les évolutions notables de l'extension Sign Search Convention sont listées ici.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), et les numéros de version suivent le [versionnage sémantique](https://semver.org/lang/fr/) :
- **MAJEUR** : changement incompatible ;
- **MINEUR** : nouvelle fonctionnalité ;
- **CORRECTIF** : correction.

## [Non publié]

## [0.4.0] - 2026-11-23

### Ajouté

- Documents **À signer** : votre badge surligné en orange est un lien qui ouvre directement la page de signature du document (`/sign/…`).

## [0.3.0] - 2026-11-16

### Modifié

- Documents **À signer** : votre propre ligne (le compte connecté, qui doit signer) est surlignée sur fond orange, comme le badge « signatures manquantes ». sign.com ne fournit pas l'adresse du compte connecté : l'extension la déduit des documents à signer.

## [0.2.2] - 2026-11-16

### Corrigé

- Les documents en attente de votre signature (affichés « Sign document » sur sign.com) n'apparaissaient pas : sign.com les renvoie dans une liste à part (`actionRequiredItems`) que l'extension ignorait. Ils sont maintenant inclus, avec le nouveau statut **À signer**, filtrable dans la liste des statuts, et le détail de leurs signataires (qui a signé, qui manque) est chargé comme pour les autres documents en attente.

## [0.2.1] - 2026-11-16

### Ajouté

- Licence open source : [EUPL-1.2](https://github.com/studoo-app/sign-search/blob/main/LICENSE). Le texte anglais est dans `LICENSE`, à la racine ; le texte français est dans [docs/fr/LICENCE.md](https://github.com/studoo-app/sign-search/blob/main/docs/fr/LICENCE.md). Le fichier `LICENSE` est aussi inclus dans le zip de chaque version.
- Message d'erreur explicite quand sign.com modifie le format de son API : « sign.com a modifié le format de ses données », avec le détail technique et un lien vers le dépôt. Auparavant, un changement de format pouvait donner une liste vide sans aucune erreur.
- Avertissement dans le pied du panneau quand le détail des signatures n'a plus le format attendu.

## [0.2.0] - 2026-11-16

### Modifié

- L'extension s'appelle désormais **Sign Search Convention** (auparavant « Sign.com Recherche »).

### Ajouté

- Pied du panneau : numéro de version de l'extension et mention « Créé par Studoo Labs », avec un lien vers https://github.com/studoo-app.

### Corrigé

- Le pied du panneau affichait le mot « null » dans la vue Personnes.

## [0.1.1] - 2026-11-15

### Modifié

- CI : actions `checkout` et `setup-node` passées en v6 (Node 24), car Node 20 est déprécié sur GitHub Actions.

## [0.1.0] - 2026-11-15

Première version.

### Ajouté

- Panneau de recherche dans sign.com. On l'ouvre avec le bouton « 🔎 Rechercher », l'icône de l'extension ou **Alt + Maj + S**, et on le ferme avec Échap. Compatible Chrome, Brave et Edge (Manifest V3).
- Affichage du **nom complet et de l'email** de chaque signataire, au lieu des initiales.
- **Recherche instantanée** dans le nom du fichier, les signataires et les emails. Elle ignore les accents et les majuscules ; avec plusieurs mots, tous doivent être présents.
- **Filtres** par statut (Signé, En attente, Expiré, Annulé), par filière (toutes années) et par classe, déduites du nom de fichier. **Tri** par date ou par nom.
- **État de chaque signataire** (✓ a signé, ⏳ en attente, ✕ annulé) et nombre de signatures manquantes :
  - automatique pour les documents en attente ;
  - à la demande pour les autres.
- **Vue Personnes** : chaque personne avec ses classes, son nombre de documents et ses documents en attente. Un clic sur une personne filtre les documents sur elle.
- **Export CSV** des résultats affichés, prêt pour Excel en français.
- Documentation dans `docs/` : installation, guide d'utilisation, dépannage, architecture, développement, confidentialité.
- Publication automatique : un workflow GitHub Actions construit le zip et le publie dans une Release.

[Non publié]: https://github.com/studoo-app/sign-search/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/studoo-app/sign-search/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/studoo-app/sign-search/compare/v0.2.2...v0.3.0
[0.2.2]: https://github.com/studoo-app/sign-search/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/studoo-app/sign-search/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/studoo-app/sign-search/compare/v0.1.1...v0.2.0
[0.1.1]: https://github.com/studoo-app/sign-search/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/studoo-app/sign-search/releases/tag/v0.1.0
