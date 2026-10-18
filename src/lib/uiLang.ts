import i18n from "i18next";

export type UiLang = "en" | "ar";

export function currentUiLang(): UiLang {
  return i18n.language?.startsWith("ar") ? "ar" : "en";
}

export function applyUiLang(lang: UiLang) {
  if (currentUiLang() !== lang) void i18n.changeLanguage(lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  try {
    localStorage.setItem("lang", lang);
  } catch {
    /* private mode: ignore */
  }
}
