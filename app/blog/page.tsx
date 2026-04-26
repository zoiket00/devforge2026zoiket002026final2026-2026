// app/blog/page.tsx
import { Container, Section } from "@/components/layout/container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | DevForge",
  description: "Artículos sobre desarrollo web, móvil, IA y arquitectura de software",
};

export default function BlogPage() {
  return (
    <Section>
      <Container>
        <div className="text-center py-20 space-y-4">
          <span className="badge">{`// próximamente`}</span>
          <h1 className="heading-lg">Blog DevForge</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Artículos técnicos sobre Next.js, arquitectura, IA y mejores prácticas 2026.
            Suscríbete para ser el primero en enterarte.
          </p>
          <div className="flex gap-2 justify-center mt-8 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="tu@email.com"
              className="input-base flex-1"
            />
            <button className="btn-primary">Suscribirse</button>
          </div>
        </div>
      </Container>
    </Section>
  );
}