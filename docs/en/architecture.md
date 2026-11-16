**English** · [Français](../fr/architecture.md)

# Architecture

## Overview

```
 Toolbar icon / Alt+Shift+S
            │
            ▼
 ┌─────────────────────┐   message "signsearch:toggle"   ┌──────────────────────────────┐
 │ src/background.js   │ ──────────────────────────────▶ │ Tab https://sign.com/*         │
 │ (service worker)    │                                 │                                │
 └─────────────────────┘                                 │  src/core.js    (pure logic)   │
                                                         │  src/content.js (panel UI)     │
                                                         │        │                       │
                                                         │        │ fetch (same origin,   │
                                                         │        ▼  session cookies)     │
                                                         │  /api/documents                │
                                                         │  /api/documents/:id            │
                                                         │  /api/sign-requests/:publicId  │
                                                         └──────────────────────────────┘
```

- **Manifest V3**. The only permission is access to `https://sign.com/*` (`host_permissions`).
- **Content scripts**: `core.js` then `content.js` are injected into every sign.com page (`run_at: document_idle`).
- **Service worker** (`background.js`): only handles the toolbar icon click and the keyboard shortcut. It never sees the data.
- **No storage**: no `chrome.storage`, `localStorage` or IndexedDB. Everything lives in memory inside the tab.

## Components

### `src/core.js` — pure logic

This file depends on neither the DOM nor `chrome.*`. It is exposed as `globalThis.SignSearchCore` in the browser, and through `module.exports` under Node for the tests.

| Function | Role |
|---|---|
| `normalize(str)` | Lowercase, strip accents (NFD), collapse spaces |
| `statusKey` / `statusLabel` | Unify statuses (`Cancelled` → `canceled`) and translate them into French |
| `parseClasse(name)` | Derive the class from the file name (`MCO1`, `SIO2`, `SIO`…) |
| `filiereOf(classe)` | `MCO1` → `MCO` (program) |
| `documentUrl(item)` | Link that opens the document in sign.com |
| `detailApiUrl(item)` | URL of the details API (signature status) |
| `toRecord(item)` | Turn a raw API item into a display object, with a normalised `haystack` field for searching |
| `tokenize` / `matches` | Split the query into words; AND match on `haystack` |
| `matchingSignees` | Signers to highlight |
| `filterRecords(records, opts)` | Search, filters and sorting |
| `people(records, exclude)` | Group by person (key = normalised email) |
| `facets(records)` | Counts by status, class and program, for the drop-down lists |
| `toCsv(records, origin)` | CSV export (BOM, `;`, RFC 4180 escaping) |
| `parseDetail(json)` | Normalise the two details-response formats |
| `signeeStatusMap(rows)` | `Map(normalised email → status)` |

### `src/content.js` — interface

- Creates a `#signsearch-host` element attached to `<html>`, with a **Shadow DOM**. sign.com's CSS (Chakra UI) can't reach the panel, and vice versa.
- Loads `panel.css` as a **constructed stylesheet** (`CSSStyleSheet.replaceSync` + `adoptedStyleSheets`). This avoids being blocked by the site's CSP. As a last resort it falls back to a `<link>` tag.
- Builds the whole DOM with a small `h()` helper. Data goes **only** through `textContent` and attributes, **never through `innerHTML`**, which rules out injection through a file name.
- Stops key events from propagating out of the panel, so sign.com's keyboard shortcuts don't capture typing.
- The footer shows the version, read with `chrome.runtime.getManifest()`, and a link to Studoo Labs.

Internal state (`state` object):

| Key | Content |
|---|---|
| `items` | `Map(id → raw item)` |
| `records` | `toRecord` result for each item |
| `senders` | Sender emails: that's you, greyed out in the display and excluded from the People view |
| `details` | `Map(id → Map(email → status) \| "loading" \| "error")` |
| `query`, `status`, `classe`, `sort`, `view`, `limit` | Display settings |

### `src/background.js`

- `chrome.action.onClicked` and `chrome.commands.onCommand("toggle-panel")` → `chrome.tabs.sendMessage(tab.id, {type: "signsearch:toggle"})`.
- If the tab is not on sign.com, it opens `https://sign.com/storage/all-documents`.
- If the content script isn't there yet (tab opened before installation), it reloads the tab.

## sign.com APIs used

> These APIs are **internal** to the site and not documented by sign.com. They were observed on 15/11/2026 and may change without notice.

All requests are `GET` requests to the **same origin**, with the session cookies (`credentials: "include"`). The extension sends no special authentication header.

### `GET /api/documents` — full list

A single request, without pagination, returns every document.

```jsonc
{
  "actionRequiredItems": [],
  "items": [
    {
      "id": "uuid",
      "itemType": "signRequest" | "document",
      "publicSignRequestId": "77e3aedc6d",   // only when itemType = signRequest
      "name": "MCO1 NAME - Conventions.pdf",
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

Each signer's individual status is **not** in this list.

### Two kinds of documents

| `itemType` | Corresponds to | Link to open | Details API |
|---|---|---|---|
| `signRequest` | Recent signature requests | `/detail/{publicSignRequestId}` | `/api/sign-requests/{publicSignRequestId}` |
| `document` | Older documents | `/request-pdf/{id}` | `/api/documents/{id}` |

Addresses tested that **don't work** (for reference): `/detail/{id}` (access denied), `/detail/{publicDocumentId}` (blank page), `/api/documents/{publicSignRequestId}` (500), `/api/sign-requests/{id}` (403).

### `GET /api/documents/{id}` — details of a `document`

Each signer's status is in `actions[]`:

```jsonc
{ "actions": [ { "assigneeEmail": "…", "assigneeFirstName": "…", "assigneeLastName": "…",
                 "status": "Completed" | "Pending" | "Cancelled",
                 "completedAt": "ISO-8601" | null, "order": 0, "type": "SignRequest" } ] }
```

### `GET /api/sign-requests/{publicSignRequestId}` — details of a `signRequest`

Each signer's status is in `signees[]`:

```jsonc
{ "signees": [ { "email": "…", "firstName": "…", "lastName": "…",
                 "status": "Pending" | "Completed" | …, "order": 0 } ] }
```

`parseDetail()` handles both formats. A signer counts as **"has signed"** if their status is `Completed` or `Signed`. A `completedAt` together with the `Cancelled` status does **not** count as a signature.

## Execution flow

1. **Page load**: scripts are injected and the button is created (hidden until the CSS is ready).
2. **First opening**: `load()` calls `/api/documents`, applies `toRecord` to each item, then fills the drop-down lists with `facets()`.
3. **Automatic details**: `loadDetails()` processes `pending` documents with **4 parallel requests** (`DETAIL_CONCURRENCY`). The display refreshes at most every 250 ms.
4. **Typing**: a 120 ms delay after each keystroke, then `filterRecords()` and a new render. At most 150 rows are rendered (`PAGE_SIZE`), with an "Afficher plus" (Show more) button.
5. **↻ Actualiser** (Refresh): clears the details cache and starts again at step 2.

## If sign.com changes

Things to check, in order:

1. In DevTools → Network, does the "All Documents" page still call `/api/documents`? Do the `items[].signees` fields still exist?
2. Open a document from the sign.com list: does the resulting address still match `/detail/…` or `/request-pdf/…`? If not, update `documentUrl()`.
3. Is the signers' status still in `actions[]` or `signees[]`? If not, update `parseDetail()` and add a test.

Since all format handling is grouped in `core.js`, an adaptation usually touches only that file and its tests.
