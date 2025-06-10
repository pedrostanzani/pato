"use client";
import { Undo, Redo } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function UndoRedo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="transition-colors" variant="outline" size="icon">
            <Undo className="h-4 w-4" />
            <span className="sr-only">Undo</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Undo</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button className="transition-colors" variant="outline" size="icon">
            <Redo className="h-4 w-4" />
            <span className="sr-only">Redo</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>Redo</TooltipContent>
      </Tooltip>
    </div>
  );
}
