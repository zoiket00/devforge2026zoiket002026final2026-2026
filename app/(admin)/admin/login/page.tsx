"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Credenciales incorrectas");
      setLoading(false);
      return;
    }

    router.push("/admin");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-xl border border-border bg-card">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl font-bold">
            dev<span className="text-accent">forge</span>
          </h1>
          <p className="text-muted-foreground mt-2 font-mono text-sm">
            Panel de administracion
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-mono text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background font-mono text-sm focus:outline-none focus:border-accent"
              placeholder="admin@devforge.dev"
              required
            />
          </div>
          <div>
            <label className="block font-mono text-sm font-semibold mb-2">Contrasena</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-border bg-background font-mono text-sm focus:outline-none focus:border-accent"
              placeholder="••••••••"
              required
            />
          </div>
          {error && <p className="text-red-500 font-mono text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-accent text-accent-foreground rounded-lg font-mono text-sm font-semibold hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Iniciando sesion..." : "Iniciar sesion"}
          </button>
        </form>
      </div>
    </div>
  );
}