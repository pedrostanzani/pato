import React from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { StringFieldFormat } from "@/core/types";

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

const formSchema = z.object({
  placeholder: z.string(),
  format: z.nativeEnum(StringFieldFormat),
});

type FormValues = z.infer<typeof formSchema>;

export function StringFieldSettings({
  placeholder,
  format,
  onSave,
}: {
  placeholder: string;
  format: StringFieldFormat;
  onSave: (values: FormValues) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      placeholder: placeholder,
      format: format,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="mt-2 space-y-6">
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
                  <SelectItem value="input">Input</SelectItem>
                  <SelectItem value="textarea">Textarea</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="password">Password</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
