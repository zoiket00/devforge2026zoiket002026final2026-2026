// proxy.ts
import { NextRequest, NextResponse } from "next/server";
import { securityHeaders } from "@/lib/security/headers";
import { rateLimit } from "@/lib/security/rate-limit";
import { detectBot } from "@/lib/security/bot-detection";
import { validateCsrf } from "@/lib/security/csrf";
import { geoBlock } from "@/lib/security/geo-block";

const CSRF_ROUTES: string[] = [];

const RATE_LIMITS: Record<string, { requests: number; window: number }> = {
  "/api/contact":    { requests: 5,   window: 60 },
  "/api/newsletter": { requests: 3,   window: 60 },
  "/api/auth":       { requests: 10,  window: 60 },
  "/api/":           { requests: 100, window: 60 },
  "default":         { requests: 300, window: 60 },
};

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = getClientIP(req);
  const userAgent = req.headers.get("user-agent") || "";
  const response = NextResponse.next();

  const blacklistCheck = await checkIPBlacklist(ip);
  if (blacklistCheck.blocked) {
    return new NextResponse(
      JSON.stringify({ error: "Access denied", code: "IP_BLOCKED" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

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

    response.headers.set("X-RateLimit-Limit", String(limitConfig.requests));
    response.headers.set("X-RateLimit-Remaining", String(rateLimitResult.remaining));
    response.headers.set("X-RateLimit-Reset", String(rateLimitResult.resetAt));
  }

  const isCsrfRoute = CSRF_ROUTES.some((r) => pathname.startsWith(r));
  if (isCsrfRoute && req.method === "POST") {
    const csrfResult = await validateCsrf(req);
    if (!csrfResult.valid) {
      logSecurityEvent("CSRF_FAILED", { ip, pathname, reason: csrfResult.reason });
      return new NextResponse(
        JSON.stringify({ error: "CSRF validation failed", code: "CSRF_INVALID" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }
  }

  const country = req.headers.get("cf-ipcountry") || "";
  const geoResult = geoBlock(country);
  if (geoResult.blocked) {
    logSecurityEvent("GEO_BLOCKED", { ip, country, pathname });
    return new NextResponse(
      JSON.stringify({ error: "Service unavailable in your region" }),
      { status: 451, headers: { "Content-Type": "application/json" } }
    );
  }

  const allowedMethods = ["GET", "POST", "PUT", "PATCH", "DELETE", "HEAD", "OPTIONS"];
  if (!allowedMethods.includes(req.method)) {
    return new NextResponse(null, { status: 405 });
  }

  if (containsPathTraversal(pathname)) {
    logSecurityEvent("PATH_TRAVERSAL", { ip, pathname });
    return new NextResponse(null, { status: 400 });
  }

  const searchParams = req.nextUrl.searchParams.toString();
  if (containsSQLInjection(searchParams)) {
    logSecurityEvent("SQL_INJECTION_ATTEMPT", { ip, pathname, params: searchParams });
    return new NextResponse(
      JSON.stringify({ error: "Invalid request parameters" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const headers = securityHeaders();
  headers.forEach((header) => {
    response.headers.set(header.key, header.value);
  });

  if (pathname.startsWith("/api/")) {
    response.headers.set("X-Request-ID", generateRequestId());
    response.headers.set("X-Timestamp", new Date().toISOString());
  }

  response.headers.set("x-pathname", pathname);

  return response;
}

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
  const BLACKLISTED_IPS: string[] = [];
  return { blocked: BLACKLISTED_IPS.includes(ip) };
}

function containsPathTraversal(pathname: string): boolean {
  const patterns = [/\.\./, /%2e%2e/i, /\.\.%2f/i, /%2f\.\./i];
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

function logSecurityEvent(event: string, data: Record<string, unknown>): void {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[SECURITY:${event}]`, { timestamp: new Date().toISOString(), ...data });
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|admin|api/auth|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|woff2?)$).*)",
  ],
};