"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { usePlaygroundStore } from "@/stores/playground";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
  formTitle: z.string().min(1, { message: "A form title is required" }),
  description: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

export function EditHeadingDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { form: formSpec, setMetadata } = usePlaygroundStore();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      formTitle: formSpec.metadata.heading,
      description: formSpec.metadata.description,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setMetadata({
      ...formSpec.metadata,
      heading: values.formTitle,
      description: values.description,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="mb-4 text-2xl leading-none tracking-tight">
            Customize heading and description
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-4 space-y-6">
                <FormField
                  control={form.control}
                  name="formTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Form title</FormLabel>
                      <FormControl>
                        <Input placeholder="My New Form..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Form description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="I built this form with formcn, shadcn/ui, React Hook Form and Zod..."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
