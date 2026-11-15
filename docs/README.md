# Documentation — Sign.com Recherche

Sign.com Recherche est une extension pour Chrome et Brave. Elle ajoute à [sign.com](https://sign.com) un panneau qui permet de retrouver en quelques secondes **à qui appartient chaque document** : noms complets des signataires, emails, classe, et qui a signé ou non.

## Sommaire

| Document | Pour qui | Contenu |
|---|---|---|
| [Installation](installation.md) | Utilisateur | Installer, mettre à jour et désinstaller dans Chrome ou Brave |
| [Guide d'utilisation](guide-utilisateur.md) | Utilisateur | Rechercher, filtrer, vue Personnes, état des signatures, export CSV |
| [Dépannage et FAQ](depannage.md) | Utilisateur | Problèmes courants et leurs solutions |
| [Architecture](architecture.md) | Développeur | Fonctionnement interne, API sign.com utilisées, flux de données |
| [Développement](developpement.md) | Développeur | Organisation du code, tests, conventions, publier une version |
| [Confidentialité et sécurité](securite.md) | Tous | Données lues, permissions, ce qui n'est jamais fait |

## En bref

- **Le problème** : la liste de sign.com n'affiche que les initiales des signataires (« CS », « FT », « EJ »…). Pour savoir à qui appartient une convention, il faut ouvrir les documents un par un.
- **La solution** : l'extension lit la liste complète que sign.com charge déjà (plus de 500 documents en une seule requête). Elle l'affiche ensuite dans un panneau où l'on peut chercher et filtrer.
- **Ouvrir le panneau** : bouton **🔎 Rechercher** en bas à droite de sign.com, ou **Alt + Maj + S**.

## Version

Cette documentation correspond à la version **0.1.0** de l'extension.
