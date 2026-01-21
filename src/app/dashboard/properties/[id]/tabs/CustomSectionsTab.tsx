"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import {
  Plus,
  FileText,
  Trash2,
  Pencil,
  Eye,
  EyeOff,
  Car,
  AlertTriangle,
  ClipboardList,
  DoorOpen,
  Info,
  Coffee,
} from "lucide-react";
import { Button } from "@/components/ui";
import { FormField } from "@/components/auth/FormField";
import { createClient } from "@/lib/supabase/client";
import { SortableList } from "@/components/dashboard/SortableList";
import { RichTextEditor, htmlToPlainText } from "@/components/editor";

interface CustomSectionsTabProps {
  propertyId: string;
  onDataChange?: () => void;
}

interface CustomSection {
  id: string;
  title: string;
  icon: string;
  content: string[] | string; // Can be array (legacy) or HTML string (new)
  display_order: number;
  is_visible: boolean;
}

// Helper to get preview text from content
function getPreviewText(content: string[] | string): string[] {
  if (Array.isArray(content)) return content;
  // Extract text from HTML for preview
  const text = htmlToPlainText(content);
  if (!text) return [];
  // Split by common separators and filter
  return text
    .split(/\n|(?<=\.)(?=\s)/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

const availableIcons = [
  { id: "file-text", label: "Document", Icon: FileText },
  { id: "door-open", label: "Check-in/out", Icon: DoorOpen },
  { id: "car", label: "Parking", Icon: Car },
  { id: "alert-triangle", label: "Important", Icon: AlertTriangle },
  { id: "clipboard-list", label: "List", Icon: ClipboardList },
  { id: "info", label: "Info", Icon: Info },
  { id: "coffee", label: "Amenities", Icon: Coffee },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  "file-text": FileText,
  "door-open": DoorOpen,
  car: Car,
  "alert-triangle": AlertTriangle,
  "clipboard-list": ClipboardList,
  info: Info,
  coffee: Coffee,
};

export function CustomSectionsTab({ propertyId, onDataChange }: CustomSectionsTabProps) {
  const [sections, setSections] = useState<CustomSection[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchSections();
  }, [propertyId]);

  const fetchSections = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("property_sections")
      .select("*")
      .eq("property_id", propertyId)
      .eq("section_type", "custom")
      .order("display_order");

    if (data) setSections(data as CustomSection[]);
  };

  const handleAddSection = async (formData: FormData) => {
    const supabase = createClient();
    const title = formData.get("title") as string;
    const icon = formData.get("icon") as string;
    const contentHtml = formData.get("content") as string;

    // Store as HTML string (wrapped in array for JSONB compatibility)
    // We store it as a single-element array with the HTML for backwards compatibility
    const content = contentHtml ? [contentHtml] : [];

    startTransition(async () => {
      await supabase.from("property_sections").insert({
        property_id: propertyId,
        section_type: "custom",
        title,
        icon,
        content,
        display_order: sections.length,
      });
      await fetchSections();
      setIsAdding(false);
      onDataChange?.();
    });
  };

  const handleUpdateSection = async (id: string, formData: FormData) => {
    const supabase = createClient();
    const title = formData.get("title") as string;
    const icon = formData.get("icon") as string;
    const contentHtml = formData.get("content") as string;
    // Store as single-element array with HTML for backwards compatibility
    const content = contentHtml ? [contentHtml] : [];

    startTransition(async () => {
      await supabase
        .from("property_sections")
        .update({ title, icon, content })
        .eq("id", id);
      await fetchSections();
      setEditingId(null);
      onDataChange?.();
    });
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    startTransition(async () => {
      await supabase.from("property_sections").delete().eq("id", id);
      await fetchSections();
      onDataChange?.();
    });
  };

  const handleToggleVisibility = async (
    id: string,
    currentVisibility: boolean
  ) => {
    const supabase = createClient();
    startTransition(async () => {
      await supabase
        .from("property_sections")
        .update({ is_visible: !currentVisibility })
        .eq("id", id);
      await fetchSections();
      onDataChange?.();
    });
  };

  const handleReorder = async (reorderedSections: CustomSection[]) => {
    // Optimistic update
    setSections(reorderedSections);

    // Update database
    const supabase = createClient();
    startTransition(async () => {
      await Promise.all(
        reorderedSections.map((section, index) =>
          supabase
            .from("property_sections")
            .update({ display_order: index })
            .eq("id", section.id)
        )
      );
      onDataChange?.();
    });
  };

  const SectionForm = ({
    section,
    onSubmit,
    onCancel,
  }: {
    section?: CustomSection;
    onSubmit: (formData: FormData) => void;
    onCancel: () => void;
  }) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [contentHtml, setContentHtml] = useState(() => {
      if (!section?.content) return "";
      // Handle both legacy array format and new HTML format
      if (Array.isArray(section.content)) {
        // Check if it's the new format (single element with HTML)
        if (section.content.length === 1 && section.content[0].startsWith("<")) {
          return section.content[0];
        }
        // Legacy format: convert array to HTML list
        return `<ul>${section.content.map((item) => `<li>${item}</li>`).join("")}</ul>`;
      }
      return section.content;
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (formRef.current) {
        const formData = new FormData(formRef.current);
        onSubmit(formData);
      }
    };

    return (
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="space-y-4 rounded-xl border bg-card p-4"
      >
        <input type="hidden" name="content" value={contentHtml} />
        <FormField
          label="Section Title"
          name="title"
          type="text"
          defaultValue={section?.title || ""}
          placeholder="e.g., Parking Information"
          required
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Icon
          </label>
          <select
            name="icon"
            defaultValue={section?.icon || "file-text"}
            className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base"
          >
            {availableIcons.map((icon) => (
              <option key={icon.id} value={icon.id}>
                {icon.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Content <span className="text-destructive">*</span>
          </label>
          <RichTextEditor
            content={contentHtml}
            onChange={setContentHtml}
            placeholder="Add your section content here. Use bullet or numbered lists to organize information."
          />
          <p className="text-xs text-muted-foreground">
            Use formatting to highlight important information
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" variant="accent" disabled={isPending}>
            {section ? "Save Changes" : "Add Section"}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Custom Sections</h2>
          <p className="text-sm text-muted-foreground">
            Add your own information sections
          </p>
        </div>
        {!isAdding && !editingId && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Section
          </Button>
        )}
      </div>

      {/* Add Section Form */}
      {isAdding && (
        <SectionForm
          onSubmit={handleAddSection}
          onCancel={() => setIsAdding(false)}
        />
      )}

      {/* Sections List */}
      {sections.length === 0 && !isAdding ? (
        <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-8 text-center">
          <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">No custom sections yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add sections for parking, local tips, or any other information
          </p>
        </div>
      ) : editingId ? (
        // When editing, show list without drag-and-drop
        <div className="space-y-3">
          {sections.map((section) => {
            const IconComponent = iconMap[section.icon] || FileText;

            if (editingId === section.id) {
              return (
                <SectionForm
                  key={section.id}
                  section={section}
                  onSubmit={(formData) =>
                    handleUpdateSection(section.id, formData)
                  }
                  onCancel={() => setEditingId(null)}
                />
              );
            }

            return (
              <div
                key={section.id}
                className={`rounded-xl border bg-card p-4 ${
                  !section.is_visible ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{section.title}</span>
                      {!section.is_visible && (
                        <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          Hidden
                        </span>
                      )}
                    </div>
                    <ContentPreview content={section.content} />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        handleToggleVisibility(section.id, section.is_visible)
                      }
                      disabled={isPending}
                      title={section.is_visible ? "Hide section" : "Show section"}
                    >
                      {section.is_visible ? (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setEditingId(section.id)}
                      disabled={isPending}
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(section.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Normal view with drag-and-drop
        <SortableList
          items={sections}
          getItemId={(section) => section.id}
          onReorder={handleReorder}
          disabled={isPending}
          showKeyboardControls={sections.length > 1}
          renderItem={(section) => {
            const IconComponent = iconMap[section.icon] || FileText;
            return (
              <div
                className={`rounded-xl border bg-card p-4 ${
                  !section.is_visible ? "opacity-60" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <IconComponent className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{section.title}</span>
                      {!section.is_visible && (
                        <span className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                          Hidden
                        </span>
                      )}
                    </div>
                    <ContentPreview content={section.content} />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() =>
                        handleToggleVisibility(section.id, section.is_visible)
                      }
                      disabled={isPending}
                      title={section.is_visible ? "Hide section" : "Show section"}
                    >
                      {section.is_visible ? (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setEditingId(section.id)}
                      disabled={isPending}
                    >
                      <Pencil className="h-4 w-4 text-muted-foreground" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleDelete(section.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          }}
        />
      )}
    </div>
  );
}

// Helper component to render content preview
function ContentPreview({ content }: { content: string[] | string }) {
  const previewItems = getPreviewText(content);

  if (previewItems.length === 0) {
    return (
      <p className="mt-2 text-sm text-muted-foreground italic">No content</p>
    );
  }

  return (
    <ul className="mt-2 space-y-1">
      {previewItems.slice(0, 3).map((item, idx) => (
        <li key={idx} className="text-sm text-muted-foreground">
          • {item}
        </li>
      ))}
      {previewItems.length > 3 && (
        <li className="text-sm text-muted-foreground">
          ... and {previewItems.length - 3} more
        </li>
      )}
    </ul>
  );
}
