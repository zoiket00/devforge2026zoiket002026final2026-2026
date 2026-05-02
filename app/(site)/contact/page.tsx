// app/contact/page.tsx

import { Container, Section } from "@/components/layout/container";
import { ContactForm } from "@/components/form/contact-form";
import { CTA } from "@/components/sections";

export default function ContactPage() {
  return (
    <>
      <Section>
        <Container size="md">
          <div className="text-center mb-12 space-y-4">
            <h1 className="heading-lg">Conversemos sobre tu proyecto</h1>
            <p className="text-lg text-muted-foreground">
              Respuesta en menos de 24 horas. Sin compromiso.
            </p>
          </div>

          <ContactForm />

          <div className="mt-12 p-8 rounded-lg border border-border text-center space-y-4">
            <h3 className="font-display text-lg font-bold">¿Prefieres contactar directamente?</h3>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="https://wa.me/573001234567"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:border-accent transition-colors"
              >
                WhatsApp
              </a>
              <a
                href="mailto:hola@devforge.dev"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:border-accent transition-colors"
              >
                Email
              </a>
              <a
                href="https://cal.com/devforge"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border hover:border-accent transition-colors"
              >
                Agendar llamada
              </a>
            </div>
          </div>
        </Container>
      </Section>

      <CTA
        title="¿Aún dudas?"
        description="Tu primera consulta es gratis"
        primaryCta={{ text: "Sí, quiero hablar", href: "https://wa.me/573001234567" }}
      />
    </>
  );
}
