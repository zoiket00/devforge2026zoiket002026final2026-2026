// lib/security/headers.ts
// ┌─────────────────────────────────────────────────────────────┐
// │  SECURITY HEADERS - Protección a nivel de HTTP              │
// │  CSP · HSTS · X-Frame · XSS · CORP · COOP · COEP          │
// └─────────────────────────────────────────────────────────────┘

export interface SecurityHeader {
  key: string;
  value: string;
}

const isDev = process.env.NODE_ENV === "development";

/**
 * Content Security Policy
 * Controla qué recursos puede cargar el navegador
 * Previene XSS, data injection, clickjacking
 */
function buildCSP(): string {
  const nonce = process.env.NEXT_PUBLIC_CSP_NONCE || "";

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],

    "script-src": [
      "'self'",
      isDev ? "'unsafe-eval'" : "",           // Solo en dev
      isDev ? "'unsafe-inline'" : "",          // Solo en dev
      nonce ? `'nonce-${nonce}'` : "",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://va.vercel-scripts.com",
      "https://cdn.jsdelivr.net",
      "https://cdnjs.cloudflare.com",
    ].filter(Boolean),

    "style-src": [
      "'self'",
      "'unsafe-inline'",                        // Necesario para Tailwind
      "https://fonts.googleapis.com",
      "https://cdnjs.cloudflare.com",
    ],

    "font-src": [
      "'self'",
      "https://fonts.gstatic.com",
      "data:",
    ],

    "img-src": [
      "'self'",
      "data:",
      "blob:",
      "https://www.googletagmanager.com",
      "https://www.google-analytics.com",
      "https://*.sanity.io",
      "https://*.cdn.sanity.io",
      "https://avatars.githubusercontent.com",
      "https://lh3.googleusercontent.com",
    ],

    "connect-src": [
      "'self'",
      "https://www.google-analytics.com",
      "https://analytics.google.com",
      "https://vitals.vercel-insights.com",
      "https://api.anthropic.com",
      "wss://",                                // WebSockets
      isDev ? "ws://localhost:*" : "",
    ].filter(Boolean),

    "frame-src": [
      "'none'",                                // Sin iframes externos
    ],

    "frame-ancestors": [
      "'none'",                                // Previene clickjacking
    ],

    "object-src": ["'none'"],
    "base-uri":   ["'self'"],
    "form-action": ["'self'", "https://wa.me"],
    "manifest-src": ["'self'"],
    "media-src": ["'self'"],
    "worker-src": ["'self'", "blob:"],

    "upgrade-insecure-requests": isDev ? [] : [""],
  };

  return Object.entries(directives)
    .filter(([, values]) => values.length > 0)
    .map(([key, values]) =>
      values[0] === "" ? key : `${key} ${values.join(" ")}`
    )
    .join("; ");
}

/**
 * Headers de seguridad completos
 */
export function securityHeaders(): SecurityHeader[] {
  return [
    // ── Previene ataques MIME-sniffing ────────────────────────
    {
      key: "X-Content-Type-Options",
      value: "nosniff",
    },

    // ── Previene clickjacking ─────────────────────────────────
    {
      key: "X-Frame-Options",
      value: "DENY",
    },

    // ── Previene XSS en navegadores legacy ───────────────────
    {
      key: "X-XSS-Protection",
      value: "1; mode=block",
    },

    // ── Política de referrer ──────────────────────────────────
    {
      key: "Referrer-Policy",
      value: "strict-origin-when-cross-origin",
    },

    // ── Permisos de características del navegador ─────────────
    {
      key: "Permissions-Policy",
      value: [
        "camera=()",
        "microphone=()",
        "geolocation=(self)",
        "interest-cohort=()",      // FLoC opt-out
        "payment=()",
        "usb=()",
        "bluetooth=()",
        "accelerometer=()",
        "gyroscope=()",
        "magnetometer=()",
        "clipboard-read=()",
        "clipboard-write=(self)",
      ].join(", "),
    },

    // ── Content Security Policy ───────────────────────────────
    {
      key: "Content-Security-Policy",
      value: buildCSP(),
    },

    // ── HTTP Strict Transport Security ────────────────────────
    // Fuerza HTTPS por 2 años
    {
      key: "Strict-Transport-Security",
      value: "max-age=63072000; includeSubDomains; preload",
    },

    // ── Cross-Origin Resource Policy ─────────────────────────
    {
      key: "Cross-Origin-Resource-Policy",
      value: "same-site",
    },

    // ── Cross-Origin Opener Policy ────────────────────────────
    {
      key: "Cross-Origin-Opener-Policy",
      value: "same-origin",
    },

    // ── Cross-Origin Embedder Policy ─────────────────────────
    {
      key: "Cross-Origin-Embedder-Policy",
      value: "require-corp",
    },

    // ── Ocultar tecnología del servidor ──────────────────────
    {
      key: "X-Powered-By",
      value: "",                               // Elimina "X-Powered-By: Next.js"
    },

    // ── Server header personalizado ───────────────────────────
    {
      key: "Server",
      value: "devforge",                       // Oculta tecnología real
    },

    // ── Previene información de DNS ───────────────────────────
    {
      key: "X-DNS-Prefetch-Control",
      value: "on",
    },

    // ── Cache control para APIs ───────────────────────────────
    {
      key: "Cache-Control",
      value: "no-store, no-cache, must-revalidate, proxy-revalidate",
    },

    // ── Previene ataques de timing ────────────────────────────
    {
      key: "Timing-Allow-Origin",
      value: process.env.NEXT_PUBLIC_SITE_URL || "https://devforge.dev",
    },
  ].filter((h) => h.value !== "");
}

/**
 * Headers para respuestas API
 */
export function apiSecurityHeaders(): Record<string, string> {
  return {
    "Content-Type": "application/json; charset=utf-8",
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store, no-cache, must-revalidate",
    "Pragma": "no-cache",
    "Expires": "0",
    "X-Robots-Tag": "noindex",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token",
    "Access-Control-Max-Age": "86400",
  };
}

/**
 * Headers CORS para APIs públicas
 */
export function corsHeaders(allowedOrigins: string[] = []): Record<string, string> {
  const origins = [
    process.env.NEXT_PUBLIC_SITE_URL || "",
    ...allowedOrigins,
  ].filter(Boolean);

  return {
    "Access-Control-Allow-Origin": origins.join(", ") || "'none'",
    "Access-Control-Allow-Credentials": "true",
    "Vary": "Origin",
  };
}
