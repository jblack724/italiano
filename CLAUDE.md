# Italiano — class notes

Personal study document for Italian 10 (Beginning Italian I, Harvard, fall 2026; textbook *Parliamo italiano!* 5th ed. with the VHL Supersite). The folder is named `spanish` by mistake; the class is Italian. Justin gives the agent source material (lecture slide decks, photos of handwritten notes, textbook pages) and the agent adds a section to the document plus a vocabulary entry that feeds the flashcards.

**Everything lives on one page.** `index.html` is the whole document: a table of contents, then every set of notes, so it reads top to bottom and prints as one document. There are no per-lecture pages. The only other page is the flashcards app.

Plain static HTML, CSS, and JavaScript. No build step, no dependencies, no frameworks. It opens straight from the file system and is published with GitHub Pages at https://jblack724.github.io/italiano/ (repo `jblack724/italiano`).

## Files

| Path | What it is |
|---|---|
| `index.html` | The document. Contents, then one collection section per collection, each holding its notes. |
| `data/sessions.js` | The collections, plus every set of notes and its vocabulary. Field docs are at the top of the file. |
| `flashcards.html`, `js/flashcards.js` | Flashcard app. Deck picker (everything, a whole collection, or one set of notes), Italian-first or English-first, shuffle, Again / Got it. |
| `js/site.js` | Renders the vocabulary tables, flags empty collections, builds the table of contents. |
| `css/style.css` | All styling, including the print rules. |
| `_reference/components.html` | Style reference. Shows every component in a fake set of notes. Not part of the document. Keep it in sync if a component changes. |

## Structure of the document

```
h1  Italiano                      the document
  nav.toc                         Contents, built automatically from the headings
  section.collection              one per collection
    h2  Lectures                  the collection
      section.note                one set of notes
        h3  Lecture 1 · Present…   "Lecture N · " plus the source's own title
        p.meta                    09/02/26 · Week 1 · English subtitle
        h4  Come stai? (stare)    a topic
          h5                      a part of a topic, when needed
        h4  Vocabulary            always last
```

Collections, in document order:

| Collection | id | Source | Slug for its notes |
|---|---|---|---|
| Lectures | `lectures` | slide decks the instructor posts on Canvas (`.pptx`, sometimes `.pdf`) | class date, `2026-09-02` |
| In class | `in-class` | Justin's handwritten notes, pasted as photos | class date |
| Textbook | `textbook` | textbook units | unit, `unita-p`, `unita-1a` |

Each set of notes has an id of `<collection>/<slug>`. That id is the key in `data/sessions.js` and the value of `data-vocab`. To add a collection: add it to `window.COLLECTIONS` in `data/sessions.js` and add a matching `section.collection` to `index.html`.

**Heading ids must be unique across the whole document.** Use the notes id with the slash turned into a dash as a prefix: `lectures-2026-09-02` for the `h3`, `lectures-2026-09-02-stai` for each `h4`. Do not give `h5` an id.

Empty collections say "Nothing here yet" and are skipped by the print page breaks automatically; just delete that paragraph when adding the first set of notes.

## Adding notes (the main job)

1. Read the whole source before writing anything. Find the date and any week, lecture, or unit number. If something seems to continue in material you were not given, say so in the reply instead of guessing.
2. Add a `section.note` to `index.html`, inside the right `section.collection`, in date order. Copy the skeleton below and use only the components listed after it.
3. Add an entry to `data/sessions.js`, in date order within its collection, with the vocabulary as `words`. Vocabulary goes only there, never as a hand-written table in the HTML. The `topics` field gets two to four short labels.
4. Check it: open `index.html` in a browser (Chrome DevTools MCP works with `file://` URLs). Confirm the contents list picked up the new headings, there are no duplicate ids, and the vocabulary table rendered. Then check the print layout by rendering a PDF:
   ```
   "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu \
     --no-pdf-header-footer --print-to-pdf=<scratchpad>/print.pdf --virtual-time-budget=8000 \
     file:///Users/justinblack/spanish/index.html
   ```
   Read the PDF and look for headings stranded at the bottom of a page or tables broken badly.
