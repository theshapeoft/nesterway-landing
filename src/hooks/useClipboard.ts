"use client";

import { useState, useCallback } from "react";

interface UseClipboardReturn {
  copy: (text: string) => Promise<boolean>;
  hasCopied: boolean;
  error: Error | null;
}

export function useClipboard(resetDelay = 2000): UseClipboardReturn {
  const [hasCopied, setHasCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) {
        setError(new Error("Clipboard API not available"));
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setHasCopied(true);
        setError(null);

        // Haptic feedback if available
        if ("vibrate" in navigator) {
          navigator.vibrate(50);
        }

        // Reset after delay
        setTimeout(() => {
          setHasCopied(false);
        }, resetDelay);

        return true;
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to copy"));
        setHasCopied(false);
        return false;
      }
    },
    [resetDelay]
  );

  return { copy, hasCopied, error };
}
