"use client";

import { Building, Home, Square, File, Check } from "lucide-react";
import { propertyTemplates } from "@/lib/templates";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  value: string | null;
  onChange: (templateId: string | null) => void;
  disabled?: boolean;
}

const iconMap: Record<string, React.ElementType> = {
  file: File,
  building: Building,
  home: Home,
  square: Square,
};

export function TemplateSelector({
  value,
  onChange,
  disabled,
}: TemplateSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-foreground">
        Start from a template
      </label>
      <p className="text-sm text-muted-foreground">
        Choose a template to pre-fill common rules and appliances, or start
        blank
      </p>
      <div className="grid grid-cols-2 gap-3">
        {propertyTemplates.map((template) => {
          const Icon = iconMap[template.icon] || File;
          const isSelected = value === template.id;

          return (
            <button
              key={template.id}
              type="button"
              onClick={() => onChange(template.id)}
              disabled={disabled}
              className={cn(
                "relative flex flex-col items-start rounded-xl border p-4 text-left transition-all",
                "hover:border-primary/50 hover:bg-accent/50",
                "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-card"
              )}
            >
              {isSelected && (
                <div className="absolute right-3 top-3">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              )}
              <Icon
                className={cn(
                  "mb-2 h-6 w-6",
                  isSelected ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "font-medium",
                  isSelected ? "text-primary" : "text-foreground"
                )}
              >
                {template.name}
              </span>
              <span className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {template.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
