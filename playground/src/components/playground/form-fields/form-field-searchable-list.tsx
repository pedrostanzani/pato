"use client";

import { Input } from "@/components/ui/input";
import { Search, LucideIcon, CircleOff, Square } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Field, FieldType } from "@/core/types";
import { usePlaygroundStore } from "@/stores/playground";
import { fieldSections } from "@/core/static/field-sections";

export function FormFieldSearchableList({
  closeDialog,
}: {
  closeDialog: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FieldType[]>([]);

  const toggleFilter = (filter: FieldType) => {
    if (filters.includes(filter)) {
      setFilters((prev) => prev.filter((item) => item !== filter));
    } else {
      setFilters((prev) => [...prev, filter]);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:px-6">
        <div className="w-full px-4 md:order-2 md:px-0">
          <div className="relative w-full">
            <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-zinc-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 md:max-w-sm"
              type="text"
              placeholder="Search for a field type..."
            />
          </div>
        </div>
        <div className="flex gap-2 overflow-x-scroll pl-4 last:pr-4 md:order-1 md:overflow-x-visible md:pl-0 md:last:pr-0">
          <div className="flex gap-2" key="filter-types">
            {Object.values(FieldType).map((fieldType) => (
              <Button
                key={fieldType}
                onClick={() => toggleFilter(fieldType)}
                variant="outline"
                className={cn(
                  "h-8.5 font-medium tracking-tight transition-all",
                  filters.includes(fieldType) &&
                    "bg-amber-400 hover:bg-amber-400/90",
                )}
              >
                {fieldType.charAt(0).toUpperCase() + fieldType.slice(1)}
              </Button>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-grow space-y-6 last:pb-6">
        {fieldSections
          .filter(
            (fieldSection) =>
              (filters.includes(fieldSection.type) || filters.length === 0) &&
              fieldSection.fields.some(
                (field) =>
                  field.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                  field.description
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()),
              ),
          )
          .map((fieldSection) => (
            <div key={fieldSection.type}>
              <div className="mb-4 flex items-center gap-2 px-4 md:px-6">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-sm font-mono text-xs leading-none font-bold text-white select-none",
                    fieldSection.accentBackground,
                  )}
                >
                  {fieldSection?.icon ? (
                    <fieldSection.icon className="h-5 w-5" />
                  ) : (
                    <Square className="h-5 w-5" />
                  )}
                </div>
                <h3 className="text-xl leading-none font-semibold tracking-tight">
                  {fieldSection.sectionName}
                </h3>
              </div>
              <div className="flex gap-2 overflow-x-scroll pl-4 last:pr-4 md:pl-6">
                {fieldSection.fields
                  .filter(
                    (field) =>
                      field.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                      field.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
                  )
                  .map((field) => (
                    <FieldTypeButton
                      key={`${fieldSection.type}-${field.format}`}
                      accentBackground={fieldSection.accentBackground}
                      title={field.title}
                      description={field.description}
                      icon={field.icon}
                      fieldToAdd={field.fieldToAdd}
                      closeDialog={closeDialog}
                    />
                  ))}
              </div>
            </div>
          ))}
        {fieldSections.filter(
          (fieldSection) =>
            (filters.includes(fieldSection.type) || filters.length === 0) &&
            fieldSection.fields.some(
              (field) =>
                field.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                field.description
                  .toLowerCase()
                  .includes(searchQuery.toLowerCase()),
            ),
        ).length === 0 && (
          <div className="flex h-full flex-col items-center justify-center gap-5 text-zinc-500">
            <CircleOff className="size-10" />
            <p className="text-center tracking-tight">
              No matching fields found. Try a different search term.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

const FieldTypeButton = ({
  icon: Icon,
  accentBackground,
  title,
  description,
  fieldToAdd,
  closeDialog,
}: {
  icon: LucideIcon;
  accentBackground: string;
  title: string;
  description: string;
  fieldToAdd: Field;
  closeDialog: () => void;
}) => {
  const { addField } = usePlaygroundStore();

  const handleClick = () => {
    addField(fieldToAdd);
    closeDialog();
    
    // Add smooth scrolling to the bottom of the page after dialog closes
    setTimeout(() => {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior: "smooth",
      });
    }, 100); // Small delay to ensure dialog is closed first
  };

  return (
    <button
      onClick={handleClick}
      className="group flex max-w-52 shrink-0 flex-col overflow-hidden rounded-md border border-zinc-200 transition-all"
    >
      <div
        className={cn(
          "flex h-24 w-52 items-center justify-center transition-opacity group-hover:opacity-95",
          accentBackground,
        )}
      >
        <Icon className="size-6 text-zinc-50" />
      </div>
      <div className="flex flex-col p-2.5 pt-3 text-left transition-colors group-hover:bg-zinc-50">
        <span className="mb-1 text-sm leading-none font-medium">{title}</span>
        <span className="text-xs break-words text-zinc-500">{description}</span>
      </div>
    </button>
  );
};
