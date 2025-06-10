import { useState } from "react";

import { cn } from "@/lib/utils";

import { FormDemo } from "./form-demo";
import { Card } from "@/components/ui/card";
import { z } from "zod";
import type { FormDefinition } from "@/types/form";

export function FormPreview({
  form,
  className,
  formSchema,
  defaultValues,
}: {
  form: FormDefinition;
  className?: string;
  formSchema: z.ZodObject<
    Record<string, z.ZodTypeAny>,
    "strip",
    z.ZodTypeAny,
    {
      [x: string]: any;
    },
    {
      [x: string]: any;
    }
  >;
  defaultValues: Record<string, any>;
}) {
  const [formValues, setFormValues] = useState<Record<string, any>>({});

  if (form.fields.length === 0) {
    return (
      <Card
        className={cn(
          "flex min-h-96 flex-1 items-center justify-center px-4 text-center",
          className,
        )}
      >
        <p className="max-w-72 text-sm text-zinc-500">
          Start adding fields to the form to get started and then visualize the
          form preview.
        </p>
      </Card>
    );
  }

  return (
    <Card className={cn("relative min-h-96 overflow-hidden py-0", className)}>
      <FormDemo
        formSpec={form}
        formSchema={formSchema}
        defaultValues={defaultValues}
        formValues={formValues}
        setFormValues={setFormValues}
      />
    </Card>
  );
}
