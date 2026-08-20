export type Region = "Europe" | "Asia" | "Middle East" | "Africa" | "Pacific & Americas";

export interface Greeting {
  lang: string;
  word: string;
  native?: string;
  say: string;
  region: Region;
  note?: string;
}

export const GREETINGS: Greeting[] = [
  { lang: "English", word: "Hello", say: "huh-LOH", region: "Europe", note: "The word that won the telephone" },
  { lang: "Spanish", word: "Hola", say: "OH-lah", region: "Europe" },
  { lang: "French", word: "Bonjour", say: "bohn-ZHOOR", region: "Europe", note: "A small social contract" },
  { lang: "Italian", word: "Ciao", say: "CHOW", region: "Europe", note: "From 'schiavo' — 'your servant'" },
  { lang: "Portuguese", word: "Olá", say: "oh-LAH", region: "Europe" },
  { lang: "German", word: "Hallo", say: "hah-LOH", region: "Europe" },
  { lang: "Dutch", word: "Hoi", say: "HOY", region: "Europe" },
  { lang: "Swedish", word: "Hej", say: "heh", region: "Europe" },
  { lang: "Norwegian", word: "Hei", say: "hay", region: "Europe" },
  { lang: "Danish", word: "Hej", say: "eye", region: "Europe", note: "Spelled like 'hey', said like 'eye'" },
  { lang: "Icelandic", word: "Halló", say: "hah-LOH", region: "Europe" },
  { lang: "Finnish", word: "Hei", say: "hey", region: "Europe" },
  { lang: "Estonian", word: "Tere", say: "TEH-reh", region: "Europe" },
  { lang: "Latvian", word: "Sveiki", say: "SVEY-kee", region: "Europe" },
  { lang: "Lithuanian", word: "Labas", say: "LAH-bahs", region: "Europe" },
  { lang: "Polish", word: "Cześć", say: "cheshch", region: "Europe" },
  { lang: "Czech", word: "Ahoj", say: "ah-HOY", region: "Europe", note: "Borrowed from sailors" },
  { lang: "Slovak", word: "Ahoj", say: "ah-HOY", region: "Europe" },
  { lang: "Hungarian", word: "Szia", say: "SEE-yah", region: "Europe" },
  { lang: "Romanian", word: "Salut", say: "sah-LOOT", region: "Europe" },
  { lang: "Croatian", word: "Bok", say: "bohk", region: "Europe" },
  { lang: "Serbian", word: "Zdravo", native: "Здраво", say: "ZDRAH-voh", region: "Europe" },
  { lang: "Bulgarian", word: "Zdravei", native: "Здравей", say: "zdrah-VEY", region: "Europe" },
  { lang: "Greek", word: "Yia sou", native: "Γειά σου", say: "YAH-soo", region: "Europe", note: "Literally 'health to you'" },
  { lang: "Russian", word: "Privet", native: "Привет", say: "pree-VYET", region: "Europe" },
  { lang: "Ukrainian", word: "Pryvit", native: "Привіт", say: "pree-VEET", region: "Europe" },
  { lang: "Basque", word: "Kaixo", say: "KY-shoh", region: "Europe", note: "From a language older than Spain" },
  { lang: "Welsh", word: "Shwmae", say: "shoo-MYE", region: "Europe" },
  { lang: "Irish", word: "Dia dhuit", say: "DEE-ah ghwitch", region: "Europe", note: "'God be with you'" },
  { lang: "Maltese", word: "Bonġu", say: "BON-joo", region: "Europe" },
  { lang: "Mandarin", word: "Nǐ hǎo", native: "你好", say: "nee HOW", region: "Asia", note: "'You good'" },
  { lang: "Cantonese", word: "Nei hou", native: "你好", say: "nay HOW", region: "Asia" },
  { lang: "Japanese", word: "Konnichiwa", native: "こんにちは", say: "kon-nee-CHEE-wah", region: "Asia", note: "Originally 'today is…'" },
  { lang: "Korean", word: "Annyeonghaseyo", native: "안녕하세요", say: "ahn-nyung-hah-seh-YOH", region: "Asia", note: "'Are you at peace?'" },
  { lang: "Hindi", word: "Namaste", native: "नमस्ते", say: "NAH-mah-stay", region: "Asia", note: "'I bow to you'" },
  { lang: "Bengali", word: "Nomoshkar", native: "নমস্কার", say: "NOH-mosh-kar", region: "Asia" },
  { lang: "Tamil", word: "Vanakkam", native: "வணக்கம்", say: "VAH-nah-kum", region: "Asia" },
  { lang: "Nepali", word: "Namaste", native: "नमस्ते", say: "NAH-mah-stay", region: "Asia" },
  { lang: "Sinhala", word: "Ayubowan", native: "ආයුබෝවන්", say: "ah-YOO-boh-wan", region: "Asia", note: "'May you live long'" },
  { lang: "Thai", word: "Sawasdee", native: "สวัสดี", say: "sah-wah-DEE", region: "Asia" },
  { lang: "Lao", word: "Sabaidee", native: "ສະບາຍດີ", say: "sah-bye-DEE", region: "Asia" },
  { lang: "Khmer", word: "Chumreap suor", native: "ជំរាបសួរ", say: "chum-ree-ap SUOH", region: "Asia" },
  { lang: "Burmese", word: "Mingalaba", native: "မင်္ဂလာပါ", say: "min-gah-LAH-bah", region: "Asia", note: "'Auspiciousness upon you'" },
  { lang: "Vietnamese", word: "Xin chào", say: "sin CHOW", region: "Asia" },
  { lang: "Indonesian", word: "Halo", say: "HAH-loh", region: "Asia" },
  { lang: "Filipino", word: "Kumusta", say: "koo-MOOS-tah", region: "Asia", note: "From Spanish '¿cómo está?'" },
  { lang: "Mongolian", word: "Sain uu", native: "Сайн уу", say: "SIGN-oo", region: "Asia" },
  { lang: "Kazakh", word: "Sälem", native: "Сәлем", say: "sah-LEM", region: "Asia" },
  { lang: "Georgian", word: "Gamarjoba", native: "გამარჯობა", say: "gah-mar-JOH-bah", region: "Asia", note: "From 'victory' — a fighting word" },
  { lang: "Armenian", word: "Barev", native: "Բարև", say: "bah-REV", region: "Asia" },
  { lang: "Arabic", word: "Marhaban", native: "مرحبا", say: "MAR-hah-ban", region: "Middle East", note: "'I welcome you widely'" },
  { lang: "Hebrew", word: "Shalom", native: "שלום", say: "shah-LOM", region: "Middle East", note: "Means peace" },
  { lang: "Persian", word: "Salām", native: "سلام", say: "sah-LAAM", region: "Middle East" },
  { lang: "Turkish", word: "Merhaba", say: "MEHR-hah-bah", region: "Middle East" },
  { lang: "Kurdish", word: "Silav", say: "SEE-lav", region: "Middle East" },
  { lang: "Swahili", word: "Jambo", say: "JAM-boh", region: "Africa" },
  { lang: "Zulu", word: "Sawubona", say: "sah-WOO-boh-nah", region: "Africa", note: "'I see you'" },
  { lang: "Xhosa", word: "Molo", say: "MOH-loh", region: "Africa" },
  { lang: "Yoruba", word: "Pẹlẹ o", say: "PEH-leh oh", region: "Africa" },
  { lang: "Igbo", word: "Ndewo", say: "n-DEH-woh", region: "Africa" },
  { lang: "Hausa", word: "Sannu", say: "SAHN-noo", region: "Africa" },
  { lang: "Wolof", word: "Nanga def", say: "NAHN-gah def", region: "Africa" },
  { lang: "Shona", word: "Mhoro", say: "MOH-roh", region: "Africa" },
  { lang: "Somali", word: "Salaan", say: "sah-LAAN", region: "Africa" },
  { lang: "Amharic", word: "Selam", native: "ሰላም", say: "seh-LAHM", region: "Africa", note: "Also means peace" },
  { lang: "Malagasy", word: "Salama", say: "sah-LAH-mah", region: "Africa" },
  { lang: "Hawaiian", word: "Aloha", say: "ah-LOH-hah", region: "Pacific & Americas", note: "Hello, goodbye, love, breath" },
  { lang: "Māori", word: "Kia ora", say: "KEE-ah OH-rah", region: "Pacific & Americas", note: "'Be well' — literally" },
  { lang: "Samoan", word: "Talofa", say: "tah-LOH-fah", region: "Pacific & Americas" },
  { lang: "Tongan", word: "Mālō e lelei", say: "mah-LOH eh leh-LEH", region: "Pacific & Americas" },
  { lang: "Fijian", word: "Bula", say: "MBOO-lah", region: "Pacific & Americas", note: "Means life itself" },
  { lang: "Tahitian", word: "Ia ora na", say: "ee-ah OH-rah nah", region: "Pacific & Americas" },
  { lang: "Cherokee", word: "Osiyo", native: "ᎣᏏᏲ", say: "oh-SEE-yoh", region: "Pacific & Americas" },
  { lang: "Navajo", word: "Yá'át'ééh", say: "yah-ah-TAY", region: "Pacific & Americas", note: "'It is good'" },
  { lang: "Greenlandic", word: "Aluu", say: "ah-LOO", region: "Pacific & Americas" },
  { lang: "Quechua", word: "Imaynalla", say: "ee-my-NAH-yah", region: "Pacific & Americas" },
  { lang: "Guarani", word: "Mba'éichapa", say: "mbah-ay-CHAH-pah", region: "Pacific & Americas" },
];

