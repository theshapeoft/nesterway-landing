"use client";

import { useState, useTransition, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  MoreVertical,
  Check,
  Loader2,
  Trash2,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui";
import {
  updateProperty,
  updatePropertyStatus,
  deleteProperty,
  duplicateProperty,
  type DbProperty,
} from "@/lib/actions/properties";
import { track } from "@/lib/analytics";
import { BasicInfoTab } from "./tabs/BasicInfoTab";
import { WifiTab } from "./tabs/WifiTab";
import { RulesTab } from "./tabs/RulesTab";
import { EmergencyTab } from "./tabs/EmergencyTab";
import { QrCodeTab } from "./tabs/QrCodeTab";
import { AppliancesTab } from "./tabs/AppliancesTab";
import { CustomSectionsTab } from "./tabs/CustomSectionsTab";
import { PreviewPanel } from "./PreviewPanel";

const tabs = [
  { id: "basic", label: "Basic Info" },
  { id: "wifi", label: "Wi-Fi" },
  { id: "appliances", label: "Appliances" },
  { id: "rules", label: "Rules" },
  { id: "sections", label: "Sections" },
  { id: "emergency", label: "Emergency" },
  { id: "qr", label: "QR Code" },
] as const;

type TabId = (typeof tabs)[number]["id"];

interface PropertyEditorProps {
  property: DbProperty;
  showDuplicatedToast?: boolean;
}

export function PropertyEditor({
  property,
  showDuplicatedToast,
}: PropertyEditorProps) {
  const [activeTab, setActiveTab] = useState<TabId>("basic");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
  );
  const [isPending, startTransition] = useTransition();
  const [showMenu, setShowMenu] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [previewRefreshTrigger, setPreviewRefreshTrigger] = useState(0);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Check if we're on desktop (≥1024px)
  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkIsDesktop();
    window.addEventListener("resize", checkIsDesktop);
    return () => window.removeEventListener("resize", checkIsDesktop);
  }, []);

  // Show toast when property was just duplicated
  useEffect(() => {
    if (showDuplicatedToast) {
      toast.success("Property duplicated successfully");
      // Remove the query param from URL without triggering a reload
      window.history.replaceState(
        {},
        "",
        `/dashboard/properties/${property.id}`
      );
    }
  }, [showDuplicatedToast, property.id]);

  // Debounced preview refresh
  const triggerPreviewRefresh = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setPreviewRefreshTrigger((prev) => prev + 1);
    }, 500);
  }, []);

  const handleSave = async (formData: FormData) => {
    setSaveStatus("saving");
    startTransition(async () => {
      await updateProperty(property.id, formData);
      setSaveStatus("saved");
      track("property_edited", { property_id: property.id, section: activeTab });
      setTimeout(() => setSaveStatus("idle"), 2000);
      // Trigger preview refresh after save
      triggerPreviewRefresh();
    });
  };

  const handlePublishToggle = () => {
    startTransition(async () => {
      const newStatus =
        property.status === "published" ? "draft" : "published";
      await updatePropertyStatus(property.id, newStatus);
      if (newStatus === "published") {
        track("property_published", { property_id: property.id });
      } else {
        track("property_unpublished", { property_id: property.id });
      }
    });
  };

  const handleDelete = () => {
    if (
      confirm(
        `Are you sure you want to delete "${property.name}"? This action can be undone within 30 days.`
      )
    ) {
      startTransition(async () => {
        track("property_deleted", { property_id: property.id });
        await deleteProperty(property.id);
      });
    }
  };

  const handleDuplicate = () => {
    startTransition(async () => {
      await duplicateProperty(property.id);
    });
  };

  const handlePreviewToggle = () => {
    if (isDesktop) {
      const newShowPreview = !showPreview;
      setShowPreview(newShowPreview);
      track("preview_toggled", { property_id: property.id, visible: newShowPreview });
    } else {
      // On mobile/tablet, open in new tab
      track("preview_opened", { property_id: property.id });
      window.open(`/stay/${property.slug}`, "_blank");
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Main Editor Area */}
      <div
        className={`flex min-h-screen flex-1 flex-col transition-all duration-300 ${
          showPreview && isDesktop ? "lg:w-1/2" : "w-full"
        }`}
      >
        {/* Header */}
        <header className="sticky top-0 z-10 border-b bg-background px-4 py-3">
          <div
            className={`mx-auto flex items-center justify-between ${
              showPreview && isDesktop ? "" : "max-w-5xl"
            }`}
          >
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Properties</span>
              </Link>
              <h1 className="truncate text-lg font-semibold">
                {property.name}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Preview Toggle Button */}
              <Button
                variant="secondary"
                size="sm"
                onClick={handlePreviewToggle}
                className="hidden sm:flex"
              >
                {showPreview && isDesktop ? (
                  <>
                    <EyeOff className="mr-1 h-3 w-3" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="mr-1 h-3 w-3" />
                    Preview
                  </>
                )}
              </Button>
              {property.status === "published" && (
                <Link
                  href={`/stay/${property.slug}`}
                  target="_blank"
                  className="hidden sm:block"
                >
                  <Button variant="secondary" size="sm">
                    <ExternalLink className="mr-1 h-3 w-3" />
                    View Live
                  </Button>
                </Link>
              )}
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowMenu(!showMenu)}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-lg border bg-card py-1 shadow-lg">
                      {/* Mobile preview option */}
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm hover:bg-accent sm:hidden"
                        onClick={() => {
                          setShowMenu(false);
                          handlePreviewToggle();
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </button>
                      {property.status === "published" && (
                        <Link
                          href={`/stay/${property.slug}`}
                          target="_blank"
                          className="flex w-full items-center px-4 py-2 text-sm hover:bg-accent sm:hidden"
                          onClick={() => setShowMenu(false)}
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Live
                        </Link>
                      )}
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm hover:bg-accent"
                        onClick={() => {
                          setShowMenu(false);
                          handleDuplicate();
                        }}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </button>
                      <button
                        className="flex w-full items-center px-4 py-2 text-sm text-destructive hover:bg-accent"
                        onClick={() => {
                          setShowMenu(false);
                          handleDelete();
                        }}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Property
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Tab Navigation */}
        <nav className="border-b bg-background">
          <div
            className={`mx-auto overflow-x-auto ${
              showPreview && isDesktop ? "" : "max-w-5xl"
            }`}
          >
            <div className="flex min-w-max px-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Tab Content */}
        <main className="flex-1 px-4 py-6">
          <div
            className={`mx-auto ${showPreview && isDesktop ? "max-w-xl" : "max-w-2xl"}`}
          >
            {activeTab === "basic" && (
              <BasicInfoTab property={property} onSave={handleSave} />
            )}
            {activeTab === "wifi" && (
              <WifiTab
                propertyId={property.id}
                onDataChange={triggerPreviewRefresh}
              />
            )}
            {activeTab === "appliances" && (
              <AppliancesTab
                propertyId={property.id}
                onDataChange={triggerPreviewRefresh}
              />
            )}
            {activeTab === "rules" && (
              <RulesTab
                propertyId={property.id}
                onDataChange={triggerPreviewRefresh}
              />
            )}
            {activeTab === "sections" && (
              <CustomSectionsTab
                propertyId={property.id}
                onDataChange={triggerPreviewRefresh}
              />
            )}
            {activeTab === "emergency" && (
              <EmergencyTab
                propertyId={property.id}
                onDataChange={triggerPreviewRefresh}
              />
            )}
            {activeTab === "qr" && <QrCodeTab property={property} />}
          </div>
        </main>

        {/* Footer */}
        <footer className="sticky bottom-0 border-t bg-background px-4 py-3">
          <div
            className={`mx-auto flex items-center justify-between ${
              showPreview && isDesktop ? "" : "max-w-5xl"
            }`}
          >
            <div className="flex items-center gap-2 text-sm">
              <span
                className={`h-2 w-2 rounded-full ${
                  property.status === "published"
                    ? "bg-green-500"
                    : "bg-amber-500"
                }`}
              />
              <span className="text-muted-foreground">
                {property.status === "published" ? "Published" : "Draft"}
              </span>
              {saveStatus === "saving" && (
                <span className="ml-2 flex items-center text-muted-foreground">
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                  Saving...
                </span>
              )}
              {saveStatus === "saved" && (
                <span className="ml-2 flex items-center text-green-600">
                  <Check className="mr-1 h-3 w-3" />
                  Saved
                </span>
              )}
            </div>
            <Button
              variant="accent"
              onClick={handlePublishToggle}
              disabled={isPending}
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {property.status === "published" ? "Unpublish" : "Publish"}
            </Button>
          </div>
        </footer>
      </div>

      {/* Preview Panel - Desktop only */}
      {showPreview && isDesktop && (
        <div className="hidden h-screen w-1/2 lg:block">
          <PreviewPanel
            property={property}
            onClose={() => setShowPreview(false)}
            refreshTrigger={previewRefreshTrigger}
          />
        </div>
      )}
    </div>
  );
}
