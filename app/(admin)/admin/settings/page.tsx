export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground font-mono text-sm mt-1">
          Configuracion del sitio
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-bold mb-4">Informacion General</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block mb-2">Nombre del sitio</label>
                <input type="text" defaultValue="DevForge Studio" className="w-full px-4 py-2 rounded-lg border border-border bg-background font-mono text-sm focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block mb-2">URL del sitio</label>
                <input type="text" defaultValue="https://devforge.dev" className="w-full px-4 py-2 rounded-lg border border-border bg-background font-mono text-sm focus:outline-none focus:border-accent" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block mb-2">Email de contacto</label>
                <input type="email" defaultValue="hola@devforge.dev" className="w-full px-4 py-2 rounded-lg border border-border bg-background font-mono text-sm focus:outline-none focus:border-accent" />
              </div>
              <div>
                <label className="font-mono text-xs text-muted-foreground uppercase tracking-wider block mb-2">WhatsApp</label>
                <input type="text" defaultValue="+57 300 123 4567" className="w-full px-4 py-2 rounded-lg border border-border bg-background font-mono text-sm focus:outline-none focus:border-accent" />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-bold mb-4">Funcionalidades</h3>
          <div className="space-y-3">
            {[
              { label: "Chatbot habilitado", desc: "Mostrar el chatbot en el sitio", enabled: true },
              { label: "Formulario de contacto", desc: "Permitir envio de formularios", enabled: true },
              { label: "Newsletter", desc: "Permitir suscripciones al newsletter", enabled: true },
              { label: "Modo mantenimiento", desc: "Mostrar pagina de mantenimiento", enabled: false },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-accent/5 transition-colors">
                <div>
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="font-mono text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                </div>
                <div className={`w-10 h-6 rounded-full border transition-colors ${item.enabled ? "bg-accent/20 border-accent/30" : "bg-muted border-border"}`}>
                  <div className={`w-4 h-4 rounded-full mt-1 transition-all ${item.enabled ? "bg-accent ml-5" : "bg-muted-foreground ml-1"}`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-display text-lg font-bold mb-4">Seguridad</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-semibold text-sm">Version de la app</p>
                <p className="font-mono text-xs text-muted-foreground mt-0.5">devforge-studio v2.0.0</p>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-[#00D68F15] text-[#00D68F] border border-[#00D68F30]">PRODUCCION</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-semibold text-sm">Base de datos</p>
                <p className="font-mono text-xs text-muted-foreground mt-0.5">Neon PostgreSQL · ep-broad-smoke</p>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">CONECTADO</span>
            </div>
            <div className="flex items-center justify-between p-4 rounded-lg border border-border">
              <div>
                <p className="font-semibold text-sm">Autenticacion</p>
                <p className="font-mono text-xs text-muted-foreground mt-0.5">NextAuth.js · JWT Sessions</p>
              </div>
              <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">ACTIVO</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}