"use client";

import { useState, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { GripVertical, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui";

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  disabled?: boolean;
}

function SortableItem({ id, children, disabled }: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${isDragging ? "opacity-50" : ""}`}
    >
      <div className="flex items-start gap-2">
        {/* Drag handle */}
        <button
          {...attributes}
          {...listeners}
          className={`mt-3 flex-shrink-0 touch-none rounded p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary ${
            disabled ? "cursor-not-allowed opacity-50" : "cursor-grab active:cursor-grabbing"
          }`}
          aria-label="Drag to reorder"
          disabled={disabled}
        >
          <GripVertical className="h-4 w-4" />
        </button>
        {/* Content */}
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}

interface SortableListProps<T> {
  items: T[];
  getItemId: (item: T) => string;
  renderItem: (item: T, index: number) => React.ReactNode;
  onReorder: (items: T[]) => void;
  disabled?: boolean;
  showKeyboardControls?: boolean;
}

export function SortableList<T>({
  items,
  getItemId,
  renderItem,
  onReorder,
  disabled = false,
  showKeyboardControls = true,
}: SortableListProps<T>) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (over && active.id !== over.id) {
        const oldIndex = items.findIndex((item) => getItemId(item) === active.id);
        const newIndex = items.findIndex((item) => getItemId(item) === over.id);

        if (oldIndex !== -1 && newIndex !== -1) {
          const newItems = arrayMove(items, oldIndex, newIndex);
          onReorder(newItems);
        }
      }
    },
    [items, getItemId, onReorder]
  );

  const moveItem = useCallback(
    (index: number, direction: "up" | "down") => {
      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= items.length) return;
      const newItems = arrayMove(items, index, newIndex);
      onReorder(newItems);
    },
    [items, onReorder]
  );

  const activeItem = activeId
    ? items.find((item) => getItemId(item) === activeId)
    : null;
  const activeIndex = activeItem
    ? items.findIndex((item) => getItemId(item) === activeId)
    : -1;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext
        items={items.map(getItemId)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {items.map((item, index) => (
            <div key={getItemId(item)} className="group relative">
              <SortableItem id={getItemId(item)} disabled={disabled}>
                {renderItem(item, index)}
              </SortableItem>
              {/* Keyboard accessibility controls */}
              {showKeyboardControls && !disabled && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => moveItem(index, "up")}
                    disabled={index === 0}
                    className="h-6 w-6"
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => moveItem(index, "down")}
                    disabled={index === items.length - 1}
                    className="h-6 w-6"
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>
      </SortableContext>

      {/* Drag overlay for visual feedback */}
      <DragOverlay>
        {activeItem && activeIndex !== -1 ? (
          <div className="rounded-xl border bg-card p-4 shadow-lg ring-2 ring-primary/20">
            {renderItem(activeItem, activeIndex)}
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
