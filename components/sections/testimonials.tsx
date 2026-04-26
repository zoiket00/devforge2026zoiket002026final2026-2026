// components/sections/testimonials.tsx

"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";
import { Container, Section } from "@/components/layout/container";
import { cn } from "@/lib/utils";

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: 1 | 2 | 3 | 4 | 5;
}

export interface TestimonialsProps {
  title?: string;
  description?: string;
  testimonials: Testimonial[];
}

export function Testimonials({
  title = "Lo que dicen nuestros clientes",
  description = "Feedback real de proyectos completados",
  testimonials,
}: TestimonialsProps) {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="group relative p-6 rounded-xl border border-border bg-card hover:border-accent hover:shadow-lg transition-all duration-200"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < testimonial.rating
                        ? "fill-accent text-accent"
                        : "text-border"
                    )}
                  />
                ))}
              </div>

              {/* Content */}
              <blockquote className="mb-6 text-sm leading-relaxed text-muted-foreground">
                &ldquo;{testimonial.content}&rdquo;
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-4 pt-6 border-t border-border">
                <div className="relative h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-accent/20 to-secondary/20">
                  {testimonial.image ? (
                    <Image
                      src={testimonial.image}
                      alt={testimonial.author}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center font-display font-bold text-accent">
                      {testimonial.author[0]}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground text-sm truncate">
                    {testimonial.author}
                  </p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {testimonial.role} @ {testimonial.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}