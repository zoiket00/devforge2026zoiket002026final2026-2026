// components/sections/faq.tsx

"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Container, Section } from "@/components/layout/container";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

export interface FAQProps {
  title?: string;
  description?: string;
  items: FAQItem[];
  grouped?: boolean;
}

export function FAQ({
  title = "Preguntas Frecuentes",
  description = "Resuelve tus dudas sobre nuestros servicios",
  items,
  grouped = false,
}: FAQProps) {
  // Agrupar por categoría si está disponible
  const groupedItems = grouped
    ? items.reduce(
        (acc, item) => {
          const category = item.category || "General";
          if (!acc[category]) acc[category] = [];
          acc[category].push(item);
          return acc;
        },
        {} as Record<string, FAQItem[]>
      )
    : { General: items };

  return (
    <Section>
      <Container size="md">
        {/* Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="heading-lg">{title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* FAQ Groups */}
        {Object.entries(groupedItems).map(([category, categoryItems]) => (
          <div key={category} className="space-y-8">
            {grouped && (
              <h3 className="font-display text-xl font-bold text-center">
                {category}
              </h3>
            )}

            <Accordion type="single" collapsible className="w-full space-y-2">
              {categoryItems.map((item) => (
                <AccordionItem
                  key={item.id}
                  value={item.id}
                  className="border-b border-border"
                >
                  <AccordionTrigger className="hover:text-accent">
                    <span className="text-left font-semibold">
                      {item.question}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}

        {/* Footer CTA */}
        <div className="mt-16 p-8 rounded-lg border border-border text-center space-y-4">
          <h3 className="font-display text-lg font-bold">
            ¿Aún tienes preguntas?
          </h3>
          <p className="text-muted-foreground">
            Nuestro equipo está listo para ayudarte.
          </p>
          <div className="flex gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-accent-foreground font-semibold hover:shadow-lg transition-all"
            >
              Contactanos
            </a>
          </div>
        </div>
      </Container>
    </Section>
  );
}