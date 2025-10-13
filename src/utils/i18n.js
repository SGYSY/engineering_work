// Minimal i18n helper that keeps the API surface but renders English copy.
// Additional phrases can be added to the dictionary if phrasing tweaks are required.

const dictionary = new Map([
  ["Smart Suggestions", "Smart Suggestions"],
  ["Favorite status updated", "Favorite status updated"],
  ["Application submitted and synced to My Applications", "Application submitted and synced to My Applications"],
  ["Quick Apply", "Quick Apply"],
  ["Apply Now", "Apply Now"],
  ["Reset", "Reset"],
  ["Remove", "Remove"],
  ["Entry Guide", "Entry Guide"],
  ["Download Schedule", "Download Schedule"],
  ["My Registrations", "My Registrations"],
  ["Select an application to view details", "Select an application to view details"],
  ["No applications available", "No applications available"],
  ["No messages yet", "No messages yet"],
  ["Attachment removed", "Attachment removed"],
  ["Attachment uploaded", "Attachment uploaded"],
  ["Only PDF files are supported", "Only PDF files are supported"],
  ["Session reset for demo", "Session reset for demo"],
  ["Offer", "Offer"],
  ["Registered", "Registered"],
  ["Available", "Available"]
]);

let currentLocale = "en-US";

function syncDocumentLang() {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (!root) return;
  root.setAttribute("lang", "en");
}

syncDocumentLang();

export function setLocale(locale) {
  currentLocale = locale === "zh-CN" || locale === "zh" ? "zh-CN" : "en-US";
  // English copy only; this still updates the lang attribute for accessibility.
  syncDocumentLang();
  return currentLocale;
}

export function t(input) {
  if (input == null) return "";
  const key = String(input);
  return dictionary.get(key) ?? key;
}

export function translateStatus(value) {
  return t(value);
}
