// Script injecté dans sign.com : bouton flottant + panneau de recherche.
// Toutes les données restent dans la page (aucun envoi extérieur, rien n'est stocké).

(function () {
  "use strict";
  if (window.__signSearchLoaded) return;
  window.__signSearchLoaded = true;

  const C = globalThis.SignSearchCore;
  const PAGE_SIZE = 150;
  const DETAIL_CONCURRENCY = 4;
  const ISSUES_URL = "https://github.com/studoo-app/sign-search/issues";

  // ---------- état ----------
  const state = {
    open: false,
    loading: false,
    error: "",
    formatError: false, // true si l'erreur vient d'un changement de l'API de sign.com
    detailFormatError: "", // message si le détail des signatures n'a pas pu être lu
    items: new Map(), // id → élément brut
    records: [],
    senders: [],
    details: new Map(), // id → Map(email → statut) | "loading" | "error" | "format"
    view: "docs", // "docs" | "people"
    query: "",
    status: "",
    classe: "",
    sort: "recent",
    limit: PAGE_SIZE,
    loadedAt: null,
  };

  // ---------- petit utilitaire DOM (jamais d'innerHTML avec des données) ----------
  function h(tag, attrs, ...children) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k.startsWith("on") && typeof v === "function") el.addEventListener(k.slice(2), v);
      else if (k === "text") el.textContent = v;
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false) continue;
      el.appendChild(typeof c === "string" || typeof c === "number" ? document.createTextNode(String(c)) : c);
    }
    return el;
  }

  // ---------- structure (Shadow DOM pour ne pas subir le CSS du site) ----------
  const host = h("div", { id: "signsearch-host" });
  const shadow = host.attachShadow({ mode: "open" });
  // Masqué tant que le style n'est pas chargé (évite un affichage brut).
  host.style.display = "none";
  fetch(chrome.runtime.getURL("src/panel.css"))
    .then((r) => r.text())
    .then((css) => {
      const sheet = new CSSStyleSheet();
      sheet.replaceSync(css);
      shadow.adoptedStyleSheets = [sheet];
    })
    .catch(() => {
      shadow.prepend(h("link", { rel: "stylesheet", href: chrome.runtime.getURL("src/panel.css") }));
    })
    .finally(() => {
      host.style.display = "";
    });

  const fab = h("button", { class: "fab", title: "Rechercher dans les documents (Alt+Maj+S)", onclick: () => toggle() }, "🔎 Rechercher");

  const searchInput = h("input", {
    class: "search",
    type: "search",
    placeholder: "Nom d'étudiant, tuteur, entreprise, email, fichier…",
    autocomplete: "off",
    spellcheck: "false",
  });
  const statusSelect = h("select", { title: "Statut" });
  const classeSelect = h("select", { title: "Classe" });
  const sortSelect = h(
    "select",
    { title: "Tri" },
    h("option", { value: "recent" }, "Plus récents"),
    h("option", { value: "old" }, "Plus anciens"),
    h("option", { value: "name" }, "Nom (A→Z)")
  );
  const countEl = h("span", { class: "count" });
  const tabDocs = h("button", { class: "tab", onclick: () => setView("docs") }, "Documents");
  const tabPeople = h("button", { class: "tab", onclick: () => setView("people") }, "Personnes");
  const body = h("div", { class: "body" });
  const footerInfo = h("div", { class: "footer-info" });
  const VERSION = chrome.runtime.getManifest().version;
  const footer = h(
    "div",
    { class: "footer" },
    footerInfo,
    h(
      "div",
      { class: "credit" },
      "Sign Search Convention v" + VERSION + " · Créé par ",
      h("a", { href: "https://github.com/studoo-app", target: "_blank", rel: "noopener", title: "Studoo Labs sur GitHub" }, "Studoo Labs")
    )
  );

  const panel = h(
    "aside",
    { class: "panel", role: "dialog", "aria-label": "Sign Search Convention" },
    h(
      "header",
      { class: "head" },
      h("strong", { class: "title" }, "Sign Search Convention"),
      countEl,
      h("span", { class: "spacer" }),
      h("button", { class: "btn", title: "Recharger la liste", onclick: () => load(true) }, "↻ Actualiser"),
      h("button", { class: "btn", title: "Exporter les résultats affichés", onclick: exportCsv }, "⬇ CSV"),
      h("button", { class: "btn close", title: "Fermer (Échap)", onclick: () => toggle(false) }, "✕")
    ),
    h(
      "div",
      { class: "controls" },
      searchInput,
      h("div", { class: "row" }, statusSelect, classeSelect, sortSelect, h("span", { class: "spacer" }), tabDocs, tabPeople)
    ),
    body,
    footer
  );

  shadow.append(fab, panel);
  document.documentElement.appendChild(host);

  // ---------- événements ----------
  let debounce;
  searchInput.addEventListener("input", () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      state.query = searchInput.value;
      state.limit = PAGE_SIZE;
      render();
    }, 120);
  });
  statusSelect.addEventListener("change", () => {
    state.status = statusSelect.value;
    state.limit = PAGE_SIZE;
    render();
  });
  classeSelect.addEventListener("change", () => {
    state.classe = classeSelect.value;
    state.limit = PAGE_SIZE;
    render();
  });
  sortSelect.addEventListener("change", () => {
    state.sort = sortSelect.value;
    render();
  });
  // Empêche les raccourcis clavier du site de capter la frappe dans le panneau.
  panel.addEventListener("keydown", (e) => {
    if (e.key === "Escape") toggle(false);
    e.stopPropagation();
  });

  chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.type === "signsearch:toggle") toggle();
  });

  // ---------- actions ----------
  function toggle(force) {
    state.open = typeof force === "boolean" ? force : !state.open;
    panel.classList.toggle("open", state.open);
    fab.classList.toggle("hidden", state.open);
    if (state.open) {
      if (!state.records.length && !state.loading) load(false);
      else render();
      setTimeout(() => searchInput.focus(), 50);
    }
  }

  function setView(v) {
    state.view = v;
    render();
  }

  async function load(force) {
    if (state.loading) return;
    state.loading = true;
    state.error = "";
    state.formatError = false;
    if (force) {
      state.details.clear();
      state.detailFormatError = "";
    }
    render();
    try {
      const res = await fetch("/api/documents", { credentials: "include", headers: { Accept: "application/json" } });
      if (res.status === 401 || res.status === 403) throw new Error("Vous n'êtes pas connecté à sign.com (ou la session a expiré).");
      if (res.status === 404) throw new C.FormatError("liste des documents", "l'adresse /api/documents n'existe plus (404)");
      if (!res.ok) throw new Error("sign.com a répondu " + res.status + ".");
      const items = C.parseDocumentList(await readJson(res, "liste des documents"));
      state.items = new Map(items.map((i) => [i.id, i]));
      state.records = items.map(C.toRecord);
      state.senders = [...new Set(state.records.map((r) => r.sender.email).filter(Boolean))];
      state.loadedAt = new Date();
      fillSelects();
    } catch (e) {
      state.error = e && e.message ? e.message : String(e);
      state.formatError = e instanceof C.FormatError;
    } finally {
      state.loading = false;
      render();
    }
    // Les documents en attente sont ceux pour lesquels « qui manque ? » compte le plus.
    loadDetails(state.records.filter((r) => C.isAwaiting(r.status)));
  }

  /** Lit le JSON d'une réponse ; une page HTML à la place signale un changement côté sign.com. */
  async function readJson(res, where) {
    try {
      return await res.json();
    } catch (e) {
      throw new C.FormatError(where, "la réponse n'est pas du JSON");
    }
  }

  async function loadDetails(records) {
    const queue = records.filter((r) => !state.details.has(r.id));
    queue.forEach((r) => state.details.set(r.id, "loading"));
    if (queue.length) render();
    let pendingRender = null;
    const scheduleRender = () => {
      if (pendingRender) return;
      pendingRender = setTimeout(() => {
        pendingRender = null;
        render();
      }, 250);
    };
    async function worker() {
      while (queue.length) {
        const r = queue.shift();
        const url = C.detailApiUrl(state.items.get(r.id) || r);
        try {
          if (!url) throw new Error("no url");
          const res = await fetch(url, { credentials: "include", headers: { Accept: "application/json" } });
          if (res.status === 404) throw new C.FormatError("détail d'un document", "l'adresse " + url + " n'existe plus (404)");
          if (!res.ok) throw new Error(String(res.status));
          state.details.set(r.id, C.signeeStatusMap(C.parseDetail(await readJson(res, "détail d'un document"))));
        } catch (e) {
          if (e instanceof C.FormatError) {
            state.details.set(r.id, "format");
            state.detailFormatError = e.message;
          } else {
            state.details.set(r.id, "error");
          }
        }
        scheduleRender();
      }
    }
    await Promise.all(Array.from({ length: DETAIL_CONCURRENCY }, worker));
  }

  function fillSelects() {
    const f = C.facets(state.records);
    statusSelect.replaceChildren(
      h("option", { value: "" }, "Tous les statuts"),
      ...Object.keys(f.statuses)
        .sort()
        .map((k) => h("option", { value: k }, C.statusLabel(k) + " (" + f.statuses[k] + ")"))
    );
    const byName = (a, b) => a.localeCompare(b, "fr", { numeric: true });
    classeSelect.replaceChildren(
      h("option", { value: "" }, "Toutes les classes"),
      h(
        "optgroup",
        { label: "Filière (toutes années)" },
        Object.keys(f.filieres).sort(byName).map((k) => h("option", { value: k }, k + " – toutes (" + f.filieres[k] + ")"))
      ),
      h(
        "optgroup",
        { label: "Classe" },
        Object.keys(f.classes).sort(byName).map((k) => h("option", { value: k }, k + " (" + f.classes[k] + ")"))
      )
    );
    statusSelect.value = state.status;
    classeSelect.value = state.classe;
  }

  function currentResults() {
    return C.filterRecords(state.records, {
      query: state.query,
      status: state.status,
      classe: state.classe,
      sort: state.sort,
    });
  }

  function exportCsv() {
    const rows = currentResults();
    if (!rows.length) return;
    const blob = new Blob([C.toCsv(rows, location.origin)], { type: "text/csv;charset=utf-8" });
    const a = h("a", { href: URL.createObjectURL(blob), download: "sign-documents-" + new Date().toISOString().slice(0, 10) + ".csv" });
    shadow.appendChild(a);
    a.click();
    setTimeout(() => {
      URL.revokeObjectURL(a.href);
      a.remove();
    }, 1000);
  }

  // ---------- rendu ----------
  function render() {
    if (!state.open) return;
    tabDocs.classList.toggle("active", state.view === "docs");
    tabPeople.classList.toggle("active", state.view === "people");

    if (state.loading && !state.records.length) {
      countEl.textContent = "";
      body.replaceChildren(h("div", { class: "empty" }, "Chargement des documents…"));
      footerInfo.replaceChildren();
      return;
    }
    if (state.error) {
      countEl.textContent = "";
      body.replaceChildren(
        state.formatError
          ? h(
              "div",
              { class: "empty error" },
              h("strong", {}, "sign.com a modifié le format de ses données : l'extension ne sait plus les lire."),
              h("br"),
              "Il faut mettre à jour l'extension (voir ",
              h("a", { href: ISSUES_URL, target: "_blank", rel: "noopener" }, "le dépôt du projet"),
              ").",
              h("br"),
              h("small", {}, "Détail technique : " + state.error),
              h("br"),
              h("button", { class: "btn", onclick: () => load(true) }, "Réessayer")
            )
          : h("div", { class: "empty error" }, state.error, h("br"), h("button", { class: "btn", onclick: () => load(true) }, "Réessayer"))
      );
      footerInfo.replaceChildren();
      return;
    }

    const results = currentResults();
    countEl.textContent = results.length + " / " + state.records.length + " documents";
    if (state.view === "people") renderPeople(results);
    else renderDocs(results);

    const loadingDetails = [...state.details.values()].filter((v) => v === "loading").length;
    // replaceChildren (DOM) afficherait « null » en texte : on filtre les absents.
    footerInfo.replaceChildren(
      ...[
      h(
        "span",
        {},
        state.loadedAt ? "Liste chargée à " + state.loadedAt.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }) : "",
        loadingDetails ? " · vérification des signatures… (" + loadingDetails + ")" : ""
      ),
      state.detailFormatError
        ? h(
            "span",
            { class: "warn", title: state.detailFormatError },
            "⚠ sign.com a modifié le format du détail des signatures : les icônes ✓ / ⏳ ne peuvent plus s'afficher. Mettez à jour l'extension."
          )
        : null,
      h("span", { class: "spacer" }),
      state.view === "docs" && results.length
        ? h(
            "button",
            {
              class: "btn small",
              title: "Récupère l'état de chaque signataire pour les documents affichés",
              onclick: () => loadDetails(results.slice(0, 300)),
            },
            "Vérifier qui a signé (résultats affichés)"
          )
        : null,
      ].filter(Boolean)
    );
  }

  function statusIcon(st) {
    if (!st) return null;
    if (st.done) return h("span", { class: "ico ok", title: st.label + (st.date ? " le " + C.formatDate(st.date) : "") }, "✓");
    if (st.status === "pending") return h("span", { class: "ico wait", title: "N'a pas encore signé" }, "⏳");
    return h("span", { class: "ico ko", title: st.label }, "✕");
  }

  function renderDocs(results) {
    if (!results.length) {
      body.replaceChildren(h("div", { class: "empty" }, "Aucun document ne correspond."));
      return;
    }
    const tokens = C.tokenize(state.query);
    const senders = new Set(state.senders.map(C.normalize));
    const list = h("ul", { class: "docs" });
    const account = C.guessAccountEmail(state.records, state.details);

    for (const r of results.slice(0, state.limit)) {
      const hit = C.matchingSignees(r, tokens);
      const detail = state.details.get(r.id);
      const stMap = detail instanceof Map ? detail : null;
      const missing = stMap ? r.signees.filter((s) => { const d = stMap.get(C.normalize(s.email)); return d && d.status === "pending"; }).length : 0;

      const chips = r.signees.map((s) => {
        const st = stMap ? stMap.get(C.normalize(s.email)) : null;
        const waiting = st && st.status === "pending";
        // Document « À signer » (Sign document) : le compte connecté, qui doit signer, est surligné en orange.
        const toSign = waiting && r.status === "to_sign" && !!account && C.normalize(s.email) === account;
        const cls = ["chip", hit.has(s.id) ? "hit" : "", senders.has(C.normalize(s.email)) ? "me" : "", toSign ? "to-sign" : waiting ? "pending" : ""]
          .filter(Boolean)
          .join(" ");
        return h(
          "li",
          { class: cls, title: toSign ? s.email + " — signature attendue" : s.email },
          statusIcon(st),
          h("span", { class: "who" }, s.name || s.email || "?"),
          s.name && s.email ? h("span", { class: "mail" }, s.email) : null
        );
      });

      list.appendChild(
        h(
          "li",
          { class: "doc" },
          h(
            "div",
            { class: "line1" },
            r.url ? h("a", { class: "name", href: r.url, target: "_blank", rel: "noopener", title: "Ouvrir le document dans un nouvel onglet" }, r.name) : h("span", { class: "name" }, r.name),
            r.classe ? h("span", { class: "badge classe" }, r.classe) : null,
            h("span", { class: "badge st-" + r.status }, r.statusLabel),
            missing ? h("span", { class: "badge missing" }, missing + " signature" + (missing > 1 ? "s" : "") + " manquante" + (missing > 1 ? "s" : "")) : null,
            detail === "loading" ? h("span", { class: "muted" }, "…") : null,
            h("span", { class: "spacer" }),
            h("span", { class: "date", title: "Créé le " + C.formatDate(r.createdAt) }, C.formatDate(r.updatedAt))
          ),
          h("ul", { class: "chips" }, chips)
        )
      );
    }

    const nodes = [list];
    if (results.length > state.limit) {
      nodes.push(
        h(
          "button",
          { class: "btn more", onclick: () => { state.limit += PAGE_SIZE; render(); } },
          "Afficher plus (" + (results.length - state.limit) + " restants)"
        )
      );
    }
    body.replaceChildren(...nodes);
  }

  function renderPeople(results) {
    const list = C.people(results, state.senders);
    if (!list.length) {
      body.replaceChildren(h("div", { class: "empty" }, "Aucune personne trouvée."));
      return;
    }
    const table = h(
      "table",
      { class: "people" },
      h("thead", {}, h("tr", {}, h("th", {}, "Nom"), h("th", {}, "Email"), h("th", {}, "Classes"), h("th", { class: "num" }, "Docs"), h("th", { class: "num" }, "En attente"))),
      h(
        "tbody",
        {},
        list.map((p) =>
          h(
            "tr",
            {
              title: "Voir les documents de cette personne",
              onclick: () => {
                searchInput.value = p.email || p.name;
                state.query = searchInput.value;
                state.view = "docs";
                state.limit = PAGE_SIZE;
                render();
              },
            },
            h("td", {}, p.name || "—"),
            h("td", { class: "mail" }, p.email),
            h("td", {}, p.classes.join(", ")),
            h("td", { class: "num" }, p.count),
            h("td", { class: "num" }, p.pending || "")
          )
        )
      )
    );
    body.replaceChildren(table);
  }
})();
