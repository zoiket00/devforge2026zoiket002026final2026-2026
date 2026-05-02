export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Proyectos</h2>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          Gestiona tu portafolio
        </p>
      </div>
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-muted-foreground font-mono text-sm">
          No hay proyectos aun
        </p>
      </div>
    </div>
  );
}