5. Commit and push:
   ```
   git add -A && git commit -m "Add <collection> notes for <date or unit>: <title>" && git push
   ```
6. In the reply, list anything flagged `[?]`, anything in a "check" callout, and anything you added that was not literally in the source.

### Skeleton for one set of notes

```html
<section class="note" aria-labelledby="lectures-2026-09-02">
  <h3 id="lectures-2026-09-02">Lecture 1 · Presentazioni e pronuncia</h3>
  <p class="meta">09/02/26 · Week 1 · Introductions and pronunciation</p>

  <h4 id="lectures-2026-09-02-stai">Come stai? (stare)</h4>
  <!-- body: paragraphs, examples lists, tables, callouts -->

  <h4 id="lectures-2026-09-02-vocab">Vocabulary</h4>
  <div data-vocab="lectures/2026-09-02"></div>
  <p class="no-print"><a href="flashcards.html?session=lectures/2026-09-02">Practice this vocabulary as flashcards</a></p>

  <p class="note-end no-print"><a href="#contents">↑ Contents</a></p>
</section>
```

### Lecture slides

"Check my recently downloaded lecture notes" means: look in `~/Downloads` for the newest `.pptx` or `.pdf` whose name looks like a lecture (`1_09.02 Presentazioni e pronuncia.pptx` = lecture 1, September 2, title). Then:

1. Extract the text with python-pptx (installed): iterate slides and shapes, include tables and speaker notes, keep slide order. Save to the scratchpad.
2. Render the deck so you can see the pictures: `soffice --headless --convert-to pdf --outdir <scratchpad> <copy of the pptx>` (LibreOffice is at `/opt/homebrew/bin/soffice`). Then Read the PDF in batches of at most 20 pages. Much of the content is in images (pronunciation examples, colored highlights, photos that explain a word).
3. The `h3` is `Lecture N · ` plus the deck's own Italian title. The number comes from the file name (`1_09.02 …` is lecture 1); also put it in the entry's `lecture` field. The meta line is `MM/DD/YY · Week N · English subtitle`.
4. Administrative slides (contacts, class contract, syllabus, honesty policy, tips) collapse into one short "Course logistics" topic at the top. Skip nothing that says how the course works.
5. **Headings come from the slides, not from you.** Each `h4` reuses the wording of the slide or the agenda item it covers (`Pronunciamo l'italiano!`, `Compiti per domani`, `Che cosa studi? (studiare)`), with a short English gloss in parentheses when the Italian alone is not clear. Put the deck's agenda slide first as `Ordine del giorno`. Each language topic gets its own `h4`, with the slide's example sentences as an examples list and any conjugation as a conj table. If the deck only showed some forms of a verb, table only those and say so in the caption.
6. Activity slides (interview a partner, present a classmate, brainstorm) are recorded as the prompt and the sentence frames, briefly, under an `h5`.
7. Pronunciation slides become a table: spelling, sound, examples. Tongue twisters are an examples list with an English gloss and the sound they practice.
8. The homework slide is always its own `h4` at the end, before Vocabulary.
9. Vocabulary: every word or phrase the deck teaches, including the words used as pronunciation examples (with a `note` naming the sound) and the "parole utili" lists. Nouns get their article and gender.

### Handwritten notes

Photos come pasted in the chat. Transcribe faithfully. Unclear handwriting: best guess, flagged (see rules). One set of notes per class meeting, slug is the date.

### Textbook

Pages or photos of the unit. Slug is the unit (`unita-p`, `unita-1a`). Same rules as handwritten notes, but the source is printed, so nothing should need a `[?]`.

## Transcription rules

