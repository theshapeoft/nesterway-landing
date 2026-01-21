"use client";

import { useState, useEffect, useTransition } from "react";
import { Plus, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { FormField } from "@/components/auth/FormField";
import { createClient } from "@/lib/supabase/client";
import { SortableList } from "@/components/dashboard/SortableList";

interface RulesTabProps {
  propertyId: string;
}

interface Rule {
  text: string;
  severity: "critical" | "normal";
}

interface RulesSection {
  id: string;
  content: Rule[];
}

const suggestedRules = [
  "No smoking inside",
  "No pets",
  "No parties",
  "Quiet hours: 10pm - 8am",
  "Maximum 4 guests",
];

export function RulesTab({ propertyId }: RulesTabProps) {
  const [rulesSection, setRulesSection] = useState<RulesSection | null>(null);
  const [rules, setRules] = useState<Rule[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchRules();
  }, [propertyId]);

  const fetchRules = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("property_sections")
      .select("*")
      .eq("property_id", propertyId)
      .eq("section_type", "house_rules")
      .single();

    if (data) {
      setRulesSection(data);
      setRules(data.content as Rule[]);
    }
  };

  const saveRules = async (newRules: Rule[]) => {
    const supabase = createClient();

    if (rulesSection) {
      await supabase
        .from("property_sections")
        .update({ content: newRules })
        .eq("id", rulesSection.id);
    } else {
      await supabase.from("property_sections").insert({
        property_id: propertyId,
        section_type: "house_rules",
        title: "House Rules",
        icon: "clipboard-list",
        content: newRules,
      });
    }

    await fetchRules();
  };

  const handleAddRule = async (formData: FormData) => {
    const text = formData.get("text") as string;
    const severity = formData.get("severity") as "critical" | "normal";

    const newRules = [...rules, { text, severity }];
    startTransition(async () => {
      await saveRules(newRules);
      setIsAdding(false);
    });
  };

  const handleAddSuggested = (ruleText: string) => {
    const newRules = [...rules, { text: ruleText, severity: "normal" as const }];
    startTransition(async () => {
      await saveRules(newRules);
    });
  };

  const handleDelete = (index: number) => {
    const newRules = rules.filter((_, i) => i !== index);
    startTransition(async () => {
      await saveRules(newRules);
    });
  };

  const handleToggleSeverity = (index: number) => {
    const newRules = [...rules];
    newRules[index] = {
      ...newRules[index],
      severity: newRules[index].severity === "critical" ? "normal" : "critical",
    };
    startTransition(async () => {
      await saveRules(newRules);
    });
  };

  // Create indexed rules for sortable list (rules don't have natural IDs)
  const indexedRules = rules.map((rule, index) => ({ ...rule, _sortId: `rule-${index}` }));

  const handleReorder = (reorderedRules: Array<Rule & { _sortId: string }>) => {
    // Extract just the rule data without the sort ID
    const newRules = reorderedRules.map(({ _sortId, ...rule }) => rule);
    // Optimistic update
    setRules(newRules);
    startTransition(async () => {
      await saveRules(newRules);
    });
  };

  const unusedSuggestions = suggestedRules.filter(
    (suggestion) => !rules.some((r) => r.text === suggestion)
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">House Rules</h2>
        {!isAdding && (
          <Button variant="secondary" size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Add Rule
          </Button>
        )}
      </div>

      {/* Add Rule Form */}
      {isAdding && (
        <form
          action={handleAddRule}
          className="rounded-xl border bg-card p-4 space-y-4"
        >
          <FormField
            label="Rule"
            name="text"
            type="text"
            placeholder="e.g., No smoking inside"
            required
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Importance
            </label>
            <select
              name="severity"
              defaultValue="normal"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base"
            >
              <option value="normal">Normal</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsAdding(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" variant="accent" disabled={isPending}>
              Add Rule
            </Button>
          </div>
        </form>
      )}

      {/* Rules List */}
      {rules.length === 0 && !isAdding ? (
        <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-8 text-center">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">No house rules added yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Set expectations for your guests
          </p>
        </div>
      ) : (
        <SortableList
          items={indexedRules}
          getItemId={(rule) => rule._sortId}
          onReorder={handleReorder}
          disabled={isPending}
          showKeyboardControls={rules.length > 1}
          renderItem={(rule, index) => (
            <div className="flex items-center justify-between rounded-xl border bg-card px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="text-sm">{rule.text}</span>
                <button
                  onClick={() => handleToggleSeverity(index)}
                  disabled={isPending}
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    rule.severity === "critical"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {rule.severity === "critical" ? "Critical" : "Normal"}
                </button>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => handleDelete(index)}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>
          )}
        />
      )}

      {/* Suggestions */}
      {unusedSuggestions.length > 0 && (
        <div className="border-t pt-4">
          <p className="mb-3 text-sm text-muted-foreground">
            Suggested rules you might want to add:
          </p>
          <div className="flex flex-wrap gap-2">
            {unusedSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleAddSuggested(suggestion)}
                disabled={isPending}
                className="rounded-lg border border-dashed border-border bg-card px-3 py-2 text-sm hover:bg-accent disabled:opacity-50"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
