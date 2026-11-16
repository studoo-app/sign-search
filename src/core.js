// Logique pure (sans DOM) : normalisation, recherche, statuts, CSV.
// Chargé comme content script (expose globalThis.SignSearchCore)
// et testable sous Node (module.exports).

(function (root) {
  "use strict";

  const STATUS_LABELS = {
    sealed: "Signé",
    pending: "En attente",
    expired: "Expiré",
    canceled: "Annulé",
    cancelled: "Annulé",
    draft: "Brouillon",
    declined: "Refusé",
  };

  /** Minuscules, sans accents, espaces compactés. */
  function normalize(str) {
    return String(str || "")
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ")
      .trim();
  }

  /** Clé de statut unifiée (« Canceled » et « Cancelled » → « canceled »). */
  function statusKey(status) {
    const k = normalize(status);
    return k === "cancelled" ? "canceled" : k;
  }

  function statusLabel(status) {
    return STATUS_LABELS[statusKey(status)] || status || "—";
  }

  /**
   * Filières reconnues même sans numéro d'année (« SIO - … », « CG - … »).
   * Avec un numéro (« MCO1 », « SIO 2 »), n'importe quel sigle est accepté.
   */
  const KNOWN_FILIERES = [
    "SIO", "SISR", "SLAM", "CG", "DCG", "DCGL", "NDRC", "MCO", "SAM", "SP",
    "GPME", "CI", "TC", "MUC", "AM", "PI", "CJN", "BTS",
  ];

  /**
   * Devine la classe à partir du début du nom de fichier.
   * « MCO1 LEROY - … » → « MCO1 », « SIO 2_Lucas … » → « SIO2 »,
   * « SIO - Convention … » → « SIO ».
   */
  function parseClasse(name) {
    const s = String(name || "");
    const withYear = s.match(/^\s*([A-Z]{2,6})\s*[-_ ]?\s*(\d)(?!\d)/);
    if (withYear) return (withYear[1] + withYear[2]).toUpperCase();
    const bare = s.match(/^\s*([A-Za-z]{2,6})(?=[\s\-_.]|$)/);
    if (bare && KNOWN_FILIERES.includes(bare[1].toUpperCase())) return bare[1].toUpperCase();
    return "";
  }

  /** « MCO1 » → « MCO » ; « SIO » → « SIO ». */
  function filiereOf(classe) {
    return String(classe || "").replace(/\d+$/, "");
  }

  function fullName(p) {
    const first = (p.firstName || "").trim();
    const last = (p.lastName || "").trim();
    return [first, last].filter(Boolean).join(" ");
  }

  /** Lien pour ouvrir un document dans sign.com. */
  function documentUrl(item) {
    if (item.itemType === "signRequest" && item.publicSignRequestId) {
      return "/detail/" + item.publicSignRequestId;
    }
    if (item.id) return "/request-pdf/" + item.id;
    return null;
  }

  /** Transforme un élément brut de /api/documents en objet prêt à afficher. */
  function toRecord(item) {
    const signees = (item.signees || [])
      .slice()
      .sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((s) => ({
        id: s.id,
        name: fullName(s),
        email: (s.email || "").trim(),
        order: s.order,
        role: s.role,
      }));
    const sender = {
      name: fullName({ firstName: item.senderFirstName, lastName: item.senderLastName }),
      email: (item.senderEmail || "").trim(),
    };
    const record = {
      id: item.id,
      itemType: item.itemType,
      name: item.name || "(sans nom)",
      classe: parseClasse(item.name),
      filiere: filiereOf(parseClasse(item.name)),
      status: statusKey(item.status),
      statusLabel: statusLabel(item.status),
      createdAt: item.createdAt || "",
      updatedAt: item.updatedAt || item.createdAt || "",
      url: documentUrl(item),
      sender,
      signees,
    };
    record.haystack = normalize(
      [
        record.name,
        record.classe,
        sender.name,
        sender.email,
        ...signees.map((s) => s.name + " " + s.email),
      ].join(" | ")
    );
    return record;
  }

  /** Découpe la requête en mots ; chaque mot doit être présent (ET logique). */
  function tokenize(query) {
    return normalize(query).split(" ").filter(Boolean);
  }

  function matches(record, tokens) {
    return tokens.every((t) => record.haystack.includes(t));
  }

  /** Signataires qui correspondent à au moins un mot de la recherche. */
  function matchingSignees(record, tokens) {
    if (!tokens.length) return new Set();
    const ids = new Set();
    for (const s of record.signees) {
      const h = normalize(s.name + " " + s.email);
      if (tokens.some((t) => h.includes(t))) ids.add(s.id);
    }
    return ids;
  }

  /**
   * Filtre + tri.
   * opts : { query, status, classe, sort: "recent" | "old" | "name" }
   */
  function filterRecords(records, opts) {
    const o = opts || {};
    const tokens = tokenize(o.query);
    let out = records.filter(
      (r) =>
        (!o.status || r.status === o.status) &&
        (!o.classe || r.classe === o.classe || r.filiere === o.classe) &&
        matches(r, tokens)
    );
    const sort = o.sort || "recent";
    out = out.slice().sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name, "fr", { sensitivity: "base" });
      const d = String(a.updatedAt).localeCompare(String(b.updatedAt));
      return sort === "old" ? d : -d;
    });
    return out;
  }

  /** Liste des personnes (par email) avec le nombre de documents. */
  function people(records, excludeEmails) {
    const skip = new Set((excludeEmails || []).map((e) => normalize(e)));
    const map = new Map();
    for (const r of records) {
      for (const s of r.signees) {
        const key = normalize(s.email) || normalize(s.name);
        if (!key || skip.has(key)) continue;
        let p = map.get(key);
        if (!p) {
          p = { key, name: s.name, email: s.email, count: 0, pending: 0, classes: new Set() };
          map.set(key, p);
        }
        if (!p.name && s.name) p.name = s.name;
        p.count++;
        if (r.status === "pending") p.pending++;
        if (r.classe) p.classes.add(r.classe);
      }
    }
    return [...map.values()]
      .map((p) => ({ ...p, classes: [...p.classes].sort() }))
      .sort((a, b) => (a.name || a.email).localeCompare(b.name || b.email, "fr", { sensitivity: "base" }));
  }

  /** Comptes par statut, par classe (avec année) et par filière (toutes années). */
  function facets(records) {
    const statuses = {};
    const classes = {};
    const filieres = {};
    for (const r of records) {
      statuses[r.status] = (statuses[r.status] || 0) + 1;
      if (r.classe && r.classe !== r.filiere) classes[r.classe] = (classes[r.classe] || 0) + 1;
      if (r.filiere) filieres[r.filiere] = (filieres[r.filiere] || 0) + 1;
    }
    return { statuses, classes, filieres };
  }

  function formatDate(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d)) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return pad(d.getDate()) + "/" + pad(d.getMonth() + 1) + "/" + d.getFullYear();
  }

  function csvCell(v) {
    const s = String(v == null ? "" : v);
    return /[";\n\r]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
  }

  /** CSV séparé par « ; » avec BOM, pour une ouverture directe dans Excel (FR). */
  function toCsv(records, origin) {
    const base = origin || "https://sign.com";
    const header = ["Document", "Classe", "Statut", "Créé le", "Mis à jour le", "Signataires", "Emails", "Lien"];
    const lines = [header.map(csvCell).join(";")];
    for (const r of records) {
      lines.push(
        [
          r.name,
          r.classe,
          r.statusLabel,
          formatDate(r.createdAt),
          formatDate(r.updatedAt),
          r.signees.map((s) => s.name || s.email).join(", "),
          r.signees.map((s) => s.email).filter(Boolean).join(", "),
          r.url ? base + r.url : "",
        ]
          .map(csvCell)
          .join(";")
      );
    }
    return "﻿" + lines.join("\r\n");
  }

  /** Statut individuel d'un signataire (détail /api/documents/:id). */
  function actionStatusLabel(action) {
    const k = normalize(action && action.status);
    const map = {
      completed: "A signé",
      signed: "A signé",
      pending: "En attente",
      waiting: "En attente",
      declined: "A refusé",
      canceled: "Annulé",
      cancelled: "Annulé",
      expired: "Expiré",
    };
    if (map[k]) return map[k];
    if (action && action.completedAt) return "A signé";
    return action && action.status ? action.status : "—";
  }

  // ---------- contrôle du format des réponses de sign.com ----------

  /**
   * Levée quand une réponse de sign.com n'a plus la forme attendue
   * (API modifiée) : l'extension doit alors être mise à jour.
   */
  class FormatError extends Error {
    constructor(where, detail) {
      super("Format inattendu (" + where + ") : " + detail + ".");
      this.name = "FormatError";
      this.where = where;
      this.detail = detail;
    }
  }

  function isObject(v) {
    return v !== null && typeof v === "object" && !Array.isArray(v);
  }

  /** Champs dont l'extension a besoin dans chaque élément de /api/documents. */
  const DOCUMENT_FIELDS = ["id", "name", "status", "signees"];

  /**
   * Vérifie la réponse de /api/documents et renvoie la liste des éléments.
   * Lève une FormatError si la forme ne correspond plus.
   */
  function parseDocumentList(json) {
    const where = "liste des documents";
    if (!isObject(json)) throw new FormatError(where, "la réponse n'est pas un objet JSON");
    if (!Array.isArray(json.items)) throw new FormatError(where, "le champ « items » est absent ou n'est pas une liste");
    const items = json.items;
    if (!items.every(isObject)) throw new FormatError(where, "la liste contient des éléments qui ne sont pas des documents");
    if (items.some((i) => i.id == null)) throw new FormatError(where, "des documents n'ont pas d'« id »");
    if (items.some((i) => i.signees != null && !Array.isArray(i.signees))) {
      throw new FormatError(where, "« signees » n'est plus une liste");
    }
    // Un champ absent d'un document isolé est toléré ; absent de tous, c'est un changement de format.
    for (const f of DOCUMENT_FIELDS) {
      if (items.length && !items.some((i) => f in i)) throw new FormatError(where, "les documents n'ont plus de champ « " + f + " »");
    }
    return items;
  }

  /** URL de l'API de détail (état de chaque signataire). */
  function detailApiUrl(item) {
    if (item.itemType === "signRequest" && item.publicSignRequestId) {
      return "/api/sign-requests/" + encodeURIComponent(item.publicSignRequestId);
    }
    if (item.id) return "/api/documents/" + encodeURIComponent(item.id);
    return null;
  }

  /**
   * Normalise la réponse de détail (deux formats possibles) en
   * [{ email, name, status, label, done, date }].
   */
  function parseDetail(json) {
    const where = "détail d'un document";
    if (!isObject(json)) throw new FormatError(where, "la réponse n'est pas un objet JSON");
    const hasActions = Array.isArray(json.actions);
    const hasSignees = Array.isArray(json.signees);
    if (!hasActions && !hasSignees) throw new FormatError(where, "ni « actions » ni « signees » ne sont présents");
    const source = hasActions && json.actions.length ? json.actions : hasSignees ? json.signees : [];
    if (!source.every(isObject)) throw new FormatError(where, "la liste des signataires contient des éléments invalides");
    const emailKey = source === json.actions ? "assigneeEmail" : "email";
    if (source.length && !source.some((x) => emailKey in x)) {
      throw new FormatError(where, "les signataires n'ont plus de champ « " + emailKey + " »");
    }
    let rows = [];
    if (hasActions && json.actions.length) {
      rows = json.actions.map((a) => ({
        email: a.assigneeEmail || "",
        name: fullName({ firstName: a.assigneeFirstName, lastName: a.assigneeLastName }),
        status: a.status,
        completedAt: a.completedAt,
        order: a.order,
      }));
    } else if (hasSignees) {
      rows = json.signees.map((s) => ({
        email: s.email || "",
        name: fullName(s),
        status: s.status,
        completedAt: s.completedAt || null,
        order: s.order,
      }));
    }
    return rows.map((r) => {
      const k = statusKey(r.status);
      const done = k === "completed" || k === "signed";
      return {
        email: r.email.trim(),
        name: r.name,
        status: k,
        label: actionStatusLabel({ status: r.status, completedAt: done ? r.completedAt : null }),
        done,
        date: done ? r.completedAt || "" : "",
      };
    });
  }

  /** Associe le détail aux signataires par email (insensible à la casse). */
  function signeeStatusMap(detailRows) {
    const m = new Map();
    for (const d of detailRows || []) if (d.email) m.set(normalize(d.email), d);
    return m;
  }

  const api = {
    FormatError,
    parseDocumentList,
    detailApiUrl,
    parseDetail,
    signeeStatusMap,
    normalize,
    statusKey,
    statusLabel,
    parseClasse,
    filiereOf,
    KNOWN_FILIERES,
    documentUrl,
    toRecord,
    tokenize,
    matches,
    matchingSignees,
    filterRecords,
    people,
    facets,
    formatDate,
    toCsv,
    actionStatusLabel,
    STATUS_LABELS,
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  root.SignSearchCore = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
