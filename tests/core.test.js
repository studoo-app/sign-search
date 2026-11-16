// Lancer : npm test  (Node ≥ 18)
// Données fictives uniquement.
const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../src/core.js");

const raw = [
  {
    id: "a1",
    itemType: "signRequest",
    publicSignRequestId: "pub111",
    name: "MCO1 DUPONT - Conventions ECOLE.pdf",
    status: "Pending",
    createdAt: "2026-11-10T10:00:00Z",
    updatedAt: "2026-11-12T10:00:00Z",
    senderEmail: "conventions@ecole.test",
    senderFirstName: "Service",
    senderLastName: "Conventions",
    signees: [
      { id: "s2", firstName: "Élodie", lastName: "Martin", email: "elodie@entreprise.test", order: 2, role: "signer" },
      { id: "s1", firstName: "Jean", lastName: "Dupont", email: "jean.dupont@eleve.test", order: 1, role: "signer" },
      { id: "s0", firstName: "Service", lastName: "Conventions", email: "conventions@ecole.test", order: 0, role: "signer" },
    ],
  },
  {
    id: "b2",
    itemType: "document",
    name: "SIO 2_Ana LOPEZ Convention ECOLE.pdf",
    status: "Cancelled",
    createdAt: "2026-05-01T10:00:00Z",
    updatedAt: "2026-05-02T10:00:00Z",
    senderEmail: "conventions@ecole.test",
    signees: [
      { id: "t1", firstName: "Ana", lastName: "López", email: "ana@eleve.test", order: 1, role: "signer" },
      { id: "t2", firstName: "Élodie", lastName: "Martin", email: "ELODIE@entreprise.test", order: 2, role: "signer" },
    ],
  },
  {
    id: "c3",
    itemType: "document",
    name: "NDRC1 - Convention Paul DURAND.pdf",
    status: "Sealed",
    createdAt: "2026-06-01T10:00:00Z",
    updatedAt: "2026-06-03T10:00:00Z",
    senderEmail: "conventions@ecole.test",
    signees: [{ id: "u1", firstName: "Paul", lastName: "Durand", email: "paul@eleve.test", order: 1, role: "signer" }],
  },
];
const records = raw.map(C.toRecord);

test("normalize retire accents et casse", () => {
  assert.equal(C.normalize("  Élodie   LÓPEZ "), "elodie lopez");
});

test("statuts : Canceled et Cancelled sont regroupés", () => {
  assert.equal(C.statusKey("Canceled"), "canceled");
  assert.equal(C.statusKey("Cancelled"), "canceled");
  assert.equal(C.statusLabel("Sealed"), "Signé");
  assert.equal(C.statusLabel("Pending"), "En attente");
  assert.equal(C.statusLabel("Bizarre"), "Bizarre");
});

test("parseClasse reconnaît les préfixes de classe", () => {
  assert.equal(C.parseClasse("MCO1 LEROY - Conventions"), "MCO1");
  assert.equal(C.parseClasse("MCO2 MOREAU- Conventions"), "MCO2");
  assert.equal(C.parseClasse("SIO 2_Lucas PETIT - Convention"), "SIO2");
  assert.equal(C.parseClasse("NDRC1 - Convention X"), "NDRC1");
  assert.equal(C.parseClasse("SAM2 - Bernard"), "SAM2");
  assert.equal(C.parseClasse("CG1 NOM - Convention"), "CG1");
  assert.equal(C.parseClasse("Contrat de location 2026.pdf"), "");
  // filière sans année
  assert.equal(C.parseClasse("SIO - Convention ECOLE.pdf"), "SIO");
  assert.equal(C.parseClasse("CG LABED2 - Convention"), "CG");
  assert.equal(C.parseClasse("NDRC S2 .3 Nom.pdf"), "NDRC");
  assert.equal(C.parseClasse("DCG  - l2Nom.pdf"), "DCG");
  assert.equal(C.parseClasse("DCGL2 Nom"), "DCGL2");
  // pas de faux positifs
  assert.equal(C.parseClasse("DUPONT - Convention"), "");
  assert.equal(C.parseClasse("Avis 2 stage"), "");
  assert.equal(C.filiereOf("MCO1"), "MCO");
  assert.equal(C.filiereOf("SIO"), "SIO");
});

test("liens vers les documents selon le type", () => {
  assert.equal(records[0].url, "/detail/pub111");
  assert.equal(records[1].url, "/request-pdf/b2");
  assert.equal(C.detailApiUrl(raw[0]), "/api/sign-requests/pub111");
  assert.equal(C.detailApiUrl(raw[1]), "/api/documents/b2");
});

test("signataires triés par ordre", () => {
  assert.deepEqual(records[0].signees.map((s) => s.name), ["Service Conventions", "Jean Dupont", "Élodie Martin"]);
});

