# Italiano — class notes site

Personal study site for a beginner Italian class. The folder is named `spanish` by mistake; the class is Italian. Justin pastes photos of his handwritten class notes into the chat, and the agent turns each class session into one HTML notes page plus a vocabulary entry that feeds the flashcards.

Plain static HTML, CSS, and JavaScript. No build step, no dependencies, no frameworks. Pages open straight from the file system and are published with GitHub Pages.

## Files

| Path | What it is |
|---|---|
| `index.html` | Home. Lists every session, grouped by week. Rendered from `data/sessions.js`. |
| `flashcards.html`, `js/flashcards.js` | Flashcard app. Session picker, Italian-first or English-first, shuffle, Again / Got it. |
| `notes/YYYY-MM-DD.html` | One page per class session. |
| `notes/_template.html` | Copy this to start a new session page. |
| `notes/example.html` | Style reference. Shows every component. Keep it in sync if a component changes. |
| `data/sessions.js` | The single list of sessions and their vocabulary. Feeds the home page, the vocab table on each notes page, prev/next links, and the flashcards. Field docs are at the top of the file. |
| `css/style.css`, `js/site.js` | Shared. Rarely need changes. |

## Converting a set of notes (the main job)

1. Read every image completely before writing anything. Find the date and any week or chapter number written on the page. If a page looks like it continues on a photo you were not given, say so in the reply instead of guessing.
2. Copy `notes/_template.html` to `notes/<date>.html`, date as `YYYY-MM-DD`. That date is the session `id` everywhere. Replace every `YYYY-MM-DD`, `TITLE`, and `Week N` placeholder in the file.
3. Write the sections using only the components below. Keep the user's order, groupings, examples, and wording. Headings are short and specific: "Essere, present tense", not "Grammar".
4. Add a session entry to `data/sessions.js`, in date order, with the vocabulary as `words`. Vocabulary goes only there, never as a hand-written table in the HTML. The `topics` field gets two to four short labels.
5. Check the page: open it in a browser, or at least confirm the HTML is well formed, the session id matches in all four places (file name, `data-session`, two flashcard links), and the data entry exists.
6. Commit and push:
   ```
   git add -A && git commit -m "Add notes for <date>: <title>" && git push
   ```
7. In the reply, list anything flagged `[?]` and anything you put in a "check" callout, so Justin can verify against his notebook.

## Transcription rules

- **Faithful, not creative.** Write what is in the notes. Do not add grammar the notes do not cover and do not pad the vocabulary. A short page that matches the notes beats a long one that does not.
- **Fix spelling and accents silently.** Handwriting often drops accents (`perche` → `perché`, `e` → `è` when it means "is"). Standard Italian spelling is transcription, not a content change.
- **Unclear handwriting: best guess, flagged.** In HTML wrap the guess in `<span class="unsure" title="Unclear in the handwriting; please check">…</span>`. In data set `unsure: true` on the word. Both render a `[?]`.
- **Looks wrong? Keep it and flag it.** If the notes say something that seems incorrect, keep the user's version and add a `check` callout right after it saying what you think is right. Never silently correct content.
- **Mark Italian with `lang="it"`.** `<i lang="it">Come stai?</i>` for phrases and example sentences, `<b lang="it">io</b>` for a single word or form in a table. Both render bold and upright. Screen readers switch to an Italian voice.
- **English glosses** next to Italian go in `<span class="en">…</span>`.
- The page's `<html lang="en">` stays English, since the explanations are in English.

## Components

Use these and nothing else. Copy the markup exactly.

**Section heading.** One `<h2>` per topic, with an id. The table of contents is built from them automatically.
```html
<h2 id="essere">Essere (to be), present tense</h2>
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

**General table.** For anything else tabular (pronouns, endings, question words).
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

**Check callout.** For something in the notes that may be wrong.
```html
<div class="callout check"><p>The notes have X. The standard form is Y.</p></div>
```

**Unsure flag.**
```html
<span class="unsure" title="Unclear in the handwriting; please check">parola</span>
```

**Vocabulary section.** Always last before prev/next. The table is rendered from data; do not write rows here.
```html
<h2 id="vocab">Vocabulary</h2>
<div data-vocab></div>
<p><a href="../flashcards.html?session=YYYY-MM-DD">Practice this vocabulary as flashcards</a></p>
```

Plain `<p>`, `<ul>`, `<ol>`, and `<h3>` (for sub-points under an `<h2>`) are fine too.

## Design rules

- Light theme only. Black text on white, one green accent, amber for flags. No other colors, no dark mode.
- System font, 18px base size, 72-character line length. Do not change these.
- No frameworks, libraries, CDNs, icon fonts, or images other than the user's own. No inline styles. If a component is truly missing, add one class to `css/style.css`, use it in `notes/example.html`, and document it here.
- Every page has the skip link, the site header, one `<h1>`, `<h2>` sections, and the prev/next nav. Start from the template and this takes care of itself.
- All links are relative, so pages work from `file://` and from GitHub Pages.

## Do not

- Rename or move files, or add a build step.
- Create a notes page without its `data/sessions.js` entry, or the reverse.
- Put vocabulary in HTML.
- Edit `notes/example.html` except to keep it in sync with a component change.
- Invent content that is not in the photos.
