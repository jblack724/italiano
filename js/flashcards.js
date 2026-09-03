// Flashcards. Three modes over one deck: Cards, Write, Match.
// Expects window.Italiano from js/site.js, which needs data/sessions.js.
(function () {
  var I = window.Italiano;
  if (!I) return;

  function $(id) { return document.getElementById(id); }
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function save(k, v) { try { localStorage.setItem("italiano." + k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem("italiano." + k); } catch (e) { return null; } }
  // Array.prototype.slice does not work on a Set (no length), so build the array explicitly.
  function saveSet(k, set) {
    var out = [];
    set.forEach(function (v) { out.push(v); });
    save(k, JSON.stringify(out));
  }
  function loadSet(k) {
    try { return new Set(JSON.parse(load(k) || "[]")); } catch (e) { return new Set(); }
  }

  var starred = loadSet("starred");
  var known = loadSet("known");

  // ---------- deck building ----------

  var withWords = I.sessions.filter(function (s) { return s.words && s.words.length; });
  var realSets = withWords.filter(function (s) { return !s.example; });

  function itemsOf(session) {
    return session.words.map(function (w) {
      return { w: w, key: session.id + "|" + w.it, group: w.group || "Other", set: session };
    });
  }

  function buildSetPicker() {
    var groups = I.collections.map(function (c) { return c.id; });
    realSets.forEach(function (s) { var c = I.collectionOf(s); if (groups.indexOf(c) < 0) groups.push(c); });
    var html = '<option value="all">Everything</option>';
    groups.forEach(function (cid) {
      var items = realSets.filter(function (s) { return I.collectionOf(s) === cid; });
      if (!items.length) return;
      html += '<optgroup label="' + I.esc(I.collectionTitle(cid)) + '">';
      items.forEach(function (s) { html += '<option value="' + I.esc(s.id) + '">' + I.esc(I.label(s)) + "</option>"; });
      html += "</optgroup>";
    });
    $("set").innerHTML = html;
  }

  function setItems() {
    var id = $("set").value;
    if (id === "all") return realSets.reduce(function (a, s) { return a.concat(itemsOf(s)); }, []);
    var s = I.sessions.filter(function (x) { return x.id === id; })[0];
    return s ? itemsOf(s) : [];
  }

  function buildGroupPicker() {
    var items = setItems();
    var names = [], counts = {};
    items.forEach(function (it) {
      if (names.indexOf(it.group) < 0) names.push(it.group);
      counts[it.group] = (counts[it.group] || 0) + 1;
    });
    var html = '<option value="all">All sections (' + items.length + ")</option>";
    names.forEach(function (n) {
      html += '<option value="' + I.esc(n) + '">' + I.esc(n) + " (" + counts[n] + ")</option>";
    });
    var keep = $("group").value;
    $("group").innerHTML = html;
    $("group").value = names.indexOf(keep) > -1 ? keep : "all";
  }

  // Every item in the current set / section / starred filter.
  function pool() {
    var g = $("group").value;
    var items = setItems().filter(function (it) { return g === "all" || it.group === g; });
    if ($("starred").checked) items = items.filter(function (it) { return starred.has(it.key); });
    return items;
  }

  var dir = load("dir") === "en" ? "en" : "it";
  function frontIsItalian() { return dir === "it"; }

  function termOf(item, italian) { return italian ? item.w.it : item.w.en; }

  function detailHTML(w) {
    var parts = [];
    var gp = [w.gender ? w.gender + "." : "", w.plural ? "pl. " + w.plural : ""].filter(Boolean).join(", ");
    if (gp) parts.push(I.esc(gp));
    if (w.say) parts.push(I.esc(w.say));
    if (w.example) parts.push('<i lang="it">' + I.esc(w.example) + "</i>" + (w.exampleEn ? "<br>" + I.esc(w.exampleEn) : ""));
    if (w.note) parts.push(I.esc(w.note));
    return parts.join("<br>");
  }

  function speak(text) {
    if (!window.speechSynthesis) return;
    var clean = String(text).replace(/\([^)]*\)/g, " ").replace(/[…]/g, " ").trim();
    if (!clean) return;
    var u = new SpeechSynthesisUtterance(clean);
    u.lang = "it-IT";
    u.rate = 0.9;
    var v = (window.speechSynthesis.getVoices() || []).filter(function (x) { return /^it/i.test(x.lang); })[0];
    if (v) u.voice = v;
    try { window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); } catch (e) {}
  }

  // ---------- Cards ----------

  var queue = [], missed = [], roundTotal = 0, current = null, flipped = false, busy = false, history = [];

  function poolKeys() { var s = new Set(); pool().forEach(function (i) { s.add(i.key); }); return s; }

  function knownInPool() {
    var n = 0;
    pool().forEach(function (i) { if (known.has(i.key)) n++; });
    return n;
  }

  function startRound(items) {
    queue = items.slice();
    missed = [];
    roundTotal = queue.length;
    history = [];
    current = null;
    flipped = false;
    $("round-done").hidden = true;
    nextCard(true);
    renderCounts();
  }

  function buildCards() {
    var all = pool();
    var todo = all.filter(function (i) { return !known.has(i.key); });
    $("empty").hidden = all.length > 0;
    if (!all.length) { showPanels(false); return; }
    showPanels(true);
    if (!todo.length) { queue = []; roundTotal = 0; current = null; renderCounts(); finishRound(true); return; }
    startRound(todo);
  }

  function showPanels(on) {
    ["panel-cards", "panel-write", "panel-match"].forEach(function (id) {
      var el = $(id);
      if (!on) el.hidden = true;
      else el.hidden = el.id !== "panel-" + mode;
    });
  }

  function nextCard(first) {
    current = queue.length ? queue[0] : null;
    if (!current) { finishRound(false); return; }
    if (!first) renderCard();
    else renderCard();
  }

  function renderCard() {
    if (!current) return;
    var italianFront = frontIsItalian();
    $("front-label").textContent = italianFront ? "Italian" : "English";
    $("back-label").textContent = italianFront ? "English" : "Italian";
    var f = termOf(current, italianFront), b = termOf(current, !italianFront);
    $("front-term").textContent = f;
    $("back-term").textContent = b;
    $("front-term").classList.toggle("long", f.length > 22);
    $("back-term").classList.toggle("long", b.length > 22);
    if (italianFront) { $("front-term").setAttribute("lang", "it"); $("back-term").removeAttribute("lang"); }
    else { $("back-term").setAttribute("lang", "it"); $("front-term").removeAttribute("lang"); }
    $("front-term").classList.toggle("unsure", !!current.w.unsure && italianFront);
    $("back-term").classList.toggle("unsure", !!current.w.unsure && !italianFront);
    $("back-detail").innerHTML = detailHTML(current.w);
    $("star").setAttribute("aria-pressed", starred.has(current.key) ? "true" : "false");
    $("card-live").textContent = f;
    renderCounts();
  }

  function renderCounts() {
    var total = pool().length;
    var k = knownInPool();
    $("n-learning").textContent = missed.length;
    $("n-known").textContent = k;
    $("n-left").textContent = queue.length ? queue.length + " left this round" : "";
    var done = roundTotal ? (roundTotal - queue.length) / roundTotal : (total ? 1 : 0);
    $("bar-fill").style.width = Math.round(done * 100) + "%";
  }

  function resetFlip() {
    $("card").classList.add("no-anim");
    $("card").classList.remove("flipped");
    void $("card").offsetWidth;
    $("card").classList.remove("no-anim");
    flipped = false;
  }

  function advance(side, mutate) {
    if (busy || !current) return;
    busy = true;
    var card = $("card");
    card.classList.remove("in-left", "in-right");
    card.classList.add(side === "left" ? "out-left" : "out-right");
    setTimeout(function () {
      mutate();
      resetFlip();
      card.classList.remove("out-left", "out-right");
      if (queue.length) {
        nextCard();
        card.classList.add(side === "left" ? "in-left" : "in-right");
        setTimeout(function () { card.classList.remove("in-left", "in-right"); }, reduced ? 1 : 400);
      } else {
        finishRound(false);
      }
      busy = false;
    }, reduced ? 1 : 240);
  }

  function markLearning() {
    advance("left", function () {
      var it = queue.shift();
      history.push({ item: it, was: "learning" });
      missed.push(it);
      known.delete(it.key);
      saveSet("known", known);
    });
  }

  function markKnown() {
    advance("right", function () {
      var it = queue.shift();
      history.push({ item: it, was: "known" });
      known.add(it.key);
      saveSet("known", known);
    });
  }

  function goBack() {
    if (busy || !history.length) return;
    var last = history.pop();
    if (last.was === "learning") missed = missed.filter(function (x) { return x !== last.item; });
    else { known.delete(last.item.key); saveSet("known", known); }
    queue.unshift(last.item);
    resetFlip();
    nextCard();
    var card = $("card");
    card.classList.add("in-left");
    setTimeout(function () { card.classList.remove("in-left"); }, reduced ? 1 : 400);
  }

  function finishRound(allKnown) {
    current = null;
    $("bar-fill").style.width = "100%";
    renderCounts();
    var box = $("round-done");
    if (allKnown || !missed.length) {
      $("done-title").textContent = "All done";
      $("done-text").textContent = "You know every card in this section.";
      $("next-round").hidden = true;
    } else {
      $("done-title").textContent = "Round finished";
      $("done-text").textContent = missed.length + " card" + (missed.length === 1 ? "" : "s") + " to go over again.";
      $("next-round").hidden = false;
    }
    box.hidden = false;
    $("card").hidden = true;
    $("star").hidden = true;
    document.querySelector("#panel-cards .actions").hidden = true;
    $("card-hint").hidden = true;
  }

  function reopenCards() {
    $("round-done").hidden = true;
    $("card").hidden = false;
    $("star").hidden = false;
    document.querySelector("#panel-cards .actions").hidden = false;
    $("card-hint").hidden = false;
  }

  $("card").addEventListener("click", function () {
    if (busy) return;
    flipped = !flipped;
    $("card").classList.toggle("flipped", flipped);
    $("card-live").textContent = flipped ? termOf(current, !frontIsItalian()) : termOf(current, frontIsItalian());
  });
  $("flip").addEventListener("click", function () { $("card").click(); });
  $("again").addEventListener("click", markLearning);
  $("know").addEventListener("click", markKnown);
  $("prev").addEventListener("click", goBack);
  $("speak").addEventListener("click", function () { if (current) speak(current.w.it); });
  $("shuffle").addEventListener("click", function () { shuffle(queue); resetFlip(); nextCard(); });
  $("restart").addEventListener("click", function () { reopenCards(); buildCards(); });
  $("next-round").addEventListener("click", function () { reopenCards(); startRound(missed); });
  $("restart-all").addEventListener("click", function () {
    pool().forEach(function (i) { known.delete(i.key); });
    saveSet("known", known);
    reopenCards();
    buildCards();
  });
  $("star").addEventListener("click", function () {
    if (!current) return;
    if (starred.has(current.key)) starred.delete(current.key); else starred.add(current.key);
    saveSet("starred", starred);
    $("star").setAttribute("aria-pressed", starred.has(current.key) ? "true" : "false");
  });

  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i];
      a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // ---------- Write ----------

  var wQueue = [], wCurrent = null, wRight = 0, wWrong = 0, wTotal = 0, wChecked = false;

  function normalize(s) {
    return String(s)
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/\([^)]*\)/g, " ")
      .replace(/[.,!?;:"'’“”…]/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .replace(/^(the|a|an|il|lo|la|l|i|gli|le|un|una|uno)\s+/, "");
  }

  // Variants of one entry's answer. English glosses list alternatives with commas
  // ("hi, bye"), so those split. Italian phrases use commas as punctuation
  // ("bene, grazie, e tu?"), so only " / " splits there.
  function variants(item, wantItalian) {
    var target = wantItalian ? item.w.it : item.w.en;
    var out = [normalize(target)];
    String(target).split(wantItalian ? /\s\/\s/ : /[,/]| or /).forEach(function (p) {
      var n = normalize(p);
      if (n && out.indexOf(n) < 0) out.push(n);
    });
    return out.filter(Boolean);
  }

  // Several entries can share one prompt: "very well" is both benissimo and molto
  // bene. Any of their answers counts.
  function accepted(item, wantItalian) {
    var promptText = normalize(wantItalian ? item.w.en : item.w.it);
    var out = [];
    pool().forEach(function (other) {
      if (normalize(wantItalian ? other.w.en : other.w.it) !== promptText) return;
      variants(other, wantItalian).forEach(function (v) { if (out.indexOf(v) < 0) out.push(v); });
    });
    return out.length ? out : variants(item, wantItalian);
  }

  function buildWrite() {
    var all = pool();
    $("empty").hidden = all.length > 0;
    if (!all.length) { showPanels(false); return; }
    showPanels(true);
    wQueue = shuffle(all.slice());
    wTotal = wQueue.length;
    wRight = 0; wWrong = 0;
    $("w-done").hidden = true;
    $("w-prompt").hidden = false;
    document.querySelector("#panel-write .answer-row").hidden = false;
    nextWrite();
  }

  function nextWrite() {
    wChecked = false;
    $("w-input").value = "";
    $("w-input").className = "";
    $("w-verdict").textContent = "";
    $("w-verdict").className = "verdict";
    $("w-submit").textContent = "Check";
    wCurrent = wQueue.length ? wQueue[0] : null;
    if (!wCurrent) { finishWrite(); return; }
    var promptItalian = frontIsItalian();
    $("w-label").textContent = promptItalian ? "Italian → English" : "English → Italian";
    $("w-term").textContent = termOf(wCurrent, promptItalian);
    if (promptItalian) $("w-term").setAttribute("lang", "it"); else $("w-term").removeAttribute("lang");
    $("w-term").classList.toggle("long", termOf(wCurrent, promptItalian).length > 22);
    $("w-input").placeholder = promptItalian ? "Type the English" : "Type the Italian";
    renderWriteCounts();
    $("w-input").focus();
  }

  function renderWriteCounts() {
    $("w-right").textContent = wRight;
    $("w-wrong").textContent = wWrong;
    $("w-left").textContent = wQueue.length ? wQueue.length + " left" : "";
    $("w-bar-fill").style.width = wTotal ? Math.round(((wTotal - wQueue.length) / wTotal) * 100) + "%" : "0%";
  }

  function checkWrite() {
    if (!wCurrent) return;
    if (wChecked) { wQueue.shift(); nextWrite(); return; }
    var wantItalian = !frontIsItalian();
    var ok = accepted(wCurrent, wantItalian).indexOf(normalize($("w-input").value)) > -1;
    wChecked = true;
    $("w-submit").textContent = "Next";
    var right = wantItalian ? wCurrent.w.it : wCurrent.w.en;
    if (ok) {
      wRight++;
      known.add(wCurrent.key); saveSet("known", known);
      $("w-input").className = "right";
      $("w-verdict").className = "verdict right";
      $("w-verdict").textContent = "Correct.";
      if (wantItalian) speak(wCurrent.w.it);
    } else {
      wWrong++;
      known.delete(wCurrent.key); saveSet("known", known);
      $("w-input").className = "wrong";
      $("w-verdict").className = "verdict wrong";
      $("w-verdict").innerHTML = "Not quite. <span class=\"fix\">" +
        (wantItalian ? '<i lang="it">' + I.esc(right) + "</i>" : I.esc(right)) + "</span>";
      $("w-prompt").classList.add("shake");
      setTimeout(function () { $("w-prompt").classList.remove("shake"); }, 460);
      wQueue.push(wCurrent);
    }
    renderWriteCounts();
  }

  function finishWrite() {
    $("w-prompt").hidden = true;
    document.querySelector("#panel-write .answer-row").hidden = true;
    $("w-done-text").textContent = wRight + " of " + wTotal + " right on the first try.";
    $("w-done").hidden = false;
    $("w-bar-fill").style.width = "100%";
  }

  $("w-submit").addEventListener("click", checkWrite);
  $("w-input").addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); checkWrite(); }
  });
  $("w-skip").addEventListener("click", function () {
    if (!wCurrent || wChecked) return;
    $("w-input").value = "";
    checkWrite();
  });
  $("w-restart").addEventListener("click", buildWrite);
  $("w-again").addEventListener("click", buildWrite);

  // ---------- Match ----------

  var mPairs = [], mPicked = null, mStart = 0, mTimer = null, mLeft = 0, mValid = {};

  function buildMatch() {
    var all = pool();
    $("empty").hidden = all.length > 0;
    if (!all.length) { showPanels(false); return; }
    showPanels(true);
    clearInterval(mTimer);
    $("m-done").hidden = true;
    $("m-grid").hidden = false;
    // Pick pairs whose Italian and English are both unique, so no two tiles read alike.
    mPairs = [];
    var seenIt = {}, seenEn = {};
    shuffle(all.slice()).forEach(function (it) {
      if (mPairs.length >= 6) return;
      var a = it.w.it.toLowerCase(), b = it.w.en.toLowerCase();
      if (seenIt[a] || seenEn[b]) return;
      seenIt[a] = seenEn[b] = 1;
      mPairs.push(it);
    });
    mLeft = mPairs.length;
    mPicked = null;
    mValid = {};
    var tiles = [];
    mPairs.forEach(function (it) {
      mValid[it.w.it + "||" + it.w.en] = 1;
      tiles.push({ side: "it", text: it.w.it });
      tiles.push({ side: "en", text: it.w.en });
    });
    shuffle(tiles);
    $("m-grid").innerHTML = tiles.map(function (t, n) {
      return '<button type="button" class="tile" data-side="' + t.side + '" data-text="' + I.esc(t.text) +
        '" aria-pressed="false" style="animation-delay:' + (n * 25) + 'ms">' +
        (t.side === "it" ? '<b lang="it">' + I.esc(t.text) + "</b>" : I.esc(t.text)) + "</button>";
    }).join("");
    var best = load("match.best." + $("set").value + "." + $("group").value);
    $("m-best").textContent = best ? "Best: " + best + "s" : "";
    mStart = 0;
    $("m-timer").textContent = "0.0s";
  }

  function startTimer() {
    if (mStart) return;
    mStart = Date.now();
    mTimer = setInterval(function () {
      $("m-timer").textContent = ((Date.now() - mStart) / 1000).toFixed(1) + "s";
    }, 100);
  }

  $("m-grid").addEventListener("click", function (e) {
    var tile = e.target.closest(".tile");
    if (!tile || tile.classList.contains("gone")) return;
    startTimer();
    if (tile === mPicked) { tile.setAttribute("aria-pressed", "false"); mPicked = null; return; }
    if (!mPicked) { mPicked = tile; tile.setAttribute("aria-pressed", "true"); return; }
    // Two tiles from the same column: just move the selection.
    if (mPicked.dataset.side === tile.dataset.side) {
      mPicked.setAttribute("aria-pressed", "false");
      mPicked = tile;
      tile.setAttribute("aria-pressed", "true");
      return;
    }
    var a = mPicked, b = tile;
    var itText = a.dataset.side === "it" ? a.dataset.text : b.dataset.text;
    var enText = a.dataset.side === "en" ? a.dataset.text : b.dataset.text;
    if (mValid[itText + "||" + enText]) {
      [a, b].forEach(function (t) { t.setAttribute("aria-pressed", "false"); t.classList.add("gone"); });
      mPicked = null;
      mLeft--;
      $("m-live").textContent = "Matched. " + mLeft + " left.";
      if (!mLeft) finishMatch();
    } else {
      b.classList.add("wrong");
      a.setAttribute("aria-pressed", "false");
      setTimeout(function () { b.classList.remove("wrong"); }, 400);
      mPicked = null;
    }
  });

  function finishMatch() {
    clearInterval(mTimer);
    var secs = ((Date.now() - mStart) / 1000).toFixed(1);
    var key = "match.best." + $("set").value + "." + $("group").value;
    var best = load(key);
    if (!best || parseFloat(secs) < parseFloat(best)) { save(key, secs); best = secs; }
    $("m-done-text").textContent = secs + "s. Best: " + best + "s.";
    $("m-grid").hidden = true;
    $("m-done").hidden = false;
  }

  $("m-restart").addEventListener("click", buildMatch);
  $("m-again").addEventListener("click", buildMatch);

  // ---------- modes and wiring ----------

  var mode = load("mode") || "cards";
  if (["cards", "write", "match"].indexOf(mode) < 0) mode = "cards";

  function setMode(next) {
    mode = next;
    save("mode", mode);
    Array.prototype.forEach.call(document.querySelectorAll(".modes button"), function (b) {
      b.setAttribute("aria-selected", b.dataset.mode === mode ? "true" : "false");
    });
    clearInterval(mTimer);
    rebuild();
  }

  Array.prototype.forEach.call(document.querySelectorAll(".modes button"), function (b) {
    b.addEventListener("click", function () { setMode(b.dataset.mode); });
  });

  function rebuild() {
    if (mode === "cards") { reopenCards(); buildCards(); }
    else if (mode === "write") buildWrite();
    else buildMatch();
  }

  $("set").addEventListener("change", function () {
    save("set", $("set").value);
    buildGroupPicker();
    save("group", $("group").value);
    rebuild();
  });
  $("group").addEventListener("change", function () { save("group", $("group").value); rebuild(); });
  $("starred").addEventListener("change", function () {
    save("starredOnly", $("starred").checked ? "1" : "0");
    rebuild();
  });
  Array.prototype.forEach.call(document.querySelectorAll('input[name="dir"]'), function (r) {
    r.addEventListener("change", function () {
      dir = r.value; save("dir", dir);
      if (mode === "cards") { resetFlip(); renderCard(); } else rebuild();
    });
  });

  document.addEventListener("keydown", function (e) {
    var tag = e.target.tagName;
    if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
    if (mode !== "cards" || !current) return;
    if (e.key === "ArrowLeft") { e.preventDefault(); markLearning(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); markKnown(); }
    else if (e.key === " " || e.key === "Enter") {
      if (tag === "BUTTON" && e.target.id !== "card") return;
      e.preventDefault(); $("card").click();
    }
    else if (e.key === "s" || e.key === "S") { e.preventDefault(); $("star").click(); }
    else if (e.key === "l" || e.key === "L") { e.preventDefault(); $("speak").click(); }
  });

  // ---------- start ----------

  buildSetPicker();
  var params = new URLSearchParams(location.search);
  var wantSet = params.get("session") || load("set") || "all";
  if (Array.prototype.some.call($("set").options, function (o) { return o.value === wantSet; })) $("set").value = wantSet;
  buildGroupPicker();
  var wantGroup = params.get("group") || load("group") || "all";
  if (Array.prototype.some.call($("group").options, function (o) { return o.value === wantGroup; })) $("group").value = wantGroup;
  document.querySelector('input[name="dir"][value="' + dir + '"]').checked = true;
  $("starred").checked = load("starredOnly") === "1";
  Array.prototype.forEach.call(document.querySelectorAll(".modes button"), function (b) {
    b.setAttribute("aria-selected", b.dataset.mode === mode ? "true" : "false");
  });
  rebuild();
  if (window.speechSynthesis) window.speechSynthesis.onvoiceschanged = function () {};
})();
