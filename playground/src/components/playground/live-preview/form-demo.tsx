import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form } from "@/components/ui/form";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { DemoField } from "./demo-fields";
import {
  cn,
  getTailwindColorHex,
  getTextColorBasedOnBackground,
} from "@/lib/utils";
import type { FormDefinition } from "@/types/form";

type FormDemoProps = {
  formSpec: FormDefinition;
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
  formValues: Record<string, any>;
  setFormValues: (values: Record<string, any>) => void;
};

export const FormDemo: React.FC<FormDemoProps> = ({
  formSpec,
  formSchema,
  setFormValues,
}) => {
  // const {
  //   form: formSpec,
  //   setPayloadPreview,
  //   setEditHeadingDialogOpen,
  //   setEditSubmitButtonDialogOpen
  // } = usePlaygroundStore();

  // const submitButtonColor = useMemo(() => {
  //   return tailwindColors[formSpec.metadata.submitButtonColor][
  //     formSpec.metadata.submitButtonShade
  //   ];
  // }, [
  //   formSpec.metadata.submitButtonColor,
  //   formSpec.metadata.submitButtonShade,
  // ]);

  // When we insert a new field, the key (which is the nextFieldId) passed to FormDemo is incremented.
  // This causes the form to be recreated with new values.
  // This is a problem because the form state is lost.
  // To fix this, we merge the default values with the form values.
  // Form values are the values that the user has entered in the form. They are stored in the formValues object.
  // They are kept in sync with the form state by the useEffect hook below.
  // const mergedValues = { ...defaultValues, ...formValues };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // defaultValues: mergedValues,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // TODO: Implement submission preview
    console.log(values);
  }

  // This useEffect hook is used to keep the form values in sync with the form state.
  // When the form values change, the form state is updated.
  useEffect(() => {
    const subscription = form.watch((values) => {
      setFormValues(values);
    });
    return () => subscription.unsubscribe();
  }, [form, setFormValues]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div
          className="h-40"
          style={{
            backgroundColor: getTailwindColorHex({
              color: "amber",
              shade: 500,
            }),
          }}
        />
        <div
          className={cn(
            "space-y-4 pb-6",
            "mt-4"
          )}
        >
          <div className="flex items-center justify-between">
            <div className="pl-6">
              {formSpec.name !== "" && (
                <h1 className="mb-1 text-3xl font-bold tracking-tight">
                  {formSpec.name}
                </h1>
              )}
            </div>
            {/* <div className="pr-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setEditHeadingDialogOpen(true)}
                      type="button"
                      variant="outline"
                      size="icon"
                    >
                      <LetterText className="text-zinc-800" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Customize heading</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div> */}
          </div>
          <div className="mb-4 space-y-6 px-6">
            {formSpec.fields.map((field, index) => (
              <DemoField
                key={index}
                field={field}
                formControl={form.control}
              />
            ))}
          </div>
          <div className="pl-6 pr-4 gap-4 flex items-center justify-between">
            <div className="w-full">
              <Button
                className="transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "#1c1c1c",
                  color: getTextColorBasedOnBackground("#1c1c1c"),
                }}
                type="submit"
              >
                Submit
              </Button>
            </div>
            {/* <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      onClick={() => setEditSubmitButtonDialogOpen(true)}
                      type="button"
                      variant="outline"
                      size="icon"
                    >
                      <RectangleHorizontal className="text-zinc-800" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Customize button</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div> */}
          </div>
        </div>
      </form>
    </Form>
  );
};
