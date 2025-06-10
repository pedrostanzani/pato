import React from "react";

import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { EnumFieldFormat } from "@/core/types";

import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
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
import { Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  placeholder: z.string(),
  options: z
    .array(
      z.object({
        name: z.string().min(1),
        value: z.string().min(1),
      }),
    )
    .min(1),
  format: z.nativeEnum(EnumFieldFormat),
});

type FormValues = z.infer<typeof formSchema>;

export function EnumFieldSettings({
  placeholder,
  format,
  options,
  onSave,
}: {
  placeholder?: string;
  format: EnumFieldFormat;
  options: { name: string; value: string }[];
  onSave: (values: FormValues) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      placeholder: placeholder,
      format: format,
      options: options,
    },
  });

  const {
    fields: optionFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: "options",
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input placeholder="Placeholder" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Input format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select an input format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="select">Select</SelectItem>
                  <SelectItem value="combobox">Combobox</SelectItem>
                  <SelectItem value="radio">Radio Group</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="my-4" />

        <div className="flex flex-col gap-2">
          <FormLabel className="pb-1">Options</FormLabel>
          <ul className="space-y-2">
            {optionFields.map((optionField, index) => (
              <li key={optionField.id} className="flex items-center space-x-2">
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...form.register(`options.${index}.name`)}
                  />
                </FormControl>
                <FormControl>
                  <Input
                    placeholder="Value"
                    {...form.register(`options.${index}.value`)}
                  />
                </FormControl>
                <Button
                  type="button"
                  onClick={() => remove(index)}
                  variant="outline"
                  className="text-zinc-800 hover:text-red-600"
                >
                  <Trash2 />
                </Button>
              </li>
            ))}
          </ul>
          <Button
            type="button"
            onClick={() => append({ name: "", value: "" })}
            size="sm"
            className="self-start"
            variant="outline"
          >
            Add option
          </Button>
        </div>

        <DialogFooter>
          <Button disabled={!form.formState.isValid} type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