export const REGIONS: ("All" | Region)[] = [
  "All",
  "Europe",
  "Asia",
  "Middle East",
  "Africa",
  "Pacific & Americas",
];

export interface FoyerWord {
  word: string;
  lang: string;
  say: string;
}

export const FOYER_WORDS: FoyerWord[] = [
  { word: "HELLO", lang: "English", say: "huh-LOH" },
  { word: "HOLA", lang: "Spanish", say: "OH-lah" },
  { word: "BONJOUR", lang: "French", say: "bohn-ZHOOR" },
  { word: "CIAO", lang: "Italian", say: "CHOW" },
  { word: "OLÁ", lang: "Portuguese", say: "oh-LAH" },
  { word: "HALLO", lang: "German", say: "hah-LOH" },
  { word: "ALOHA", lang: "Hawaiian", say: "ah-LOH-hah" },
  { word: "SALAM", lang: "Persian", say: "sah-LAAM" },
  { word: "MERHABA", lang: "Turkish", say: "MEHR-hah-bah" },
  { word: "KUMUSTA", lang: "Filipino", say: "koo-MOOS-tah" },
  { word: "KAIXO", lang: "Basque", say: "KY-shoh" },
  { word: "BULA", lang: "Fijian", say: "MBOO-lah" },
  { word: "SALUT", lang: "Romanian", say: "sah-LOOT" },
  { word: "HEJ", lang: "Swedish", say: "heh" },
];

