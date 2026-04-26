// components/ui/textarea.tsx

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
  hint?: string;
  label?: string;
  rows?: number;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      error,
      hint,
      label,
      disabled,
      rows = 4,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || `textarea-${Math.random()}`;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={textareaId}
            className="block font-mono text-sm font-semibold text-foreground"
          >
            {label}
            {props.required && <span className="text-destructive">*</span>}
          </label>
        )}

        <textarea
          className={cn(
            "flex min-h-[120px] w-full rounded-md border border-input bg-input px-3 py-2 font-mono text-sm text-foreground placeholder-muted transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:cursor-not-allowed disabled:opacity-50 resize-vertical",
            error && "border-destructive focus:ring-destructive/50",
            className
          )}
          disabled={disabled}
          id={textareaId}
          rows={rows}
          ref={ref}
          {...props}
        />

        {error && (
          <p className="font-mono text-xs font-semibold text-destructive">
            {error}
          </p>
        )}

        {hint && (
          <p className="font-mono text-xs text-muted-foreground">
            {hint}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };
