// components/sections/hero.tsx

"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container, Section } from "@/components/layout/container";
import { cn } from "@/lib/utils";

export interface HeroProps {
  badge?: string;
  title: React.ReactNode;
  description: string;
  cta: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
  image?: React.ReactNode;
  gradient?: boolean;
}

export function Hero({
  badge,
  title,
  description,
  cta,
  secondaryCta,
  image,
  gradient = true,
}: HeroProps) {
  return (
    <Section py className="relative overflow-hidden">
      {/* Background gradient */}
      {gradient && (
        <>
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" />
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000" />
          </div>
        </>
      )}

      <Container>
        <div className={cn(
          "grid gap-12",
          image && "lg:grid-cols-2 lg:gap-16 items-center"
        )}>
          {/* Content */}
          <div className="space-y-8">
            {badge && (
              <Badge variant="outline" className="w-fit">
                {badge}
              </Badge>
            )}

            <div className="space-y-6">
              {typeof title === "string" ? (
                <h1 className="heading-xl max-w-2xl">{title}</h1>
              ) : (
                <h1 className="heading-xl max-w-2xl">{title}</h1>
              )}

              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                {description}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" variant="primary">
                <a href={cta.href}>
                  {cta.text}
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

            {/* Stats or additional info */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div>
                <div className="font-display text-2xl font-bold text-accent">50+</div>
                <p className="font-mono text-xs text-muted-foreground mt-1">Proyectos completados</p>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-accent">30+</div>
                <p className="font-mono text-xs text-muted-foreground mt-1">Clientes satisfechos</p>
              </div>
              <div>
                <div className="font-display text-2xl font-bold text-accent">99.9%</div>
                <p className="font-mono text-xs text-muted-foreground mt-1">Uptime garantizado</p>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          {image && (
            <div className="relative h-[500px] hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-2xl" />
              <div className="relative h-full w-full flex items-center justify-center">
                {image}
              </div>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}