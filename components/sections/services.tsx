// components/sections/services.tsx

"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Container, Section } from "@/components/layout/container";

export interface Service {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  price: string;
  timeline: string;
  features: string[];
  technologies?: string[];
}

export interface ServicesProps {
  title?: string;
  description?: string;
  services: Service[];
  columns?: 2 | 3 | 4;
}

export function Services({
  title = "Nuestros Servicios",
  description = "Soluciones profesionales adaptadas a tu proyecto",
  services,
  columns = 3,
}: ServicesProps) {
  const gridCols = {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  };

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
        <div className={`grid grid-cols-1 md:grid-cols-2 ${gridCols} gap-6`}>
          {services.map((service) => (
            <Card key={service.id} hoverable>
              <CardHeader>
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-lg mb-4">
                  {service.icon}
                </div>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Price & Timeline */}
                <div className="grid grid-cols-2 gap-4 p-3 bg-accent/5 rounded-lg">
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">Desde</p>
                    <p className="font-display text-lg font-bold text-accent">
                      {service.price}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-xs text-muted-foreground">Timeline</p>
                    <p className="font-mono text-sm font-semibold">
                      {service.timeline}
                    </p>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-2">
                  <p className="font-mono text-xs font-bold uppercase text-muted-foreground">
                    Incluye
                  </p>
                  <ul className="space-y-1">
                    {service.features.slice(0, 3).map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="text-accent mt-1">→</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technologies */}
                {service.technologies && (
                  <div className="space-y-2 pt-2 border-t border-border">
                    <p className="font-mono text-xs font-bold uppercase text-muted-foreground">
                      Stack
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {service.technologies.map((tech) => (
                        <Badge key={tech} variant="muted" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <Button asChild variant="ghost" fullWidth className="mt-4">
                  <a href="/contact">
                    Más información
                    <ArrowRight className="h-4 w-4" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  );
}