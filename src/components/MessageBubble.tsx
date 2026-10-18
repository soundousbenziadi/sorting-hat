import { motion } from "framer-motion";
import Typewriter from "./Typewriter";
import type { ChatMessage } from "../types";

interface Props {
  message: ChatMessage;
  animate: boolean;
  onSpeaking?: (speaking: boolean) => void;
  onTick?: () => void;
}

export default function MessageBubble({
  message,
  animate,
  onSpeaking,
  onTick,
}: Props) {
  const isHat = message.from === "hat";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`max-w-[85%] rounded-2xl px-4 py-3 text-[15px] leading-relaxed shadow-lg ${
        isHat ?
          "self-start rounded-ss-sm border border-gold/40 bg-parchment text-background"
        : "self-end rounded-se-sm bg-primary text-foreground"
      }`}
    >
      <p dir="auto" className="whitespace-pre-wrap">
        {isHat && animate ?
          <Typewriter
            text={message.text}
            onStart={() => onSpeaking?.(true)}
            onProgress={onTick}
            onDone={() => onSpeaking?.(false)}
          />
        : message.text}
      </p>
    </motion.div>
  );
}
