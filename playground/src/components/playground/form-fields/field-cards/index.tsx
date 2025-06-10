import { FieldType, FieldWithId } from "@/core/types";

import { StringFieldCard } from "./string-field-card";
import { EnumFieldCard } from "./enum-field-card";
import { BooleanFieldCard } from "./boolean-field-card";

export function FieldCard({
  field
}: {
  field: FieldWithId
}) {
  switch (field.type) {
    case FieldType.String:
      return <StringFieldCard field={field} />

    case FieldType.Enum:
      return <EnumFieldCard field={field} />

    case FieldType.Boolean:
      return <BooleanFieldCard field={field} />

    default:
      break;
  }

  return null;
}
