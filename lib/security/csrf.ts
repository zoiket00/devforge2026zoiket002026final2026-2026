// lib/security/csrf.ts
// ┌─────────────────────────────────────────────────────────────┐
// │  CSRF PROTECTION - Double Submit Cookie Pattern             │
// └─────────────────────────────────────────────────────────────┘

import { NextRequest } from "next/server";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const CSRF_SECRET = process.env.CSRF_SECRET || "change-me-in-production-32-chars!!";
const CSRF_HEADER = "x-csrf-token";
const CSRF_COOKIE = "__Host-csrf";

/**
 * Genera un token CSRF
 */
export function generateCsrfToken(): { token: string; hash: string } {
  const token = randomBytes(32).toString("hex");
  const hash = createHmac("sha256", CSRF_SECRET).update(token).digest("hex");
  return { token, hash };
}

/**
 * Valida el token CSRF
 */
export function validateCsrf(req: NextRequest): { valid: boolean; reason?: string } {
  // Verificar origen
  const origin = req.headers.get("origin") || req.headers.get("referer");
  const host = req.headers.get("host");

  if (!origin) {
    return { valid: false, reason: "Missing origin header" };
  }

  try {
    const originUrl = new URL(origin);
    if (originUrl.host !== host) {
      return { valid: false, reason: "Origin mismatch" };
    }
  } catch {
    return { valid: false, reason: "Invalid origin URL" };
  }

  // Verificar token CSRF
  const headerToken = req.headers.get(CSRF_HEADER);
  const cookieToken = req.cookies.get(CSRF_COOKIE)?.value;

  if (!headerToken || !cookieToken) {
    return { valid: false, reason: "Missing CSRF token" };
  }

  const expectedHash = createHmac("sha256", CSRF_SECRET)
    .update(headerToken)
    .digest("hex");

  const cookieBuffer = Buffer.from(cookieToken, "hex");
  const expectedBuffer = Buffer.from(expectedHash, "hex");

  if (cookieBuffer.length !== expectedBuffer.length) {
    return { valid: false, reason: "CSRF token length mismatch" };
  }

  // Comparación en tiempo constante para prevenir timing attacks
  const valid = timingSafeEqual(cookieBuffer, expectedBuffer);

  return valid ? { valid: true } : { valid: false, reason: "CSRF token invalid" };
}
