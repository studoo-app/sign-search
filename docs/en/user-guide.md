**English** · [Français](../fr/guide-utilisateur.md)

# User guide

> The extension's interface is in French. On-screen labels are quoted as they appear, followed by their English meaning.

## Open and close the panel

| Action | How |
|---|---|
| Open | **🔎 Rechercher** button at the bottom right of sign.com, the extension icon in the toolbar, or **Alt + Shift + S** |
| Close | **Esc**, the **✕** button, or **Alt + Shift + S** again |

If you click the icon while you are not on sign.com, the extension opens the sign.com document list in a new tab.

The first time it opens, the panel loads the list of all your documents. This takes about a second.

## The panel at a glance

```
┌──────────────────────────────────────────────────────────────┐
│ Sign Search Convention  312 / 507 docs   ↻ Actualiser ⬇ CSV ✕ │
├──────────────────────────────────────────────────────────────┤
│ [ Nom d'étudiant, tuteur, entreprise, email, fichier…      ] │
│ [Statut ▾] [Classe ▾] [Tri ▾]            [Documents][Personnes]│
├──────────────────────────────────────────────────────────────┤
│ MCO1 DUPONT - Conventions.pdf  MCO1  En attente              │
│   1 signature manquante                         12/11/2026   │
│   ✓ Service Conventions  ✓ Jean Dupont  ⏳ Élodie Martin      │
│ ...                                                          │
├──────────────────────────────────────────────────────────────┤
│ Liste chargée à 14:32        [Vérifier qui a signé (…)]      │
│        Sign Search Convention v0.2.2 · Créé par Studoo Labs  │
└──────────────────────────────────────────────────────────────┘
```

| Label | Meaning |
|---|---|
| Actualiser | Refresh |
| Statut / Classe / Tri | Status / Class / Sort |
| Documents / Personnes | Documents / People |
| En attente | Pending |
| À signer | Awaiting your signature (« Sign document » on sign.com) |
| signature manquante | missing signature |
| Liste chargée à | List loaded at |
| Vérifier qui a signé | Check who has signed |

The **312 / 507** counter shows the number of documents displayed out of the total.

## Search

Type in the search bar: results update as you type. The search covers:

- the **file name**;
- the **first name, last name and email** of each signer;
- the document's sender;
- the detected class (MCO1, SIO2…).

**Rules:**

- **Accents and capitals are ignored**: `elodie` finds "Élodie", `lopez` finds "LÓPEZ".
- **Several words = all required**, in any order. For example, `martin mco1` finds MCO1 documents that include a Martin.
- **Part of a word is enough**: `dupo` finds "Dupont". A domain works too: `@company.com` finds every document involving someone from that company.

**Useful examples:**

| Search | Result |
|---|---|
| `dupont` | Every document involving a Dupont |
| `sio2 dupont` | Only those in class SIO2 |
| `@carrefour.fr` | Every agreement signed with Carrefour |
| `acme ndrc` | "ACME" files in the NDRC program |

Signers matching the search are **highlighted in blue**.

## Filter

### By status

| Label shown | Meaning on sign.com |
|---|---|
| Signé (Signed) | All signatures done, the document is sealed |
| En attente (Pending) | Sent, at least one signature is missing |
| Expiré (Expired) | The signing deadline has passed |
| Annulé (Cancelled) | Cancelled by the sender (sign.com writes "Canceled" or "Cancelled"; both are grouped) |

Each option shows the number of matching documents in parentheses.

### By class or program

The class is **derived from the beginning of the file name**:

| File name | Class | Program |
|---|---|---|
| `MCO1 LEROY - Conventions…` | MCO1 | MCO |
| `SIO 2_Lucas PETIT - Convention…` | SIO2 | SIO |
| `NDRC1 - Convention…` | NDRC1 | NDRC |
| `SIO - Convention…` | SIO | SIO |
| `Convention Name Firstname.pdf` | *(none)* | *(none)* |

The drop-down list has two groups:

- **Filière (toutes années)** (Program, all years): for example "MCO – toutes" shows MCO1, MCO2, and also files that start with just "MCO".
- **Classe** (Class): one specific year, for example MCO1.

A document without a code at the start of its name has no class. It can still be found with the text search.

**To make sure a document is always classified**, start its name with the class code, for example `MCO1 NAME Firstname - Convention.pdf`. All the rules and pitfalls are in **[File naming](file-naming.md)**.

### Sort

- **Plus récents** (Newest, default): by last-updated date, newest first.
- **Plus anciens** (Oldest).
- **Nom (A→Z)** (Name A→Z): alphabetical order of the file name.

## Reading a document row

- **File name**: click it to open the document in a **new tab**. The panel stays open.
- **Badges**: class (blue), status (colour depends on state), and "N signature(s) manquante(s)" (N missing signatures) when known.
- **Date**: last update. Hover over it to see the creation date.
- **Signers**: full name and email, in signing order. Hover over a name to see the full email.
  - A **greyed-out** name is you (the document's sender).
  - A name **highlighted in blue** matches your search.
  - A **dashed orange border** marks someone who hasn't signed yet.

## Who has signed, who is missing?

The main sign.com list doesn't say where each person stands. So the extension fetches the **details** of each document:

- **Automatically** for every **Pending** (En attente) and **À signer** document, as soon as the panel opens.
- **On demand** for the others: the **"Vérifier qui a signé (résultats affichés)"** (Check who has signed, displayed results) button at the bottom of the panel. It covers the first 300 displayed results.

While checking, the panel footer shows "vérification des signatures… (N)" (checking signatures).

| Icon | Meaning |
|---|---|
| ✓ (green) | Has signed. Hover to see the date. |
| ⏳ (orange) | Hasn't signed yet |
| ✕ (red) | Signature cancelled or declined |
| *(nothing)* | Details not loaded yet |

**Example**: to see every pending MCO1 agreement and who is holding it up:

1. Status = En attente (Pending).
2. Class = MCO1.
3. Look at the names marked ⏳ and the "signature manquante" badge.

## People view

Click the **Personnes** (People) tab to list everyone who appears in the displayed documents:

| Column | Content |
|---|---|
| Nom | Full name |
| Email | Address used in sign.com |
| Classes | Classes of the documents they appear in |
| Docs | Number of documents |
| En attente | Number of pending documents they are on |

- People are grouped **by email**, ignoring case.
- You (the sender) are not listed.
- The view follows the search and filters. For example, with Class = SIO2 and the People tab, you get every student, tutor and company in SIO2.
- **Click a person** to go back to the documents, filtered on their email.

## Export to CSV

The **⬇ CSV** button exports the **displayed results**, with the active search and filters, to a `sign-documents-YYYY-MM-DD.csv` file.

| Column | Content |
|---|---|
| Document | File name |
| Classe | Detected class |
| Statut | Signé, En attente… |
| Créé le / Mis à jour le | Created / Updated dates, DD/MM/YYYY |
| Signataires | Signer names, comma-separated |
| Emails | Emails, comma-separated |
| Lien | Full link to open the document |

The file uses a **semicolon** separator and **UTF-8 with BOM** encoding. It opens directly in French-language Excel, accents included. For other Excel languages, see [Troubleshooting](troubleshooting.md#the-csv-export-opens-badly-in-excel).

## Refresh

The panel keeps the list in memory while the page is open. After sending or getting new documents signed, click **↻ Actualiser** (Refresh): the list is reloaded, along with the status of pending signatures.

Reloading the sign.com page (F5) has the same effect.
