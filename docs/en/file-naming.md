**English** · [Français](../fr/nommage.md)

# Naming files so the program and class are detected

Sign Search Convention doesn't read the content of PDFs. It derives the **class** (MCO1, SIO2…) and the **program** (MCO, SIO…) **only from the beginning of the file name** uploaded to sign.com. Both feed the panel's "Classe" filter and the "Classes" column of the People view.

So files must be named **before they are sent for signature**. Renaming a document already in sign.com also works: the extension rereads the names every time it loads.

## The pattern to follow

```
<PROGRAM><YEAR> <NAME Firstname> - Convention <Company>.pdf
```

| Part | Rule | Example |
|---|---|---|
| `PROGRAM` | Code in **CAPITALS**, 2 to 6 letters, **at the very start** of the name | `MCO`, `SIO`, `NDRC`, `DCGL` |
| `YEAR` | **A single digit**, attached to the code or separated by a space, `-` or `_` | `1`, `2` |
| The rest | Free text. Used by the text search (student name, company…). | `DUPONT Jean - Convention ACME` |

**Recommended examples:**

```
MCO1 DUPONT Jean - Convention ACME.pdf            → class MCO1, program MCO
SIO2 MARTIN Léa - Convention CAPGEMINI.pdf        → class SIO2, program SIO
NDRC1 DURAND Paul - Convention.pdf                → class NDRC1, program NDRC
```

Pick one form and use it for every file: `MCO1 NAME…` with a space is the most readable.

## Every accepted form

### With the year (→ class + program)

| File name | Class | Program |
|---|---|---|
| `MCO1 DUPONT…` | MCO1 | MCO |
| `MCO1_DUPONT…` | MCO1 | MCO |
| `MCO1-DUPONT…` | MCO1 | MCO |
| `MCO 1 DUPONT…` | MCO1 | MCO |
| `MCO-1 DUPONT…` | MCO1 | MCO |
| `SIO 2_Lucas…` | SIO2 | SIO |
| `SIO - 2 …` | SIO2 | SIO |
| `MCO1DUPONT…` | MCO1 | MCO |

With a year, **any capitalised code** of 2 to 6 letters is accepted, even if it isn't in the list of known programs (`XYZ1` → XYZ1).

### Without the year (→ program only)

| File name | Class | Program |
|---|---|---|
| `MCO - DUPONT…` | MCO | MCO |
| `MCO_DUPONT…` | MCO | MCO |
| `MCO.DUPONT…` | MCO | MCO |
| `mco - dupont…` | MCO | MCO |

Without a year, the code must be in the **list of known programs** and be followed by a space, `-`, `_` or `.`. Lowercase is accepted here. These documents show up under "MCO – toutes" (MCO, all years), but in no specific class.

**Known programs**: SIO, SISR, SLAM, CG, DCG, DCGL, NDRC, MCO, SAM, SP, GPME, CI, TC, MUC, AM, PI, CJN, BTS.

## What is not detected

| File name | Why |
|---|---|
| `Convention MCO1 DUPONT…` | The code is not **at the start** |
| `Mco1 DUPONT…`, `mco1 dupont…` | With a year, the code must be **in capitals** |
| `MCO12 DUPONT…` | The year must be **a single digit** |
| `1MCO DUPONT…` | The year must come **after** the code |
| `S1 DUPONT…` | Code too short (**2 letters minimum**) |
| `ABCDEFG1 …` | Code too long (**6 letters maximum**) |
| `XYZ - DUPONT…` | Without a year, the code must be in the **list of known programs** |

An undetected document can still be found with the text search: typing `mco1` also finds "Convention MCO1 DUPONT". It just doesn't appear in the Class filter.

## Pitfalls

- **A short surname in capitals followed by a digit is taken for a class**: `DUPONT2 - Convention.pdf` gives the class "DUPONT2". Always start with the class code.
- **A letter after the year is ignored**: `MCO1A DUPONT` gives MCO1. To tell two groups of the same year apart, put the group further into the name (`MCO1 GrA DUPONT…`) and find it with the search.
- **Different programs sharing the same code** (for example two "SP" courses) will be grouped together. Use distinct codes.

## Adding a program to the list

A program whose files **always include a year** (`XYZ1`, `XYZ2`) needs no change.

For a code to be detected **without a year** (`XYZ - …`), add it to the `KNOWN_FILIERES` list in `src/core.js`, then release a new version. See [Development → Add a program](development.md#add-a-program).

## For the curious: the exact rule

The code lives in `parseClasse()` (`src/core.js`):

1. **With year**: `^\s*([A-Z]{2,6})\s*[-_ ]?\s*(\d)(?!\d)` → class = code + digit.
2. **Otherwise, without year**: `^\s*([A-Za-z]{2,6})(?=[\s\-_.]|$)`, provided the code is in `KNOWN_FILIERES` → class = program = code.
3. **Otherwise**: no class.

The program is the class without its trailing digit (`MCO1` → `MCO`).
