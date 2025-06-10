import { useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { Check, Copy } from "lucide-react";

import { cn, formatTypeScriptCode } from "@/lib/utils";

export function CodePreview({ sourceCode, className }: { sourceCode: string, className?: string }) {
  const [html, setHTML] = useState<string>("");
  const [formattedSourceCode, setFormattedSourceCode] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);

  const sourceCodeToHTML = async (sourceCode: string) => {
    const formattedCode = await formatTypeScriptCode(sourceCode);
    setFormattedSourceCode(formattedCode);
    return await codeToHtml(formattedCode, {
      lang: "tsx",
      theme: "github-dark-high-contrast",
    });
  };

  const handleCopy = async () => {
    navigator.clipboard.writeText(formattedSourceCode);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  useEffect(() => {
    const getAndSetHTML = async () => {
      const html = await sourceCodeToHTML(sourceCode);
      setHTML(html);
    };

    getAndSetHTML();
  }, [sourceCode]);

  return (
    <div className={cn("relative min-h-96 overflow-hidden rounded-xl bg-[#090b0e]", className)}>
      <div
        className="max-h-96 overflow-y-scroll p-4 text-xs"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <div className="absolute top-0 right-0 pt-4 pr-3.5">
        <button
          onClick={handleCopy}
          className="flex h-[22px] w-[22px] items-center justify-center rounded-md bg-transparent transition-colors hover:bg-zinc-700"
        >
          {isCopied ? (
            <Check size={14} className="text-zinc-100" />
          ) : (
            <Copy size={14} className="text-zinc-100" />
          )}
        </button>
      </div>
    </div>
  );
}
