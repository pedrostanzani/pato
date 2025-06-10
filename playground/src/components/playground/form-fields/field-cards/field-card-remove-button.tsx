import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Trash2 } from "lucide-react";

export function FieldCardRemoveButton({ onRemove }: { onRemove: () => void }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            className="text-zinc-800 transition-colors hover:text-red-600"
            onClick={onRemove}
            variant="outline"
          >
            <Trash2 />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Remove field</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
