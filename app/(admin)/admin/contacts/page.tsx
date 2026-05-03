import { prisma } from "@/lib/database/prisma";

async function getContacts() {
  try {
    return await prisma.contactForm.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function ContactsPage() {
  const contacts = await getContacts();

  const total = contacts.length;
  const unread = contacts.filter((c) => c.status === "NEW").length;
  const replied = contacts.filter((c) => c.status === "REPLIED").length;
  const thisWeek = contacts.filter((c) => {
    const d = new Date(c.createdAt);
    const now = new Date();
    const diff = (now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
    return diff <= 7;
  }).length;

  const statusStyles: Record<string, string> = {
    NEW: "bg-[#00D68F15] text-[#00D68F] border border-[#00D68F30]",
    READ: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    IN_PROGRESS: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    REPLIED: "bg-green-500/10 text-green-400 border border-green-500/20",
    CLOSED: "bg-muted text-muted-foreground border border-border",
  };

  const priorityStyles: Record<string, string> = {
    LOW: "text-muted-foreground",
    NORMAL: "text-muted-foreground",
    HIGH: "text-yellow-400",
    URGENT: "text-red-400",
  };

  const priorityDot: Record<string, string> = {
    LOW: "bg-muted-foreground",
    NORMAL: "bg-muted-foreground",
    HIGH: "bg-yellow-400",
    URGENT: "bg-red-400",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Contactos</h2>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            {total} formularios recibidos · {unread} sin leer
          </p>
        </div>
        <div className="flex gap-2">
          <button className="font-mono text-xs px-3 py-2 rounded-lg border border-border hover:bg-accent/5 transition-colors">
            Exportar CSV
          </button>
          <button className="font-mono text-xs px-3 py-2 rounded-lg bg-[#00D68F10] border border-[#00D68F30] text-[#00D68F] hover:bg-[#00D68F20] transition-colors">
            Marcar todos leídos
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: total, accent: false },
          { label: "Sin leer", value: unread, accent: true },
          { label: "Respondidos", value: replied, accent: false },
          { label: "Esta semana", value: thisWeek, accent: false },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className={`font-display text-3xl font-bold mt-1 ${s.accent ? "text-accent" : ""}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        {contacts.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="font-display text-lg text-muted-foreground">No hay contactos aun</p>
            <p className="font-mono text-sm text-muted-foreground mt-2">Los formularios enviados apareceran aqui</p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="rounded-xl border border-border bg-card overflow-hidden hover:border-accent/40 transition-colors">
              <div className="flex items-start justify-between p-5 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-sm flex-shrink-0">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold">{contact.name}</p>
                    <p className="font-mono text-xs text-accent mt-0.5">{contact.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-xs px-2.5 py-1 rounded-full ${statusStyles[contact.status] || statusStyles.NEW}`}>
                    {contact.status}
                  </span>
                  <span className={`font-mono text-xs flex items-center gap-1 ${priorityStyles[contact.priority] || ""}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${priorityDot[contact.priority] || "bg-muted-foreground"}`}></span>
                    {contact.priority}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {new Date(contact.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>

              {(contact.company || contact.service || contact.budget) && (
                <div className="flex items-center gap-5 px-5 py-2.5 bg-background/50 border-b border-border">
                  {contact.company && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">🏢</span>
                      <span className="font-mono text-xs font-semibold">{contact.company}</span>
                    </div>
                  )}
                  {contact.service && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">⚡</span>
                      <span className="font-mono text-xs font-semibold">{contact.service}</span>
                    </div>
                  )}
                  {contact.budget && (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-muted-foreground">💰</span>
                      <span className="font-mono text-xs font-semibold text-accent">{contact.budget}</span>
                    </div>
                  )}
                </div>
              )}

              <div className="p-5 border-b border-border">
                <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider mb-2">Mensaje</p>
                <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{contact.message}</p>
              </div>

              <div className="flex items-center gap-2 px-5 py-3">
                <button className="font-mono text-xs px-3 py-1.5 rounded-lg border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 transition-colors">
                  Marcar leído
                </button>
                <button className="font-mono text-xs px-3 py-1.5 rounded-lg border border-[#00D68F30] text-[#00D68F] hover:bg-[#00D68F10] transition-colors">
                  Responder
                </button>
                <button className="font-mono text-xs px-3 py-1.5 rounded-lg border border-destructive/20 text-destructive hover:bg-destructive/10 transition-colors ml-auto">
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}