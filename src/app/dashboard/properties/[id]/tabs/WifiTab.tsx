"use client";

import { useState, useEffect, useTransition } from "react";
import { Plus, Wifi, Eye, EyeOff, Copy, Check, Trash2, Star } from "lucide-react";
import { Button } from "@/components/ui";
import { FormField } from "@/components/auth/FormField";
import { createClient } from "@/lib/supabase/client";
import { SortableList } from "@/components/dashboard/SortableList";

interface WifiNetwork {
  id: string;
  name: string;
  password: string;
  security_type: "WPA" | "WEP" | "nopass";
  description: string | null;
  is_primary: boolean;
}

interface WifiTabProps {
  propertyId: string;
}

export function WifiTab({ propertyId }: WifiTabProps) {
  const [networks, setNetworks] = useState<WifiNetwork[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchNetworks();
  }, [propertyId]);

  const fetchNetworks = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("wifi_networks")
      .select("*")
      .eq("property_id", propertyId)
      .order("display_order");
    if (data) setNetworks(data);
  };

  const handleAddNetwork = async (formData: FormData) => {
    const supabase = createClient();
    const name = formData.get("name") as string;
    const password = formData.get("password") as string;
    const securityType = formData.get("security_type") as "WPA" | "WEP" | "nopass";
    const description = formData.get("description") as string;

    startTransition(async () => {
      await supabase.from("wifi_networks").insert({
        property_id: propertyId,
        name,
        password,
        security_type: securityType,
        description: description || null,
        is_primary: networks.length === 0,
        display_order: networks.length,
      });
      await fetchNetworks();
      setIsAdding(false);
    });
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    startTransition(async () => {
      await supabase.from("wifi_networks").delete().eq("id", id);
      await fetchNetworks();
    });
  };

  const handleSetPrimary = async (id: string) => {
    const supabase = createClient();
    startTransition(async () => {
      // Unset all as primary
      await supabase
        .from("wifi_networks")
        .update({ is_primary: false })
        .eq("property_id", propertyId);
      // Set selected as primary
      await supabase.from("wifi_networks").update({ is_primary: true }).eq("id", id);
      await fetchNetworks();
    });
  };

  const togglePassword = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const copyPassword = async (id: string, password: string) => {
    await navigator.clipboard.writeText(password);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReorder = async (reorderedNetworks: WifiNetwork[]) => {
    // Optimistic update
    setNetworks(reorderedNetworks);

    // Update database
    const supabase = createClient();
    startTransition(async () => {
      await Promise.all(
        reorderedNetworks.map((network, index) =>
          supabase
            .from("wifi_networks")
            .update({ display_order: index })
            .eq("id", network.id)
        )
      );
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Wi-Fi Networks</h2>
        {!isAdding && (
          <Button variant="secondary" size="sm" onClick={() => setIsAdding(true)}>
            <Plus className="mr-1 h-4 w-4" />
            Add Network
          </Button>
        )}
      </div>

      {/* Add Network Form */}
      {isAdding && (
        <form
          action={handleAddNetwork}
          className="rounded-xl border bg-card p-4 space-y-4"
        >
          <FormField
            label="Network Name (SSID)"
            name="name"
            type="text"
            placeholder="PropertyWiFi_5G"
            required
          />
          <FormField
            label="Password"
            name="password"
            type="text"
            placeholder="Enter password"
            required
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">
              Security Type
            </label>
            <select
              name="security_type"
              defaultValue="WPA"
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-base"
            >
              <option value="WPA">WPA/WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">No Password</option>
            </select>
          </div>
          <FormField
            label="Note (optional)"
            name="description"
            type="text"
            placeholder="e.g., Best for streaming"
          />
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
              Add Network
            </Button>
          </div>
        </form>
      )}

      {/* Network List */}
      {networks.length === 0 && !isAdding ? (
        <div className="rounded-xl border-2 border-dashed border-border bg-card/50 p-8 text-center">
          <Wifi className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">No Wi-Fi networks added yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your property&apos;s Wi-Fi details for guests
          </p>
        </div>
      ) : (
        <SortableList
          items={networks}
          getItemId={(network) => network.id}
          onReorder={handleReorder}
          disabled={isPending}
          showKeyboardControls={networks.length > 1}
          renderItem={(network) => (
            <div className="rounded-xl border bg-card p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{network.name}</span>
                  {network.is_primary && (
                    <span className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                      <Star className="h-3 w-3" />
                      Primary
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleDelete(network.id)}
                  disabled={isPending}
                >
                  <Trash2 className="h-4 w-4 text-muted-foreground" />
                </Button>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Password:</span>
                <code className="rounded bg-muted px-2 py-1 text-sm">
                  {showPasswords[network.id]
                    ? network.password
                    : "••••••••••"}
                </code>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => togglePassword(network.id)}
                >
                  {showPasswords[network.id] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => copyPassword(network.id, network.password)}
                >
                  {copiedId === network.id ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {network.description && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {network.description}
                </p>
              )}

              {!network.is_primary && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2"
                  onClick={() => handleSetPrimary(network.id)}
                  disabled={isPending}
                >
                  Set as Primary
                </Button>
              )}
            </div>
          )}
        />
      )}
    </div>
  );
}
