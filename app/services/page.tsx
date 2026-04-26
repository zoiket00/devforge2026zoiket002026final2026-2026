// app/services/page.tsx

import { Services, Pricing, CTA } from "@/components/sections";

const allServices = [
  {
    id: "web-app",
    icon: "💻",
    title: "Aplicaciones Web",
    description: "SaaS, dashboards, plataformas",
    price: "$2,500",
    timeline: "3-6 semanas",
    features: ["React/Next.js", "Backend API", "Base de datos"],
    technologies: ["Next.js", "TypeScript", "PostgreSQL"],
  },
  {
    id: "mobile",
    icon: "📱",
    title: "Apps Móviles",
    description: "iOS y Android",
    price: "$3,500",
    timeline: "6-10 semanas",
    features: ["React Native", "App Store", "Push notifications"],
    technologies: ["React Native", "Expo", "Firebase"],
  },
  {
    id: "api",
    icon: "⚙️",
    title: "APIs & Backend",
    description: "REST, GraphQL, microservicios",
    price: "$1,800",
    timeline: "2-4 semanas",
    features: ["Escalable", "Segura", "Documentada"],
    technologies: ["Node.js", "PostgreSQL", "Docker"],
  },
];

const pricingTiers = [
  {
    id: "starter",
    name: "Starter",
    description: "Para MVPs",
    price: 1500,
    period: "USD",
    features: ["App simple", "5 vistas", "Responsive", "15 días soporte"],
    cta: { text: "Contactar", href: "/contact" },
  },
  {
    id: "pro",
    name: "Professional",
    description: "Para aplicaciones serias",
    price: 5500,
    period: "USD",
    featured: true,
    features: ["Web app completa", "Backend + API", "Admin panel", "30 días soporte"],
    cta: { text: "Contactar", href: "/contact" },
  },
];

export default function ServicesPage() {
  return (
    <>
      <Services title="Servicios" services={allServices} columns={3} />
      <Pricing title="Precios" tiers={pricingTiers} />
      <CTA title="¿Listo?" primaryCta={{ text: "Contactar", href: "/contact" }} />
    </>
  );
}
