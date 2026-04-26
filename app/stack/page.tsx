// app/stack/page.tsx

import { Stack, CTA } from "@/components/sections";

const stackCategories = [
  {
    id: "frontend",
    label: "Frontend",
    items: [
      { name: "React 19", icon: "⚛️" },
      { name: "Next.js 15", icon: "▲" },
      { name: "TypeScript", icon: "📘" },
      { name: "Tailwind CSS", icon: "🎨" },
      { name: "Framer Motion", icon: "✨" },
      { name: "Astro 5", icon: "🚀" },
    ],
  },
  {
    id: "backend",
    label: "Backend",
    items: [
      { name: "Node.js 22", icon: "🟢" },
      { name: "Hono", icon: "⚡" },
      { name: "NestJS", icon: "🏗️" },
      { name: "Drizzle ORM", icon: "💾" },
      { name: "PostgreSQL", icon: "🐘" },
      { name: "Bun", icon: "🥖" },
    ],
  },
  {
    id: "ai",
    label: "IA & Agentes",
    items: [
      { name: "Claude 4.6", icon: "🤖" },
      { name: "LangGraph", icon: "🔗" },
      { name: "Vercel AI SDK", icon: "⚡" },
      { name: "Mastra", icon: "🔧" },
      { name: "CrewAI", icon: "👥" },
      { name: "Model Context Protocol", icon: "📡" },
    ],
  },
  {
    id: "devops",
    label: "DevOps",
    items: [
      { name: "Docker", icon: "🐳" },
      { name: "Vercel", icon: "▲" },
      { name: "AWS", icon: "☁️" },
      { name: "GitHub Actions", icon: "⚙️" },
      { name: "Cloudflare", icon: "🌐" },
      { name: "Kubernetes", icon: "☸️" },
    ],
  },
];

export default function StackPage() {
  return (
    <>
      <Stack title="Stack Tecnológico 2026" categories={stackCategories} />
      <CTA title="Construye con nosotros" primaryCta={{ text: "Iniciar", href: "/contact" }} />
    </>
  );
}
