"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/components/ui/button";
import { useScroll, useNavMenu } from "@/hooks";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const isScrolled = useScroll(50);
  const [mobileOpen, setMobileOpen] = useNavMenu();

  const isActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    return pathname.startsWith(href) && href !== "/";
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-40 transition-all duration-200",
          isScrolled
            ? "border-b border-border bg-background/95 backdrop-blur-sm shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="container-responsive flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="SpaceSoft"
              width={32}
              height={32}
              className="object-contain"
            />
            <span className="font-display text-xl font-bold tracking-tight">
              Space<span className="text-accent">Soft</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-3 py-2 rounded-md font-mono text-sm font-semibold transition-colors",
                  isActive(item.href)
                    ? "text-accent bg-accent/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button asChild className="hidden sm:inline-flex">
              <a href={siteConfig.links.whatsapp} target="_blank" rel="noopener noreferrer">
                Contactar
              </a>
            </Button>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 hover:bg-accent/10 rounded-md transition-colors"
              aria-label="Toggle mobile menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-30 md:hidden bg-background border-b border-border">
          <nav className="container-responsive py-6 space-y-2">
            {siteConfig.mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-4 py-2 rounded-md font-mono text-sm font-semibold transition-colors",
                  isActive(item.href)
                    ? "text-accent bg-accent/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/5"
                )}
              >
                {item.title}
              </Link>
            ))}
            <div className="pt-4 border-t border-border">
              <Button asChild fullWidth>
                <a href={siteConfig.links.whatsapp} target="_blank" rel="noopener noreferrer">
                  Contactar
                </a>
              </Button>
            </div>
          </nav>
        </div>
      )}

      <div className="h-16" />
    </>
  );
}