"use client";

import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type AlertType = "error" | "success" | "warning" | "info";

interface AlertMessageProps {
  type: AlertType;
  message: string;
  className?: string;
}

const alertStyles: Record<
  AlertType,
  { bg: string; border: string; text: string; icon: React.ReactNode }
> = {
  error: {
    bg: "bg-destructive/10",
    border: "border-destructive/20",
    text: "text-destructive",
    icon: <XCircle className="h-5 w-5" />,
  },
  success: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    text: "text-green-700 dark:text-green-400",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  warning: {
    bg: "bg-yellow-500/10",
    border: "border-yellow-500/20",
    text: "text-yellow-700 dark:text-yellow-400",
    icon: <AlertTriangle className="h-5 w-5" />,
  },
  info: {
    bg: "bg-primary/10",
    border: "border-primary/20",
    text: "text-primary",
    icon: <Info className="h-5 w-5" />,
  },
};

export function AlertMessage({ type, message, className }: AlertMessageProps) {
  const styles = alertStyles[type];

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-lg border p-4",
        styles.bg,
        styles.border,
        className
      )}
      role="alert"
    >
      <span className={styles.text}>{styles.icon}</span>
      <p className={cn("text-sm", styles.text)}>{message}</p>
    </div>
  );
}
