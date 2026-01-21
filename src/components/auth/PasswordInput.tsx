"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: string;
  error?: string;
  showStrength?: boolean;
}

function getPasswordStrength(password: string): {
  level: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
  suggestions: string[];
} {
  if (!password) {
    return { level: 0, label: "", color: "", suggestions: [] };
  }

  const suggestions: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score++;
  } else {
    suggestions.push("at least 8 characters");
  }

  if (/[A-Z]/.test(password)) {
    score++;
  } else {
    suggestions.push("uppercase letter");
  }

  if (/[0-9]/.test(password)) {
    score++;
  } else {
    suggestions.push("number");
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score++;
  }

  const levels: Record<
    number,
    { label: string; color: string; level: 0 | 1 | 2 | 3 | 4 }
  > = {
    0: { level: 1, label: "Weak", color: "bg-destructive" },
    1: { level: 1, label: "Weak", color: "bg-destructive" },
    2: { level: 2, label: "Fair", color: "bg-orange-500" },
    3: { level: 3, label: "Good", color: "bg-yellow-500" },
    4: { level: 4, label: "Strong", color: "bg-green-500" },
  };

  return { ...levels[score], suggestions };
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    { label, error, showStrength = false, className, id, required, ...props },
    ref
  ) => {
    const [isVisible, setIsVisible] = useState(false);
    const [value, setValue] = useState("");

    const inputId = id || label.toLowerCase().replace(/\s+/g, "-");
    const strength = showStrength ? getPasswordStrength(value) : null;

    return (
      <div className="space-y-2">
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={inputId}
            type={isVisible ? "text" : "password"}
            className={cn(
              "w-full rounded-lg border bg-background px-4 py-3 pr-12 text-base text-foreground",
              "placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error
                ? "border-destructive focus:ring-destructive"
                : "border-border",
              className
            )}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            onChange={(e) => {
              setValue(e.target.value);
              props.onChange?.(e);
            }}
            {...props}
          />
          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label={isVisible ? "Hide password" : "Show password"}
          >
            {isVisible ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>

        {showStrength && value && strength && (
          <div className="space-y-1">
            <div className="flex gap-1">
              {[1, 2, 3, 4].map((level) => (
                <div
                  key={level}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors",
                    level <= strength.level
                      ? strength.color
                      : "bg-muted"
                  )}
                />
              ))}
            </div>
            <p
              className={cn(
                "text-xs",
                strength.level <= 1
                  ? "text-destructive"
                  : strength.level === 2
                    ? "text-orange-600"
                    : strength.level === 3
                      ? "text-yellow-600"
                      : "text-green-600"
              )}
            >
              {strength.label}
              {strength.suggestions.length > 0 &&
                ` · Add ${strength.suggestions.join(", ")}`}
            </p>
          </div>
        )}

        {error && (
          <p
            id={`${inputId}-error`}
            className="text-sm text-destructive flex items-center gap-1"
          >
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";
