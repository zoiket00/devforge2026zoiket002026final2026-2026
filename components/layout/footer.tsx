// components/layout/footer.tsx

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Github, Linkedin, Twitter, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: "GitHub",
      href: siteConfig.links.github,
      icon: Github,
    },
    {
      name: "LinkedIn",
      href: siteConfig.links.linkedin,
      icon: Linkedin,
    },
    {
      name: "Twitter",
      href: siteConfig.links.twitter,
      icon: Twitter,
    },
    {
      name: "Email",
      href: `mailto:${siteConfig.links.email}`,
      icon: Mail,
    },
  ];

  return (
    <footer className="border-t border-border bg-background">
      {/* CTA Section */}
      <div className="border-b border-border">
        <div className="container-responsive py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h2 className="heading-lg">¿Listo para tu proyecto?</h2>
              <p className="text-muted-foreground">
                Conversemos sobre tus objetivos. Primera consulta gratis.
              </p>
            </div>
            <div className="flex gap-3 md:justify-end">
              <Button asChild variant="primary" size="lg">
                <a href={siteConfig.links.whatsapp} target="_blank" rel="noopener noreferrer">
                  Contactar ahora
                  <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-responsive py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-display text-lg font-bold"
            >
              <span className="h-6 w-6 rounded-md bg-accent flex items-center justify-center text-accent-foreground">
                ■
              </span>
              <span>
                dev<span className="text-accent">forge</span>
              </span>
            </Link>
            <p className="font-mono text-sm text-muted-foreground">
              Micro-estudio de desarrollo full-stack profesional.
            </p>
            <div className="flex gap-3 pt-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-mono text-sm font-bold uppercase tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-2 font-mono text-sm">
              {siteConfig.mainNav.slice(0, 4).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Empresa */}
          <div className="space-y-4">
            <h4 className="font-mono text-sm font-bold uppercase tracking-wider">
              Empresa
            </h4>
            <ul className="space-y-2 font-mono text-sm">
              {siteConfig.mainNav.slice(4).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="space-y-4">
            <h4 className="font-mono text-sm font-bold uppercase tracking-wider">
              Contacto
            </h4>
            <ul className="space-y-2 font-mono text-sm">
              <li>
                <a
                  href={siteConfig.links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.links.email}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  {siteConfig.links.email}
                </a>
              </li>
              <li>
                <a
                  href="https://cal.com/devforge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Agendar llamada
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 font-mono text-xs text-muted-foreground">
          <p>
            © {currentYear} DevForge Studio. Hecho con{" "}
            <span className="text-accent">&lt;/&gt;</span> y mucho café.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="hover:text-foreground transition-colors"
            >
              Política de Privacidad
            </a>
            <a
              href="#"
              className="hover:text-foreground transition-colors"
            >
              Términos de Servicio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
