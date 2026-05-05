// components/ui/select.tsx

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: string;
  hint?: string;
  label?: string;
  placeholder?: string;
  options: Array<{
    value: string;
    label: string;
    disabled?: boolean;
  }>;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      error,
      hint,
      label,
      options,
      disabled,
      id,
      placeholder,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || `select-${generatedId}`;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={selectId}
            className="block font-mono text-sm font-semibold text-foreground"
          >
            {label}
            {props.required && <span className="text-destructive">*</span>}
          </label>
        )}

        <select
          className={cn(
            "flex h-10 w-full rounded-md border border-input bg-input px-3 py-2 font-mono text-sm text-foreground transition-colors focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive focus:ring-destructive/50",
            className
          )}
          disabled={disabled}
          id={selectId}
          ref={ref}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

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

Select.displayName = "Select";

export { Select };