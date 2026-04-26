// components/sections/stack.tsx

"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Container, Section } from "@/components/layout/container";

export interface StackCategory {
  id: string;
  label: string;
  items: {
    name: string;
    icon: React.ReactNode;
    description?: string;
  }[];
}

export interface StackProps {
  title?: string;
  description?: string;
  categories: StackCategory[];
}

export function Stack({
  title = "Nuestro Stack Tecnológico",
  description = "Herramientas profesionales 2026 probadas en producción",
  categories,
}: StackProps) {
  const [activeTab, setActiveTab] = useState(categories[0]?.id || "");

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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-center mb-8 flex-wrap h-auto gap-2 bg-transparent border-0 p-0">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="px-4 py-2 capitalize"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map((category) => (
            <TabsContent
              key={category.id}
              value={category.id}
              className="space-y-6"
            >
              {/* Grid de tecnologías */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="group relative p-4 rounded-lg border border-border bg-card hover:border-accent hover:bg-accent/5 transition-all duration-200"
                  >
                    <div className="flex flex-col items-center text-center gap-3">
                      {/* Icon */}
                      <div className="text-3xl group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>

                      {/* Name */}
                      <div>
                        <p className="font-semibold text-sm">{item.name}</p>
                        {item.description && (
                          <p className="font-mono text-xs text-muted-foreground mt-1">
                            {item.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="font-display text-3xl font-bold text-accent">
              {categories.reduce((acc, cat) => acc + cat.items.length, 0)}+
            </div>
            <p className="font-mono text-xs text-muted-foreground mt-2">
              Tecnologías
            </p>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-accent">
              {categories.length}
            </div>
            <p className="font-mono text-xs text-muted-foreground mt-2">
              Categorías
            </p>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-accent">
              2026
            </div>
            <p className="font-mono text-xs text-muted-foreground mt-2">
              Actualizado
            </p>
          </div>
          <div>
            <div className="font-display text-3xl font-bold text-accent">
              100%
            </div>
            <p className="font-mono text-xs text-muted-foreground mt-2">
              Producción Ready
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}