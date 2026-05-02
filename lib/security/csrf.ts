// lib/security/csrf.ts
import { NextRequest } from "next/server";

const CSRF_SECRET = process.env.CSRF_SECRET || "change-me-in-production-32-chars!!";
const CSRF_HEADER = "x-csrf-token";
const CSRF_COOKIE = "__Host-csrf";

async function hmac(secret: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateToken(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function generateCsrfToken(): { token: string; hash: string } {
  const token = generateToken();
  return { token, hash: token };
}

export async function validateCsrf(req: NextRequest): Promise<{ valid: boolean; reason?: string }> {
  const origin = req.headers.get("origin") || req.headers.get("referer");
  const host = req.headers.get("host");

  if (!origin) return { valid: false, reason: "Missing origin header" };

  try {
    const originUrl = new URL(origin);
    if (originUrl.host !== host) return { valid: false, reason: "Origin mismatch" };
  } catch {
    return { valid: false, reason: "Invalid origin URL" };
  }

  const headerToken = req.headers.get(CSRF_HEADER);
  const cookieToken = req.cookies.get(CSRF_COOKIE)?.value;

  if (!headerToken || !cookieToken) return { valid: false, reason: "Missing CSRF token" };

  const expectedHash = await hmac(CSRF_SECRET, headerToken);
  return expectedHash === cookieToken
    ? { valid: true }
    : { valid: false, reason: "CSRF token invalid" };
}