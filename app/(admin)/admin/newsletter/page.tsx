import { prisma } from "@/lib/database/prisma";

async function getSubscribers() {
  try {
    return await prisma.newsletterSubscription.findMany({
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

export default async function NewsletterPage() {
  const subscribers = await getSubscribers();

  const total = subscribers.length;
  const active = subscribers.filter((s) => s.status === "ACTIVE").length;
  const pending = subscribers.filter((s) => s.status === "PENDING").length;
  const unsubscribed = subscribers.filter((s) => s.status === "UNSUBSCRIBED").length;

  const statusStyles: Record<string, string> = {
    ACTIVE: "bg-green-500/10 text-green-400 border border-green-500/20",
    PENDING: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
    UNSUBSCRIBED: "bg-muted text-muted-foreground border border-border",
    BOUNCED: "bg-red-500/10 text-red-400 border border-red-500/20",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Newsletter</h2>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          {total} suscriptores totales
        </p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total", value: total },
          { label: "Activos", value: active },
          { label: "Pendientes", value: pending },
          { label: "Bajas", value: unsubscribed },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className="font-display text-3xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        {subscribers.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-display text-lg text-muted-foreground">No hay suscriptores aun</p>
            <p className="font-mono text-sm text-muted-foreground mt-2">Los suscriptores apareceran aqui</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-background/50">
                <th className="text-left p-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="text-left p-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Nombre</th>
                <th className="text-left p-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Estado</th>
                <th className="text-left p-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Frecuencia</th>
                <th className="text-left p-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Suscrito</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-border hover:bg-accent/5 transition-colors last:border-0">
                  <td className="p-4 font-mono text-sm text-accent">{sub.email}</td>
                  <td className="p-4 text-sm">{sub.name || "—"}</td>
                  <td className="p-4">
                    <span className={`font-mono text-xs px-2.5 py-1 rounded-full ${statusStyles[sub.status] || ""}`}>
                      {sub.status}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-muted-foreground">{sub.frequency}</td>
                  <td className="p-4 font-mono text-xs text-muted-foreground">
                    {new Date(sub.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}