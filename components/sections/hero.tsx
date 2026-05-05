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
  cta: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
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
     
      <Container>
        <div className={cn("grid gap-12", image && "lg:grid-cols-2 lg:gap-16 items-center")}>
          <div className="space-y-10">
            {badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></span>
                <span className="font-mono text-xs text-accent font-semibold tracking-wider uppercase">{badge}</span>
              </div>
            )}

            <div className="space-y-6">
              <h1 className="font-display font-bold tracking-tight leading-[1.05]" style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)" }}>
                {title}
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
                {description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" variant="primary">
                <a href={cta.href}>
                  {cta.text}
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
              {secondaryCta && (
                <Button asChild size="lg" variant="ghost">
                  <a href={secondaryCta.href}>{secondaryCta.text}</a>
                </Button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50">
              {[
                { value: "50+", label: "Proyectos completados" },
                { value: "30+", label: "Clientes satisfechos" },
                { value: "99.9%", label: "Uptime garantizado" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="font-display text-3xl font-bold text-accent">{stat.value}</div>
                  <p className="font-mono text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {image && (
            <div className="relative h-[500px] hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-secondary/10 rounded-2xl" />
              <div className="relative h-full w-full flex items-center justify-center">{image}</div>
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}