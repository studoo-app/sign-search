[English](../en/architecture.md) · **Français**

# Architecture

## Vue d'ensemble

```
 Barre d'outils / Alt+Maj+S
            │
            ▼
 ┌─────────────────────┐   message "signsearch:toggle"   ┌──────────────────────────────┐
 │ src/background.js   │ ──────────────────────────────▶ │ Onglet https://sign.com/*      │
 │ (service worker)    │                                 │                                │
 └─────────────────────┘                                 │  src/core.js    (logique pure) │
                                                         │  src/content.js (panneau UI)   │
                                                         │        │                       │
                                                         │        │ fetch (même origine,  │
                                                         │        ▼  cookies de session)  │
                                                         │  /api/documents                │
                                                         │  /api/documents/:id            │
                                                         │  /api/sign-requests/:publicId  │
                                                         └──────────────────────────────┘
```

- **Manifest V3**. La seule permission est l'accès à `https://sign.com/*` (`host_permissions`).
- **Content scripts** : `core.js` puis `content.js` sont injectés dans chaque page sign.com (`run_at: document_idle`).
- **Service worker** (`background.js`) : il gère seulement le clic sur l'icône et le raccourci clavier. Il ne voit jamais les données.
- **Aucun stockage** : pas de `chrome.storage`, `localStorage` ni IndexedDB. Tout vit en mémoire dans l'onglet.

## Les composants

### `src/core.js` — logique pure

Ce fichier ne dépend ni du DOM ni de `chrome.*`. Il est exposé sous `globalThis.SignSearchCore` dans le navigateur, et via `module.exports` sous Node pour les tests.

| Fonction | Rôle |
|---|---|
| `normalize(str)` | Minuscules, suppression des accents (NFD), espaces compactés |
| `statusKey` / `statusLabel` | Unifie les statuts (`Cancelled` → `canceled`) et les traduit en français |
| `parseClasse(name)` | Déduit la classe du nom de fichier (`MCO1`, `SIO2`, `SIO`…) |
| `filiereOf(classe)` | `MCO1` → `MCO` |
| `documentUrl(item)` | Lien d'ouverture du document dans sign.com |
| `detailApiUrl(item)` | URL de l'API de détail (état des signatures) |
| `toRecord(item)` | Transforme un élément brut de l'API en objet d'affichage, avec un champ `haystack` normalisé pour la recherche |
| `tokenize` / `matches` | Découpe la requête en mots ; correspondance en ET logique sur `haystack` |
| `matchingSignees` | Signataires à surligner |
| `filterRecords(records, opts)` | Recherche, filtres et tri |
| `people(records, exclude)` | Agrégation par personne (clé = email normalisé) |
| `facets(records)` | Comptes par statut, classe et filière, pour les listes déroulantes |
| `toCsv(records, origin)` | Export CSV (BOM, `;`, échappement RFC 4180) |
| `parseDocumentList(json)` | Vérifie la réponse de `/api/documents` et renvoie `items` ; lève une `FormatError` si le format a changé |
| `parseDetail(json)` | Normalise les deux formats de réponse de détail ; lève une `FormatError` sur un format inconnu |
| `FormatError` | Erreur « format de sign.com inattendu », affichée avec un message dédié dans le panneau |
| `signeeStatusMap(rows)` | `Map(email normalisé → statut)` |

### `src/content.js` — interface

- Crée un hôte `#signsearch-host` attaché à `<html>`, avec un **Shadow DOM**. Le CSS de sign.com (Chakra UI) n'atteint pas le panneau, et inversement.
- Charge `panel.css` comme **feuille de style construite** (`CSSStyleSheet.replaceSync` + `adoptedStyleSheets`). Cela évite d'être bloqué par la politique CSP du site. En dernier recours, il utilise une balise `<link>`.
- Construit tout le DOM avec un petit utilitaire `h()`. Les données passent **uniquement** par `textContent` et des attributs, **jamais par `innerHTML`**, ce qui écarte le risque d'injection via un nom de fichier.
- Arrête la propagation des touches dans le panneau, pour que les raccourcis clavier de sign.com ne captent pas la frappe.
- Le pied affiche la version, lue avec `chrome.runtime.getManifest()`, et un lien vers Studoo Labs.

État interne (objet `state`) :

| Clé | Contenu |
|---|---|
| `items` | `Map(id → élément brut)` |
| `records` | Résultat de `toRecord` pour chaque élément |
| `senders` | Emails des expéditeurs : vous-même, grisé dans l'affichage et exclu de la vue Personnes |
| `details` | `Map(id → Map(email → statut) \| "loading" \| "error" \| "format")` |
| `error`, `formatError` | Message d'erreur du chargement de la liste ; `formatError` vaut `true` quand il vient d'un changement de l'API |
| `detailFormatError` | Message affiché dans le pied quand le détail des signatures n'a plus le format attendu |
| `query`, `status`, `classe`, `sort`, `view`, `limit` | Paramètres d'affichage |

### `src/background.js`

- `chrome.action.onClicked` et `chrome.commands.onCommand("toggle-panel")` → `chrome.tabs.sendMessage(tab.id, {type: "signsearch:toggle"})`.
- Si l'onglet n'est pas sur sign.com, il ouvre `https://sign.com/storage/all-documents`.
- Si le content script n'est pas encore présent (onglet ouvert avant l'installation), il recharge l'onglet.

