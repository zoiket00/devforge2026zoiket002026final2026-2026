// middleware.ts
// ┌─────────────────────────────────────────────────────────────┐
// │  SECURITY MIDDLEWARE - Intercepta 100% de las requests      │
// │  Rate limiting · CSRF · Headers · Bot detection · Geo-block │
// └─────────────────────────────────────────────────────────────┘

import { NextRequest, NextResponse } from "next/server";
import { securityHeaders } from "@/lib/security/headers";
import { rateLimit } from "@/lib/security/rate-limit";
import { detectBot } from "@/lib/security/bot-detection";
import { validateCsrf } from "@/lib/security/csrf";
import { geoBlock } from "@/lib/security/geo-block";

// ── Rutas que requieren verificación CSRF ──────────────────────
const CSRF_ROUTES = ["/api/contact", "/api/newsletter", "/api/subscribe"];

// ── Límites de rate por ruta ───────────────────────────────────
const RATE_LIMITS: Record<string, { requests: number; window: number }> = {
  "/api/contact":    { requests: 5,   window: 60  }, // 5/min
  "/api/newsletter": { requests: 3,   window: 60  }, // 3/min
  "/api/auth":       { requests: 10,  window: 60  }, // 10/min
  "/api/":           { requests: 100, window: 60  }, // 100/min genérico
  "default":         { requests: 300, window: 60  }, // 300/min resto
};

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl;
  const ip = getClientIP(req);
  const userAgent = req.headers.get("user-agent") || "";
  const response = NextResponse.next();

  // ── 1. Bloquear IPs en blacklist ─────────────────────────────
  const blacklistCheck = await checkIPBlacklist(ip);
  if (blacklistCheck.blocked) {
    return new NextResponse(
      JSON.stringify({ error: "Access denied", code: "IP_BLOCKED" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── 2. Detección de bots maliciosos ──────────────────────────
  if (pathname.startsWith("/api/")) {
    const botResult = detectBot(userAgent);
    if (botResult.isMalicious) {
      logSecurityEvent("BOT_BLOCKED", { ip, userAgent, pathname });
      return new NextResponse(
        JSON.stringify({ error: "Forbidden", code: "BOT_DETECTED" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // ── 3. Rate Limiting ─────────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    const limitConfig = getRateLimit(pathname);
    const rateLimitResult = await rateLimit(ip, pathname, limitConfig);

    if (rateLimitResult.exceeded) {
      logSecurityEvent("RATE_LIMIT_EXCEEDED", { ip, pathname, requests: rateLimitResult.count });
      return new NextResponse(
        JSON.stringify({
          error: "Too many requests",
          code: "RATE_LIMIT_EXCEEDED",
          retryAfter: rateLimitResult.resetIn,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(rateLimitResult.resetIn),
            "X-RateLimit-Limit": String(limitConfig.requests),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(rateLimitResult.resetAt),
          },
        }
      );
    }

    // Inyectar headers de rate limit
    response.headers.set("X-RateLimit-Limit", String(limitConfig.requests));
    response.headers.set("X-RateLimit-Remaining", String(rateLimitResult.remaining));
    response.headers.set("X-RateLimit-Reset", String(rateLimitResult.resetAt));
  }

  // ── 4. Validación CSRF para rutas POST ───────────────────────
  const isCsrfRoute = CSRF_ROUTES.some((r) => pathname.startsWith(r));
  if (isCsrfRoute && req.method === "POST") {
    const csrfResult = validateCsrf(req);
    if (!csrfResult.valid) {
      logSecurityEvent("CSRF_FAILED", { ip, pathname, reason: csrfResult.reason });
      return new NextResponse(
        JSON.stringify({ error: "CSRF validation failed", code: "CSRF_INVALID" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  // ── 5. Bloqueo geográfico (opcional) ─────────────────────────
  const country = req.headers.get("cf-ipcountry") || "";
  const geoResult = geoBlock(country);
  if (geoResult.blocked) {
    logSecurityEvent("GEO_BLOCKED", { ip, country, pathname });
    return new NextResponse(
      JSON.stringify({ error: "Service unavailable in your region" }),
      { status: 451, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── 6. Bloquear métodos HTTP no permitidos ───────────────────
  const allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
  if (!allowedMethods.includes(req.method)) {
    return new NextResponse(null, { status: 405 });
  }

  // ── 7. Detectar path traversal ───────────────────────────────
  if (containsPathTraversal(pathname)) {
    logSecurityEvent("PATH_TRAVERSAL", { ip, pathname });
    return new NextResponse(null, { status: 400 });
  }

  // ── 8. Detectar inyección SQL en query params ────────────────
  const searchParams = req.nextUrl.searchParams.toString();
  if (containsSQLInjection(searchParams)) {
    logSecurityEvent("SQL_INJECTION_ATTEMPT", { ip, pathname, params: searchParams });
    return new NextResponse(
      JSON.stringify({ error: "Invalid request parameters" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // ── 9. Inyectar headers de seguridad ─────────────────────────
  const headers = securityHeaders();
  headers.forEach((header) => {
    response.headers.set(header.key, header.value);
  });

  // ── 10. Registrar request para auditoría ─────────────────────
  if (pathname.startsWith("/api/")) {
    response.headers.set("X-Request-ID", generateRequestId());
    response.headers.set("X-Timestamp", new Date().toISOString());
  }

  return response;
}

// ── Helpers ─────────────────────────────────────────────────────

function getClientIP(req: NextRequest): string {
  return (
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown"
  );
}

function getRateLimit(pathname: string) {
  for (const [route, config] of Object.entries(RATE_LIMITS)) {
    if (route !== "default" && pathname.startsWith(route)) {
      return config;
    }
  }
  return RATE_LIMITS["default"];
}

async function checkIPBlacklist(ip: string) {
  // Lista de IPs bloqueadas (en producción: consultar Redis o DB)
  const BLACKLISTED_IPS: string[] = [
    // Agregar IPs maliciosas aquí
  ];
  return { blocked: BLACKLISTED_IPS.includes(ip) };
}

function containsPathTraversal(pathname: string): boolean {
  const patterns = [
    /\.\./,           // ../
    /%2e%2e/i,        // Encoded ../
    /\.\.%2f/i,       // ..%2f
    /%2f\.\./i,       // %2f../
  ];
  return patterns.some((p) => p.test(pathname));
}

function containsSQLInjection(input: string): boolean {
  const patterns = [
    /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|(\-\-)|(\%3B)|(;))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i,
    /exec(\s|\+)+(s|x)p\w+/i,
    /insert\s+into/i,
    /drop\s+table/i,
    /delete\s+from/i,
  ];
  return patterns.some((p) => p.test(decodeURIComponent(input)));
}

function generateRequestId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function logSecurityEvent(
  event: string,
  data: Record<string, unknown>
): void {
  // En producción: Enviar a Sentry, Datadog, o LogRocket
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[SECURITY:${event}]`, { timestamp: new Date().toISOString(), ...data });
  }
}

// ── Configuración de rutas del middleware ────────────────────────
export const config = {
  matcher: [
    /*
     * Aplica a TODAS las rutas excepto:
     * - _next/static (archivos estáticos)
     * - _next/image (optimización de imágenes)
     * - favicon.ico, robots.txt, sitemap.xml
     * - Imágenes públicas
     */
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2?)$).*)",
  ],
};