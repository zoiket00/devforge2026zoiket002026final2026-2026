// app/work/page.tsx

import { Projects, CTA } from "@/components/sections";

const projects = [
  {
    id: "1",
    title: "FinTrack",
    description: "SaaS de finanzas personales",
    image: "",
    technologies: ["Next.js", "PostgreSQL", "Stripe"],
    featured: true,
    status: "Live" as const,
    category: "Web" as const,
    link: "https://fintrack.example.com",
  },
  {
    id: "2",
    title: "MediCare",
    description: "App móvil para salud",
    image: "",
    technologies: ["React Native", "Firebase"],
    featured: true,
    status: "Live" as const,
    category: "Mobile" as const,
  },
  {
    id: "3",
    title: "ShopNova",
    description: "E-commerce headless",
    image: "",
    technologies: ["Next.js", "Medusa", "PostgreSQL"],
    featured: true,
    status: "Live" as const,
    category: "Web" as const,
  },
];

export default function WorkPage() {
  return (
    <>
      <Projects title="Nuestro Portafolio" projects={projects} featured={false} />
      <CTA title="Inicia tu proyecto" primaryCta={{ text: "Contactar", href: "/contact" }} />
    </>
  );
}
