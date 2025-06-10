import { Fragment, useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogTooltipTrigger } from "@/components/dialog-tooltip-trigger";

import { usePlaygroundStore } from "@/stores/playground";
import { WithIdAndKey, BooleanField } from "@/core/types";
import { useHtmlDynamicId } from "@/hooks/use-html-dynamic-id";
import { FieldCardHeader } from "./field-card-header";
import { FieldCardRemoveButton } from "./field-card-remove-button";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { BooleanFieldSettings } from "../field-settings/boolean-field-settings";

export function BooleanFieldCard({ field }: { field: WithIdAndKey<BooleanField> }) {
  const [fieldSettingsDialogOpen, setFieldSettingsDialogOpen] = useState(false);

  const { setField, removeField } = usePlaygroundStore();
  const { getFormFieldId } = useHtmlDynamicId(field.id);

  return (
    <Fragment>
      <FieldCardHeader fieldType={field.type} fieldFormat={field.format} />
      <div className="flex justify-between gap-1.5">
        <div className="w-full space-y-2">
          <Label className="font-medium" htmlFor={getFormFieldId("label")}>
            Label
          </Label>
          <Input
            onChange={(e) =>
              setField(field.id, { ...field, label: e.target.value })
            }
            value={field.label}
            id={getFormFieldId("label")}
            placeholder="Label..."
          />
        </div>
        <div className="flex gap-1.5 self-end">
          <Dialog
            open={fieldSettingsDialogOpen}
            onOpenChange={setFieldSettingsDialogOpen}
          >
            <DialogTooltipTrigger tooltip="Field settings">
              <Button variant="outline">
                <Settings className="text-zinc-800" />
              </Button>
            </DialogTooltipTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle className="text-2xl leading-none tracking-tight mb-1">
                  Enum field
                </DialogTitle>
              </DialogHeader>
              <BooleanFieldSettings
                format={field.format}
                description={field.description ?? ""}
                asCard={field.asCard}
                onSave={(values) => {
                  setField(field.id, {
                    ...field,
                    format: values.format,
                    description: values.description,
                    asCard: values.asCard,
                  });
                  setFieldSettingsDialogOpen(false);
                }}
              />
            </DialogContent>
          </Dialog>
          <FieldCardRemoveButton onRemove={() => removeField(field.id)} />
        </div>
      </div>
    </Fragment>
  );
}
