"use client";

import { useState, useEffect, useTransition } from "react";
import { Plus, Plug, Trash2, MapPin } from "lucide-react";
import { Button } from "@/components/ui";
import { FormField } from "@/components/auth/FormField";
import { createClient } from "@/lib/supabase/client";
import { SortableList } from "@/components/dashboard/SortableList";

interface AppliancesTabProps {
  propertyId: string;
  onDataChange?: () => void;
}

interface Appliance {
  name: string;
  location?: string;
  instructions: string;
}

interface AppliancesSection {
  id: string;
  content: Appliance[];
}

const suggestedAppliances = [
  "Washing Machine",
  "Coffee Maker",
  "Air Conditioning",
  "Dishwasher",
  "Microwave",
  "TV & Remote",
  "Heating",
];

export function AppliancesTab({ propertyId, onDataChange }: AppliancesTabProps) {
  const [appliancesSection, setAppliancesSection] =
    useState<AppliancesSection | null>(null);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchAppliances();
  }, [propertyId]);

  const fetchAppliances = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("property_sections")
      .select("*")
      .eq("property_id", propertyId)
      .eq("section_type", "appliances")
      .single();

    if (data) {
      setAppliancesSection(data);
      setAppliances(data.content as Appliance[]);
    }
  };

  const saveAppliances = async (newAppliances: Appliance[]) => {
    const supabase = createClient();

    if (appliancesSection) {
      await supabase
        .from("property_sections")
        .update({ content: newAppliances })
        .eq("id", appliancesSection.id);
    } else {
      await supabase.from("property_sections").insert({
        property_id: propertyId,
        section_type: "appliances",
        title: "Appliances",
        icon: "plug",
        content: newAppliances,
      });
    }

    await fetchAppliances();
  };

  const handleAddAppliance = async (formData: FormData) => {
    const name = formData.get("name") as string;
    const location = formData.get("location") as string;
    const instructions = formData.get("instructions") as string;

    const newAppliances = [
      ...appliances,
      { name, location: location || undefined, instructions },
    ];
    startTransition(async () => {
      await saveAppliances(newAppliances);
      setIsAdding(false);
      onDataChange?.();
    });
  };

  const handleAddSuggested = (applianceName: string) => {
    setIsAdding(true);
    // Pre-fill the name in the form would require controlled input
    // For simplicity, just open the form - user fills in details
  };

  const handleDelete = (index: number) => {
    const newAppliances = appliances.filter((_, i) => i !== index);
    startTransition(async () => {
      await saveAppliances(newAppliances);
      onDataChange?.();
    });
  };

  // Create indexed appliances for sortable list (appliances don't have natural IDs)
  const indexedAppliances = appliances.map((appliance, index) => ({
    ...appliance,
    _sortId: `appliance-${index}`,
  }));

  const handleReorder = (reorderedAppliances: Array<Appliance & { _sortId: string }>) => {
    // Extract just the appliance data without the sort ID
    const newAppliances = reorderedAppliances.map(({ _sortId, ...appliance }) => appliance);
    // Optimistic update
    setAppliances(newAppliances);
    startTransition(async () => {
      await saveAppliances(newAppliances);
      onDataChange?.();
    });
  };

  const unusedSuggestions = suggestedAppliances.filter(
    (suggestion) =>
      !appliances.some(
        (a) => a.name.toLowerCase() === suggestion.toLowerCase()
      )
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Appliances</h2>
        {!isAdding && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Appliance
          </Button>
        )}
      </div>

      {/* Add Appliance Form */}
      {isAdding && (
        <form
          action={handleAddAppliance}
          className="space-y-4 rounded-xl border bg-card p-4"
        >
          <FormField
            label="Appliance Name"
            name="name"
            type="text"
            placeholder="e.g., Washing Machine"
            required
          />
          <FormField
            label="Location"
            name="location"
            type="text"
            placeholder="e.g., Kitchen, next to the fridge"
            hint="Where guests can find this appliance"
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Instructions <span className="text-destructive">*</span>
            </label>
            <textarea
              name="instructions"
              placeholder="e.g., Add detergent to the drawer, select cycle and temperature, press start button..."
              rows={3}
              required
              className="w-full resize-y rounded-lg border border-border bg-background px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <p className="text-xs text-muted-foreground">
              Step-by-step instructions for using this appliance
            </p>
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
              Add Appliance
            </Button>
          </div>
        </form>
      )}

      {/* Appliances List */}
      {appliances.length === 0 && !isAdding ? (
        <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-8 text-center">
          <Plug className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">No appliances added yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Help guests use the coffee maker, washing machine, and other
            appliances
          </p>
        </div>
      ) : (
        <SortableList
          items={indexedAppliances}
          getItemId={(appliance) => appliance._sortId}
          onReorder={handleReorder}
          disabled={isPending}
          showKeyboardControls={appliances.length > 1}
          renderItem={(appliance, index) => (
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Plug className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{appliance.name}</span>
                  </div>
                  {appliance.location && (
                    <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {appliance.location}
                    </div>
                  )}
                  <p className="mt-2 text-sm text-muted-foreground">
                    {appliance.instructions}
                  </p>
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
            </div>
          )}
        />
      )}

      {/* Suggestions */}
      {unusedSuggestions.length > 0 && (
        <div className="border-t pt-4">
          <p className="mb-3 text-sm text-muted-foreground">
            Common appliances you might want to document:
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
