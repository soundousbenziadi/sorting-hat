import { useState } from "react";
import { motion } from "framer-motion";

interface Dot {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
}

export default function Sparkles({ count = 22 }: { count?: number }) {
  const [dots] = useState<Dot[]>(() =>
    Array.from({ length: count }, (_, id) => ({
      id,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: 2 + Math.random() * 3,
      delay: Math.random() * 4,
      duration: 3 + Math.random() * 4,
    })),
  );

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 overflow-hidden"
    >
      {dots.map((d) => (
        <motion.span
          key={d.id}
          className="absolute rounded-full bg-gold"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
          }}
          animate={{ opacity: [0, 0.8, 0], y: [0, -24, -48] }}
          transition={{
            duration: d.duration,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
