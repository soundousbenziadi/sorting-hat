import { useCallback, useEffect, useRef, useState } from "react";
import { HatNetworkError, sendToHat } from "../lib/api";
import type { ChatMessage, HatResult, Lang } from "../types";

export type Phase = "language" | "chatting" | "decided";

export function useSortingHat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [language, setLanguage] = useState<Lang | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<HatResult | null>(null);

  // A new page load = a new student = a new session. Nothing is persisted.
  const sessionId = useRef(crypto.randomUUID());
  const turn = useRef(0);
  const pending = useRef<string | null>(null); // message to resend on retry
  const generation = useRef(0); // lets us ignore answers from an old session
  const busy = useRef(false);
  const started = useRef(false);

  const push = useCallback((from: ChatMessage["from"], text: string) => {
    setMessages((m) => [...m, { id: crypto.randomUUID(), from, text }]);
  }, []);

  const request = useCallback(
    async (message: string) => {
      if (busy.current) return;
      busy.current = true;
      pending.current = message;
      setLoading(true);
      setError(null);
      const gen = generation.current;

      try {
        const res = await sendToHat({
          sessionId: sessionId.current,
          message,
          turn: turn.current,
        });
        if (gen !== generation.current) return;

        if (res.status === "error") {
          setError(res.code);
          return;
        }

        turn.current += 1; // only advance when the hat really answered
        pending.current = null;
        if (res.language) setLanguage(res.language);
        push("hat", res.message);
        if (res.status === "decided") setResult(res.result);
      } catch (e) {
        if (gen !== generation.current) return;
        setError(e instanceof HatNetworkError ? e.code : "unknown");
      } finally {
        if (gen === generation.current) {
          busy.current = false;
          setLoading(false);
        }
      }
    },
    [push],
  );

  // First message: the hat greets and asks for a language.
  // The ref guard stops React StrictMode (dev) from sending __start__ twice.
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void request("__start__");
  }, [request]);

  const send = useCallback(
    (text: string) => {
      const clean = text.trim().slice(0, 500);
      if (!clean || busy.current || result) return;
      push("student", clean);
      void request(clean);
    },
    [push, request, result],
  );

  const retry = useCallback(() => {
    if (pending.current) void request(pending.current);
  }, [request]);

  const restart = useCallback(() => {
    generation.current += 1; // invalidate anything still in flight
    sessionId.current = crypto.randomUUID();
    turn.current = 0;
    pending.current = null;
    busy.current = false;
    setMessages([]);
    setLanguage(null);
    setResult(null);
    setError(null);
    setLoading(false);
    void request("__start__");
  }, [request]);

  const phase: Phase =
    result ? "decided"
    : language ? "chatting"
    : "language";

  return {
    messages,
    language,
    phase,
    loading,
    error,
    result,
    send,
    retry,
    restart,
  };
}
