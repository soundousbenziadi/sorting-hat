import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import MessageBubble from "./MessageBubble";
import type { ChatMessage } from "../types";
import type { Phase } from "../hooks/useSortingHat";

// Sent as plain text; the hat understands them and replies in that language.
const LANGUAGE_CHOICES = ["العربية", "English", "Français"];

interface Props {
  messages: ChatMessage[];
  phase: Phase;
  loading: boolean;
  error: string | null;
  onSend: (text: string) => void;
  onRetry: () => void;
  onSpeaking: (speaking: boolean) => void;
}

export default function ChatWindow({
  messages,
  phase,
  loading,
  error,
  onSend,
  onRetry,
  onSpeaking,
}: Props) {
  const { t } = useTranslation();
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollDown = useCallback(() => {
    const el = listRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollDown();
  }, [messages, loading, error, scrollDown]);

  useEffect(() => {
    if (!loading && phase !== "decided") inputRef.current?.focus();
  }, [loading, phase]);

  // Only the newest message, if it comes from the hat, gets the typewriter effect.
  const last = messages[messages.length - 1];
  const animatedId = last && last.from === "hat" ? last.id : null;

  const showLanguageChoices =
    phase === "language" && !loading && !error && messages.length > 0;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    onSend(text);
    setText("");
  };

  return (
    <div className="flex h-full flex-col">
      <div
        ref={listRef}
        aria-live="polite"
        className="flex flex-1 flex-col gap-3 overflow-y-auto p-4 sm:p-5"
      >
        {messages.map((m) => (
          <MessageBubble
            key={m.id}
            message={m}
            animate={m.id === animatedId}
            onSpeaking={onSpeaking}
            onTick={scrollDown}
          />
        ))}

        {loading && (
          <div className="flex items-center gap-2 self-start text-sm text-muted">
            <span className="flex gap-1" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2 w-2 rounded-full bg-gold"
                  animate={{ opacity: [0.2, 1, 0.2], y: [0, -3, 0] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    delay: i * 0.15,
                  }}
                />
              ))}
            </span>
            {t("hat.thinking")}
          </div>
        )}

        {showLanguageChoices && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-center gap-2 self-start"
          >
            <span className="text-sm text-muted">
              {t("hat.chooseLanguage")}
            </span>
            {LANGUAGE_CHOICES.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onSend(l)}
                className="rounded-full border border-gold/60 px-4 py-1.5 text-sm text-gold transition-colors hover:bg-gold hover:text-background"
              >
                {l}
              </button>
            ))}
          </motion.div>
        )}

        {error && (
          <div className="flex flex-wrap items-center gap-3 self-start rounded-2xl border border-primary/60 bg-primary/20 px-4 py-3 text-sm">
            <span>{t("hat.error")}</span>
            <button
              type="button"
              onClick={onRetry}
              className="rounded-full bg-gold px-4 py-1 font-medium text-background hover:opacity-90"
            >
              {t("hat.retry")}
            </button>
          </div>
        )}
      </div>

      {phase !== "decided" && (
        <form
          onSubmit={submit}
          className="flex items-center gap-2 border-t border-border/60 p-3 sm:p-4"
        >
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            dir="auto"
            maxLength={500}
            disabled={loading || !!error}
            placeholder={t("hat.placeholder")}
            className="min-w-0 flex-1 rounded-full border border-border bg-surface px-5 py-3 text-foreground placeholder:text-muted focus:border-gold focus:outline-none disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={loading || !!error || !text.trim()}
            className="rounded-full bg-gold px-5 py-3 font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {t("hat.send")}
          </button>
        </form>
      )}
    </div>
  );
}
