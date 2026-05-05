"use client";

import { useEffect, useRef } from "react";

const items = [
  "Next.js 15",
  "React 19",
  "TypeScript",
  "Node.js",
  "PostgreSQL",
  "Prisma",
  "Tailwind CSS",
  "Framer Motion",
  "Docker",
  "AWS",
  "Vercel",
  "Anthropic AI",
  "React Native",
  "GraphQL",
  "Redis",
];

export function Marquee() {
  return (
    <div className="relative w-full overflow-hidden border-y border-border/50 bg-card/30 py-4">
      <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-background to-transparent z-10" />
      <div className="flex animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 mx-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
            <span className="font-mono text-sm font-semibold text-muted-foreground hover:text-accent transition-colors">
              {item}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}