export interface TimelineEntry {
  year: string;
  title: string;
  body: string;
  accent: "chalk" | "sun" | "signal" | "periwinkle";
}

export const TIMELINE: TimelineEntry[] = [
  {
    year: "c. 1400",
    title: "A shout, not a greeting",
    body: "“Halloo!”, “hollo!”, “hullo!” begin as attention-shouts for ferrymen, hunters and shepherds — a way to be heard across a river, not a way to be polite.",
    accent: "periwinkle",
  },
  {
    year: "1580s",
    title: "Print can't pick a spelling",
    body: "Shakespeare scatters “hollo” and “holla” through his plays; his contemporaries try “halloo”, “hullo”, “holloa”. Every writer spells the shout differently.",
    accent: "chalk",
  },
  {
    year: "1827",
    title: "The word settles down",
    body: "The first recorded “hello” appears in an English letter from Norwich. It still means “hey, you!” — an exclamation, not yet a greeting between friends.",
    accent: "sun",
  },
  {
    year: "1877",
    title: "Edison vs. Bell",
    body: "Thomas Edison scribbles “Hello!” in a letter about the brand-new telephone. Alexander Graham Bell swears by “Ahoy!”. History, rudely, sides with Edison.",
    accent: "signal",
  },
  {
    year: "1878",
    title: "Enter the Hello Girls",
    body: "New Haven, Connecticut opens the first public telephone exchange. Its operators soon earn the nickname “hello girls” — and hello becomes the sound of connection.",
    accent: "chalk",
  },
  {
    year: "1880s",
    title: "Into the dictionary",
    body: "Within a decade hello lands in dictionaries, etiquette manuals and song titles. A shout has become a word of welcome at astonishing speed.",
    accent: "periwinkle",
  },
  {
    year: "1974",
    title: "Hello, world",
    body: "Brian Kernighan writes “hello, world” in a Bell Labs memo (and later, the C programming book). Saying hello becomes every programmer's first rite of passage.",
    accent: "sun",
  },
  {
    year: "Today",
    title: "The most recognized word on Earth",
    body: "Spoken billions of times a day, understood almost everywhere — even in languages that already had a perfectly good hello of their own.",
    accent: "signal",
  },
];

