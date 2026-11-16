# Confidentialité et sécurité

Les documents gérés dans sign.com contiennent des données personnelles : noms et emails d'élèves, de tuteurs et d'entreprises. L'extension est conçue pour **ne rien ajouter** aux endroits où ces données circulent ou sont conservées.

## Ce que l'extension fait

- Elle lit, **avec votre session sign.com déjà ouverte**, les mêmes informations que celles affichées par le site :
  - `/api/documents` : liste des documents et des signataires ;
  - `/api/documents/{id}` et `/api/sign-requests/{id}` : état de chaque signature.
- Elle affiche ces informations dans un panneau, à l'intérieur de l'onglet sign.com.
- Quand **vous** cliquez sur « CSV », elle crée un fichier dans votre dossier de téléchargements.

## Ce qu'elle ne fait jamais

- **Aucun envoi vers un autre site.** Toutes les requêtes partent vers `sign.com` et seulement vers lui. La seule autre adresse du code est le lien « Studoo Labs » du pied du panneau (`https://github.com/studoo-app`). C'est un simple lien, qui ne s'ouvre que si vous cliquez dessus, et il ne transmet aucune donnée.
- **Aucun stockage** : pas de `chrome.storage`, `localStorage`, IndexedDB ni cookie. Fermer ou recharger l'onglet efface tout.
- **Aucune écriture** dans sign.com : elle ne signe, n'envoie, ne relance, n'annule et ne supprime rien. Elle n'utilise que des requêtes `GET`.
- **Pas d'accès aux identifiants** : elle ne lit ni mot de passe ni jeton. Le navigateur joint lui-même les cookies de session aux requêtes vers sign.com.
- **Pas de statistiques ni de télémétrie.**

## Permissions demandées

| Permission | Pourquoi |
|---|---|
| `host_permissions: https://sign.com/*` | Injecter le panneau et lire l'API sur sign.com |
| `commands` (implicite) | Raccourci Alt + Maj + S |
| `action` (implicite) | Icône dans la barre d'outils |

Aucune autre permission n'est demandée : ni `tabs`, ni `storage`, ni `<all_urls>`, ni `downloads`, ni `cookies`.

## Mesures dans le code

- **Pas d'`innerHTML` avec des données** : un nom de fichier contenant du HTML ou du script s'affiche comme du texte, sans être exécuté.
- **Shadow DOM** : le panneau est isolé du reste de la page.
- **Aucune bibliothèque tierce** : tout le code est dans le dépôt et peut être relu en quelques minutes.
- **Tests sur données fictives** : aucune vraie donnée personnelle n'est versionnée.

## Bonnes pratiques d'utilisation

- Les **exports CSV** contiennent des données personnelles. Rangez-les dans un emplacement protégé et supprimez-les quand ils ne servent plus (RGPD : limitation de la conservation).
- Le dépôt peut rester **privé**. Il ne contient pas de données, mais il décrit l'organisation interne des conventions de l'établissement.
- Avant d'installer une version modifiée par quelqu'un d'autre, vérifiez dans le diff qu'aucune nouvelle adresse réseau et aucune nouvelle permission n'ont été ajoutées.

## Vérifier par soi-même

```bash
# Toutes les URL présentes dans le code
grep -rnoE "https?://[^\"' )]+" src/ manifest.json

# Toutes les requêtes réseau
grep -rn "fetch(" src/
```

Le résultat attendu : `sign.com`, le lien `github.com/studoo-app` du pied du panneau, et des `fetch` vers `/api/…` (même origine) ou vers le CSS de l'extension.
