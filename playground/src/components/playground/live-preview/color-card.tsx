import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn, getTextColorBasedOnBackground, isCloseToWhite } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";

export const ColorCard = ({
  color,
  name,
  description,
  className,
}: {
  color: string;
  name: string;
  description: string;
  className?: string;
}) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    setIsCopied(true);
    navigator.clipboard.writeText(color);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        "group flex h-48 cursor-pointer flex-col justify-between rounded-lg border border-transparent p-3 text-sm font-semibold transition-all hover:opacity-95",
        isCloseToWhite(color, 5) && "border-zinc-200",
        className,
      )}
      style={{
        backgroundColor: color,
        color: getTextColorBasedOnBackground(color),
      }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isCopied ? (
          <motion.div
            key="check"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.075 }}
            className="self-end"
          >
            <Check className="h-4 w-4 transition-opacity group-hover:opacity-90" />
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.075 }}
            className="self-end"
          >
            <Copy className="h-4 w-4 transition-opacity group-hover:opacity-90" />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="text-start select-none">
        <p>{name}</p>
        <p className="text-xs font-normal opacity-75">{description}</p>
      </div>
    </button>
  );
};