## API sign.com utilisées

> Ces API sont **internes** au site et ne sont pas documentées par sign.com. Elles ont été relevées le 15/11/2026 et peuvent changer sans préavis.

Toutes les requêtes sont des `GET` vers la **même origine**, avec les cookies de session (`credentials: "include"`). L'extension n'envoie aucun en-tête d'authentification particulier.

### `GET /api/documents` — liste complète

Une seule requête, sans pagination, renvoie tous les documents.

```jsonc
{
  "actionRequiredItems": [],
  "items": [
    {
      "id": "uuid",
      "itemType": "signRequest" | "document",
      "publicSignRequestId": "77e3aedc6d",   // seulement si itemType = signRequest
      "name": "MCO1 NOM - Conventions.pdf",
      "status": "Pending" | "Sealed" | "Expired" | "Canceled" | "Cancelled",
      "createdAt": "ISO-8601", "updatedAt": "ISO-8601",
      "creatorId": "uuid",
      "senderEmail": "…", "senderFirstName": "…", "senderLastName": "…",
      "signees": [
        { "id": "uuid", "firstName": "…", "lastName": "…", "email": "…",
          "order": 0, "role": "signer", "profilePicture": {…} }
      ]
    }
  ]
}
```

L'état individuel de chaque signataire **n'est pas** dans cette liste.

### Deux types de documents

| `itemType` | Correspond à | Lien d'ouverture | API de détail |
|---|---|---|---|
| `signRequest` | Demandes de signature récentes | `/detail/{publicSignRequestId}` | `/api/sign-requests/{publicSignRequestId}` |
| `document` | Documents plus anciens | `/request-pdf/{id}` | `/api/documents/{id}` |

Adresses testées qui **ne fonctionnent pas** (pour mémoire) : `/detail/{id}` (accès refusé), `/detail/{publicDocumentId}` (page vide), `/api/documents/{publicSignRequestId}` (500), `/api/sign-requests/{id}` (403).

### `GET /api/documents/{id}` — détail d'un `document`

L'état de chaque signataire se trouve dans `actions[]` :

```jsonc
{ "actions": [ { "assigneeEmail": "…", "assigneeFirstName": "…", "assigneeLastName": "…",
                 "status": "Completed" | "Pending" | "Cancelled",
                 "completedAt": "ISO-8601" | null, "order": 0, "type": "SignRequest" } ] }
```

### `GET /api/sign-requests/{publicSignRequestId}` — détail d'un `signRequest`

L'état de chaque signataire se trouve dans `signees[]` :

```jsonc
{ "signees": [ { "email": "…", "firstName": "…", "lastName": "…",
                 "status": "Pending" | "Completed" | …, "order": 0 } ] }
```

`parseDetail()` gère les deux formats. Un signataire est considéré **« a signé »** si son statut est `Completed` ou `Signed`. Un `completedAt` présent avec le statut `Cancelled` ne compte **pas** comme une signature.

## Flux d'exécution

1. **Chargement de la page** : injection des scripts, création du bouton (masqué tant que le CSS n'est pas prêt).
2. **Première ouverture** : `load()` appelle `/api/documents`, applique `toRecord` à chaque élément, puis remplit les listes déroulantes avec `facets()`.
3. **Détail automatique** : `loadDetails()` traite les documents `pending` par **4 requêtes en parallèle** (`DETAIL_CONCURRENCY`). L'affichage est rafraîchi au plus toutes les 250 ms.
4. **Saisie** : un délai de 120 ms après la frappe, puis `filterRecords()` et un nouveau rendu. Le rendu affiche au plus 150 lignes (`PAGE_SIZE`), avec un bouton « Afficher plus ».
5. **↻ Actualiser** : vide le cache de détail et recommence à l'étape 2.

## Si sign.com change

L'extension détecte la plupart des changements de l'API et l'affiche clairement au lieu de montrer une liste vide :

- liste des documents illisible (adresse en 404, réponse qui n'est pas du JSON, champ `items` absent, champs `id`, `name`, `status` ou `signees` absents de tous les documents) : le panneau affiche « sign.com a modifié le format de ses données », avec le détail technique et un lien vers le dépôt ;
- détail des signatures illisible : un avertissement s'affiche dans le pied du panneau, la liste reste utilisable.

Ces contrôles sont dans `parseDocumentList()` et `parseDetail()` (`core.js`), et testés dans `tests/core.test.js`.

Points à vérifier, dans l'ordre :

1. Dans DevTools → Network, la page « All Documents » appelle-t-elle toujours `/api/documents` ? Les champs `items[].signees` existent-ils toujours ?
2. Ouvrir un document depuis la liste sign.com : l'adresse obtenue correspond-elle toujours à `/detail/…` ou `/request-pdf/…` ? Sinon, adapter `documentUrl()`.
3. L'état des signataires est-il toujours dans `actions[]` ou `signees[]` ? Sinon, adapter `parseDetail()` et ajouter un test.

Comme toute la logique de format est regroupée dans `core.js`, une adaptation touche en général ce seul fichier et ses tests.
