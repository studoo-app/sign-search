**English** · [Français](../fr/developpement.md)

# Development

## Requirements

- Node.js **18 or later**, only for the tests. There are no npm dependencies.
- Chrome or Brave with the extension loaded in developer mode (see [Installation](installation.md)).
- `zip`, to build the archive.

## Layout

```
sign-search/
├── .github/workflows/   release.yml: tests + zip + GitHub Release
├── manifest.json        Manifest V3
├── package.json         npm scripts (test, zip)
├── CHANGELOG.md         version history (French)
├── icons/               16/32/48/128 px icons
├── src/
│   ├── background.js    service worker: icon + keyboard shortcut
│   ├── core.js          pure logic, tested under Node
│   ├── content.js       panel injected into sign.com
│   └── panel.css        panel styles (loaded into the Shadow DOM)
├── tests/
│   └── core.test.js     unit tests (node:test), fictitious data
└── docs/
    ├── en/              English documentation
    └── fr/              French documentation
```

## Commands

```bash
npm test        # runs tests/*.test.js with node --test
npm run zip     # builds sign-search.zip (manifest, src, icons)
```

## Workflow

1. Change the code.
2. Run `npm test` if `core.js` changed.
3. In `brave://extensions`, click **↻** on the extension card.
4. Reload the sign.com tab.

Debugging:

- **Content script**: F12 on the sign.com tab. Errors from `content.js` show up in the page console. The panel can be inspected in the Elements tab, under `#signsearch-host` → `#shadow-root`.
- **Service worker**: "service worker" link on the extension card.
- **Testing the logic in the page**: select the extension's context in the console, and `SignSearchCore` is available.

## Conventions

- **All testable logic goes in `core.js`**: parsing, search, API formats, CSV. `content.js` only handles display and requests.
- **No `innerHTML` with data.** Build the DOM with `h(tag, attrs, ...children)`. Strings become text nodes.
- **No external dependencies**: no libraries, no CDN. The extension must stay readable and reviewable at a glance.
- **No storage of sign.com data**, and no new permission without discussing it first (see [security](security.md)).
- **Fictitious data only in tests**: no real names or emails in the repository.
- Interface text and code comments are in **French**.
- **Documentation in both languages**: any change to `docs/fr/` must be mirrored in `docs/en/`, and vice versa.

## Recipes

### Add a program

Codes with a number (`XYZ1`) are detected automatically if they are in capitals. For a code **without a number** to be detected (`XYZ - Convention…`), add it to `KNOWN_FILIERES` in `src/core.js`:

```js
const KNOWN_FILIERES = [
  "SIO", "SISR", "SLAM", "CG", "DCG", /* … */ "XYZ",
];
```

Then add a case to the "parseClasse reconnaît les préfixes de classe" test, and update the list in [File naming](file-naming.md) (and its French counterpart).

### Add a status

Add the normalised key (lowercase) and its label to `STATUS_LABELS` (`core.js`). The badge uses the CSS class `st-<key>`. Add the matching colour to `panel.css` if needed.

### Add a column to the CSV export

In `toCsv()`, add the header to `header` and the value at the same position in the row. Update the "CSV" test and the table in the [user guide](user-guide.md#export-to-csv).

### Adapt to a sign.com change

See [Architecture → If sign.com changes](architecture.md#if-signcom-changes).

## Releasing a version

Releases are automated by **GitHub Actions** (`.github/workflows/release.yml`).

As you go, note changes in the `## [Non publié]` (Unreleased) section of `CHANGELOG.md` (headings *Ajouté* / Added, *Modifié* / Changed, *Corrigé* / Fixed, *Supprimé* / Removed).

1. Update `version` in `manifest.json` **and** in `package.json` (`MAJOR.MINOR.PATCH` format).
2. In `CHANGELOG.md`, rename `## [Non publié]` to `## [0.2.0] - YYYY-MM-DD`, add a new empty `## [Non publié]` above it, and update the links at the bottom of the file. **The Release text is taken from that section**: without it, the release fails.
3. `npm test`.
4. Commit, then tag:
   ```bash
   git commit -am "Version 0.2.0"
   git tag v0.2.0
   git push && git push origin v0.2.0
   ```
5. The **Release** workflow does the rest:
   - it runs the tests;
   - it checks that the tag matches the manifest version, and fails otherwise;
   - it builds the zip;
   - it uses the CHANGELOG section as the release text;
   - it creates the `v0.2.0` Release with two files: `sign-search.zip` and `sign-search-0.2.0.zip`.

The `…/releases/latest/download/sign-search.zip` link always points to the latest version.

The workflow can also be run by hand (**Actions → Release → Run workflow** tab). It then releases the version in the manifest.

## Ideas for later

- Remember the last filters used (would need the `storage` permission, for preferences only, never for document data).
- "Missing signature from…" filter: only show documents where a given person hasn't signed.
- Send a reminder to a late signer from the panel (a write action: to be approved before adding it).
- Firefox version (Manifest V3 with `browser_specific_settings`).
