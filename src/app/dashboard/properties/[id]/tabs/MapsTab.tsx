"use client";

import { useState, useEffect, useTransition, useCallback } from "react";
import {
  Plus,
  Trash2,
  Check,
  X,
  AlertTriangle,
  Map as MapIcon,
} from "lucide-react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui";
import { FormField } from "@/components/auth/FormField";
import {
  getMaps,
  createMap,
  deleteMap,
  createCategory,
  deleteCategory,
  assignMapToProperty,
  getPropertyActiveMap,
} from "@/lib/actions/maps";
import type { PropertyMap, MapCategoryColor } from "@/types";

interface MapsTabProps {
  propertyId: string;
  onDataChange?: () => void;
}

const CATEGORY_COLORS: { value: MapCategoryColor; label: string; className: string }[] = [
  { value: "blue", label: "Blue", className: "bg-blue-500" },
  { value: "red", label: "Red", className: "bg-red-500" },
  { value: "yellow", label: "Yellow", className: "bg-yellow-500" },
  { value: "green", label: "Green", className: "bg-green-500" },
  { value: "purple", label: "Purple", className: "bg-purple-500" },
  { value: "orange", label: "Orange", className: "bg-orange-500" },
];

export function MapsTab({ propertyId, onDataChange }: MapsTabProps) {
  const [maps, setMaps] = useState<PropertyMap[]>([]);
  const [activeMapId, setActiveMapId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form state for new map
  const [newMapTitle, setNewMapTitle] = useState("");
  const [showPropertyAddress, setShowPropertyAddress] = useState(true);
  const [categories, setCategories] = useState<{ title: string; color: MapCategoryColor }[]>([
    { title: "", color: "blue" },
  ]);

  // Form state for adding category to existing map
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [newCategoryColor, setNewCategoryColor] = useState<MapCategoryColor>("blue");

  const fetchData = useCallback(async () => {
    const [mapsData, activeMap] = await Promise.all([
      getMaps(),
      getPropertyActiveMap(propertyId),
    ]);
    setMaps(mapsData);
    setActiveMapId(activeMap);
  }, [propertyId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateMap = async () => {
    if (!newMapTitle.trim()) {
      setError("Map title is required");
      return;
    }

    const validCategories = categories.filter((c) => c.title.trim());
    if (validCategories.length === 0) {
      setError("At least one category is required");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await createMap({
        title: newMapTitle.trim(),
        showPropertyAddress,
        categories: validCategories,
      });

      if (result.success) {
        setIsCreating(false);
        setNewMapTitle("");
        setShowPropertyAddress(true);
        setCategories([{ title: "", color: "blue" }]);
        await fetchData();
        onDataChange?.();
      } else {
        setError(result.error || "Failed to create map");
      }
    });
  };

  const handleDeleteMap = async (mapId: string) => {
    if (!confirm("Are you sure you want to delete this map? All pins will be deleted.")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteMap(mapId);
      if (result.success) {
        await fetchData();
        onDataChange?.();
      } else {
        setError(result.error || "Failed to delete map");
      }
    });
  };

  const handleAddCategory = async (mapId: string) => {
    if (!newCategoryTitle.trim()) {
      setError("Category title is required");
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await createCategory(mapId, {
        title: newCategoryTitle.trim(),
        color: newCategoryColor,
      });

      if (result.success) {
        setIsAddingCategory(null);
        setNewCategoryTitle("");
        setNewCategoryColor("blue");
        await fetchData();
        onDataChange?.();
      } else {
        setError(result.error || "Failed to add category");
      }
    });
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Are you sure? All pins in this category will be deleted.")) {
      return;
    }

    startTransition(async () => {
      const result = await deleteCategory(categoryId);
      if (result.success) {
        await fetchData();
        onDataChange?.();
      } else {
        setError(result.error || "Failed to delete category");
      }
    });
  };

  const handleAssignMap = async (mapId: string | null) => {
    startTransition(async () => {
      const result = await assignMapToProperty(propertyId, mapId);
      if (result.success) {
        setActiveMapId(mapId);
        onDataChange?.();
      } else {
        setError(result.error || "Failed to assign map");
      }
    });
  };

  const addCategoryField = () => {
    setCategories([...categories, { title: "", color: "blue" }]);
  };

  const removeCategoryField = (index: number) => {
    if (categories.length > 1) {
      setCategories(categories.filter((_, i) => i !== index));
    }
  };

  const updateCategoryField = (
    index: number,
    field: "title" | "color",
    value: string
  ) => {
    const updated = [...categories];
    if (field === "color") {
      updated[index].color = value as MapCategoryColor;
    } else {
      updated[index].title = value;
    }
    setCategories(updated);
  };

  const getColorClass = (color: MapCategoryColor) => {
    return CATEGORY_COLORS.find((c) => c.value === color)?.className || "bg-blue-500";
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto hover:opacity-70"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium">Interactive Maps</h2>
          <p className="text-sm text-muted-foreground">
            Create maps with categorized pins for local recommendations
          </p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsCreating(true)}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Map
        </Button>
      </div>

      {/* Map Assignment Section */}
      <div className="rounded-xl border bg-card p-4">
        <h3 className="mb-3 text-sm font-medium">Set Active Map For This Guide</h3>
        <div className="flex items-center gap-3">
          <select
            value={activeMapId || ""}
            onChange={(e) => handleAssignMap(e.target.value || null)}
            disabled={isPending}
            className="flex-1 rounded-lg border border-border bg-background px-4 py-2 text-sm"
          >
            <option value="">No map selected</option>
            {maps.map((map) => (
              <option key={map.id} value={map.id}>
                {map.title} ({map.pinCount || 0}/100 pins)
              </option>
            ))}
          </select>
        </div>
        {activeMapId && (
          <p className="mt-2 text-xs text-muted-foreground">
            Guests will see the Map tab when viewing this guide
          </p>
        )}
      </div>

      {/* Maps List */}
      <div>
        <h3 className="mb-3 text-sm font-medium text-muted-foreground">
          Your Maps
        </h3>
        {maps.length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-8 text-center">
            <MapIcon className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No maps created yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create a map to add local recommendations for your guests
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {maps.map((map) => (
              <div
                key={map.id}
                className={`rounded-xl border bg-card p-4 ${
                  map.id === activeMapId ? "border-primary" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{map.title}</h4>
                      {map.id === activeMapId && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {map.pinCount || 0}/100 pins
                      {(map.pinCount || 0) >= 90 && (
                        <span className="ml-2 text-yellow-600">
                          (Approaching limit)
                        </span>
                      )}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDeleteMap(map.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>

                {/* Categories */}
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium">Categories</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsAddingCategory(map.id)}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Add
                    </Button>
                  </div>
                  {map.categories && map.categories.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {map.categories.map((category) => (
                        <div
                          key={category.id}
                          className="flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-sm"
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${getColorClass(category.color)}`}
                          />
                          <span>{category.title}</span>
                          <button
                            onClick={() => handleDeleteCategory(category.id)}
                            className="ml-1 hover:opacity-70"
                            disabled={isPending}
                          >
                            <X className="h-3 w-3 text-muted-foreground" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No categories yet
                    </p>
                  )}
                </div>

                {/* Add Category Form (Inline) */}
                {isAddingCategory === map.id && (
                  <div className="mt-4 flex items-end gap-2 rounded-lg border bg-muted/50 p-3">
                    <div className="flex-1">
                      <label className="mb-1 block text-xs font-medium">
                        Category Title
                      </label>
                      <input
                        type="text"
                        value={newCategoryTitle}
                        onChange={(e) => setNewCategoryTitle(e.target.value)}
                        placeholder="e.g., Restaurants"
                        className="w-full rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium">
                        Color
                      </label>
                      <select
                        value={newCategoryColor}
                        onChange={(e) =>
                          setNewCategoryColor(e.target.value as MapCategoryColor)
                        }
                        className="rounded-md border border-border bg-background px-3 py-1.5 text-sm"
                      >
                        {CATEGORY_COLORS.map((color) => (
                          <option key={color.value} value={color.value}>
                            {color.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleAddCategory(map.id)}
                      disabled={isPending}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsAddingCategory(null);
                        setNewCategoryTitle("");
                        setNewCategoryColor("blue");
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Map Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Map</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <FormField
              label="Map Title"
              name="title"
              type="text"
              placeholder="e.g., Local Recommendations"
              value={newMapTitle}
              onChange={(e) => setNewMapTitle(e.target.value)}
              required
            />

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="showPropertyAddress"
                checked={showPropertyAddress}
                onChange={(e) => setShowPropertyAddress(e.target.checked)}
                className="h-4 w-4 rounded border-border"
              />
              <label htmlFor="showPropertyAddress" className="text-sm">
                Show guide address on map?
              </label>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Pin Categories</label>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={addCategoryField}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add Category
                </Button>
              </div>
              {categories.map((category, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={category.title}
                    onChange={(e) =>
                      updateCategoryField(index, "title", e.target.value)
                    }
                    placeholder="Category title"
                    className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                  <select
                    value={category.color}
                    onChange={(e) =>
                      updateCategoryField(index, "color", e.target.value)
                    }
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                  >
                    {CATEGORY_COLORS.map((color) => (
                      <option key={color.value} value={color.value}>
                        {color.label}
                      </option>
                    ))}
                  </select>
                  {categories.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeCategoryField(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setIsCreating(false);
                setError(null);
              }}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="accent"
              onClick={handleCreateMap}
              disabled={isPending}
            >
              Create Map
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
