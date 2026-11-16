**English** · [Français](../fr/installation.md)

# Installation

The extension is not published on the Chrome Web Store. It is installed in **developer mode**, which takes about a minute.

## Requirements

- A recent version of Google Chrome, Brave or Microsoft Edge (Manifest V3).
- A sign.com account signed in in that browser.

## 1. Get the extension

**Recommended**: download the latest release archive, then unzip it.

> https://github.com/bfoujols/sign-search/releases/latest/download/sign-search.zip

This archive is built automatically by GitHub Actions for every new version. It contains only the extension (`manifest.json`, `src/`, `icons/`), without tests or documentation. Previous versions are on the repository's **Releases** page.

> While the repository is **private**, you must be signed in to GitHub with an account that has access to it to download the archive.

Other options, for development:

- `git clone https://github.com/bfoujols/sign-search.git`;
- **Code → Download ZIP** on the repository page.

Put the folder somewhere **permanent**, for example `Documents/Extensions/sign-search`. The browser loads the extension from this folder on every start: don't delete or move it.

## 2. Load the extension

| Browser | Address to open |
|---|---|
| Chrome | `chrome://extensions` |
| Brave | `brave://extensions` |
| Edge | `edge://extensions` |

1. Turn on **Developer mode** (toggle at the top right).
2. Click **Load unpacked**.
3. Select the folder that contains `manifest.json`. Not a parent folder, and not the zip.
4. The "Sign Search Convention" card appears. Enable it if it isn't already.

**Tip**: pin the icon. Click the puzzle piece in the toolbar, then the pin next to "Sign Search Convention".

## 3. Check

1. Open (or reload) https://sign.com/storage/all-documents.
2. The **🔎 Rechercher** button appears at the bottom right.
3. Click it: the panel opens and shows "X / X documents".

## Update

1. Download `sign-search.zip` again and replace the folder's contents with the archive's. Keep the **same folder**, so the browser finds the extension. With Git, simply run `git pull`.
2. On the extensions page, click the **↻** icon on the "Sign Search Convention" card.
3. Reload the sign.com tab.

## Change the keyboard shortcut

The default shortcut is **Alt + Shift + S**. To change it, open `chrome://extensions/shortcuts` (or `brave://extensions/shortcuts`). Then find "Sign Search Convention" → "Ouvrir / fermer le panneau de recherche" (Open / close the search panel).

## Uninstall

On the extensions page, click **Remove** on the card. The extension stores no data, so there is nothing else to clean up.

## Why developer mode?

On Windows and macOS, Chrome only accepts a permanently installed extension, outside developer mode, if it comes from the **Chrome Web Store**. A `.crx` file dropped onto the extensions page is refused. Brave, being Chromium-based, follows the same rule.

There are two ways around it:

| Option | Pros | Cons |
|---|---|---|
| **Chrome Web Store, "Unlisted" visibility** | One-click install from a link, automatic updates. Also works in Brave. | Google developer account (one-time $5 fee), Google review for every version, privacy form to fill in |
| **Enterprise policy** (`ExtensionInstallForcelist`) | Forced deployment on the school's managed computers | Computers managed by GPO or MDM, signed `.crx` hosted with an `update.xml` file |

Until then, the zip published by GitHub Actions plus developer mode is the simplest option.

## "Disable developer mode extensions" message

Chrome sometimes shows this message at startup. Just close it with the cross, without disabling the extension. Brave doesn't show this message.
