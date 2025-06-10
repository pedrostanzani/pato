import { z } from "zod";

export type FieldType = "string_field" | "select_field" | "checkbox_field";

export interface FormField {
  type: FieldType;
  name: string;
  properties: {
    label: string;
    placeholder?: string;
    required: boolean;
    options?: string[];
  };
}

export interface FormDefinition {
  name: string;
  fields: FormField[];
}

export type FormSchema = z.ZodType<any, any, any>; 