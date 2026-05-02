interface AdminHeaderProps {
  email?: string | null;
  title: string;
}

export function AdminHeader({ email, title }: AdminHeaderProps) {
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
      <h2 className="font-display text-lg font-bold">{title}</h2>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
          <span className="font-mono text-xs text-accent font-bold">
            {email?.charAt(0).toUpperCase()}
          </span>
        </div>
        <span className="font-mono text-sm text-muted-foreground">{email}</span>
      </div>
    </header>
  );
}