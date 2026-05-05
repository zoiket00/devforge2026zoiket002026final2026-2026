"use client";

import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { Github, Linkedin, Twitter, Mail, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background">
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

      <div className="container-responsive py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src="/logo.png" alt="SpaceSoft" width={28} height={28} className="object-contain" />
              <span className="font-display text-lg font-bold">
                Space<span className="text-accent">Soft</span>
              </span>
            </Link>
            <p className="font-mono text-sm text-muted-foreground">
              Micro-estudio de desarrollo full-stack profesional.
            </p>
            <div className="flex gap-3 pt-4">
              <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent transition-colors" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
              <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href={siteConfig.links.twitter} target="_blank" rel="noopener noreferrer" className="h-10 w-10 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent transition-colors" aria-label="Twitter">
                <Twitter className="h-4 w-4" />
              </a>
              <a href={`mailto:${siteConfig.links.email}`} className="h-10 w-10 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent transition-colors" aria-label="Email">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-mono text-sm font-bold uppercase tracking-wider">Navegación</h4>
            <ul className="space-y-2 font-mono text-sm">
              {siteConfig.mainNav.slice(0, 4).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-mono text-sm font-bold uppercase tracking-wider">Empresa</h4>
            <ul className="space-y-2 font-mono text-sm">
              {siteConfig.mainNav.slice(4).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted-foreground hover:text-foreground transition-colors">
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-mono text-sm font-bold uppercase tracking-wider">Contacto</h4>
            <ul className="space-y-2 font-mono text-sm">
              <li>
                <a href={siteConfig.links.whatsapp} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.links.email}`} className="text-muted-foreground hover:text-foreground transition-colors">
                  {siteConfig.links.email}
                </a>
              </li>
              <li>
                <a href="https://cal.com/spacesoft" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                  Agendar llamada
                </a>
              </li>
            </ul>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 font-mono text-xs text-muted-foreground">
          <p>
            © {currentYear} SpaceSoft. Hecho con <span className="text-accent">&lt;/&gt;</span> y mucho café.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">Política de Privacidad</a>
            <a href="#" className="hover:text-foreground transition-colors">Términos de Servicio</a>
          </div>
        </div>
      </div>
    </footer>
  );
}