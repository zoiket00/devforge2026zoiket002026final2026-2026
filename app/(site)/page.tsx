// app/(site)/page.tsx

import { Hero, Services, Projects, Testimonials, CTA } from "@/components/sections";
import { Container, Section } from "@/components/layout/container";

const featuredServices = [
  {
    id: "web-app",
    icon: "💻",
    title: "Aplicaciones Web",
    description: "SaaS y plataformas escalables",
    price: "$2,500",
    timeline: "3-6 semanas",
    features: ["Arquitectura moderna", "Responsive", "Base de datos"],
    technologies: ["Next.js", "React", "TypeScript"],
  },
  {
    id: "mobile-app",
    icon: "📱",
    title: "Apps Móviles",
    description: "iOS y Android con React Native",
    price: "$3,500",
    timeline: "6-10 semanas",
    features: ["Cross-platform", "App Store ready", "Push notifications"],
    technologies: ["React Native", "Expo", "TypeScript"],
  },
  {
    id: "api",
    icon: "⚙️",
    title: "APIs & Backend",
    description: "Microservicios y APIs REST",
    price: "$1,800",
    timeline: "2-4 semanas",
    features: ["Escalable", "Segura", "Documentada"],
    technologies: ["Node.js", "PostgreSQL", "Docker"],
  },
];

const featuredProjects = [
  {
    id: "fintrack",
    title: "FinTrack",
    description: "App de finanzas personales con dashboard",
    image: "",
    technologies: ["Next.js", "React", "PostgreSQL"],
    featured: true,
    status: "Live" as const,
    category: "Web" as const,
    link: "https://example.com",
  },
  {
    id: "medicare",
    title: "MediCare",
    description: "App móvil para gestión de salud",
    image: "",
    technologies: ["React Native", "Firebase", "TypeScript"],
    featured: true,
    status: "Live" as const,
    category: "Mobile" as const,
  },
  {
    id: "shopnova",
    title: "ShopNova",
    description: "E-commerce headless moderno",
    image: "",
    technologies: ["Next.js", "Stripe", "Vercel"],
    featured: true,
    status: "Live" as const,
    category: "Web" as const,
  },
];

const testimonials = [
  {
    id: "1",
    author: "María García",
    role: "CEO",
    company: "TechStart",
    image: "",
    content: "SpaceSoft entregó exactamente lo que prometieron. Profesionales, puntuales y muy dedicados.",
    rating: 5 as const,
  },
  {
    id: "2",
    author: "Carlos López",
    role: "Product Manager",
    company: "InnovaHub",
    image: "",
    content: "La mejor decisión fue confiarles nuestro proyecto. Resultados excepcionales.",
    rating: 5 as const,
  },
  {
    id: "3",
    author: "Laura Martínez",
    role: "Founder",
    company: "DataFlow",
    image: "",
    content: "Equipo profesional con expertise real. Recomendado 100%.",
    rating: 5 as const,
  },
];

export default function Home() {
  return (
    <>
      <Hero
        badge="Powered by 2026 Tech Stack"
        title={
          <>
            Código que funciona.
            <br />
            <span className="text-accent">Productos que escalan.</span>
          </>
        }
        description="Micro-estudio de desarrollo full-stack. Desde MVPs hasta aplicaciones empresariales. React, Node, IA - todo hecho con excelencia."
        cta={{ text: "Iniciar proyecto", href: "/contact" }}
        secondaryCta={{ text: "Ver portafolio", href: "/work" }}
        gradient
      />

      <Services
        title="Servicios"
        description="Soluciones adaptadas a tu proyecto"
        services={featuredServices}
        columns={3}
      />

      <Projects
        title="Proyectos Destacados"
        description="Trabajos que demuestran nuestra expertise"
        projects={featuredProjects}
        featured
      />

      <Section>
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "50+", label: "Proyectos completados" },
              { value: "30+", label: "Clientes satisfechos" },
              { value: "99.9%", label: "Uptime garantizado" },
              { value: "24h", label: "Respuesta máxima" },
            ].map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="font-display text-4xl md:text-5xl font-bold text-accent">{stat.value}</div>
                <p className="font-mono text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Testimonials
        title="Lo que dicen nuestros clientes"
        description="Feedback real de proyectos completados"
        testimonials={testimonials}
      />

      <CTA
        title="¿Listo para tu proyecto?"
        description="Primera consulta gratis. Sin compromisos. Propuesta detallada en 24 horas."
        primaryCta={{ text: "Agendar llamada", href: "/contact" }}
        secondaryCta={{ text: "Contactar por WhatsApp", href: "https://wa.me/573001234567" }}
      />
    </>
  );
}