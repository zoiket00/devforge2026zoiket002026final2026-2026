// config/site.ts

export const siteConfig = {
  name: "SpaceSoft Labs",
  description: "Micro-estudio de desarrollo full-stack profesional",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: `${process.env.NEXT_PUBLIC_SITE_URL}/og.png`,
  mainNav: [
    {
      title: "Inicio",
      href: "/",
    },
    {
      title: "Servicios",
      href: "/services",
    },
    {
      title: "Portafolio",
      href: "/work",
    },
    {
      title: "Tecnologías",
      href: "/stack",
    },
    {
      title: "Equipo",
      href: "/team",
    },
    {
      title: "Blog",
      href: "/blog",
    },
    {
      title: "Contacto",
      href: "/contact",
    },
  ],
  links: {
    twitter: "https://twitter.com/devforge",
    github: "https://github.com/devforge",
    linkedin: "https://linkedin.com/company/devforge",
    whatsapp: "https://wa.me/573001234567",
    email: "hola@devforge.dev",
  },
};

export const metadata = {
  title: {
    template: "%s | DevForge",
    default: "DevForge - Full-Stack Development Studio",
  },
  description: siteConfig.description,
  keywords: [
    "Full-stack development",
    "Web development",
    "API development",
    "Mobile apps",
    "AI integration",
    "DevOps",
    "Cloud solutions",
  ],
  authors: [
    {
      name: "DevForge Studio",
      url: siteConfig.url,
    },
  ],
  creator: "DevForge",
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: "DevForge - Full-Stack Development",
    description: siteConfig.description,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DevForge",
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@devforge",
  },
};

// config/routes.ts
export const routes = {
  public: ["/", "/services", "/work", "/stack", "/team", "/blog", "/contact"],
  protected: ["/admin", "/dashboard"],
  auth: ["/login", "/signup"],
} as const;

// config/features.ts
export const features = [
  {
    title: "Full-Stack Development",
    description: "Web apps, APIs, databases completas",
  },
  {
    title: "Mobile Apps",
    description: "iOS y Android con React Native",
  },
  {
    title: "AI & Automation",
    description: "Agentes inteligentes y workflows automáticos",
  },
  {
    title: "Cloud & DevOps",
    description: "Infraestructura escalable y segura",
  },
  {
    title: "Performance First",
    description: "Core Web Vitals optimizados",
  },
  {
    title: "Modern Stack",
    description: "Tecnologías 2026 probadas en producción",
  },
];

// config/pricing.ts
export const pricingTiers = [
  {
    name: "Starter",
    price: 1500,
    description: "Para MVPs y validación de ideas",
    features: [
      "Landing o app simple",
      "Hasta 5 páginas/vistas",
      "Diseño responsive",
      "Despliegue",
      "15 días soporte",
    ],
  },
  {
    name: "Professional",
    price: 5500,
    description: "Para aplicaciones serias",
    recommended: true,
    features: [
      "Web app completa",
      "Backend + API + DB",
      "Autenticación",
      "Panel admin",
      "Integraciones",
      "30 días soporte",
      "Revisiones ilimitadas",
    ],
  },
  {
    name: "Enterprise",
    price: null,
    description: "Para proyectos complejos",
    features: [
      "Arquitectura dedicada",
      "Equipo full-time",
      "SLA garantizado",
      "Seguridad avanzada",
      "Integraciones custom",
      "Soporte 24/7",
      "Contrato personalizado",
    ],
  },
];
