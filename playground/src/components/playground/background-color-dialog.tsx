import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

import { usePlaygroundStore } from "@/stores/playground";
import { useState } from "react";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ColorCard } from "./live-preview/color-card";

import { tailwindColors } from "@/static/tailwind-colors";
import { ColorSelect } from "../colors/color-select";
import { ShadeSelect } from "../colors/shade-select";

export function BackgroundColorDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { form, setBackground } = usePlaygroundStore();

  const [selectedColor, setSelectedColor] = useState(
    form.metadata.backgroundColor,
  );
  const [selectedShade, setSelectedShade] = useState(
    form.metadata.backgroundShade.toString(),
  );

  const handleSave = () => {
    setBackground({
      color: selectedColor,
      shade: parseInt(selectedShade),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl leading-none tracking-tight">
            Customize background
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-500 dark:text-zinc-400">
            Customize the background color of the form with colors from the
            Tailwind CSS palette.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2 sm:flex-row">
          <ColorSelect value={selectedColor} onValueChange={setSelectedColor} />
          <ShadeSelect
            selectedColor={selectedColor}
            value={selectedShade}
            onValueChange={setSelectedShade}
          />
        </div>
        <div>
          <ColorCard
            className="h-32 w-full"
            color={tailwindColors[selectedColor][parseInt(selectedShade)]}
            name="Selected color"
            description={`${selectedColor}-${selectedShade} (${tailwindColors[selectedColor][parseInt(selectedShade)]})`}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave} type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
