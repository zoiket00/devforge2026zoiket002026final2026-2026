async function getUsers() {
  try {
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    await prisma.$disconnect();
    return users;
  } catch {
    return [];
  }
}

export default async function UsersPage() {
  const users = await getUsers();

  const total = users.length;
  const admins = users.filter((u) => u.role === "ADMIN").length;
  const active = users.filter((u) => u.status === "ACTIVE").length;

  const roleStyles: Record<string, string> = {
    ADMIN: "bg-[#00D68F15] text-[#00D68F] border border-[#00D68F30]",
    MODERATOR: "bg-blue-500/10 text-blue-400 border border-blue-500/20",
    USER: "bg-muted text-muted-foreground border border-border",
    GUEST: "bg-muted text-muted-foreground border border-border",
  };

  const statusStyles: Record<string, string> = {
    ACTIVE: "bg-green-500/10 text-green-400 border border-green-500/20",
    INACTIVE: "bg-muted text-muted-foreground border border-border",
    SUSPENDED: "bg-red-500/10 text-red-400 border border-red-500/20",
    DELETED: "bg-red-500/10 text-red-400 border border-red-500/20",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Usuarios</h2>
          <p className="text-muted-foreground font-mono text-sm mt-1">
            {total} usuarios registrados
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: total },
          { label: "Admins", value: admins },
          { label: "Activos", value: active },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-wider">{s.label}</p>
            <p className="font-display text-3xl font-bold mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-background/50">
              <th className="text-left p-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Usuario</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Rol</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Estado</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Registro</th>
              <th className="text-left p-4 font-mono text-xs text-muted-foreground uppercase tracking-wider">Último login</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-border hover:bg-accent/5 transition-colors last:border-0">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-bold text-accent text-xs flex-shrink-0">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{user.name || "Sin nombre"}</p>
                      <p className="font-mono text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`font-mono text-xs px-2.5 py-1 rounded-full ${roleStyles[user.role] || roleStyles.USER}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`font-mono text-xs px-2.5 py-1 rounded-full ${statusStyles[user.status] || statusStyles.ACTIVE}`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 font-mono text-xs text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="p-4 font-mono text-xs text-muted-foreground">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString("es-CO", { day: "numeric", month: "short" })
                    : "Nunca"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}