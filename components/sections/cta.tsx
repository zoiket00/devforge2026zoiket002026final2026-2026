// components/sections/cta.tsx

"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/layout/container";
import { cn } from "@/lib/utils";

export interface CTAProps {
  title: string;
  description?: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  className?: string;
}

export function CTA({
  title,
  description,
  primaryCta,
  secondaryCta,
  className,
}: CTAProps) {
  return (
    <Section className={className}>
      <Container>
        <div className={cn(
          "relative overflow-hidden rounded-2xl p-12 md:p-16 lg:p-20",
          "bg-gradient-to-br from-accent/10 via-secondary/5 to-background",
          "border border-accent/20"
        )}>
          {/* Background effects */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: "2s" }} />
          </div>

          {/* Content */}
          <div className="relative space-y-8 text-center max-w-3xl mx-auto">
            <h2 className="heading-lg">{title}</h2>

            {description && (
              <p className="text-lg text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button asChild size="lg" variant="primary">
                <a href={primaryCta.href}>
                  {primaryCta.text}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>

              {secondaryCta && (
                <Button asChild size="lg" variant="ghost">
                  <a href={secondaryCta.href}>
                    {secondaryCta.text}
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}