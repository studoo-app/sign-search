# Nommer les fichiers pour que la filière et la classe soient reconnues

Sign Search Convention ne lit pas le contenu des PDF. Elle déduit la **classe** (MCO1, SIO2…) et la **filière** (MCO, SIO…) **uniquement à partir du début du nom de fichier** envoyé dans sign.com. Ces deux informations alimentent le filtre « Classe » du panneau et la colonne « Classes » de la vue Personnes.

Il faut donc nommer les fichiers **avant de les envoyer à la signature**. Renommer un document déjà envoyé dans sign.com fonctionne aussi : l'extension relit les noms à chaque chargement.

## Le modèle à suivre

```
<FILIÈRE><ANNÉE> <NOM Prénom> - Convention <Entreprise>.pdf
```

| Partie | Règle | Exemple |
|---|---|---|
| `FILIÈRE` | Sigle en **MAJUSCULES**, de 2 à 6 lettres, **tout au début** du nom | `MCO`, `SIO`, `NDRC`, `DCGL` |
| `ANNÉE` | **Un seul chiffre**, collé au sigle ou séparé par un espace, `-` ou `_` | `1`, `2` |
| Le reste | Libre. Il sert à la recherche texte (nom de l'élève, entreprise…). | `DUPONT Jean - Convention ACME` |

**Exemples recommandés :**

```
MCO1 DUPONT Jean - Convention ACME.pdf            → classe MCO1, filière MCO
SIO2 MARTIN Léa - Convention CAPGEMINI.pdf        → classe SIO2, filière SIO
NDRC1 DURAND Paul - Convention.pdf                → classe NDRC1, filière NDRC
```

Choisissez une forme et gardez-la pour tous les fichiers : `MCO1 NOM…` avec un espace est la plus lisible.

## Toutes les formes acceptées

### Avec l'année (→ classe + filière)

| Nom de fichier | Classe | Filière |
|---|---|---|
| `MCO1 DUPONT…` | MCO1 | MCO |
| `MCO1_DUPONT…` | MCO1 | MCO |
| `MCO1-DUPONT…` | MCO1 | MCO |
| `MCO 1 DUPONT…` | MCO1 | MCO |
| `MCO-1 DUPONT…` | MCO1 | MCO |
| `SIO 2_Lucas…` | SIO2 | SIO |
| `SIO - 2 …` | SIO2 | SIO |
| `MCO1DUPONT…` | MCO1 | MCO |

Avec une année, **n'importe quel sigle en majuscules** de 2 à 6 lettres est accepté, même s'il n'est pas dans la liste des filières connues (`XYZ1` → XYZ1).

### Sans l'année (→ filière seulement)

| Nom de fichier | Classe | Filière |
|---|---|---|
| `MCO - DUPONT…` | MCO | MCO |
| `MCO_DUPONT…` | MCO | MCO |
| `MCO.DUPONT…` | MCO | MCO |
| `mco - dupont…` | MCO | MCO |

Sans année, le sigle doit faire partie de la **liste des filières connues** et être suivi d'un espace, `-`, `_` ou `.`. Ici les minuscules sont acceptées. Ces documents apparaissent dans « MCO – toutes », mais dans aucune classe précise.

**Filières connues** : SIO, SISR, SLAM, CG, DCG, DCGL, NDRC, MCO, SAM, SP, GPME, CI, TC, MUC, AM, PI, CJN, BTS.

## Ce qui n'est pas reconnu

| Nom de fichier | Pourquoi |
|---|---|
| `Convention MCO1 DUPONT…` | Le sigle n'est pas **au début** |
| `Mco1 DUPONT…`, `mco1 dupont…` | Avec une année, le sigle doit être **en majuscules** |
| `MCO12 DUPONT…` | L'année doit tenir sur **un seul chiffre** |
| `1MCO DUPONT…` | L'année doit venir **après** le sigle |
| `S1 DUPONT…` | Sigle trop court (**2 lettres minimum**) |
| `ABCDEFG1 …` | Sigle trop long (**6 lettres maximum**) |
| `XYZ - DUPONT…` | Sans année, le sigle doit être dans la **liste des filières connues** |

Un document non reconnu reste trouvable par la recherche texte : taper `mco1` trouve aussi « Convention MCO1 DUPONT ». Il n'apparaît simplement pas dans le filtre Classe.

## Pièges à éviter

- **Un nom de famille court en majuscules, suivi d'un chiffre, est pris pour une classe** : `DUPONT2 - Convention.pdf` donne la classe « DUPONT2 ». Commencez toujours par le sigle de la classe.
- **Une lettre après l'année est ignorée** : `MCO1A DUPONT` donne MCO1. Pour distinguer deux groupes d'une même année, mettez le groupe plus loin dans le nom (`MCO1 GrA DUPONT…`) et retrouvez-le par la recherche.
- **Des filières différentes avec le même sigle** (par exemple deux formations « SP ») seront regroupées. Utilisez des sigles distincts.

## Ajouter une filière à la liste

Une filière dont les fichiers portent **toujours une année** (`XYZ1`, `XYZ2`) n'a besoin d'aucune modification.

Pour qu'un sigle soit reconnu **sans année** (`XYZ - …`), il faut l'ajouter à la liste `KNOWN_FILIERES` dans `src/core.js`, puis publier une nouvelle version. Voir [Développement → Ajouter une filière](developpement.md#ajouter-une-filière).

## Pour les curieux : la règle exacte

Le code est dans `parseClasse()` (`src/core.js`) :

1. **Avec année** : `^\s*([A-Z]{2,6})\s*[-_ ]?\s*(\d)(?!\d)` → classe = sigle + chiffre.
2. **Sinon, sans année** : `^\s*([A-Za-z]{2,6})(?=[\s\-_.]|$)`, à condition que le sigle soit dans `KNOWN_FILIERES` → classe = filière = sigle.
3. **Sinon** : aucune classe.

La filière est la classe sans son chiffre final (`MCO1` → `MCO`).
