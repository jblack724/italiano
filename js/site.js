// Shared behavior for every page. Expects window.SESSIONS from data/sessions.js, loaded before this file.
// Does four things: builds the table of contents, renders the vocabulary table,
// fills in prev/next session links, and renders the session list on the home page.
(function () {
  var sessions = window.SESSIONS || [];
  var real = sessions.filter(function (s) { return !s.example; });

  function esc(str) {
    return String(str == null ? "" : str).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function fmtDate(iso) {
    var d = new Date(iso + "T12:00:00");
    return isNaN(d) ? iso : d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  }
  function label(s) {
    return (s.week != null ? "Week " + s.week + " · " : "") + fmtDate(s.date) + " · " + s.title;
  }
  function slug(text) {
    return text.trim().toLowerCase().replace(/[^a-z0-9àèéìòù]+/g, "-").replace(/^-|-$/g, "");
  }

  window.Italiano = { sessions: sessions, real: real, esc: esc, fmtDate: fmtDate, label: label };

  // 1. Table of contents, built from the h2 headings in <main>.
  var toc = document.querySelector("[data-toc]");
  if (toc) {
    var heads = Array.prototype.slice.call(document.querySelectorAll("main h2"));
    if (heads.length >= 2) {
      var ol = document.createElement("ol");
      heads.forEach(function (h) {
        if (!h.id) h.id = slug(h.textContent);
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.href = "#" + h.id;
        a.textContent = h.textContent;
        li.appendChild(a);
        ol.appendChild(li);
      });
      toc.appendChild(ol);
      toc.hidden = false;
    }
  }

  // 2. Vocabulary table on a notes page. The page says which session it is via <body data-session="...">.
  var sid = document.body.getAttribute("data-session");
  var current = sessions.filter(function (s) { return s.id === sid; })[0];
  var vocabEl = document.querySelector("[data-vocab]");
  if (vocabEl) {
    if (!current) {
      vocabEl.innerHTML = '<div class="callout check"><p>No session with id "' + esc(sid) + '" in data/sessions.js.</p></div>';
    } else if (!current.words || !current.words.length) {
      vocabEl.innerHTML = "<p>No vocabulary recorded for this session.</p>";
    } else {
      vocabEl.innerHTML = vocabTable(current.words);
    }
  }

  function genderPlural(w) {
    return [w.gender ? w.gender + "." : "", w.plural ? "pl. " + w.plural : ""].filter(Boolean).join(", ");
  }

  function vocabTable(words) {
    var rows = words.map(function (w) {
      var it = '<b lang="it"' + (w.unsure ? ' class="unsure" title="Unclear in the handwriting; please check"' : "") + ">" + esc(w.it) + "</b>";
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

  // 3. Previous / next session links at the bottom of a notes page.
  var pn = document.querySelector("[data-prevnext]");
  if (pn) {
    var i = current ? real.indexOf(current) : -1;
    var prev = i > 0 ? real[i - 1] : null, next = i >= 0 ? real[i + 1] : null;
    if (prev || next) {
      pn.innerHTML =
        (prev ? '<a href="' + esc(prev.id) + '.html" rel="prev">← ' + esc(label(prev)) + "</a>" : "<span></span>") +
        (next ? '<a href="' + esc(next.id) + '.html" rel="next">' + esc(label(next)) + " →</a>" : "<span></span>");
    } else {
      pn.hidden = true;
    }
  }

  // 4. Session list on the home page, grouped by week, oldest first, with a "Latest" link on top.
  var list = document.querySelector("[data-sessions]");
  if (list) {
    if (!real.length) {
      list.innerHTML = "<p>No sessions yet.</p>";
    } else {
      var latest = real[real.length - 1];
      var html = '<p class="latest">Latest: <a href="notes/' + esc(latest.id) + '.html">' + esc(label(latest)) + "</a></p>";
      var byWeek = {}, order = [];
      real.forEach(function (s) {
        var k = s.week == null ? "Other" : "Week " + s.week;
        if (!byWeek[k]) { byWeek[k] = []; order.push(k); }
        byWeek[k].push(s);
      });
      html += order.map(function (k) {
        return "<h2>" + esc(k) + "</h2><ul>" + byWeek[k].map(function (s) {
          return '<li><a href="notes/' + esc(s.id) + '.html">' + esc(fmtDate(s.date)) + " · " + esc(s.title) + "</a>" +
            (s.topics && s.topics.length ? '<span class="topics">' + esc(s.topics.join(" · ")) + "</span>" : "") + "</li>";
        }).join("") + "</ul>";
      }).join("");
      list.innerHTML = html;
    }
    var exEl = document.querySelector("[data-example]");
    var examples = sessions.filter(function (s) { return s.example; });
    if (exEl && examples.length) {
      exEl.innerHTML = examples.map(function (s) {
        return '<a href="notes/' + esc(s.id) + '.html">' + esc(s.title) + "</a>";
      }).join(", ");
    }
  }
})();
