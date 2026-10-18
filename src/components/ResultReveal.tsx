import { motion, type Variants } from "framer-motion";
import { useTranslation } from "react-i18next";
import { getHouseTheme } from "../lib/houses";
import type { HatResult } from "../types";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.4, delayChildren: 0.5 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const label = "text-xs text-gold tracking-[0.2em] rtl:tracking-normal";

interface Props {
  result: HatResult;
  onRestart: () => void;
}

export default function ResultReveal({ result, onRestart }: Props) {
  const { t } = useTranslation();
  const { primary_house: house, alternative_role: role } = result;
  const theme = getHouseTheme(house.id);

  const houseName = t(`houses.${house.id}`, { defaultValue: house.name });
  const roleName = t(`roles.${role.id}`, { defaultValue: role.name });

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-y-auto bg-background/95 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="mx-auto flex min-h-full max-w-xl items-center px-4 py-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className={`relative w-full overflow-hidden rounded-3xl border-2 bg-section p-6 sm:p-8 ${theme.border} ${theme.glow}`}
        >
          <div
            className={`pointer-events-none absolute inset-x-0 top-0 h-48 bg-linear-to-b ${theme.gradient} to-transparent`}
          />

          <div className="relative flex flex-col items-center text-center">
            <motion.img
              src={theme.image}
              alt=""
              draggable={false}
              initial={{ scale: 0, rotate: -35 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 160,
                damping: 12,
                delay: 0.1,
              }}
              className="h-28 w-28 select-none object-contain drop-shadow-[0_0_25px_rgba(197,164,93,0.5)] sm:h-32 sm:w-32"
            />

            <motion.p variants={item} className={`mt-5 ${label}`}>
              {t("hat.result.house")}
            </motion.p>
            <motion.h2
              variants={item}
              className="mt-1 font-heading text-4xl text-gold sm:text-5xl"
            >
              {houseName}
            </motion.h2>

            <motion.p
              variants={item}
              dir="auto"
              className="mt-3 text-lg text-parchment"
            >
              {t("hat.result.youAre")}{" "}
              <span className="font-semibold">{result.personality_type}</span>
            </motion.p>

            <motion.p
              variants={item}
              dir="auto"
              className="mt-4 leading-relaxed text-foreground/90"
            >
              {result.personality_paragraph}
            </motion.p>

            <motion.p
              variants={item}
              dir="auto"
              className="mt-3 text-sm text-muted"
            >
              {house.reason}
            </motion.p>
          </div>

          <motion.div
            variants={item}
            className="relative mt-6 rounded-2xl border border-border bg-surface/70 p-4"
          >
            <p className={label}>{t("hat.result.role")}</p>
            <p className="mt-1 font-heading text-xl text-parchment">
              {roleName}
            </p>
            <p dir="auto" className="mt-1 text-sm text-muted">
              {role.reason}
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="relative mt-4 rounded-2xl border border-dashed border-gold/50 p-4"
          >
            <p className={label}>{t("hat.result.quest")}</p>
            <p dir="auto" className="mt-1 text-parchment">
              {result.first_quest}
            </p>
          </motion.div>

          <motion.div
            variants={item}
            className="relative mt-6 flex justify-center"
          >
            <button
              type="button"
              onClick={onRestart}
              className="rounded-full bg-gold px-6 py-3 font-medium text-background transition-opacity hover:opacity-90"
            >
              {t("hat.next")}
            </button>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
}
