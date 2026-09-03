// Flashcards. Expects window.Italiano from js/site.js (which needs data/sessions.js).
// Deck is a queue of word indexes. "Got it" removes the front card; "Again" moves it to the back.
(function () {
  var I = window.Italiano;
  if (!I) return;
  function $(id) { return document.getElementById(id); }
  var sel = $("session"), side = $("side"), word = $("word"), detail = $("detail"), card = $("card"),
      progress = $("progress"), againBtn = $("again"), flipBtn = $("flip"), gotBtn = $("gotit");

  function store(k, v) { try { localStorage.setItem("italiano." + k, v); } catch (e) {} }
  function load(k) { try { return localStorage.getItem("italiano." + k); } catch (e) { return null; } }

  // Session picker: "All sessions" plus every session that has words.
  var withWords = I.sessions.filter(function (s) { return s.words && s.words.length; });
  sel.innerHTML = '<option value="all">All sessions</option>' + withWords.map(function (s) {
    return '<option value="' + I.esc(s.id) + '">' + I.esc(s.example ? "Example: " + s.title : I.label(s)) + "</option>";
  }).join("");
  var wanted = new URLSearchParams(location.search).get("session") || load("session") || "all";
  if (wanted === "all" || withWords.some(function (s) { return s.id === wanted; })) sel.value = wanted;

  var dir = load("dir") === "en" ? "en" : "it";
  document.querySelector('input[name="dir"][value="' + dir + '"]').checked = true;

  var words = [], deck = [], total = 0, flipped = false;

  function build() {
    var id = sel.value;
    store("session", id);
    if (id === "all") {
      words = I.real.reduce(function (acc, s) { return acc.concat(s.words || []); }, []);
    } else {
      var s = I.sessions.filter(function (x) { return x.id === id; })[0];
      words = s && s.words ? s.words.slice() : [];
    }
    deck = words.map(function (_, i) { return i; });
    total = deck.length;
    flipped = false;
    render();
  }

  function shuffle() {
    for (var i = deck.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = deck[i]; deck[i] = deck[j]; deck[j] = t;
    }
    flipped = false;
    render();
  }

  function current() { return words[deck[0]]; }

  function details(w) {
    var parts = [];
    var gp = [w.gender ? w.gender + "." : "", w.plural ? "pl. " + w.plural : ""].filter(Boolean).join(", ");
    if (gp) parts.push(I.esc(gp));
    if (w.say) parts.push(I.esc(w.say));
    if (w.example) parts.push('<i lang="it">' + I.esc(w.example) + "</i>" + (w.exampleEn ? '<br><span class="en">' + I.esc(w.exampleEn) + "</span>" : ""));
    if (w.note) parts.push(I.esc(w.note));
    return parts.join("<br>");
  }

  function render() {
    var w = current();
    againBtn.disabled = flipBtn.disabled = gotBtn.disabled = !w;
    if (!w) {
      side.textContent = "";
      word.removeAttribute("lang");
      word.classList.remove("unsure");
      word.textContent = total ? "Finished!" : "No cards";
      detail.innerHTML = total ? "You went through all " + total + " cards. Press Restart to go again." : "Pick a session that has vocabulary.";
      detail.hidden = false;
      progress.textContent = total ? "0 of " + total + " left" : "";
      card.setAttribute("aria-label", "Deck finished");
      return;
    }
    var showIt = (dir === "it") !== flipped;
    side.textContent = showIt ? "Italian" : "English";
    word.textContent = showIt ? w.it : w.en;
    if (showIt) word.setAttribute("lang", "it"); else word.removeAttribute("lang");
    word.classList.toggle("unsure", !!w.unsure && showIt);
    if (flipped) {
      detail.innerHTML = details(w);
      detail.hidden = !detail.innerHTML;
    } else {
      detail.innerHTML = "";
      detail.hidden = true;
    }
    progress.textContent = deck.length + " of " + total + " left";
    card.setAttribute("aria-label", (flipped ? "Back of card." : "Front of card.") + " Press Enter or Space to flip.");
  }

  function flip() { if (current()) { flipped = !flipped; render(); } }
  function again() { if (current()) { deck.push(deck.shift()); flipped = false; render(); } }
  function gotIt() { if (current()) { deck.shift(); flipped = false; render(); } }

  card.addEventListener("click", flip);
  card.addEventListener("keydown", function (e) {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
  });
  flipBtn.addEventListener("click", flip);
  againBtn.addEventListener("click", again);
  gotBtn.addEventListener("click", gotIt);
  $("shuffle").addEventListener("click", shuffle);
  $("restart").addEventListener("click", build);
  sel.addEventListener("change", build);
  Array.prototype.forEach.call(document.querySelectorAll('input[name="dir"]'), function (r) {
    r.addEventListener("change", function () { dir = r.value; store("dir", dir); flipped = false; render(); });
  });
  document.addEventListener("keydown", function (e) {
    var tag = e.target.tagName;
    if (tag === "SELECT" || tag === "INPUT" || tag === "TEXTAREA") return;
    if (e.key === "ArrowLeft") { e.preventDefault(); again(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); gotIt(); }
    else if ((e.key === " " || e.key === "Enter") && tag !== "BUTTON" && e.target !== card) { e.preventDefault(); flip(); }
  });

  build();
})();
