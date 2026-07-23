export const navItems = [
  { label: "Servicii", href: "/#servicii" },
  { label: "Personalizare", href: "/personalizeaza" },
  { label: "Proces", href: "/#proces" },
  { label: "Colecție", href: "/#colectie" },
  { label: "De ce Cartpaper", href: "/#de-ce-cartpaper" },
  { label: "Contact", href: "/#contact" },
];

export const homeContent = {
  hero: {
    badge: "PUNGI DE HÂRTIE PERSONALIZATE",
    titleStart: "Brandul tău, ambalat",
    titleAccent: "frumos.",
    body:
      "Creăm pungi de hârtie personalizate pentru afaceri care vor să fie ținute minte — de la magazine locale la branduri naționale. Fiecare pungă devine o extensie a identității tale.",
    primaryCta: "Personalizează",
    secondaryCta: "Cere o ofertă",
  },
  trustPoints: [
    { title: "Simulare înainte de ofertă", body: "Vezi proporția logo-ului pe pungă înainte să trimiți brief-ul." },
    { title: "Configurație clară", body: "Modelul, finisajul și poziționarea ajung împreună în cererea de ofertă." },
    { title: "Bun de tipar", body: "Producția se confirmă după verificarea detaliilor finale." },
  ],
  process: {
    overline: "PROCES",
    title: "De la idee la pungă, în trei pași.",
    steps: [
      {
        title: "Încarcă logo-ul",
        body: "Adaugă identitatea brandului tău și verifică fundalul.",
      },
      {
        title: "Alege și personalizează",
        body: "Selectează punga, culoarea și poziția imprimării.",
      },
      {
        title: "Primești propunerea",
        body: "Descarcă simularea și trimite-ne configurația pentru ofertă.",
      },
    ],
  },
  personalizer: {
    overline: "PERSONALIZATOR",
    title: "Vezi logo-ul tău pe patru tipuri de pungă.",
    body:
      "Încarcă logo-ul, elimină fundalul și testează rapid variantele Kraft Clasic, Alb Premium, Negru Elegant și Culoare Intensă.",
    cta: "Începe personalizarea",
  },
  collection: {
    overline: "COLECȚIE",
    title: "Fiecare pungă, la alt nivel.",
    tabs: [
      {
        id: "kraft",
        label: "Kraft clasic",
        mockupId: "kraft-classic",
        title: "Textură naturală pentru branduri apropiate de oameni.",
        body: "Potrivită pentru cafenele, florării, brutării, magazine locale și cadouri cu ton cald.",
        details: ["Hârtie natur cu textură vizibilă", "Logo negru sau verde Cartpaper", "Recomandată pentru comenzi recurente"],
        swatches: ["#d7a86f", "#8d5d35", "#11120e", "#bded15"],
      },
      {
        id: "alb",
        label: "Alb premium",
        mockupId: "white-premium",
        title: "Suprafață curată pentru identități rafinate.",
        body: "O bază luminoasă pentru culori precise, linii fine și prezentări de retail premium.",
        details: ["Contrast clar pentru print color", "Arată bine cu finisaje lucioase", "Potrivită pentru retail premium"],
        swatches: ["#fffefa", "#e5e0d7", "#11120e", "#bded15"],
      },
      {
        id: "culoare",
        label: "Culoare intensă",
        mockupId: "color-pop",
        title: "Un accent memorabil pentru lansări și campanii.",
        body: "Alege o culoare de pungă care susține campania, sezonul sau colecția.",
        details: ["Paletă adaptată campaniei", "Logo alb, negru sau original", "Bună pentru lansări și evenimente"],
        swatches: ["#cb4d45", "#172039", "#e9b6ab", "#bded15"],
      },
      {
        id: "panglica",
        label: "Panglică satinată",
        mockupId: "black-luxury",
        title: "Un detaliu tactil pentru experiențe de cadou.",
        body: "Finisaj potrivit pentru evenimente, hospitality și produse cu prezentare specială.",
        details: ["Aspect de cadou sau hospitality", "Merge cu folie aurie sau argintie", "Recomandată pentru serii speciale"],
        swatches: ["#191a15", "#f7f3ea", "#d6b66c", "#f2d3c7"],
      },
    ],
  },
  benefits: {
    overline: "DE CE CARTPAPER",
    title: "Ambalaje care muncesc la fel de mult ca tine.",
    cards: [
      {
        title: "Comenzi adaptate proiectului",
        body: "Pornim de la obiectiv, cantitate, dimensiuni și buget, nu de la un șablon rigid.",
      },
      {
        title: "Culori atent controlate",
        body: "Pregătim simularea ca punct de discuție și confirmăm detaliile înainte de producție.",
      },
      {
        title: "Materiale selectate responsabil",
        body: "Alegem materialul potrivit aplicației și evităm promisiunile care trebuie certificate separat.",
      },
      {
        title: "Ambalaj cu identitatea ta",
        body: "Logo-ul, dimensiunea și finisajul lucrează împreună pentru o experiență coerentă.",
      },
    ],
  },
  testimonials: {
    enabled: false,
    developmentLabel: "Conținut demonstrativ",
  },
  finalCta: {
    overline: "ÎNCEPE ASTĂZI",
    title: "Pregătit să creezi pungi pe care oamenii le țin minte?",
    body:
      "Trimite-ne brief-ul și revenim cu întrebările necesare, o simulare și o ofertă potrivită proiectului.",
    primary: "Cere un kit de mostre",
    secondary: "Sună-ne direct",
  },
};
