import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";

export function DraggableWrapper({
  id,
  children,
}: {
  id: number;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  return (
    <li
      ref={setNodeRef}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
        zIndex: isDragging ? 100 : "auto",
        position: isDragging ? "relative" : "static",
      }}
      {...attributes}
      role="listitem"
      className="flex gap-3 overflow-hidden rounded-lg border border-zinc-200 bg-white text-zinc-950 shadow-sm"
    >
      <div
        {...listeners}
        className="flex h-full w-4 cursor-move items-center justify-center bg-gray-200 text-zinc-400"
      >
        <GripVertical />
      </div>
      <div className="h-full w-full space-y-4 py-4 pr-4">{children}</div>
    </li>
  );
}
