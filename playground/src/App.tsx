import { useState } from "react";
import { Header } from "@/components/header";
import { compile } from "./compiler";
import { Button } from "./components/ui/button";
import { LivePreview } from "./components/playground/live-preview";
import { PreviewTabs } from "./components/playground/live-preview/preview-tabs";
import type { FormDefinition } from "./types/form";
import { Card } from "./components/ui/card";
import { cn } from "./lib/utils";

function App() {
  const [code, setCode] = useState("");
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
