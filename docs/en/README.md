**English** · [Français](../fr/README.md)

# Documentation — Sign Search Convention

Sign Search Convention is a Chrome and Brave extension. It adds a panel to [sign.com](https://sign.com) that tells you in seconds **who each document belongs to**: full signer names, emails, class, and who has or hasn't signed.

## Contents

| Page | Audience | What's inside |
|---|---|---|
| [Installation](installation.md) | Users | Install, update and uninstall in Chrome or Brave |
| [User guide](user-guide.md) | Users | Search, filters, People view, signature status, CSV export |
| [File naming](file-naming.md) | Users | The file-name pattern that lets the program and class be detected |
| [Troubleshooting & FAQ](troubleshooting.md) | Users | Common problems and how to fix them |
| [Architecture](architecture.md) | Developers | How it works, sign.com APIs used, data flow |
| [Development](development.md) | Developers | Code layout, tests, conventions, releasing a version |
| [Privacy & security](security.md) | Everyone | What is read, permissions, what is never done |

## In short

- **The problem**: the sign.com document list only shows signers' initials ("CS", "FT", "EJ"…). To find out who a placement agreement belongs to, you have to open the documents one by one.
- **The solution**: the extension reads the full list that sign.com already loads (500+ documents in a single request). It then shows it in a panel where you can search and filter.
- **Opening the panel**: the **🔎 Rechercher** button at the bottom right of sign.com, or **Alt + Shift + S**.

> The extension's interface is in French. This documentation quotes on-screen labels as they appear, with an English translation in parentheses.

## Version

This documentation matches version **0.2.0** of the extension. The version history is in the [CHANGELOG](../../CHANGELOG.md) (in French).

## License

Copyright © 2026 Studoo Labs. The extension is released under the [European Union Public Licence v1.2](../../LICENSE) (EUPL-1.2). The official text exists in every EU language, including [French](https://eupl.eu/1.2/fr/), and each version is equally valid.

In short: you may use, copy, modify and redistribute the extension. If you distribute a modified version, it must stay under the EUPL (or a compatible licence) together with its source code.
