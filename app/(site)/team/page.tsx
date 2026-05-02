// app/team/page.tsx
import { Team, CTA } from "@/components/sections";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Equipo | DevForge",
  description: "Conoce al equipo de DevForge Studio",
};

const members = [
  {
    id: "1",
    name: "Carlos Silva",
    role: "Tech Lead & Founder",
    image: "",
    bio: "10+ años construyendo software que escala. Apasionado por la arquitectura limpia y los sistemas resilientes.",
    skills: ["Next.js", "Node.js", "AWS", "PostgreSQL", "System Design"],
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
  },
  {
    id: "2",
    name: "María González",
    role: "Cloud Architect",
    image: "",
    bio: "Especialista en infraestructura cloud y DevOps. Certificada en AWS y GCP con foco en sistemas de alta disponibilidad.",
    skills: ["AWS", "Kubernetes", "Terraform", "Docker", "CI/CD"],
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    },
  },
  {
    id: "3",
    name: "Diego López",
    role: "Mobile & Frontend",
    image: "",
    bio: "Desarrollador mobile con más de 30 apps publicadas. Experto en React Native y rendimiento en dispositivos móviles.",
    skills: ["React Native", "Expo", "React", "TypeScript", "Framer Motion"],
    social: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
    },
  },
];

export default function TeamPage() {
  return (
    <>
      <Team
        title="El Equipo Detrás de DevForge"
        description="Desarrolladores senior con expertise real en producción"
        members={members}
      />
      <CTA
        title="¿Quieres trabajar con nosotros?"
        description="Siempre abiertos a proyectos interesantes y talento excepcional."
        primaryCta={{ text: "Hablar con el equipo", href: "/contact" }}
      />
    </>
  );
}
