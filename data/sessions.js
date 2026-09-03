// Every notes page, in one list. This file feeds the home page, the vocabulary table
// on each page, prev/next links, and the flashcards.
//
// Collections group the pages. A page's id is "<collection>/<slug>" and its file is "<id>.html".
window.COLLECTIONS = [
  { id: "lectures", title: "Lectures", blurb: "Notes from the slide decks posted on Canvas." },
  { id: "in-class", title: "In class", blurb: "Handwritten notes from class, transcribed." },
  { id: "textbook", title: "Textbook", blurb: "Parliamo italiano!, unit by unit." }
];

// Session fields:
//   id      "lectures/2026-09-02"  collection + slug; must match the file path <id>.html.
//                                  Slug is the class date for lectures and in-class notes, the unit for textbook notes ("textbook/unita-p").
//   lecture number        which lecture in its collection, when the source is numbered (decks are: "1_09.02 …")
//   week    number        week of the course (Week 1 starts Sep 2, 2026)
//   date    "YYYY-MM-DD"  date of the class or, for textbook notes, the date you studied it
//   title   string        short title, as on the page h1 (lectures keep the deck's Italian title)
//   topics  [string]      2-4 short topic labels shown on the home page
//   words   [word]        vocabulary, in the order it appears in the source
//   example true          only on the example page; hides it from the real lists
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
//   unsure    true if the source was unclear (renders a [?] flag)

window.SESSIONS = [
  {
    id: "_reference/example",
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
  },

  {
    id: "lectures/2026-09-02",
    lecture: 1,
    week: 1,
    date: "2026-09-02",
    title: "Presentazioni e pronuncia",
    topics: ["introductions", "chiamarsi, essere, studiare, stare", "pronunciation: c, g, sc, gn, gli, r"],
    words: [
      { it: "Come ti chiami?", en: "What's your name? (informal)", say: "KOH-meh tee KYAH-mee" },
      { it: "Mi chiamo…", en: "My name is…", example: "Io mi chiamo Vincenzo. Piacere!", exampleEn: "My name is Vincenzo. Nice to meet you!" },
      { it: "Come si chiama?", en: "What's his/her name?", example: "Come si chiama lui? Lui si chiama Lupin.", exampleEn: "What's his name? His name is Lupin." },
      { it: "Piacere!", en: "Nice to meet you!", say: "pyah-CHEH-reh" },
      { it: "Di dove sei?", en: "Where are you from? (informal)" },
      { it: "Di dov'è?", en: "Where is he/she from?", note: "short for Di dove è?" },
      { it: "Sono di…", en: "I'm from…", example: "Io sono di Tortolì, in Italia.", exampleEn: "I'm from Tortolì, in Italy." },
      { it: "e tu?", en: "and you?" },
      { it: "Che cosa studi?", en: "What do you study?" },
      { it: "Studio…", en: "I study…", example: "Io studio la letteratura medievale.", exampleEn: "I study medieval literature." },
      { it: "Come stai?", en: "How are you? (informal)" },
      { it: "Come sta?", en: "How is he/she?" },
      { it: "Come stanno?", en: "How are they?" },
      { it: "Sto…", en: "I'm (feeling)…", example: "Oggi io sto benissimo!", exampleEn: "Today I'm doing great!" },
      { it: "benissimo", en: "great, very well" },
      { it: "molto bene", en: "very well" },
      { it: "bene", en: "well" },
      { it: "così così", en: "so-so", say: "koh-ZEE koh-ZEE" },
      { it: "non bene", en: "not well" },
      { it: "male", en: "badly", say: "MAH-leh" },
      { it: "oggi", en: "today", say: "OHD-jee" },
      { it: "In piedi!", en: "Stand up! (classroom instruction)" },
      { it: "un compagno / una compagna", en: "a classmate (m / f)", example: "Intervistiamo un compagno/a.", exampleEn: "Let's interview a classmate." },
      { it: "il professore", en: "professor (male)", gender: "m", plural: "i professori" },
      { it: "la biologia", en: "biology", gender: "f" },
      { it: "l'economia", en: "economics", gender: "f" },
      { it: "l'antropologia", en: "anthropology", gender: "f" },
      { it: "le scienze ambientali", en: "environmental science", gender: "f", note: "plural" },
      { it: "le scienze politiche", en: "political science", gender: "f", note: "plural" },
      { it: "la matematica", en: "mathematics", gender: "f" },
      { it: "la fisica", en: "physics", gender: "f" },
      { it: "la storia", en: "history", gender: "f" },
      { it: "la letteratura", en: "literature", gender: "f" },
      { it: "l'ingegneria", en: "engineering", gender: "f", say: "een-jeh-nyeh-REE-ah" },
      { it: "la casa", en: "house", gender: "f", say: "KAH-zah", note: "hard c" },
      { it: "il cinema", en: "cinema, movie theater", gender: "m", say: "CHEE-neh-mah", note: "soft c" },
      { it: "cento", en: "one hundred", say: "CHEN-toh", note: "soft c" },
      { it: "ciao", en: "hi / bye", say: "CHOW", note: "soft c" },
      { it: "il gatto", en: "cat", gender: "m", say: "GAHT-toh", note: "hard g" },
      { it: "il lago", en: "lake", gender: "m", say: "LAH-goh", note: "hard g" },
      { it: "il gelato", en: "ice cream", gender: "m", say: "jeh-LAH-toh", note: "soft g" },
      { it: "giugno", en: "June", say: "JOO-nyoh", note: "soft g, then gn" },
      { it: "buongiorno", en: "good morning, good day", say: "bwon-JOR-noh", note: "soft g" },
      { it: "la bruschetta", en: "bruschetta", gender: "f", say: "broo-SKET-tah", note: "hard sc" },
      { it: "il telescopio", en: "telescope", gender: "m", say: "teh-leh-SKOH-pyoh", note: "hard sc" },
      { it: "il prosciutto", en: "prosciutto, cured ham", gender: "m", say: "pro-SHOOT-toh", note: "soft sc" },
      { it: "la scimmia", en: "monkey", gender: "f", say: "SHEEM-myah", note: "soft sc" },
      { it: "la lasagna", en: "lasagna", gender: "f", say: "lah-ZAH-nyah", note: "gn" },
      { it: "gli gnocchi", en: "gnocchi", gender: "m", say: "NYOK-kee", note: "gn; plural" },
      { it: "lo gnomo", en: "gnome", gender: "m", say: "NYOH-moh", note: "gn" },
      { it: "la famiglia", en: "family", gender: "f", say: "fah-MEE-lyah", note: "gli" },
      { it: "l'aglio", en: "garlic", gender: "m", say: "AH-lyoh", note: "gli" },
      { it: "la bottiglia", en: "bottle", gender: "f", say: "bot-TEE-lyah", note: "gli" },
      { it: "il regalo", en: "gift", gender: "m", say: "reh-GAH-loh", note: "rolled r" },
      { it: "l'arbitro", en: "referee", gender: "m", say: "AR-bee-troh", note: "rolled r" },
      { it: "l'aeroporto", en: "airport", gender: "m", say: "ah-eh-roh-POR-toh", note: "rolled r" }
    ]
  }
];
