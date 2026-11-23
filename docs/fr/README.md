[English](../en/README.md) · **Français**

# Documentation — Sign Search Convention

Sign Search Convention est une extension pour Chrome et Brave. Elle ajoute à [sign.com](https://sign.com) un panneau qui permet de retrouver en quelques secondes **à qui appartient chaque document** : noms complets des signataires, emails, classe, et qui a signé ou non.

## Sommaire

| Document | Pour qui | Contenu |
|---|---|---|
| [Installation](installation.md) | Utilisateur | Navigateurs compatibles ; installer, mettre à jour et désinstaller |
| [Guide d'utilisation](guide-utilisateur.md) | Utilisateur | Rechercher, filtrer, vue Personnes, état des signatures, export CSV |
| [Nommage des fichiers](nommage.md) | Utilisateur | Le modèle de nom de fichier pour que la filière et la classe soient reconnues |
| [Dépannage et FAQ](depannage.md) | Utilisateur | Problèmes courants et leurs solutions |
| [Architecture](architecture.md) | Développeur | Fonctionnement interne, API sign.com utilisées, flux de données |
| [Développement](developpement.md) | Développeur | Organisation du code, tests, conventions, publier une version |
| [Confidentialité et sécurité](securite.md) | Tous | Données lues, permissions, ce qui n'est jamais fait |

## En bref

- **Le problème** : la liste de sign.com n'affiche que les initiales des signataires (« CS », « FT », « EJ »…). Pour savoir à qui appartient une convention, il faut ouvrir les documents un par un.
- **La solution** : l'extension lit la liste complète que sign.com charge déjà (plus de 500 documents en une seule requête). Elle l'affiche ensuite dans un panneau où l'on peut chercher et filtrer.
- **Ouvrir le panneau** : bouton **🔎 Rechercher** en bas à droite de sign.com, ou **Alt + Maj + S**.

## Version

Cette documentation correspond à la version **0.4.0** de l'extension. L'historique des versions est dans le [CHANGELOG](../../CHANGELOG.md).

## Licence

Copyright © 2026 Studoo Labs. L'extension est distribuée sous [licence publique de l'Union européenne v1.2](LICENCE.md) (EUPL-1.2). Le texte officiel existe dans toutes les langues de l'UE et chaque version fait également foi : le texte français est dans [LICENCE.md](LICENCE.md), le texte anglais dans [`LICENSE`](../../LICENSE) à la racine du dépôt.

En résumé : vous pouvez utiliser, copier, modifier et redistribuer l'extension. Si vous distribuez une version modifiée, elle doit rester sous EUPL (ou une licence compatible) avec son code source.
