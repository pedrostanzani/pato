import { Fragment, useState } from "react";
import { Settings } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { usePlaygroundStore } from "@/stores/playground";
import { WithIdAndKey, EnumField } from "@/core/types";
import { useHtmlDynamicId } from "@/hooks/use-html-dynamic-id";
import { FieldCardHeader } from "./field-card-header";
import { EnumFieldSettings } from "../field-settings/enum-field-settings";
import { FieldCardRemoveButton } from "./field-card-remove-button";
import { DialogTooltipTrigger } from "@/components/dialog-tooltip-trigger";

export function EnumFieldCard({ field }: { field: WithIdAndKey<EnumField> }) {
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
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="text-2xl leading-none tracking-tight">Enum field</DialogTitle>
                <DialogDescription>
                  Make changes to your form field here. Click save when
                  you&apos;re done.
                </DialogDescription>
              </DialogHeader>
              <EnumFieldSettings
                placeholder={field.placeholder ?? ""}
                format={field.format}
                options={field.options.map((option) => ({
                  name: option.label,
                  value: option.value,
                }))}
                onSave={(values) => {
                  setField(field.id, {
                    ...field,
                    options: values.options.map((option) => ({
                      label: option.name,
                      value: option.value,
                    })),
                    placeholder: values.placeholder,
                    format: values.format,
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
