"use client";

import {
  CornerDownRight,
  LetterText,
  Paintbrush,
  PaintBucket,
  SquareX,
  TextCursorInput,
  Trash2,
} from "lucide-react";
import { usePlaygroundStore } from "@/stores/playground";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { NewFieldDialog } from "../form-fields/new-field-dialog";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { cn } from "@/lib/utils";
import { UndoRedo } from "./undo-redo";
import { useEffect, useState } from "react";

function useToolbarResize() {
  const { ref, width } = useResizeObserver();
  const { setCompactToolbar } = usePlaygroundStore();

  useEffect(() => {
    setCompactToolbar(width < 360);
  }, [width, setCompactToolbar]);

  return { ref };
}

export function Toolbar() {
  const [clearFormDialogOpen, setClearFormDialogOpen] = useState(false);
  const {
    form,
    compactToolbar,
    resetForm,
    setShowBackground,
    setBackgroundDialogOpen,
    setEditHeadingDialogOpen,
    setEditSubmitButtonDialogOpen,
  } = usePlaygroundStore();
  const { ref } = useToolbarResize();

  if (form.fields.length === 0) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "mb-3 flex justify-between gap-1 rounded-lg",
        compactToolbar && "flex-col gap-1.5 items-end",
      )}
    >
      <div className={cn("flex items-center gap-1")}>
        <NewFieldDialog />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="group transition-colors">
              <TextCursorInput className="h-4 w-4 transition-colors" />
              Form options
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Form options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {form.metadata.showBackground ? (
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="gap-2 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0">
                    <PaintBucket className="text-zinc-500" />
                    Background
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem
                        onClick={() => setBackgroundDialogOpen(true)}
                      >
                        <Paintbrush />
                        Change color
                      </DropdownMenuItem>
                      <DropdownMenuItem
                      className="group"
                        onClick={() => setTimeout(() => setShowBackground(false), 100)}
                      >
                        <Trash2 className="text-zinc-500 transition-colors group-hover:text-red-600" />
                        Remove background
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              ) : (
                <DropdownMenuItem onClick={() => setTimeout(() => setShowBackground(true), 100)}>
                  <PaintBucket />
                  Add background
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => setEditHeadingDialogOpen(true)}>
                <LetterText />
                Heading
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEditSubmitButtonDialogOpen(true)}>
                <CornerDownRight />
                Submit button
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="group" onClick={() => setClearFormDialogOpen(true)}>
                <SquareX className="text-zinc-500 transition-colors group-hover:text-red-600" />
                Clear form
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {/* <UndoRedo className={cn(compactToolbar && "order-first")} /> */}
      <AlertDialog
        open={clearFormDialogOpen}
        onOpenChange={setClearFormDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              If you clear the form, all the fields will be removed. This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                resetForm();
                setClearFormDialogOpen(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
