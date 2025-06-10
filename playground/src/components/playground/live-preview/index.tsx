"use client";
import { CodePreview } from "./code-preview";
import { Fragment } from "react";
import { cn } from "@/lib/utils";
import type { FormDefinition, FormField } from "@/types/form";
import { FormPreview } from "./form-preview";
import z from "zod";

export function LivePreview({
  form,
  currentTab,
  compiledCode,
}: {
  form: FormDefinition;
  currentTab: "form" | "code";
  compiledCode: string;
}) {
  const { formSchema, defaultValues } = generateFormZodSchema(form.fields);

  return (
    <Fragment>
      <FormPreview
        className={cn(currentTab !== "form" && "hidden")}
        form={form}
        formSchema={formSchema}
        defaultValues={defaultValues}
      />
      <CodePreview
        className={cn(currentTab !== "code" && "hidden")}
        sourceCode={compiledCode}
      />
    </Fragment>
  );
}

function parseField(field: FormField) {
  switch (field.type) {
    case "string_field":
      return {
        fieldZodSchema: field.properties.required
          ? z.string().min(1)
          : z.string().optional(),
        defaultValue: "",
      };

    case "select_field":
      const options = field.properties.options;
      if (!options) {
        return null;
      }

      return {
        fieldZodSchema: z.enum(options as [string, ...string[]]),
        defaultValue: undefined,
      };

    case "checkbox_field":
      return {
        fieldZodSchema: z.boolean().default(false),
        defaultValue: false,
      };
  }

  return null;
}

function generateFormZodSchema(fields: FormField[]) {
  const defaultValues: Record<string, any> = {};
  const schemaShape: Record<string, z.ZodTypeAny> = {};

  fields.forEach((field) => {
    const parsedField = parseField(field);
    if (!parsedField) return;

    const { fieldZodSchema, defaultValue } = parsedField;
    schemaShape[field.name] = fieldZodSchema;
    defaultValues[field.name] = defaultValue;
  });

  return {
    formSchema: z.object(schemaShape),
    defaultValues,
  };
}
