import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { applyUiLang, currentUiLang, type UiLang } from "../lib/uiLang";

const LANGS: { code: UiLang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ar", label: "AR" },
];

export default function LanguageToggle() {
  // subscribing to i18n makes this re-render when the language changes
  useTranslation();
  const current = currentUiLang();

  return (
    <div
      role="radiogroup"
      aria-label="Language"
      className="relative inline-flex items-center gap-1 rounded-full border border-foreground/10 bg-foreground/5 p-1"
    >
      {LANGS.map(({ code, label }) => {
        const active = code === current;
        return (
          <button
            key={code}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => {
              if (!active) applyUiLang(code);
            }}
            className={`relative z-10 rounded-full px-3 py-1 text-sm font-medium transition-colors ${
              active ? "text-white" : "text-foreground/70 hover:text-foreground"
            } ${code === "ar" ? "font-heading" : ""}`}
          >
            {active && (
              <motion.span
                layoutId="lang-pill"
                transition={{ type: "spring", stiffness: 450, damping: 32 }}
                className="absolute inset-0 -z-10 rounded-full bg-primary"
              />
            )}
            {label}
          </button>
        );
      })}
    </div>
  );
}
