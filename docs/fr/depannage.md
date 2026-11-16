[English](../en/troubleshooting.md) · **Français**

# Dépannage et FAQ

## Le bouton « 🔎 Rechercher » n'apparaît pas

1. Vérifiez que vous êtes bien sur une page `https://sign.com/…`, et non `www.sign.com` ou une autre adresse.
2. Rechargez la page (F5). Un onglet ouvert **avant** l'installation de l'extension ne la voit pas.
3. Dans `chrome://extensions` ou `brave://extensions`, vérifiez que l'extension est **activée** et qu'elle n'affiche pas de bouton **Erreurs**.
4. Sous Brave, vérifiez que les Shields ne bloquent pas les scripts sur sign.com : icône du lion → les scripts doivent être autorisés.

Vous pouvez toujours utiliser l'icône de l'extension ou **Alt + Maj + S** à la place du bouton.

## « Vous n'êtes pas connecté à sign.com (ou la session a expiré) »

Votre session sign.com a expiré. Reconnectez-vous dans l'onglet, puis cliquez sur **Réessayer**.

## « sign.com a répondu 500 » (ou un autre code)

sign.com rencontre un problème passager. Attendez un peu, puis cliquez sur **Réessayer**. Si l'erreur persiste alors que le site lui-même fonctionne, sign.com a peut-être changé son fonctionnement interne : voir [Architecture → Si sign.com change](architecture.md#si-signcom-change).

## La recherche ne trouve pas un document que je vois dans sign.com

- Le panneau garde la liste **chargée à son ouverture**. Cliquez sur **↻ Actualiser** pour inclure les documents récents.
- Vérifiez qu'aucun **filtre** (statut, classe) n'est resté actif.
- Avec plusieurs mots, **tous** doivent être présents. Essayez avec un seul mot.
- La recherche porte sur ce que sign.com enregistre. Si un signataire a été saisi avec une faute de frappe, il faut chercher cette orthographe.

## Un document n'a pas de classe

La classe vient du **début du nom de fichier** (voir [Nommage des fichiers](nommage.md)). Les noms qui commencent par « Convention… », par le nom de l'élève, ou par un sigle inconnu sans numéro ne sont pas classés.

Solutions :

- renommer les prochains fichiers en commençant par le sigle, par exemple `MCO1 NOM - Convention.pdf` ;
- ajouter le sigle à la liste `KNOWN_FILIERES` (voir [Développement](developpement.md#ajouter-une-filière)).

## Les icônes ✓ / ⏳ n'apparaissent pas

- Elles ne s'affichent automatiquement que pour les documents **En attente**. Pour les autres, cliquez sur **« Vérifier qui a signé (résultats affichés) »**.
- Si un document reste sans icône après la vérification, sign.com a refusé de donner son détail. Ouvrez le document directement pour voir l'état des signatures.

## Le lien d'un document ouvre « You don't have access »

Cela peut arriver pour des documents d'une équipe sign.com dont vous n'êtes pas le créateur. Ouvrez-le depuis la liste sign.com.

## L'export CSV s'ouvre mal dans Excel (tout dans une colonne, accents cassés)

Le fichier est prévu pour Excel en français (séparateur `;`). Dans une version d'Excel réglée en anglais :

1. Ouvrez Excel, puis **Données → À partir d'un fichier texte/CSV**.
2. Choisissez l'encodage **UTF-8** et le délimiteur **Point-virgule**.

LibreOffice et Numbers proposent ces options à l'ouverture.

## Le panneau s'affiche mal ou sans style

Rechargez la page. Si le problème persiste, ouvrez la console du navigateur (F12 → Console) et cherchez les messages qui mentionnent `panel.css`. Faites une capture et ouvrez un ticket sur le dépôt.

## FAQ

**L'extension envoie-t-elle mes données quelque part ?**
Non. Voir [Confidentialité et sécurité](securite.md).

**Faut-il ressaisir mon mot de passe ?**
Non. L'extension utilise la session sign.com déjà ouverte dans le navigateur.

**Peut-elle modifier, signer ou supprimer des documents ?**
Non. Elle ne fait que des lectures.

**Fonctionne-t-elle avec un compte d'équipe sign.com ?**
Elle affiche ce que renvoie la liste « All Documents » du compte connecté, comme le site lui-même.

**Fonctionne-t-elle sur Firefox ou Safari ?**
Pas en l'état. Elle est écrite pour les navigateurs Chromium (Chrome, Brave, Edge, Opera, Vivaldi).

**Combien de documents peut-elle gérer ?**
Plusieurs milliers sans difficulté : la recherche se fait en mémoire. L'affichage montre 150 résultats à la fois, avec un bouton « Afficher plus ».
