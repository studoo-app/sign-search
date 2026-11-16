**English** · [Français](../fr/depannage.md)

# Troubleshooting & FAQ

## The "🔎 Rechercher" button doesn't appear

1. Make sure you are on a `https://sign.com/…` page, not `www.sign.com` or another address.
2. Reload the page (F5). A tab opened **before** the extension was installed doesn't see it.
3. In `chrome://extensions` or `brave://extensions`, check that the extension is **enabled** and doesn't show an **Errors** button.
4. In Brave, check that Shields aren't blocking scripts on sign.com: lion icon → scripts must be allowed.

You can always use the extension icon or **Alt + Shift + S** instead of the button.

## "Vous n'êtes pas connecté à sign.com (ou la session a expiré)"

*(You are not signed in to sign.com, or the session has expired.)*

Your sign.com session has expired. Sign in again in the tab, then click **Réessayer** (Retry).

## "sign.com a répondu 500" (or another code)

*(sign.com responded 500.)*

sign.com is having a temporary problem. Wait a moment, then click **Réessayer** (Retry). If the error persists while the site itself works, sign.com may have changed how it works internally: see [Architecture → If sign.com changes](architecture.md#if-signcom-changes).

## The search doesn't find a document I can see in sign.com

- The panel keeps the list **loaded when it opened**. Click **↻ Actualiser** (Refresh) to include recent documents.
- Check that no **filter** (status, class) is still active.
- With several words, **all** must be present. Try a single word.
- The search covers what sign.com stores. If a signer was entered with a typo, you have to search for that spelling.

## A document has no class

The class comes from the **beginning of the file name** (see [File naming](file-naming.md)). Names starting with "Convention…", with the student's name, or with an unknown code without a number are not classified.

Fixes:

- name future files starting with the code, for example `MCO1 NAME - Convention.pdf`;
- add the code to the `KNOWN_FILIERES` list (see [Development](development.md#add-a-program)).

## The ✓ / ⏳ icons don't appear

- They only show up automatically for **Pending** documents. For the others, click **"Vérifier qui a signé (résultats affichés)"** (Check who has signed, displayed results).
- If a document still has no icon after the check, sign.com refused to return its details. Open the document directly to see the signature status.

## A document link opens "You don't have access"

This can happen for documents in a sign.com team that you didn't create. Open it from the sign.com list.

## The CSV export opens badly in Excel

*(Everything in one column, broken accents.)*

The file is designed for French-language Excel (`;` separator). In an English-language Excel:

1. Open Excel, then **Data → From Text/CSV**.
2. Choose **UTF-8** encoding and the **Semicolon** delimiter.

LibreOffice and Numbers offer these options when opening the file.

## The panel looks broken or unstyled

Reload the page. If the problem persists, open the browser console (F12 → Console) and look for messages mentioning `panel.css`. Take a screenshot and open an issue on the repository.

## FAQ

**Does the extension send my data anywhere?**
No. See [Privacy & security](security.md).

**Do I need to enter my password again?**
No. The extension uses the sign.com session already open in the browser.

**Can it edit, sign or delete documents?**
No. It only reads.

**Does it work with a sign.com team account?**
It shows what the signed-in account's "All Documents" list returns, just like the site itself.

**Does it work in Firefox or Safari?**
Not as it stands. It is written for Chromium browsers (Chrome, Brave, Edge, Opera, Vivaldi).

**How many documents can it handle?**
Several thousand without trouble: the search runs in memory. The display shows 150 results at a time, with an "Afficher plus" (Show more) button.
