import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ChatWindow from "./components/ChatWindow";
import HatAvatar, { type HatState } from "./components/HatAvatar";
import LanguageToggle from "./components/LanguageToggle";
import ResultReveal from "./components/ResultReveal";
import Sparkles from "./components/Sparkles";
import { useSortingHat } from "./hooks/useSortingHat";
import { applyUiLang } from "./lib/uiLang";
import bgImage from "./assets/Background.jpg";

export default function App() {
  const { t } = useTranslation();
  const hat = useSortingHat();
  const { language, result } = hat;

  const [speaking, setSpeaking] = useState(false);
  const [revealed, setRevealed] = useState(false);

  // The site follows the language the student picked in the chat.
  // English and French both use the English UI (no French translation file).
  useEffect(() => {
    if (language) applyUiLang(language === "ar" ? "ar" : "en");
  }, [language]);

  // Let the student read the hat's last words before the big reveal.
  useEffect(() => {
    if (!result) return;
    const id = window.setTimeout(() => setRevealed(true), 3500);
    return () => window.clearTimeout(id);
  }, [result]);

  const handleRestart = () => {
    setRevealed(false);
    setSpeaking(false);
    hat.restart();
  };

  const avatarState: HatState =
    hat.loading ? "thinking"
    : speaking ? "speaking"
    : "idle";

  return (
    <div className="relative flex h-dvh flex-col bg-[radial-gradient(ellipse_at_top,#2a2b40_0%,#171923_65%)]">
      {/* background image */}
      <img
        src={bgImage}
        alt=""
        aria-hidden="true"
        draggable={false}
        className="absolute inset-0 h-full w-full select-none object-cover object-center"
      />
      {/* dark overlay so text stays readable */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-b from-background/70 via-background/60 to-background/85"
      />
      <Sparkles />

      <header className="relative z-10 flex items-center justify-between px-4 py-3 sm:px-8">
        <h1 className="font-heading text-lg text-gold sm:text-2xl">
          {t("hat.title")}
        </h1>
        <LanguageToggle />
      </header>

      <main className="relative z-10 mx-auto flex min-h-0 w-full max-w-2xl flex-1 flex-col px-4 pb-4">
        <div className="flex flex-col items-center pb-3">
          <HatAvatar
            state={avatarState}
            className="h-32 w-28 sm:h-44 sm:w-40"
          />
          <p className="mt-1 text-center text-sm text-muted">
            {t("hat.subtitle")}
          </p>
        </div>

        <div className="min-h-0 flex-1 rounded-3xl border border-border/60 bg-section/70 backdrop-blur">
          <ChatWindow
            messages={hat.messages}
            phase={hat.phase}
            loading={hat.loading}
            error={hat.error}
            onSend={hat.send}
            onRetry={hat.retry}
            onSpeaking={setSpeaking}
          />
        </div>
      </main>

      {result && revealed && (
        <ResultReveal result={result} onRestart={handleRestart} />
      )}
    </div>
  );
}
