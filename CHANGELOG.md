# Changelog

Toutes les évolutions notables de l'extension sont listées ici.

Le format suit [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/), et les numéros de version suivent le [versionnage sémantique](https://semver.org/lang/fr/) :
- **MAJEUR** : changement incompatible ;
- **MINEUR** : nouvelle fonctionnalité ;
- **CORRECTIF** : correction.

## [Non publié]

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

[Non publié]: https://github.com/bfoujols/sign-search/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/bfoujols/sign-search/releases/tag/v0.1.0