test("recherche : sans accents, plusieurs mots en ET", () => {
  const r = (q, o) => C.filterRecords(records, { query: q, ...o }).map((x) => x.id);
  assert.deepEqual(r("elodie"), ["a1", "b2"]);
  assert.deepEqual(r("lopez"), ["b2"]);
  assert.deepEqual(r("martin dupont"), ["a1"]);
  assert.deepEqual(r("eleve.test"), ["a1", "c3", "b2"]);
  assert.deepEqual(r("introuvable"), []);
  assert.deepEqual(r(""), ["a1", "c3", "b2"]);
});

test("filtres statut / classe et tris", () => {
  assert.deepEqual(C.filterRecords(records, { status: "canceled" }).map((x) => x.id), ["b2"]);
  assert.deepEqual(C.filterRecords(records, { classe: "NDRC1" }).map((x) => x.id), ["c3"]);
  assert.deepEqual(C.filterRecords(records, { classe: "NDRC" }).map((x) => x.id), ["c3"]);
  assert.deepEqual(C.filterRecords(records, { classe: "NDRC2" }).map((x) => x.id), []);
  assert.deepEqual(C.filterRecords(records, { sort: "old" }).map((x) => x.id), ["b2", "c3", "a1"]);
  assert.deepEqual(C.filterRecords(records, { sort: "name" }).map((x) => x.id), ["a1", "c3", "b2"]);
});

test("matchingSignees met en évidence les bonnes personnes", () => {
  const hit = C.matchingSignees(records[0], C.tokenize("élodie"));
  assert.deepEqual([...hit], ["s2"]);
});

test("people regroupe par email et exclut l'expéditeur", () => {
  const p = C.people(records, ["conventions@ecole.test"]);
  const elodie = p.find((x) => x.email.toLowerCase() === "elodie@entreprise.test");
  assert.equal(elodie.count, 2);
  assert.equal(elodie.pending, 1);
  assert.deepEqual(elodie.classes, ["MCO1", "SIO2"]);
  assert.ok(!p.some((x) => x.email === "conventions@ecole.test"));
});

test("facets compte statuts et classes", () => {
  const f = C.facets(records);
  assert.deepEqual(f.statuses, { pending: 1, canceled: 1, sealed: 1 });
  assert.deepEqual(f.classes, { MCO1: 1, SIO2: 1, NDRC1: 1 });
  assert.deepEqual(f.filieres, { MCO: 1, SIO: 1, NDRC: 1 });
});

test("CSV : BOM, séparateur ; et échappement", () => {
  const rec = C.toRecord({ ...raw[2], name: 'Doc; "spécial"' });
  const csv = C.toCsv([rec], "https://sign.com");
  assert.ok(csv.startsWith("﻿Document;Classe;Statut"));
  assert.ok(csv.includes('"Doc; ""spécial"""'));
  assert.ok(csv.includes("https://sign.com/request-pdf/c3"));
  assert.ok(csv.includes("Paul Durand"));
});

test("parseDetail : format /api/documents/:id (actions)", () => {
  const rows = C.parseDetail({
    actions: [
      { assigneeEmail: "a@x.test", assigneeFirstName: "A", assigneeLastName: "B", status: "Completed", completedAt: "2026-06-02T10:00:00Z" },
      { assigneeEmail: "c@x.test", status: "Pending", completedAt: null },
      { assigneeEmail: "d@x.test", status: "Cancelled", completedAt: "2026-06-02T10:00:00Z" },
    ],
  });
  assert.equal(rows[0].done, true);
  assert.equal(rows[0].label, "A signé");
  assert.equal(rows[1].status, "pending");
  assert.equal(rows[1].done, false);
  assert.equal(rows[2].done, false);
  assert.equal(rows[2].label, "Annulé");
  const m = C.signeeStatusMap(rows);
  assert.equal(m.get("a@x.test").done, true);
});

test("parseDetail : format /api/sign-requests/:id (signees)", () => {
  const rows = C.parseDetail({
    signees: [
      { email: "A@X.test", firstName: "A", lastName: "B", status: "Pending" },
      { email: "e@x.test", status: "Completed" },
    ],
  });
  const m = C.signeeStatusMap(rows);
  assert.equal(m.get("a@x.test").status, "pending");
  assert.equal(m.get("e@x.test").done, true);
});

test("parseDocumentList : accepte le format actuel", () => {
  assert.deepEqual(C.parseDocumentList({ items: raw }), raw);
  assert.deepEqual(C.parseDocumentList({ items: [] }), []);
  assert.deepEqual(C.parseDocumentList({ items: [], actionRequiredItems: [] }), []);
});

