"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function PreviewTabs({
  currentTab,
  setCurrentTab,
}: {
  currentTab: "form" | "code";
  setCurrentTab: (value: "form" | "code") => void;
}) {
  return (
    <Tabs
      defaultValue="form"
      value={currentTab}
      onValueChange={setCurrentTab as (value: string) => void}
    >
      <TabsList>
        <TabsTrigger value="form">Form</TabsTrigger>
        <TabsTrigger value="code">Code</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
