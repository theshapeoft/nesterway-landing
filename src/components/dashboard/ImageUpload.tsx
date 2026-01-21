"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
  bucket: string;
  folder: string;
  currentUrl?: string | null;
  onUpload: (url: string) => void;
  onRemove: () => void;
  aspectRatio?: "square" | "video" | "wide";
  circular?: boolean;
  resizeToSize?: number; // Resize image to this dimension (e.g., 200 for 200x200)
  previewSize?: "sm" | "md" | "lg"; // sm=80px, md=120px, lg=160px
  label?: string;
  hint?: string;
  maxSizeMB?: number;
}

const aspectClasses = {
  square: "aspect-square",
  video: "aspect-video",
  wide: "aspect-[3/1]",
};

const previewSizeClasses = {
  sm: "h-20 w-20", // 80px
  md: "h-30 w-30", // 120px
  lg: "h-40 w-40", // 160px
};

// Client-side image resize using canvas
function resizeImage(file: File, maxSize: number): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      // Calculate dimensions for center crop to square
      const size = Math.min(img.width, img.height);
      const x = (img.width - size) / 2;
      const y = (img.height - size) / 2;

      // Set canvas to target size
      canvas.width = maxSize;
      canvas.height = maxSize;

      if (ctx) {
        // Draw cropped and resized image
        ctx.drawImage(img, x, y, size, size, 0, 0, maxSize, maxSize);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const resizedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(resizedFile);
            } else {
              reject(new Error("Failed to resize image"));
            }
          },
          "image/jpeg",
          0.9
        );
      } else {
        reject(new Error("Could not get canvas context"));
      }
    };

    img.onerror = () => reject(new Error("Failed to load image"));
    img.src = URL.createObjectURL(file);
  });
}

export function ImageUpload({
  bucket,
  folder,
  currentUrl,
  onUpload,
  onRemove,
  aspectRatio = "video",
  circular = false,
  resizeToSize,
  previewSize,
  label,
  hint,
  maxSizeMB = 5,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      return "Please upload a JPEG, PNG, WebP, or GIF image";
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      return `Image must be smaller than ${maxSizeMB}MB`;
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setIsUploading(true);

    try {
      // Resize image if resizeToSize is specified
      let fileToUpload = file;
      if (resizeToSize) {
        fileToUpload = await resizeImage(file, resizeToSize);
      }

      const supabase = createClient();

      // Get current user for folder path
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        throw new Error("Not authenticated");
      }

      // Generate unique filename (always jpeg if resized)
      const ext = resizeToSize ? "jpg" : file.name.split(".").pop();
      const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const path = `${user.id}/${folder}/${filename}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, fileToUpload, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const {
        data: { publicUrl },
      } = supabase.storage.from(bucket).getPublicUrl(path);

      onUpload(publicUrl);
    } catch (err) {
      console.error("Upload error:", err);
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
    // Reset input so same file can be selected again
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) {
        uploadFile(file);
      }
    },
    [folder, bucket]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemove = async () => {
    if (!currentUrl) return;

    setIsUploading(true);
    try {
      const supabase = createClient();

      // Extract path from URL
      const urlParts = currentUrl.split(`/storage/v1/object/public/${bucket}/`);
      if (urlParts.length === 2) {
        const path = urlParts[1];
        await supabase.storage.from(bucket).remove([path]);
      }

      onRemove();
    } catch (err) {
      console.error("Remove error:", err);
      setError("Failed to remove image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      {circular ? (
        // Circular preview mode (for host photos, avatars)
        <div className="flex items-center gap-4">
          <div
            onClick={() => !currentUrl && inputRef.current?.click()}
            onDrop={!currentUrl ? handleDrop : undefined}
            onDragOver={!currentUrl ? handleDragOver : undefined}
            onDragLeave={!currentUrl ? handleDragLeave : undefined}
            className={`relative ${previewSize ? previewSizeClasses[previewSize] : "h-20 w-20"} flex-shrink-0 overflow-hidden rounded-full border-2 ${
              currentUrl
                ? "border-border"
                : isDragOver
                  ? "border-primary bg-primary/5 cursor-pointer"
                  : "border-dashed border-border bg-card/50 hover:border-primary/50 hover:bg-card cursor-pointer"
            }`}
          >
            {currentUrl ? (
              <img
                src={currentUrl}
                alt="Uploaded image"
                className="h-full w-full object-cover"
              />
            ) : isUploading ? (
              <div className="flex h-full w-full items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                {isDragOver ? (
                  <Upload className="h-6 w-6 text-primary" />
                ) : (
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            {currentUrl ? (
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                  disabled={isUploading}
                >
                  Replace
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleRemove}
                  disabled={isUploading}
                  className="text-destructive hover:text-destructive"
                >
                  {isUploading ? (
                    <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                  ) : (
                    <X className="mr-1 h-4 w-4" />
                  )}
                  Remove
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => inputRef.current?.click()}
                disabled={isUploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                Upload photo
              </Button>
            )}
            <p className="text-xs text-muted-foreground">
              JPEG, PNG, WebP up to {maxSizeMB}MB
            </p>
          </div>
        </div>
      ) : currentUrl ? (
        <div className={`relative ${aspectClasses[aspectRatio]} overflow-hidden rounded-xl border bg-muted`}>
          <img
            src={currentUrl}
            alt="Uploaded image"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity hover:opacity-100">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleRemove}
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <X className="mr-1 h-4 w-4" />
              )}
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`relative ${aspectClasses[aspectRatio]} cursor-pointer rounded-xl border-2 border-dashed transition-colors ${
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-border bg-card/50 hover:border-primary/50 hover:bg-card"
          }`}
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            {isUploading ? (
              <>
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  Uploading...
                </span>
              </>
            ) : (
              <>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  {isDragOver ? (
                    <Upload className="h-6 w-6 text-primary" />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>
                <div className="text-center">
                  <span className="text-sm font-medium text-foreground">
                    {isDragOver ? "Drop to upload" : "Click or drag to upload"}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    JPEG, PNG, WebP, GIF up to {maxSizeMB}MB
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileSelect}
        className="hidden"
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
