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
      { group: "Le quattro domande", it: "Come ti chiami?", en: "What's your name? (informal)", say: "KOH-meh tee KYAH-mee" },
      { group: "Le quattro domande", it: "Mi chiamo…", en: "My name is…" },
      { group: "Le quattro domande", it: "Come si chiama?", en: "What's his/her name?" },
      { group: "Le quattro domande", it: "Piacere!", en: "Nice to meet you!", say: "pyah-CHEH-reh" },
      { group: "Le quattro domande", it: "Di dove sei?", en: "Where are you from? (informal)" },
      { group: "Le quattro domande", it: "Di dov'è?", en: "Where is he/she from?", note: "short for Di dove è?" },
      { group: "Le quattro domande", it: "Sono di…", en: "I'm from…" },
      { group: "Le quattro domande", it: "e tu?", en: "and you?" },
      { group: "Le quattro domande", it: "Che cosa studi?", en: "What do you study?" },
      { group: "Le quattro domande", it: "Studio…", en: "I study…" },
      { group: "Le quattro domande", it: "Come stai?", en: "How are you? (informal)" },
      { group: "Le quattro domande", it: "Come sta?", en: "How is he/she?" },
      { group: "Le quattro domande", it: "Come stanno?", en: "How are they?" },
      { group: "Le quattro domande", it: "Sto…", en: "I'm (feeling)…", example: "Oggi sto benissimo!", exampleEn: "Today I'm doing great!" },
      { group: "Come stai", it: "benissimo", en: "great, very well" },
      { group: "Come stai", it: "molto bene", en: "very well" },
      { group: "Come stai", it: "bene", en: "well" },
      { group: "Come stai", it: "così così", en: "so-so", say: "koh-ZEE koh-ZEE" },
      { group: "Come stai", it: "non bene", en: "not well" },
      { group: "Come stai", it: "male", en: "badly", say: "MAH-leh" },
      { group: "In classe", it: "oggi", en: "today", say: "OHD-jee" },
      { group: "In classe", it: "In piedi!", en: "Stand up! (classroom instruction)" },
      { group: "In classe", it: "un compagno / una compagna", en: "a classmate (m / f)" },
      { group: "In classe", it: "il professore", en: "professor (male)", gender: "m", plural: "i professori" },
      { group: "Le materie", it: "la biologia", en: "biology", gender: "f" },
      { group: "Le materie", it: "l'economia", en: "economics", gender: "f" },
      { group: "Le materie", it: "l'antropologia", en: "anthropology", gender: "f" },
      { group: "Le materie", it: "le scienze ambientali", en: "environmental science", gender: "f", note: "plural" },
      { group: "Le materie", it: "le scienze politiche", en: "political science", gender: "f", note: "plural" },
      { group: "Le materie", it: "la matematica", en: "mathematics", gender: "f" },
      { group: "Le materie", it: "la fisica", en: "physics", gender: "f" },
      { group: "Le materie", it: "la storia", en: "history", gender: "f" },
      { group: "Le materie", it: "la letteratura", en: "literature", gender: "f" },
      { group: "Le materie", it: "l'ingegneria", en: "engineering", gender: "f", say: "een-jeh-nyeh-REE-ah" },
      { group: "Pronuncia", it: "la casa", en: "house", gender: "f", say: "KAH-zah", note: "hard c" },
      { group: "Pronuncia", it: "il cinema", en: "cinema, movie theater", gender: "m", say: "CHEE-neh-mah", note: "soft c" },
      { group: "Pronuncia", it: "cento", en: "one hundred", say: "CHEN-toh", note: "soft c" },
      { group: "Pronuncia", it: "ciao", en: "hi / bye", say: "CHOW", note: "soft c" },
      { group: "Pronuncia", it: "il gatto", en: "cat", gender: "m", say: "GAHT-toh", note: "hard g" },
      { group: "Pronuncia", it: "il lago", en: "lake", gender: "m", say: "LAH-goh", note: "hard g" },
      { group: "Pronuncia", it: "il gelato", en: "ice cream", gender: "m", say: "jeh-LAH-toh", note: "soft g" },
      { group: "Pronuncia", it: "giugno", en: "June", say: "JOO-nyoh", note: "soft g, then gn" },
      { group: "Pronuncia", it: "buongiorno", en: "good morning, good day", say: "bwon-JOR-noh", note: "soft g" },
      { group: "Pronuncia", it: "la bruschetta", en: "bruschetta", gender: "f", say: "broo-SKET-tah", note: "hard sc" },
      { group: "Pronuncia", it: "il telescopio", en: "telescope", gender: "m", say: "teh-leh-SKOH-pyoh", note: "hard sc" },
      { group: "Pronuncia", it: "il prosciutto", en: "prosciutto, cured ham", gender: "m", say: "pro-SHOOT-toh", note: "soft sc" },
      { group: "Pronuncia", it: "la scimmia", en: "monkey", gender: "f", say: "SHEEM-myah", note: "soft sc" },
      { group: "Pronuncia", it: "la lasagna", en: "lasagna", gender: "f", say: "lah-ZAH-nyah", note: "gn" },
      { group: "Pronuncia", it: "gli gnocchi", en: "gnocchi", gender: "m", say: "NYOK-kee", note: "gn; plural" },
      { group: "Pronuncia", it: "lo gnomo", en: "gnome", gender: "m", say: "NYOH-moh", note: "gn" },
      { group: "Pronuncia", it: "la famiglia", en: "family", gender: "f", say: "fah-MEE-lyah", note: "gli" },
      { group: "Pronuncia", it: "l'aglio", en: "garlic", gender: "m", say: "AH-lyoh", note: "gli" },
      { group: "Pronuncia", it: "la bottiglia", en: "bottle", gender: "f", say: "bot-TEE-lyah", note: "gli" },
      { group: "Pronuncia", it: "il regalo", en: "gift", gender: "m", say: "reh-GAH-loh", note: "rolled r" },
      { group: "Pronuncia", it: "l'arbitro", en: "referee", gender: "m", say: "AR-bee-troh", note: "rolled r" },
      { group: "Pronuncia", it: "l'aeroporto", en: "airport", gender: "m", say: "ah-eh-roh-POR-toh", note: "rolled r" }
    ]
  },

  {
    id: "textbook/unita-p",
    week: 1,
    date: "2026-09-03",
    title: "Unità Preliminare · Per cominciare",
    topics: ["greetings", "tu vs Lei", "alphabet", "numbers 0-100"],
    words: [
      { group: "Saluti", it: "ciao", en: "hi, bye", note: "informal" },
      { group: "Saluti", it: "salve", en: "hello", note: "neutral" },
      { group: "Saluti", it: "buongiorno", en: "good morning, good day" },
      { group: "Saluti", it: "buonasera", en: "good evening" },
      { group: "Saluti", it: "buonanotte", en: "good night", note: "for leave-taking" },
      { group: "Presentazioni", it: "come ti chiami?", en: "what's your name?", note: "informal" },
      { group: "Presentazioni", it: "come si chiama?", en: "what's your name?", note: "formal" },
      { group: "Presentazioni", it: "mi chiamo…", en: "my name is…" },
      { group: "Presentazioni", it: "(tanto) piacere", en: "(so) nice to meet you" },
      { group: "Presentazioni", it: "molto lieto / molto lieta", en: "very pleased to meet you", note: "lieto if you are male, lieta if female" },
      { group: "Presentazioni", it: "e tu?", en: "and you?", note: "informal" },
      { group: "Presentazioni", it: "e Lei?", en: "and you?", note: "formal" },
      { group: "Presentazioni", it: "scusa", en: "excuse me", note: "informal" },
      { group: "Presentazioni", it: "scusi", en: "excuse me", note: "formal" },
      { group: "L'origine", it: "di dove sei?", en: "where are you from?", note: "informal" },
      { group: "L'origine", it: "di dov'è (Lei)?", en: "where are you from?", note: "formal" },
      { group: "L'origine", it: "sono di…", en: "I am from…" },
      { group: "L'origine", it: "dov'è…?", en: "where is…?" },
      { group: "L'origine", it: "ecco…", en: "here is…, here are…" },
      { group: "Come stai", it: "come stai?", en: "how are you?", note: "informal" },
      { group: "Come stai", it: "come sta?", en: "how are you?", note: "formal" },
      { group: "Come stai", it: "come va?", en: "how's it going?" },
      { group: "Come stai", it: "sto…", en: "I'm…" },
      { group: "Come stai", it: "benone", en: "terrific" },
      { group: "Come stai", it: "benissimo", en: "very well" },
      { group: "Come stai", it: "molto bene", en: "very well" },
      { group: "Come stai", it: "abbastanza bene", en: "quite well" },
      { group: "Come stai", it: "bene", en: "fine, well" },
      { group: "Come stai", it: "così così", en: "so-so" },
      { group: "Come stai", it: "non c'è male", en: "not too bad" },
      { group: "Come stai", it: "non sto bene", en: "I'm not well" },
      { group: "Come stai", it: "male", en: "badly" },
      { group: "Come stai", it: "bene, grazie, e tu?", en: "fine, thank you, and you?", note: "informal" },
      { group: "Come stai", it: "bene, grazie, e Lei?", en: "fine, thank you, and you?", note: "formal" },
      { group: "Congedi", it: "arrivederci", en: "good-bye", note: "informal" },
      { group: "Congedi", it: "arrivederLa", en: "good-bye", note: "formal" },
      { group: "Congedi", it: "a presto", en: "see you soon" },
      { group: "Congedi", it: "ci vediamo", en: "see you" },
      { group: "Congedi", it: "alla prossima", en: "until next time" },
      { group: "Congedi", it: "addio", en: "farewell" },
      { group: "Titoli", it: "il signore (Sig.)", en: "Mr.", gender: "m" },
      { group: "Titoli", it: "la signora (Sig.ra)", en: "Mrs.", gender: "f" },
      { group: "Titoli", it: "la signorina (Sig.na)", en: "Miss", gender: "f" },
      { group: "Titoli", it: "il professore (Prof.)", en: "professor (male)", gender: "m" },
      { group: "Titoli", it: "la professoressa (Prof.ssa)", en: "professor (female)", gender: "f" },
      { group: "Titoli", it: "il dottore (Dott.)", en: "doctor (male)", gender: "m" },
      { group: "Titoli", it: "la dottoressa (Dott.ssa)", en: "doctor (female)", gender: "f" },
      { group: "Titoli", it: "l'avvocato (Avv.)", en: "lawyer", gender: "m" },
      { group: "Titoli", it: "l'ingegnere (Ing.)", en: "engineer", gender: "m" },
      { group: "Titoli", it: "l'architetto (Arch.)", en: "architect", gender: "m" },
      { group: "I numeri", it: "zero", en: "0" },
      { group: "I numeri", it: "uno", en: "1" },
      { group: "I numeri", it: "due", en: "2" },
      { group: "I numeri", it: "tre", en: "3" },
      { group: "I numeri", it: "quattro", en: "4" },
      { group: "I numeri", it: "cinque", en: "5" },
      { group: "I numeri", it: "sei", en: "6" },
      { group: "I numeri", it: "sette", en: "7" },
      { group: "I numeri", it: "otto", en: "8" },
      { group: "I numeri", it: "nove", en: "9" },
      { group: "I numeri", it: "dieci", en: "10" },
      { group: "I numeri", it: "undici", en: "11" },
      { group: "I numeri", it: "dodici", en: "12" },
      { group: "I numeri", it: "tredici", en: "13" },
      { group: "I numeri", it: "quattordici", en: "14" },
      { group: "I numeri", it: "quindici", en: "15" },
      { group: "I numeri", it: "sedici", en: "16" },
      { group: "I numeri", it: "diciassette", en: "17" },
      { group: "I numeri", it: "diciotto", en: "18" },
      { group: "I numeri", it: "diciannove", en: "19" },
      { group: "I numeri", it: "venti", en: "20" },
      { group: "I numeri", it: "ventuno", en: "21", note: "venti drops its final vowel before uno" },
      { group: "I numeri", it: "ventidue", en: "22" },
      { group: "I numeri", it: "ventitré", en: "23", note: "tre takes an accent from 23 on" },
      { group: "I numeri", it: "ventiquattro", en: "24" },
      { group: "I numeri", it: "venticinque", en: "25" },
      { group: "I numeri", it: "ventisei", en: "26" },
      { group: "I numeri", it: "ventisette", en: "27" },
      { group: "I numeri", it: "ventotto", en: "28", note: "venti drops its final vowel before otto" },
      { group: "I numeri", it: "ventinove", en: "29" },
      { group: "I numeri", it: "trenta", en: "30" },
      { group: "I numeri", it: "quaranta", en: "40" },
      { group: "I numeri", it: "cinquanta", en: "50" },
      { group: "I numeri", it: "sessanta", en: "60" },
      { group: "I numeri", it: "settanta", en: "70" },
      { group: "I numeri", it: "ottanta", en: "80" },
      { group: "I numeri", it: "novanta", en: "90" },
      { group: "I numeri", it: "cento", en: "100" }
    ]
  }
];
