// app/not-found.tsx
import Link from "next/link";
import { Container, Section } from "@/components/layout/container";

export default function NotFound() {
  return (
    <Section>
      <Container>
        <div className="text-center py-20 space-y-6">
          <div className="font-mono text-8xl font-bold text-accent opacity-20">404</div>
          <div className="space-y-2">
            <h1 className="heading-md">Página no encontrada</h1>
            <p className="text-muted-foreground">
              La página que buscas no existe o fue movida.
            </p>
          </div>
          <Link href="/" className="btn-primary inline-flex">
            Volver al inicio
          </Link>
        </div>
      </Container>
    </Section>
  );
}
