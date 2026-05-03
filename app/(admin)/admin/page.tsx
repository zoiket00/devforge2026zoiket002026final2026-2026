import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/auth.config";
import { prisma } from "@/lib/database/prisma";

async function getStats() {
  try {
    const [users, contacts, newsletter, recentContacts, newContacts] = await Promise.all([
      prisma.user.count(),
      prisma.contactForm.count(),
      prisma.newsletterSubscription.count(),
      prisma.contactForm.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.contactForm.count({ where: { status: "NEW" } }),
    ]);
    return { users, contacts, newsletter, recentContacts, newContacts };
  } catch {
    return { users: 0, contacts: 0, newsletter: 0, recentContacts: [], newContacts: 0 };
  }
}

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const { users, contacts, newsletter, recentContacts, newContacts } = await getStats();

  const stats = [
    { label: "Usuarios", value: users, sub: "registrados", accent: false },
    { label: "Contactos", value: contacts, sub: `${newContacts} sin leer`, accent: newContacts > 0 },
    { label: "Newsletter", value: newsletter, sub: "suscriptores", accent: false },
    { label: "Uptime", value: "99.9%", sub: "ultimo mes", accent: true },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold">Dashboard</h2>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          Bienvenido, {session?.user?.name ?? session?.user?.email}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="p-5 rounded-xl border border-border bg-card hover:border-accent/40 transition-colors">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className={`font-display text-4xl font-bold mt-2 ${s.accent ? "text-accent" : ""}`}>{s.value}</p>
            <p className="font-mono text-xs text-muted-foreground mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-bold mb-6">Contactos Recientes</h3>
          {recentContacts.length === 0 ? (
            <p className="text-muted-foreground font-mono text-sm">No hay contactos aun</p>
          ) : (
            <div className="space-y-3">
              {recentContacts.map((contact) => (
                <div key={contact.id} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-xs">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{contact.name}</p>
                      <p className="font-mono text-xs text-muted-foreground">{contact.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {contact.budget && (
                      <span className="font-mono text-xs text-accent">{contact.budget}</span>
                    )}
                    <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${
                      contact.status === "NEW"
                        ? "bg-accent/20 text-accent border border-accent/30"
                        : "bg-muted text-muted-foreground border border-border"
                    }`}>
                      {contact.status}
                    </span>
                    <span className="font-mono text-xs text-muted-foreground">
                      {new Date(contact.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-bold mb-6">Estado del Sistema</h3>
          <div className="space-y-4">
            {[
              { label: "Base de datos", status: "operational" },
              { label: "API", status: "operational" },
              { label: "Autenticacion", status: "operational" },
              { label: "Chatbot IA", status: "operational" },
              { label: "Formularios", status: "operational" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="font-mono text-sm">{item.label}</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#00D68F]"></div>
                  <span className="font-mono text-xs text-[#00D68F]">OK</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-border">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-3">Acciones rapidas</p>
            <div className="space-y-2">
              <a href="/admin/contacts" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/5 transition-colors font-mono text-sm text-foreground">
                ✉ Ver contactos
              </a>
              <a href="/admin/users" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/5 transition-colors font-mono text-sm text-foreground">
                ◯ Gestionar usuarios
              </a>
              <a href="/admin/settings" className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent/5 transition-colors font-mono text-sm text-foreground">
                ⊙ Configuracion
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}