test("parseDocumentList : inclut les documents en attente (actionRequiredItems)", () => {
  const signe = { id: "d1", itemType: "document", name: "SIO1 A.pdf", status: "Sealed", signees: [], updatedAt: "2026-11-01" };
  const attente = { id: "p1", itemType: "signRequest", publicSignRequestId: "pub1", name: "SIO1 B.pdf", status: "Pending", actionType: "SignRequest", actorRole: "Signer", signees: [], updatedAt: "2026-11-02" };
  const liste = C.parseDocumentList({ items: [signe], actionRequiredItems: [attente] });
  assert.deepEqual(liste.map((i) => i.id), ["d1", "p1"]);
  // « Sign document » sur sign.com → statut « À signer ».
  const recs = liste.map(C.toRecord);
  assert.deepEqual(recs.map((r) => r.status), ["sealed", "to_sign"]);
  assert.equal(recs[1].statusLabel, "À signer");
  assert.ok(C.isAwaiting("to_sign") && C.isAwaiting("pending") && !C.isAwaiting("sealed"));
  // Une demande en attente des autres (sans actionType) reste « En attente ».
  assert.equal(C.toRecord({ ...attente, actionType: undefined }).status, "pending");
  // Un même document présent dans les deux listes n'apparaît qu'une fois (version la plus récente).
  const ancien = { ...attente, status: "Sealed", updatedAt: "2026-11-01" };
  const dedup = C.parseDocumentList({ items: [ancien], actionRequiredItems: [attente] });
  assert.equal(dedup.length, 1);
  assert.equal(dedup[0].status, "Pending");
  assert.throws(() => C.parseDocumentList({ items: [], actionRequiredItems: {} }), C.FormatError);
});

test("parseDocumentList : signale un changement de format", () => {
  const cas = [
    null,
    [],
    "<html>",
    {},
    { documents: raw },
    { items: "x" },
    { items: [null] },
    { items: [{ ...raw[0], id: undefined }] },
    { items: [{ ...raw[0], signees: "x" }] },
    { items: raw.map(({ name, ...rest }) => ({ ...rest, title: name })) },
    { items: raw.map(({ status, ...rest }) => ({ ...rest, state: status })) },
    { items: raw.map(({ signees, ...rest }) => ({ ...rest, recipients: signees })) },
  ];
  for (const json of cas) {
    assert.throws(() => C.parseDocumentList(json), C.FormatError, JSON.stringify(json));
  }
  // Un champ absent d'un seul document reste toléré.
  const { name, ...sansNom } = raw[0];
  assert.equal(C.parseDocumentList({ items: [sansNom, raw[1]] }).length, 2);
});

test("parseDetail : signale un changement de format", () => {
  const cas = [
    null,
    "<html>",
    {},
    { recipients: [] },
    { actions: [null] },
    { actions: [{ email: "a@x.test", status: "Pending" }] },
    { signees: [{ mail: "a@x.test", status: "Pending" }] },
  ];
  for (const json of cas) {
    assert.throws(() => C.parseDetail(json), C.FormatError, JSON.stringify(json));
  }
  assert.deepEqual(C.parseDetail({ actions: [] }), []);
  assert.deepEqual(C.parseDetail({ signees: [] }), []);
});

test("FormatError : message lisible", () => {
  const e = new C.FormatError("liste des documents", "le champ « items » est absent");
  assert.ok(e instanceof Error);
  assert.equal(e.name, "FormatError");
  assert.equal(e.message, "Format inattendu (liste des documents) : le champ « items » est absent.");
});

test("exemples documentés dans docs/fr/nommage.md et docs/en/file-naming.md", () => {
  const cas = {
    "MCO1 DUPONT Jean - Convention ACME.pdf": "MCO1",
    "MCO1_DUPONT.pdf": "MCO1",
    "MCO1-DUPONT.pdf": "MCO1",
    "MCO 1 DUPONT.pdf": "MCO1",
    "MCO-1 DUPONT.pdf": "MCO1",
    "SIO - 2 X": "SIO2",
    "MCO1DUPONT": "MCO1",
    "XYZ1 Dupont": "XYZ1",
    "MCO - DUPONT.pdf": "MCO",
    "MCO_DUPONT": "MCO",
    "MCO.DUPONT": "MCO",
    "mco - dupont": "MCO",
    "Convention MCO1 DUPONT": "",
    "Mco1 DUPONT": "",
    "mco1 dupont": "",
    "MCO12 DUPONT": "",
    "1MCO DUPONT": "",
    "S1 DUPONT": "",
    "ABCDEFG1 X": "",
    "XYZ - Dupont": "",
    // pièges documentés
    "DUPONT2 - Convention.pdf": "DUPONT2",
    "MCO1A DUPONT": "MCO1",
  };
  for (const [nom, attendu] of Object.entries(cas)) assert.equal(C.parseClasse(nom), attendu, nom);
});
