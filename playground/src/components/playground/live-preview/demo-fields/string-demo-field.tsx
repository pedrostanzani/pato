import { type Control, type FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { FormField as FormFieldDefinition } from "@/types/form";

export function StringDemoField({
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
        <FormItem>
          {fieldSpec.properties.label && <FormLabel>{fieldSpec.properties.label}</FormLabel>}
          <FormControl>
            <Input placeholder={fieldSpec.properties.placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
