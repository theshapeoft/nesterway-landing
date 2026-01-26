"use client";

import { useEffect, useState } from "react";
import { Check, AlertCircle, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
  isVisible: boolean;
}

export function Toast({
  message,
  type = "success",
  duration = 3000,
  onClose,
  isVisible,
}: ToastProps) {
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    if (!isVisible) return;

    const timer = setTimeout(() => {
      setIsLeaving(true);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: <Check className="h-4 w-4" />,
    error: <AlertCircle className="h-4 w-4" />,
    info: <Info className="h-4 w-4" />,
  };

  const borderColors = {
    success: "border-l-green-500",
    error: "border-l-destructive",
    info: "border-l-primary",
  };

  const iconColors = {
    success: "text-green-500",
    error: "text-destructive",
    info: "text-primary",
  };

  return (
    <div
      className={cn(
        "fixed bottom-4 left-1/2 z-[100] flex items-center gap-2 rounded-lg border-l-4 bg-neutral-800 px-4 py-3 text-white shadow-lg",
        borderColors[type],
        isLeaving ? "animate-toast-out" : "animate-toast-in"
      )}
      style={{ transform: "translateX(-50%)" }}
      role="alert"
      aria-live="polite"
    >
      <span className={iconColors[type]}>{icons[type]}</span>
      <span className="text-sm font-medium">{message}</span>
      <button
        onClick={() => {
          setIsLeaving(true);
          setTimeout(onClose, 300);
        }}
        className="ml-2 text-neutral-400 hover:text-white"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// Toast hook for easy usage
interface ToastState {
  message: string;
  type: ToastType;
  isVisible: boolean;
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    message: "",
    type: "success",
    isVisible: false,
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  return { toast, showToast, hideToast };
}
