// Shared behavior. Expects window.SESSIONS and window.COLLECTIONS from data/sessions.js,
// loaded before this file.
//
// On the document (index.html) it renders each vocabulary table and then builds the nested
// table of contents from the headings that are on the page. On the flashcards page it just
// exposes window.Italiano for js/flashcards.js.
(function () {
  var sessions = window.SESSIONS || [];
  var collections = window.COLLECTIONS || [];
  var real = sessions.filter(function (s) { return !s.example; });

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  // Dates read as 09/02/26, the way the lecture decks are named.
  function fmtDate(iso) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || "");
    return m ? m[2] + "/" + m[3] + "/" + m[1].slice(2) : iso;
  }
  function collectionOf(s) { return s.id.indexOf("/") > -1 ? s.id.split("/")[0] : ""; }
  function collectionTitle(cid) {
    var c = collections.filter(function (x) { return x.id === cid; })[0];
    return c ? c.title : cid;
  }
  function label(s) {
    return [s.lecture != null ? "Lecture " + s.lecture : null, fmtDate(s.date), s.title]
      .filter(Boolean).join(" · ");
  }

  window.Italiano = {
    sessions: sessions, collections: collections, real: real,
    esc: esc, fmtDate: fmtDate, label: label, collectionOf: collectionOf, collectionTitle: collectionTitle
  };

  // 1. Vocabulary tables. Each one says which set of notes it belongs to:
  //    <div data-vocab="lectures/2026-09-02"></div>
  function genderPlural(w) {
    return [w.gender ? w.gender + "." : "", w.plural ? "pl. " + w.plural : ""].filter(Boolean).join(", ");
  }

  function vocabTable(words) {
    var rows = words.map(function (w) {
      var it = '<b lang="it"' + (w.unsure ? ' class="unsure" title="Unclear in the source; please check"' : "") + ">" + esc(w.it) + "</b>";
      if (w.say) it += "<br><small>" + esc(w.say) + "</small>";
      var notes = [];
      var gp = genderPlural(w);
      if (gp) notes.push(esc(gp));
      if (w.example) notes.push('<i lang="it">' + esc(w.example) + "</i>" + (w.exampleEn ? ' <span class="en">' + esc(w.exampleEn) + "</span>" : ""));
      if (w.note) notes.push(esc(w.note));
      return "<tr><td>" + it + "</td><td>" + esc(w.en) + "</td><td>" + notes.join("<br>") + "</td></tr>";
    });
    return '<div class="table-wrap"><table>' +
      '<thead><tr><th scope="col">Italian</th><th scope="col">English</th><th scope="col">Notes</th></tr></thead>' +
      "<tbody>" + rows.join("") + "</tbody></table></div>";
  }

  Array.prototype.forEach.call(document.querySelectorAll("[data-vocab]"), function (el) {
    var id = el.getAttribute("data-vocab");
    var s = sessions.filter(function (x) { return x.id === id; })[0];
    if (!s) {
      el.innerHTML = '<div class="callout check"><p>No entry with id "' + esc(id) + '" in data/sessions.js.</p></div>';
    } else if (!s.words || !s.words.length) {
      el.innerHTML = '<p class="empty">No vocabulary recorded for these notes.</p>';
    } else {
      el.innerHTML = vocabTable(s.words);
    }
  });

  // 2. Print button. The print stylesheet does the rest.
  var printBtn = document.getElementById("print");
  if (printBtn) printBtn.addEventListener("click", function () { window.print(); });

  // 3. Mark collections that have no notes yet, so print skips their page break.
  Array.prototype.forEach.call(document.querySelectorAll(".collection"), function (el) {
    if (!el.querySelector(".note")) el.setAttribute("data-empty", "");
    else el.removeAttribute("data-empty");
  });

  // 4. Nested table of contents, built from h2 (collection), h3 (a set of notes), h4 (a topic).
  //    Every heading needs an id; the pages set them, and anything missing gets one here.
  var toc = document.querySelector("[data-toc]");
  if (toc) {
    var heads = Array.prototype.slice.call(document.querySelectorAll("main h2, main h3, main h4"));
    var used = {};
    function slug(text) {
      var base = text.trim().toLowerCase().replace(/[^a-z0-9àèéìòù]+/g, "-").replace(/^-|-$/g, "") || "section";
      var id = base, n = 2;
      while (used[id] || (id !== base && document.getElementById(id))) { id = base + "-" + n++; }
      used[id] = true;
      return id;
    }
    heads.forEach(function (h) { if (h.id) used[h.id] = true; });

    var rootList = document.createElement("ol");
    var lists = { 2: rootList };
    heads.forEach(function (h) {
      if (!h.id) h.id = slug(h.textContent);
      var level = Number(h.tagName.charAt(1));
      var parent = lists[level];
      if (!parent) {
        // A heading level was skipped; hang it off the nearest open list.
        for (var up = level - 1; up >= 2 && !parent; up--) parent = lists[up];
        if (!parent) parent = rootList;
      }
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      li.appendChild(a);
      parent.appendChild(li);
      var child = document.createElement("ol");
      li.appendChild(child);
      lists[level + 1] = child;
      for (var deeper = level + 2; deeper <= 6; deeper++) delete lists[deeper];
    });

    // Drop the empty child lists left over from headings that had nothing under them.
    Array.prototype.forEach.call(rootList.querySelectorAll("ol"), function (ol) {
      if (!ol.children.length) ol.parentNode.removeChild(ol);
    });

    if (rootList.children.length) {
      toc.appendChild(rootList);
      toc.hidden = false;
    }
  }
})();
