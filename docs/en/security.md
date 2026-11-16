**English** · [Français](../fr/securite.md)

# Privacy & security

Documents managed in sign.com contain personal data: names and emails of students, tutors and companies. The extension is designed to **add nothing** to where this data travels or is stored.

## What the extension does

- It reads, **using your already open sign.com session**, the same information the site displays:
  - `/api/documents`: list of documents and signers;
  - `/api/documents/{id}` and `/api/sign-requests/{id}`: status of each signature.
- It shows this information in a panel inside the sign.com tab.
- When **you** click "CSV", it creates a file in your downloads folder.

## What it never does

- **Nothing is sent to any other site.** Every request goes to `sign.com` and only there. The only other addresses in the code are two links: "Studoo Labs" in the panel footer (`https://github.com/studoo-app`), and the repository link (`https://github.com/studoo-app/sign-search/issues`) shown only when sign.com has changed its data format. They are plain links that only open if you click them, and they carry no data.
- **No storage**: no `chrome.storage`, `localStorage`, IndexedDB or cookie. Closing or reloading the tab erases everything.
- **No writes** to sign.com: it doesn't sign, send, remind, cancel or delete anything. It only uses `GET` requests.
- **No access to credentials**: it reads neither passwords nor tokens. The browser itself attaches the session cookies to requests to sign.com.
- **No analytics or telemetry.**

## Permissions requested

| Permission | Why |
|---|---|
| `host_permissions: https://sign.com/*` | Inject the panel and read the API on sign.com |
| `commands` (implicit) | Alt + Shift + S shortcut |
| `action` (implicit) | Toolbar icon |

No other permission is requested: no `tabs`, `storage`, `<all_urls>`, `downloads` or `cookies`.

## Safeguards in the code

- **No `innerHTML` with data**: a file name containing HTML or script is displayed as text, never executed.
- **Shadow DOM**: the panel is isolated from the rest of the page.
- **No third-party libraries**: all the code is in the repository and can be reviewed in a few minutes.
- **Fictitious data in tests**: no real personal data is committed.

## Good practice

- **CSV exports** contain personal data. Keep them somewhere protected and delete them when no longer needed (GDPR: storage limitation).
- The repository can stay **private**. It contains no data, but it describes how the school organises its placement agreements.
- Before installing a version modified by someone else, check in the diff that no new network address and no new permission have been added.

## Check for yourself

```bash
# Every URL in the code
grep -rnoE "https?://[^\"' )]+" src/ manifest.json

# Every network request
grep -rn "fetch(" src/
```

Expected result: `sign.com`, the `github.com/studoo-app` (panel footer) and `github.com/studoo-app/sign-search/issues` (format-change message) links, and `fetch` calls to `/api/…` (same origin) or to the extension's CSS.
