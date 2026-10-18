import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import hatClosed from "../assets/sortingHatClosed.png";
import hatOpen from "../assets/sortingHatOpened.png";

export type HatState = "idle" | "thinking" | "speaking";

interface Props {
  state?: HatState;
  className?: string;
}

const FLOAT = { duration: 4.5, repeat: Infinity, ease: "easeInOut" } as const;

/** Toggles the mouth at slightly irregular intervals while the hat speaks. */
function useMouthFlap(active: boolean) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!active) return;
    let timer: number;
    const tick = () => {
      setOpen((o) => !o);
      timer = window.setTimeout(tick, 110 + Math.random() * 130);
    };
    timer = window.setTimeout(tick, 100);
    return () => window.clearTimeout(timer);
  }, [active]);

  return active && open; // always closed when not speaking
}

export default function HatAvatar({ state = "idle", className = "" }: Props) {
  const thinking = state === "thinking";
  const speaking = state === "speaking";
  const mouthOpen = useMouthFlap(speaking);

  return (
    <div className={`relative ${className}`}>
      {/* soft golden glow behind the hat */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10 rounded-full bg-gold/25 blur-3xl"
        animate={{
          opacity:
            thinking ? [0.3, 0.9, 0.3]
            : speaking ? [0.3, 0.6, 0.3]
            : 0.3,
        }}
        transition={{ duration: thinking ? 1.1 : 0.9, repeat: Infinity }}
      />

      {/* both images move together inside this wrapper */}
      <motion.div
        className="relative h-full w-full drop-shadow-[0_12px_28px_rgba(197,164,93,0.3)]"
        style={{ transformOrigin: "bottom center" }}
        animate={{
          y: thinking ? [0, -6, 0] : [0, -10, 0],
          rotate: thinking ? [-5, 5, -5] : [-1.5, 1.5, -1.5],
        }}
        transition={{
          y: thinking ? { ...FLOAT, duration: 1.1 } : FLOAT,
          rotate: thinking ? { ...FLOAT, duration: 1.1 } : FLOAT,
        }}
      >
        {/* both are always in the DOM, so the open-mouth image is preloaded (no flash) */}
        <img
          src={hatClosed}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-contain"
          style={{ opacity: mouthOpen ? 0 : 1 }}
        />
        <img
          src={hatOpen}
          alt=""
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-contain"
          style={{ opacity: mouthOpen ? 1 : 0 }}
        />
      </motion.div>

      {/* sparkles while the hat is thinking */}
      {thinking &&
        [
          { left: "8%", top: "20%", delay: 0 },
          { left: "88%", top: "30%", delay: 0.3 },
          { left: "75%", top: "8%", delay: 0.6 },
        ].map((s) => (
          <motion.span
            key={`${s.left}-${s.top}`}
            aria-hidden="true"
            className="absolute h-2 w-2 rounded-full bg-gold"
            style={{ left: s.left, top: s.top }}
            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.6, 0.5] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: s.delay }}
          />
        ))}
    </div>
  );
}
