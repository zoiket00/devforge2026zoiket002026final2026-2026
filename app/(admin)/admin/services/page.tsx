export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Servicios</h2>
        <p className="text-muted-foreground font-mono text-sm mt-1">Gestiona tus servicios</p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground font-mono text-sm">No hay servicios aun</p>
      </div>
    </div>
  );
}