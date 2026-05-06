"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container, Section } from "@/components/layout/container";

function HeroVisual() {
  return (
    <div className="relative h-[520px] w-full hidden lg:flex items-center justify-center">
      <div className="relative w-full max-w-[420px]">

        <div className="absolute -top-9 left-0 flex gap-2">
          {["Next.js", "React", "TypeScript"].map((tech) => (
            <span key={tech} className="font-mono text-[10px] px-2.5 py-1 rounded-full bg-card border border-border text-muted-foreground">
              {tech}
            </span>
          ))}
        </div>

        <div className="rounded-2xl border border-border/80 bg-[#0d1117] overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/50">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
              <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
              <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            </div>
            <span className="font-mono text-xs text-muted-foreground">spacesoft ~ terminal</span>
            <div className="w-16" />
          </div>
          <div className="p-6 font-mono text-sm space-y-3">
            <div className="flex gap-2 items-center">
              <span className="text-accent font-bold">❯</span>
              <span className="text-blue-400">npx</span>
              <span className="text-foreground">create-spacesoft-app</span>
            </div>
            <div className="flex items-center gap-2 pl-4">
              <span className="text-green-400">✓</span>
              <span className="text-green-400">Proyecto inicializado</span>
            </div>
            <div className="flex gap-2 items-center mt-1">
              <span className="text-accent font-bold">❯</span>
              <span className="text-blue-400">npm</span>
              <span className="text-foreground">run deploy</span>
            </div>
            <div className="space-y-1.5 pl-4">
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-green-400">Build completado</span>
                <span className="text-muted-foreground text-xs ml-auto">2.3s</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-green-400">DB conectada</span>
                <span className="text-muted-foreground text-xs ml-auto">Neon</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                <span className="text-green-400">Deploy exitoso</span>
                <span className="text-muted-foreground text-xs ml-auto">Vercel</span>
              </div>
            </div>
            <div className="flex gap-2 items-center pt-2 border-t border-border/30">
              <span className="text-accent font-bold">❯</span>
              <span className="text-foreground/50 animate-pulse">█</span>
            </div>
          </div>
        </div>

        <div className="absolute -top-8 -right-8 bg-card border border-accent/40 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-base">⚡</div>
            <div>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Velocidad</p>
              <p className="font-display text-sm font-bold text-accent">99.9% uptime</p>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-8 -left-8 bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center text-base">🚀</div>
            <div>
              <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">Proyectos</p>
              <p className="font-display text-sm font-bold">50+ entregados</p>
            </div>
          </div>
        </div>

        <div className="absolute top-1/2 -right-12 -translate-y-1/2 bg-card border border-green-500/30 rounded-full px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <p className="font-mono text-xs text-green-400 font-semibold">En línea</p>
          </div>
        </div>

      </div>
    </div>
  );
}

export interface HeroProps {
  badge?: string;
  title: React.ReactNode;
  description: string;
  cta: { text: string; href: string };
  secondaryCta?: { text: string; href: string };
  gradient?: boolean;
}

export function Hero({
  badge,
  title,
  description,
  cta,
  secondaryCta,
}: HeroProps) {
  return (
    <Section py className="relative overflow-hidden">
      <Container>
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-10">
            {badge && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
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

          <HeroVisual />
        </div>
      </Container>
    </Section>
  );
}