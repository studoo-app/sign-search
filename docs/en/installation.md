**English** · [Français](../fr/installation.md)

# Installation

The extension is not published on the Chrome Web Store. It is installed in **developer mode**, which takes about a minute.

## Requirements

- A compatible browser: Chrome, Brave, Edge or another recent Chromium browser (see the [table below](#compatible-browsers)).
- A sign.com account signed in in that browser.

## Compatible browsers

The extension works in **Chromium**-based browsers (Manifest V3, version 88 or later).

| Browser | Compatible | Extensions page | Notes |
|---|---|---|---|
| Google Chrome | ✅ Yes | `chrome://extensions` | Reference browser. |
| Brave | ✅ Yes | `brave://extensions` | Reference browser. |
| Microsoft Edge | ✅ Yes | `edge://extensions` | **Developer mode** is in the left-hand menu. |
| Opera / Opera GX | ✅ Yes | `opera://extensions` | Chromium engine. |
| Vivaldi | ✅ Yes | `vivaldi://extensions` | Chromium engine. |
| Arc | ✅ Yes | `arc://extensions` | Chromium engine. |
| Firefox | ❌ No | — | Firefox does not accept the background *service worker* declared in the manifest. A Firefox version is listed as an [idea for later](development.md#ideas-for-later). |
| Safari | ❌ No | — | The extension would have to be converted with Xcode and distributed through Apple. |
| Mobile browsers (Android, iOS) | ❌ No | — | Chrome and Safari on mobile do not accept this kind of extension. |

Chrome and Brave are the reference browsers. The other Chromium browsers use the same engine and APIs, but are not tested for every release: if something goes wrong, open an issue on the repository.

## 1. Get the extension

**Recommended**: download the latest release archive, then unzip it.

> https://github.com/studoo-app/sign-search/releases/latest/download/sign-search.zip

This archive is built automatically by GitHub Actions for every new version. It contains only the extension and its licence (`manifest.json`, `LICENSE`, `src/`, `icons/`), without tests or documentation. Previous versions are on the repository's **Releases** page.

> While the repository is **private**, you must be signed in to GitHub with an account that has access to it to download the archive.

Other options, for development:

- `git clone https://github.com/studoo-app/sign-search.git`;
- **Code → Download ZIP** on the repository page.

Put the folder somewhere **permanent**, for example `Documents/Extensions/sign-search`. The browser loads the extension from this folder on every start: don't delete or move it.

## 2. Load the extension

Open your browser's extensions page, for example `chrome://extensions` or `brave://extensions` (the addresses for other browsers are in the [compatible browsers table](#compatible-browsers)).

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

Installed in developer mode, the extension **does not update itself**: you replace its files for each new version. It takes a minute, and you lose nothing, since the extension stores no data. Your keyboard shortcut is kept.

### Find out whether a new version exists

1. **Your version**: it is shown at the bottom of the panel ("Sign Search Convention v0.4.0") and on the extension's card on the extensions page.
2. **The latest published version**: it is on the repository's [Releases](https://github.com/studoo-app/sign-search/releases/latest) page, with the list of changes. The full history is in the [CHANGELOG](../../CHANGELOG.md) (in French).
3. **Get notified automatically** (optional): with a GitHub account, click **Watch → Custom → Releases** at the top of the [repository page](https://github.com/studoo-app/sign-search). GitHub then emails you for every new version.

### Install the new version

1. Download the latest archive: [sign-search.zip](https://github.com/studoo-app/sign-search/releases/latest/download/sign-search.zip).
2. Unzip it.
3. Open the folder where the extension is installed (the one chosen during installation, for example `Documents/Extensions/sign-search`). **Delete its contents**, then copy the archive's contents into it: `manifest.json`, `LICENSE`, `src/` and `icons/`. Deleting first avoids keeping old files that are no longer used.
4. Open the extensions page (`chrome://extensions`, `brave://extensions`… see the [browser table](#compatible-browsers)) and click the **↻** (Reload) icon on the "Sign Search Convention" card.
5. Reload any sign.com tabs that are already open: the old version stays active in them until they are reloaded.
6. Check the version number at the bottom of the panel.

**With Git**: in the extension's folder, run `git pull`, then follow steps 4 to 6.

### Pitfalls

- **Don't load the new version as a second extension.** If you unzip the archive somewhere else and click "Load unpacked", two copies run at the same time: two 🔎 buttons appear and the shortcut only opens one of them. If that happens, remove the old card on the extensions page.
- **Don't delete the folder itself**, only its contents. Otherwise the browser can no longer load the extension and shows an error on its card.
- **An extra subfolder**: when unzipping, macOS and Windows ("Extract All") create a `sign-search/` folder. Copy the files **it contains**, not the folder itself, so that `manifest.json` sits directly in the extension's folder.
- **The card shows "Errors" after ↻**: `manifest.json` is probably not at the right level. Check the previous point, then click ↻ again.

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
