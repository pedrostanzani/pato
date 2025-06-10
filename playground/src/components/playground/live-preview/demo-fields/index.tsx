import { StringDemoField } from "./string-demo-field";
import { EnumDemoField } from "./enum-demo-field";
import { type Control, type FieldValues, type UseFormReturn } from "react-hook-form";
import { BooleanDemoField } from "./boolean-demo-field";
import type { FormField } from "@/types/form";

export function DemoField({
  field,
  formControl,
}: {
  field: FormField;
  formControl: Control<FieldValues> | undefined;
}) {
  switch (field.type) {
    case "string_field":
      return <StringDemoField field={field} formControl={formControl} />;

    case "select_field":
      return (
        <EnumDemoField field={field} formControl={formControl} />
      );

    case "checkbox_field":
      return (
        <BooleanDemoField field={field} formControl={formControl} />
      );

    default:
      break;
  }

  return null;
}
