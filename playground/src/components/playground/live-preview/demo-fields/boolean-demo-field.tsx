import { type Control, type FieldValues, type UseFormReturn } from "react-hook-form";

import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { FormField as FormFieldDefinition } from "@/types/form";

export function BooleanDemoField({
  field: fieldSpec,
  formControl,
}: {
  field: FormFieldDefinition;
  formControl: Control<FieldValues> | undefined;
}) {
  return (
    <FormField
      control={formControl}
      name={fieldSpec.name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-start space-y-0 space-x-2",
            "space-x-3 rounded-md border border-zinc-200 p-4"
          )}
        >
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel>{fieldSpec.properties.label}</FormLabel>
          </div>
        </FormItem>
      )}
    />
  );
}
