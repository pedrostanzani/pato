import type { FormDefinition, FormField } from "./types";

export class FormGenerator {
  private static generateZodSchema(fields: FormField[]): string {
    const schemaEntries = fields.map((field) => {
      let validation = "";
      switch (field.type) {
        case "string_field":
          validation = `z.string()${field.properties.required ? ".min(1, 'This field is required')" : ""}`;
          break;
        case "select_field":
          validation = `z.string()${field.properties.required ? ".min(1, 'This field is required')" : ""}`;
          break;
        case "checkbox_field":
          validation = `z.boolean()${field.properties.required ? ".refine((val) => val === true, 'This field is required')" : ""}`;
          break;
      }
      return `  ${field.name}: ${validation}`;
    });

    return `const formSchema = z.object({\n${schemaEntries.join(",\n")}\n});`;
  }

  private static generateFormField(field: FormField): string {
    const { name, type, properties } = field;
    const label = properties.label;
    const placeholder = properties.placeholder || "";
    const required = properties.required;

    switch (type) {
      case "string_field":
        return `
        <FormField
          control={form.control}
          name="${name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${label}</FormLabel>
              <FormControl>
                <Input placeholder="${placeholder}" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />`;

      case "select_field":
        const options = properties.options || [];
        if (!Array.isArray(options)) {
          throw new Error(`Options for select field "${name}" must be an array`);
        }
        const optionsList = options
          .map((opt) => `<SelectItem value="${opt}">${opt}</SelectItem>`)
          .join("\n");
        return `
        <FormField
          control={form.control}
          name="${name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${label}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="${placeholder}" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  ${optionsList}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />`;

      case "checkbox_field":
        return `
        <FormField
          control={form.control}
          name="${name}"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>${label}</FormLabel>
              </div>
            </FormItem>
          )}
        />`;
    }
  }

  public static generateFormComponent(form: FormDefinition): string {
    const formName = form.name.charAt(0).toUpperCase() + form.name.slice(1) + "Form";
    const schema = this.generateZodSchema(form.fields);
    const formFields = form.fields.map((field) => this.generateFormField(field)).join("\n");

    return `"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

${schema}

export function ${formName}() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ${form.fields.map(f => `${f.name}: ${f.type === "checkbox_field" ? "false" : '""'}`).join(",\n      ")}
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        ${formFields}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}`;
  }

  public static generateForms(forms: FormDefinition[]): string[] {
    return forms.map((form) => this.generateFormComponent(form));
  }
} 