import { MousePointerClick } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { GitHub } from "@/icons/github";

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-[#e5e5e5] bg-[#e4e4e4]/95 px-4 py-5 backdrop-blur supports-[backdrop-filter]:bg-[#e4e4e4]/60 md:px-6 md:py-7">
      <div>
        <div className="flex items-center gap-1.5">
          <MousePointerClick className="h-6 w-6 fill-amber-500" />
          <span className="text-xl leading-none font-bold tracking-tight select-none">
            pato
          </span>
        </div>
      </div>
      <AnimatePresence>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={cn(
            "absolute left-1/2 -translate-x-1/2 hidden transform text-center font-medium tracking-tight text-balance whitespace-nowrap text-zinc-500 md:block",
          )}
        >
          The Pato programming language playground
        </motion.p>
      </AnimatePresence>
      <div className="absolute right-4 md:right-6">
        <a
          href="https://github.com/pedrostanzani/pato"
          target="_blank"
          rel="noopener noreferrer"
        >
          <GitHub className="fill-zinc-950 hover:fill-zinc-700 h-5 w-5" />
        </a>
      </div>
    </header>
  );
}