export interface FieldNote {
  city: string;
  country: string;
  fact: string;
  stamp: "sun" | "signal" | "periwinkle" | "chalk";
  rot: number;
}

export const FIELD_NOTES: FieldNote[] = [
  {
    city: "Kyoto",
    country: "Japan",
    stamp: "signal",
    rot: -3,
    fact: "In Japan, “moshi moshi” is exclusively a telephone word. It comes from “mōsu mōsu” — a humble “speaking, speaking”. Nobody says it face to face.",
  },
  {
    city: "Auckland",
    country: "Aotearoa NZ",
    stamp: "periwinkle",
    rot: 2,
    fact: "Kia ora, beloved across New Zealand, literally wishes you life: “be well”. It doubles as thanks, agreement, and a hearty cheers.",
  },
  {
    city: "Jerusalem",
    country: "Israel",
    stamp: "sun",
    rot: -1.5,
    fact: "Shalom and salaam share an ancient Semitic root meaning peace — so every hello in Hebrew and Arabic quietly carries a wish for peace inside it.",
  },
  {
    city: "Honolulu",
    country: "Hawaiʻi",
    stamp: "chalk",
    rot: 2.5,
    fact: "Aloha is hello, goodbye, love and presence all at once. Some say it joins “alo” (presence) with “hā” (breath): the breath of being together.",
  },
  {
    city: "Paris",
    country: "France",
    stamp: "signal",
    rot: 1.5,
    fact: "Walk into a French shop without saying “bonjour” and you've committed a small crime. The word is a social contract, not a formality.",
  },
  {
    city: "Durban",
    country: "South Africa",
    stamp: "sun",
    rot: -2.5,
    fact: "The Zulu greeting “sawubona” means “I see you”. The reply — “yebo, sawubona” — returns the favour: “yes, I see you too.”",
  },
  {
    city: "Murray Hill",
    country: "Bell Labs, USA",
    stamp: "periwinkle",
    rot: 3,
    fact: "In 1974 Brian Kernighan taught a computer to say “hello, world” in a Bell Labs memo. Every coder since has met the world exactly the same way.",
  },
];

export const MARQUEE_WORDS = [
  "HELLO",
  "HOLA",
  "BONJOUR",
  "CIAO",
  "OLÁ",
  "HALLO",
  "こんにちは",
  "NAMASTE",
  "ALOHA",
  "MERHABA",
  "PRIVET",
  "你好",
  "KIA ORA",
  "SAWUBONA",
  "JAMBO",
  "HEJ",
  "SHALOM",
  "KUMUSTA",
  "BULA",
  "SALAM",
];
