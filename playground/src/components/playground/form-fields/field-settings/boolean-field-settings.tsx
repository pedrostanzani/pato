import React from "react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { BooleanFieldFormat } from "@/core/types";

import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  format: z.nativeEnum(BooleanFieldFormat),
  description: z.string(),
  asCard: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export function BooleanFieldSettings({
  format,
  description,
  asCard,
  onSave,
}: {
  format: BooleanFieldFormat;
  description: string;
  asCard: boolean;
  onSave: (values: FormValues) => void;
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      format: format,
      description: description,
      asCard: asCard,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-6">
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
                  <SelectItem value="checkbox">Checkbox</SelectItem>
                  <SelectItem value="switch">Switch</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="You can include an optional description here..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                The description will be displayed below the field.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-2.5">
          <FormField
            control={form.control}
            name="asCard"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg">
                <div className="space-y-1">
                  <FormLabel>Render field as card</FormLabel>
                  <FormDescription>
                    Boolean fields can be rendered as a card — which will add a
                    border and padding.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <div className="flex h-40 w-full items-center justify-center rounded-sm bg-slate-100 p-8">
            <div className="flex flex-row items-start space-y-0 space-x-3 rounded-md border border-zinc-200 bg-white p-4">
              <Checkbox className="cursor-default data-[state=checked]:bg-slate-200 data-[state=checked]:text-zinc-900 data-[state=checked]:border-slate-200" checked />
              <div className="space-y-1 leading-none">
                <p className="flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50 data-[error=true]:text-red-600 dark:data-[error=true]:text-red-500">
                  This is a boolean field rendered as a card.
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 select-none ">
                  Looks great, right?
                </p>
              </div>
            </div>
          </div>
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
