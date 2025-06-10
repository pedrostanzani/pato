"use client";
import { useCallback, useEffect, useState } from "react";
import { codeToHtml } from "shiki";
import { Check, Copy } from "lucide-react";

import { cn } from "@/lib/utils";
import { usePlaygroundStore } from "@/stores/playground";
import { Button } from "@/components/ui/button";

export function PayloadPreview({ className }: { className?: string }) {
  const { payloadPreview: formattedCode, setPayloadPreview } =
    usePlaygroundStore();

  const [html, setHTML] = useState<string>("");
  const [formattedSourceCode, setFormattedSourceCode] = useState<string>("");
  const [isCopied, setIsCopied] = useState(false);

  const sourceCodeToHTML = useCallback(async () => {
    setFormattedSourceCode(formattedCode ?? "");
    return await codeToHtml(formattedCode ?? "", {
      lang: "json",
      theme: "github-dark-high-contrast",
    });
  }, [formattedCode]);

  const handleCopy = async () => {
    navigator.clipboard.writeText(formattedSourceCode);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  useEffect(() => {
    const getAndSetHTML = async () => {
      const html = await sourceCodeToHTML();
      setHTML(html);
    };

    getAndSetHTML();
  }, [formattedCode, sourceCodeToHTML]);

  if (!formattedCode) {
    return null;
  }

  return (
    <div>
      <h2 className="mb-0.5 text-xl font-bold tracking-tight">
        Request body preview
      </h2>
      <p className="mb-4 text-sm text-zinc-500">
        When your form gets submitted, these values will be sent to the server.
        Hit the submit button to refresh them!
      </p>
      <div
        className={cn(
          "relative mb-2 min-h-48 overflow-hidden rounded-xl bg-[#090b0e]",
          className,
        )}
      >
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
      <div>
        <Button
          onClick={() => {
            setPayloadPreview(null);
          }}
          variant="outline"
        >
          Clear preview
        </Button>
      </div>
    </div>
  );
}
