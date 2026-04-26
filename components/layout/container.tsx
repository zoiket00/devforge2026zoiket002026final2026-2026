// components/layout/container.tsx

import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "main" | "section" | "article";
  size?: "sm" | "md" | "lg" | "full";
  py?: boolean;
}

export function Container({
  as: Component = "div",
  className,
  size = "lg",
  py = true,
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn(
        "w-full px-4 sm:px-6 lg:px-8",
        {
          "sm:max-w-2xl": size === "sm",
          "sm:max-w-4xl": size === "md",
          "sm:max-w-7xl": size === "lg",
          "": size === "full",
        },
        {
          "mx-auto": size !== "full",
          "py-12 sm:py-16 md:py-20 lg:py-24": py,
        },
        className
      )}
      {...props}
    />
  );
}

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  py?: boolean;
}

export function Section({ className, py = true, ...props }: SectionProps) {
  return (
    <section
      className={cn(
        py && "py-12 sm:py-16 md:py-20 lg:py-24",
        className
      )}
      {...props}
    />
  );
}
