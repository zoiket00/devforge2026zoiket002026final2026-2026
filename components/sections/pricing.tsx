// components/sections/pricing.tsx

"use client";

import React from "react";
import { Check, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container, Section } from "@/components/layout/container";
import { cn } from "@/lib/utils";

export interface PricingTier {
  id: string;
  name: string;
  description: string;
  price: number | null;
  period?: string;
  features: string[];
  featured?: boolean;
  cta: {
    text: string;
    href: string;
  };
}

export interface PricingProps {
  title?: string;
  description?: string;
  tiers: PricingTier[];
}

export function Pricing({
  title = "Planes de Precios",
  description = "Elige el plan perfecto para tu proyecto",
  tiers,
}: PricingProps) {
  return (
    <Section>
      <Container>
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="heading-lg">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Grid */}
        <div className={cn(
          "grid gap-6",
          tiers.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"
        )}>
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              className={cn(
                tier.featured && "ring-2 ring-accent lg:scale-105"
              )}
              hoverable={!tier.featured}
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                  </div>
                  {tier.featured && (
                    <Badge variant="default">Recomendado</Badge>
                  )}
                </div>

                {/* Price */}
                <div className="space-y-2">
                  {tier.price ? (
                    <>
                      <div className="font-display text-4xl font-bold">
                        ${tier.price.toLocaleString()}
                        <span className="text-lg text-muted-foreground font-body ml-1">
                          {tier.period || "USD"}
                        </span>
                      </div>
                      {tier.period && tier.period !== "USD" && (
                        <p className="font-mono text-xs text-muted-foreground">
                          {tier.period}
                        </p>
                      )}
                    </>
                  ) : (
                    <div className="font-display text-3xl font-bold text-muted-foreground">
                      Custom
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <ul className="space-y-3">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                      <span className="text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Button
                  asChild
                  variant={tier.featured ? "primary" : "ghost"}
                  fullWidth
                  size="lg"
                  className="mt-8"
                >
                  <a href={tier.cta.href}>
                    {tier.cta.text}
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 p-8 rounded-lg border border-border bg-accent/5 text-center">
          <h3 className="font-display text-lg font-bold mb-2">
            ¿No encuentras lo que buscas?
          </h3>
          <p className="text-muted-foreground mb-4">
            Ofrecemos soluciones personalizadas para proyectos únicos.
          </p>
          <Button asChild variant="outline">
            <a href="/contact">Contactar para cotización</a>
          </Button>
        </div>
      </Container>
    </Section>
  );
}