- **Faithful, not creative.** Write what is in the source. Do not add grammar the source does not cover and do not pad the vocabulary. A short section that matches the source beats a long one that does not.
- **Small additions are allowed only when they explain the source itself**, such as an English gloss for an Italian sentence, a sound description for a pronunciation slide, or the article and gender of a noun. Say in the reply what you added. Anything bigger goes in a callout that says it is not from the source.
- **Fix spelling and accents silently.** Handwriting often drops accents (`perche` → `perché`, `e` → `è` when it means "is"). Standard Italian spelling is transcription, not a content change. Typos in slides (a wrong email domain, "Ital 15" for "Ital 10") are fixed the same way.
- **Unclear source: best guess, flagged.** In HTML wrap the guess in `<span class="unsure" title="Unclear in the source; please check">…</span>`. In data set `unsure: true` on the word. Both render a `[?]`.
- **Looks wrong? Keep it and flag it.** If the source says something that seems incorrect, keep the source's version and add a `check` callout right after it saying what you think is right. Never silently correct content.
- **Mark Italian with `lang="it"`.** `<i lang="it">Come stai?</i>` for phrases and example sentences, `<b lang="it">io</b>` for a single word or form in a table. Both render bold and upright. Screen readers switch to an Italian voice.
- **English glosses** next to Italian go in `<span class="en">…</span>`.
- The document's `<html lang="en">` stays English, since the explanations are in English.

## Components

Use these and nothing else. Copy the markup exactly.

**Topic heading.** One `h4` per topic, with a prefixed id. `h5` for a part of a topic; no id.
```html
<h4 id="lectures-2026-09-02-stai">Come stai? (stare)</h4>
```

**Paragraph with inline Italian.**
```html
<p>Use <i lang="it">tu</i> with friends and <i lang="it">Lei</i> with strangers.</p>
```

**Example sentences.** Italian first, English gloss after.
```html
<ul class="examples">
  <li><i lang="it">Sono di Chicago.</i> <span class="en">I'm from Chicago.</span></li>
</ul>
```

**Conjugation table.** Pronoun in a row header, form in the cell.
```html
<div class="table-wrap">
  <table class="conj">
    <caption><i lang="it">essere</i> · to be</caption>
    <tbody>
      <tr><th scope="row">io</th><td>sono</td></tr>
      <tr><th scope="row">tu</th><td>sei</td></tr>
    </tbody>
  </table>
</div>
```

**General table.** For anything else tabular (pronouns, endings, pronunciation, question and answer frames).
```html
<div class="table-wrap">
  <table>
    <thead><tr><th scope="col">Italian</th><th scope="col">English</th></tr></thead>
    <tbody>
      <tr><td><b lang="it">io</b></td><td>I</td></tr>
    </tbody>
  </table>
</div>
```

**Tip callout.** For rules of thumb, exceptions, reminders the teacher stressed.
```html
<div class="callout"><p>…</p></div>
```

**Check callout.** For something in the source that may be wrong.
```html
<div class="callout check"><p>The notes have X. The standard form is Y.</p></div>
```

**Unsure flag.**
```html
<span class="unsure" title="Unclear in the source; please check">parola</span>
```

**Vocabulary.** Always the last `h4`. The table is rendered from data; do not write rows here.
```html
<h4 id="lectures-2026-09-02-vocab">Vocabulary</h4>
<div data-vocab="lectures/2026-09-02"></div>
```

Plain `<p>`, `<ul>`, and `<ol>` are fine too. Anything that should not print (a flashcard link, a Contents link) gets `class="no-print"`.

## Design rules

- Light theme only. Black text on white, one green accent, amber for flags. No other colors, no dark mode.
- System font, 18px base size on screen, 74-character line length. Do not change these.
- It has to print well. Contents lands on its own page, each collection and each set of notes starts a new page, table headers repeat across pages, and rows and callouts do not split. If you add a component, add its print rules too.
- No frameworks, libraries, CDNs, icon fonts, or images other than the user's own. No inline styles. If a component is truly missing, add one class to `css/style.css`, use it in `_reference/components.html`, and document it here.
- Links are relative, so everything works from `file://` and from GitHub Pages.

## Do not

- Split the document into separate pages, add a build step, or rename files.
- Create a `section.note` without its `data/sessions.js` entry, or the reverse.
- Put vocabulary in HTML.
- Reuse a heading id.
- Edit `_reference/components.html` except to keep it in sync with a component change.
- Invent content that is not in the source.
