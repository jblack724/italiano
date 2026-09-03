// Every class session, oldest first. This one file feeds the home page list,
// the vocabulary table on each notes page, prev/next links, and the flashcards.
//
// Session fields:
//   id      "YYYY-MM-DD"  class date; must match the file name notes/<id>.html
//   week    number        week of the course
//   date    "YYYY-MM-DD"  same as id (kept separate so id could differ if a date ever repeats, e.g. "2026-09-02b")
//   title   string        short title, as on the notes page h1
//   topics  [string]      2-4 short topic labels shown on the home page
//   words   [word]        vocabulary, in the order it appears in the notes
//   example true          only on the example session; hides it from the real list
//
// Word fields (only `it` and `en` are required):
//   it        Italian, with the article for nouns: "il libro"
//   en        English
//   gender    "m" or "f"
//   plural    plural form with article: "i libri"
//   example   short Italian sentence using the word
//   exampleEn its English translation
//   say       pronunciation hint, stressed syllable in caps: "LEE-bro"
//   note      anything else, one short phrase
//   unsure    true if the handwriting was unclear (renders a [?] flag)

window.SESSIONS = [
  {
    id: "example",
    example: true,
    week: 0,
    date: "2026-09-01",
    title: "Greetings and introductions",
    topics: ["saluti", "pronouns", "essere"],
    words: [
      { it: "ciao", en: "hi / bye (informal)" },
      { it: "salve", en: "hello (neutral)" },
      { it: "buongiorno", en: "good morning, good day", say: "bwon-JOR-no" },
      { it: "buonasera", en: "good evening" },
      { it: "buonanotte", en: "good night" },
      { it: "arrivederci", en: "goodbye (polite)", say: "ah-ree-veh-DER-chee" },
      { it: "a presto", en: "see you soon", unsure: true },
      { it: "piacere", en: "nice to meet you", example: "Piacere, sono Anna.", exampleEn: "Nice to meet you, I'm Anna." },
      { it: "grazie", en: "thank you", say: "GRAH-tsyeh" },
      { it: "prego", en: "you're welcome" },
      { it: "per favore", en: "please" },
      { it: "scusi", en: "excuse me (formal)", note: "informal: scusa" },
      { it: "lo studente", en: "student (male)", gender: "m", plural: "gli studenti" },
      { it: "la studentessa", en: "student (female)", gender: "f", plural: "le studentesse" },
      { it: "il professore", en: "professor (male)", gender: "m", plural: "i professori" },
      { it: "la professoressa", en: "professor (female)", gender: "f", plural: "le professoresse" },
      { it: "essere", en: "to be", note: "irregular; see the conjugation table" }
    ]
  }
];
