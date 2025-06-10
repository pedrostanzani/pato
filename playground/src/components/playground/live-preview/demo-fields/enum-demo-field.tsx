import { type Control, type FieldValues } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { FormField as FormFieldDefinition } from "@/types/form";

export function EnumDemoField({
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
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger className="w-[320px]">
                  <SelectValue placeholder={fieldSpec.properties.placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {fieldSpec.properties.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    );
}
