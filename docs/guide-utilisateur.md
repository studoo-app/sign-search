# Guide d'utilisation

## Ouvrir et fermer le panneau

| Action | Comment |
|---|---|
| Ouvrir | Bouton **🔎 Rechercher** en bas à droite de sign.com, icône de l'extension dans la barre d'outils, ou **Alt + Maj + S** |
| Fermer | **Échap**, bouton **✕**, ou de nouveau **Alt + Maj + S** |

Si vous cliquez sur l'icône alors que vous n'êtes pas sur sign.com, l'extension ouvre la liste des documents sign.com dans un nouvel onglet.

À la première ouverture, le panneau charge la liste de tous vos documents. Cela prend environ une seconde.

## Le panneau en un coup d'œil

```
┌──────────────────────────────────────────────────────────────┐
│ Recherche sign.com   312 / 507 documents   ↻ Actualiser ⬇ CSV ✕ │
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
└──────────────────────────────────────────────────────────────┘
```

Le compteur **312 / 507** indique le nombre de documents affichés sur le nombre total.

## Rechercher

Tapez dans la barre de recherche : les résultats se mettent à jour pendant la frappe. La recherche porte sur :

- le **nom du fichier** ;
- le **prénom, le nom et l'email** de chaque signataire ;
- l'expéditeur du document ;
- la classe détectée (MCO1, SIO2…).

**Les règles :**

- Les **accents et majuscules sont ignorés** : `elodie` trouve « Élodie », `lopez` trouve « LÓPEZ ».
- **Plusieurs mots = tous obligatoires**, dans n'importe quel ordre. Par exemple, `martin mco1` trouve les documents de la classe MCO1 où figure un Martin.
- Une **partie de mot suffit** : `dupo` trouve « Dupont ». Un domaine aussi : `@entreprise.fr` trouve tous les documents où apparaît une personne de cette entreprise.

**Exemples utiles :**

| Recherche | Résultat |
|---|---|
| `dupont` | Tous les documents où apparaît un Dupont |
| `sio2 dupont` | Seulement ceux de la classe SIO2 |
| `@carrefour.fr` | Toutes les conventions signées avec Carrefour |
| `acme ndrc` | Fichiers « ACME » de la filière NDRC |

Les signataires qui correspondent à la recherche sont **surlignés en bleu**.

## Filtrer

### Par statut

| Statut affiché | Signification sur sign.com |
|---|---|
| Signé | Toutes les signatures sont faites, le document est scellé |
| En attente | Envoyé, au moins une signature manque |
| Expiré | Le délai de signature est dépassé |
| Annulé | Annulé par l'expéditeur (sign.com écrit « Canceled » ou « Cancelled » ; les deux sont regroupés) |

Chaque option indique entre parenthèses le nombre de documents concernés.

### Par classe ou filière

La classe est **déduite du début du nom de fichier** :

| Nom de fichier | Classe | Filière |
|---|---|---|
| `MCO1 LEROY - Conventions…` | MCO1 | MCO |
| `SIO 2_Lucas PETIT - Convention…` | SIO2 | SIO |
| `NDRC1 - Convention…` | NDRC1 | NDRC |
| `SIO - Convention…` | SIO | SIO |
| `Convention Nom Prénom.pdf` | *(aucune)* | *(aucune)* |

La liste déroulante comporte deux groupes :

- **Filière (toutes années)** : par exemple « MCO – toutes » affiche MCO1, MCO2, et aussi les fichiers qui commencent seulement par « MCO ».
- **Classe** : une année précise, par exemple MCO1.

Un document sans sigle au début de son nom n'a pas de classe. Il reste trouvable par la recherche texte.

**Astuce** : pour qu'un document soit toujours classé, faites commencer son nom par le sigle de la classe, par exemple `MCO1 NOM - Convention.pdf`.

### Tri

- **Plus récents** (par défaut) : date de dernière mise à jour, du plus récent au plus ancien.
- **Plus anciens**.
- **Nom (A→Z)** : ordre alphabétique du nom de fichier.

## Lire une ligne de document

- **Nom du fichier** : cliquez dessus pour ouvrir le document dans un **nouvel onglet**. Le panneau reste ouvert.
- **Badges** : classe (bleu), statut (couleur selon l'état), et « N signatures manquantes » si on le sait.
- **Date** : dernière mise à jour. Survolez-la pour voir la date de création.
- **Signataires** : nom complet et email, dans l'ordre de signature. Survolez un nom pour voir l'email complet.
  - Un nom **grisé** correspond à vous-même (l'expéditeur du document).
  - Un nom **surligné en bleu** correspond à votre recherche.
  - Un **cadre en pointillés orange** signale une personne qui n'a pas encore signé.

## Qui a signé, qui manque ?

La liste générale de sign.com ne précise pas l'état de chaque personne. L'extension va donc chercher le **détail** de chaque document :

- **Automatiquement** pour tous les documents **En attente**, dès l'ouverture du panneau.
- **À la demande** pour les autres : bouton **« Vérifier qui a signé (résultats affichés) »** en bas du panneau. Il porte sur les 300 premiers résultats affichés.

Pendant la vérification, le pied du panneau indique « vérification des signatures… (N) ».

| Icône | Signification |
|---|---|
| ✓ (vert) | A signé. Survolez pour voir la date. |
| ⏳ (orange) | N'a pas encore signé |
| ✕ (rouge) | Signature annulée ou refusée |
| *(rien)* | Détail pas encore chargé |

**Exemple** : pour voir toutes les conventions MCO1 en attente et qui bloque :

1. Statut = En attente.
2. Classe = MCO1.
3. Regardez les noms marqués ⏳ et le badge « signature manquante ».

## Vue Personnes

Cliquez sur l'onglet **Personnes** pour une liste de toutes les personnes présentes dans les documents affichés :

| Colonne | Contenu |
|---|---|
| Nom | Prénom Nom |
| Email | Adresse utilisée dans sign.com |
| Classes | Classes des documents où elle apparaît |
| Docs | Nombre de documents |
| En attente | Nombre de documents en attente où elle figure |

- Les personnes sont regroupées **par email**, en ignorant les majuscules.
- Vous-même (l'expéditeur) n'apparaissez pas dans cette liste.
- La vue respecte la recherche et les filtres. Par exemple, avec Classe = SIO2 et l'onglet Personnes, vous obtenez tous les élèves, tuteurs et entreprises de SIO2.
- **Cliquez sur une personne** pour revenir aux documents, filtrés sur son email.

## Exporter en CSV

Le bouton **⬇ CSV** exporte les **résultats affichés**, avec la recherche et les filtres actifs, dans un fichier `sign-documents-AAAA-MM-JJ.csv`.

| Colonne | Contenu |
|---|---|
| Document | Nom du fichier |
| Classe | Classe détectée |
| Statut | Signé, En attente… |
| Créé le / Mis à jour le | Dates au format JJ/MM/AAAA |
| Signataires | Noms séparés par des virgules |
| Emails | Emails séparés par des virgules |
| Lien | Adresse complète pour ouvrir le document |

Le fichier utilise le séparateur **point-virgule** et l'encodage **UTF-8 avec BOM**. Il s'ouvre donc directement dans Excel en français, accents compris.

## Actualiser

Le panneau garde la liste en mémoire tant que la page est ouverte. Après avoir envoyé ou fait signer de nouveaux documents, cliquez sur **↻ Actualiser** : la liste est rechargée, et l'état des signatures en attente aussi.

Recharger la page sign.com (F5) a le même effet.
