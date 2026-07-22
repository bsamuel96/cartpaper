export const companyConfig = {
  brandName: "Cartpaper",
  legalName: "",
  cui: "",
  registrationNumber: "",
  registeredAddress: "",
  contactEmail: process.env.CONTACT_EMAIL ?? "hello@cartpaper.ro",
  phone: "",
  workingHours: "",
  socialLinks: [] as Array<{ label: string; href: string }>,
  productionChecklist: [
    "Completează denumirea juridică, CUI, numărul de înregistrare și adresa.",
    "Configurează destinația formularului de ofertă.",
    "Înlocuiește mockupurile placeholder cu exporturi licențiate.",
    "Înlocuiește artwork-ul ANPC SAL placeholder cu fișierul oficial.",
    "Verifică statisticile și elimină orice conținut demonstrativ.",
  ],
};
