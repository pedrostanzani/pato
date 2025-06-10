import { Square } from "lucide-react";

import { FieldFormat, FieldType } from "@/core/types";
import { fieldSections } from "@/core/static/field-sections";
import { fieldFormats } from "@/core/static/field-formats";
import { cn, isTruthy } from "@/lib/utils";

export function FieldCardHeader({
  fieldType,
  fieldFormat,
}: {
  fieldType: FieldType;
  fieldFormat: FieldFormat;
}) {
  const fieldSection = fieldSections.find(
    (section) => section.type === fieldType,
  );

  const fieldFormatData = fieldFormats
    .find((format) => format.type === fieldType)
    ?.formats.find((format) => format.format === fieldFormat);

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-sm font-mono text-xs leading-none font-bold text-white select-none",
          fieldSection?.accentBackground ?? "bg-zinc-500",
        )}
      >
        {fieldSection?.icon ? (
          <fieldSection.icon className="h-5 w-5" />
        ) : (
          <Square className="h-5 w-5" />
        )}
      </div>
      <div className="flex flex-col justify-center gap-1 pt-px">
        <span className="leading-none font-medium tracking-tight">
          {isTruthy(fieldSection?.sectionName)
            ? fieldSection.sectionName.slice(0, -1)
            : "Unknown field"}
        </span>
        <span className="text-sm leading-none tracking-tight text-zinc-500">
          {isTruthy(fieldFormatData?.label)
            ? fieldFormatData.label
            : "Unknown format"}
        </span>
      </div>
    </div>
  );
}
