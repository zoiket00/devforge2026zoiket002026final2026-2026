// lib/security/env.ts
// ┌─────────────────────────────────────────────────────────────┐
// │  ENVIRONMENT VALIDATION                                     │
// │  Valida que todas las variables estén presentes y seguras   │
// └─────────────────────────────────────────────────────────────┘

import { z } from "zod";

/**
 * Schema de variables de entorno requeridas
 */
const envSchema = z.object({
  // ── App ────────────────────────────────────────────────────
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXT_PUBLIC_SITE_URL: z.string().url(),

  // ── Seguridad ─────────────────────────────────────────────
  CSRF_SECRET: z.string().min(32, "CSRF_SECRET debe tener al menos 32 caracteres"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET debe tener al menos 32 caracteres"),
  ENCRYPTION_KEY: z.string().length(64, "ENCRYPTION_KEY debe tener 64 caracteres (AES-256)"),

  // ── Base de datos ─────────────────────────────────────────
  DATABASE_URL: z.string().startsWith("postgresql://"),

  // ── Email ─────────────────────────────────────────────────
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASS: z.string().optional(),
  SMTP_FROM: z.string().email().optional(),

  // ── WhatsApp ──────────────────────────────────────────────
  WHATSAPP_NUMBER: z.string().optional(),

  // ── Analytics ─────────────────────────────────────────────
  NEXT_PUBLIC_GA_ID: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),

  // ── Monitoring ────────────────────────────────────────────
  SENTRY_DSN: z.string().url().optional(),
  SENTRY_AUTH_TOKEN: z.string().optional(),

  // ── AI APIs ───────────────────────────────────────────────
  ANTHROPIC_API_KEY: z.string().startsWith("sk-").optional(),
  OPENAI_API_KEY: z.string().startsWith("sk-").optional(),

  // ── Cloud ─────────────────────────────────────────────────
  AWS_REGION: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Valida y devuelve variables de entorno tipadas
 */
export function validateEnv(): Env {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors
        .map((e) => `  - ${e.path.join(".")}: ${e.message}`)
        .join("\n");

      throw new Error(
        `❌ Variables de entorno inválidas:\n${missingVars}\n\n` +
        `Copia .env.example a .env.local y completa los valores.`
      );
    }
    throw error;
  }
}

/**
 * Getter seguro de env vars (lanza si falta en producción)
 */
export function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;

  if (!value && process.env.NODE_ENV === "production") {
    throw new Error(`Variable de entorno requerida no encontrada: ${key}`);
  }

  return value || "";
}

/**
 * Verifica que los secrets no sean valores por defecto inseguros
 */
export function validateSecrets(): void {
  const INSECURE_VALUES = [
    "secret",
    "password",
    "12345",
    "change-me",
    "change-me-in-production",
    "your-secret-here",
    "example",
    "test",
    "dev",
  ];

  const secretKeys = ["CSRF_SECRET", "JWT_SECRET", "ENCRYPTION_KEY"];

  for (const key of secretKeys) {
    const value = process.env[key];
    if (value && INSECURE_VALUES.some((insecure) =>
      value.toLowerCase().includes(insecure.toLowerCase())
    )) {
      if (process.env.NODE_ENV === "production") {
        throw new Error(
          `⚠️  SECURITY: La variable ${key} contiene un valor inseguro. ` +
          `Usa un secret aleatorio en producción.`
        );
      }
      console.warn(`⚠️  ${key} tiene un valor inseguro (aceptable en desarrollo)`);
    }
  }
}
