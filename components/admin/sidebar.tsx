"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "⊞" },
  { href: "/admin/contacts", label: "Contactos", icon: "✉" },
  { href: "/admin/projects", label: "Proyectos", icon: "◈" },
  { href: "/admin/services", label: "Servicios", icon: "◉" },
  { href: "/admin/newsletter", label: "Newsletter", icon: "◎" },
  { href: "/admin/users", label: "Usuarios", icon: "◯" },
  { href: "/admin/settings", label: "Settings", icon: "⊙" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="px-6 py-5 border-b border-border">
        <Link href="/admin" className="flex items-center gap-2">
          <Image src="/logo.png" alt="SpaceSoft" width={24} height={24} className="object-contain" />
          <h1 className="font-display text-lg font-bold">
            Space<span className="text-accent">Soft</span>
            <span className="text-muted-foreground font-mono text-xs ml-2">admin</span>
          </h1>
        </Link>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm transition-all",
                isActive
                  ? "bg-accent text-accent-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="px-3 py-4 border-t border-border">
        <Link
          href="/api/auth/signout"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-mono text-sm text-destructive hover:bg-destructive/10 transition-all"
        >
          <span>⊗</span>
          Cerrar sesion
        </Link>
      </div>
    </aside>
  );
}