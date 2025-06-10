import { useEffect, useState } from "react";
import { Header } from "@/components/header";
import { compile } from "./compiler";
import { Button } from "./components/ui/button";
import { LivePreview } from "./components/playground/live-preview";
import { PreviewTabs } from "./components/playground/live-preview/preview-tabs";
import type { FormDefinition } from "./types/form";
import { Card } from "./components/ui/card";
import { cn } from "./lib/utils";

function App() {
  const [code, setCode] = useState(defaultSource);
  const [compiledCode, setCompiledCode] = useState("");
  const [currentTab, setCurrentTab] = useState<"form" | "code">("form");
  const [form, setForm] = useState<FormDefinition | null>(null);

  const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(event.target.value);
  };

  const handleCompile = () => {
    const { forms, generatedComponents } = compile(code);

    if (forms.length === 0) {
      return;
    }

    const form = forms[0];
    const generatedComponent = generatedComponents[0];

    setCompiledCode(generatedComponent);
    setForm(form);
  };

  useEffect(() => {
    const { forms, generatedComponents } = compile(defaultSource);
    const form = forms[0];
    const generatedComponent = generatedComponents[0];

    setCompiledCode(generatedComponent);
    setForm(form);
  }, []);

  return (
    <div className="antialiased">
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="p-4 flex gap-4 h-full flex-1">
          <div className="w-1/2 flex flex-col gap-3 h-full min-h-[calc(100vh-113px)]">
            <div>
              <Button onClick={handleCompile}>Compile</Button>
            </div>
            <textarea
              className="w-full p-4 bg-zinc-950 text-white resize-none rounded-md font-mono text-sm flex-1"
              value={code}
              onChange={handleCodeChange}
            />
          </div>
          <div className="space-y-5 w-1/2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight">Preview</h2>
              <PreviewTabs
                currentTab={currentTab}
                setCurrentTab={setCurrentTab}
              />
            </div>
            {form ? (
              <LivePreview
                currentTab={currentTab}
                form={form}
                compiledCode={compiledCode}
              />
            ) : (
              <Card
                className={cn(
                  "flex min-h-96 flex-1 items-center justify-center px-4 text-center"
                )}
              >
                <p className="max-w-72 text-sm text-zinc-500">
                  Start adding fields to the form to get started and then
                  visualize the form preview.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;


const defaultSource = `{
  var is_adult bool = true
  var has_plus_one bool = true
  var number_of_kids int = 2
  var counter int = 0

  form BirthdayRSVP {
    string_field guest_name {
      label: "Your Name"
      placeholder: "Enter your full name"
      required: true
    }

    string_field email {
      label: "Email Address"
      placeholder: "Enter your email"
      required: true
    }

    select_field attendance {
      label: "Will you attend?"
      options: ["Yes", "No", "Maybe"]
      required: true
    }

    if (is_adult) {
      select_field dietary_restrictions {
        label: "Dietary Restrictions"
        options: ["None", "Vegetarian", "Vegan", "Gluten-Free", "Other"]
        required: true
      }
    }

    if (has_plus_one) {
      string_field plus_one_name {
        label: "Plus One Name"
        placeholder: "Enter your plus one's name"
        required: true
      }

      select_field plus_one_dietary {
        label: "Plus One Dietary Restrictions"
        options: ["None", "Vegetarian", "Vegan", "Gluten-Free", "Other"]
        required: true
      }
    }

    for (counter < number_of_kids) {
      string_field child_name {
        label: "Child Name"
        placeholder: "Enter child's name"
        required: true
      }

      select_field child_dietary {
        label: "Child Dietary Restrictions"
        options: ["None", "Vegetarian", "Vegan", "Gluten-Free", "Other"]
        required: true
      }

      counter = counter + 1
    }

    string_field gift_preference {
      label: "Gift Preference"
      placeholder: "Enter your gift preference or registry link"
      required: false
    }
  }
}`;