import { useEffect, useMemo, useRef, useState } from "react";

interface Props {
  text: string;
  speed?: number;
  onStart?: () => void;
  onProgress?: () => void;
  onDone?: () => void;
}

/** Use it with key={message.id} so every message starts from 0. */
export default function Typewriter({
  text,
  speed = 14,
  onStart,
  onProgress,
  onDone,
}: Props) {
  const chars = useMemo(() => Array.from(text), [text]);
  const [count, setCount] = useState(0);

  const callbacks = useRef({ onStart, onProgress, onDone });
  useEffect(() => {
    callbacks.current = { onStart, onProgress, onDone };
  });

  useEffect(() => {
    callbacks.current.onStart?.();
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      callbacks.current.onProgress?.();
      if (i >= chars.length) {
        window.clearInterval(id);
        callbacks.current.onDone?.(); // ← the missing line: the hat stops talking here
      }
    }, speed);

    return () => {
      window.clearInterval(id);
      callbacks.current.onDone?.(); // also stops the hat if the message is replaced mid-typing
    };
  }, [chars, speed]);

  return (
    <>
      {chars.slice(0, count).join("")}
      {count < chars.length && <span className="animate-pulse">▍</span>}
    </>
  );
}
