// lib/security/sanitizer.ts
// ┌─────────────────────────────────────────────────────────────┐
// │  INPUT SANITIZER - Capa de defensa contra XSS, SQLi         │
// │  Sanitiza todos los inputs antes de procesarlos             │
// └─────────────────────────────────────────────────────────────┘

/**
 * Entidades HTML para escapar
 */
const HTML_ENTITIES: Record<string, string> = {
  "&":  "&amp;",
  "<":  "&lt;",
  ">":  "&gt;",
  '"':  "&quot;",
  "'":  "&#x27;",
  "/":  "&#x2F;",
  "`":  "&#x60;",
  "=":  "&#x3D;",
};

/**
 * Escapa caracteres HTML peligrosos (previene XSS)
 */
export function escapeHtml(input: string): string {
  return String(input).replace(/[&<>"'`=/]/g, (char) => HTML_ENTITIES[char] || char);
}

/**
 * Elimina etiquetas HTML
 */
export function stripHtml(input: string): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

/**
 * Sanitiza texto general (nombres, mensajes, etc.)
 */
export function sanitizeText(
  input: unknown,
  options: {
    maxLength?: number;
    allowedChars?: RegExp;
    trim?: boolean;
  } = {}
): string {
  if (typeof input !== "string") return "";

  const { maxLength = 5000, trim = true } = options;

  let sanitized = input;

  // Trim
  if (trim) sanitized = sanitized.trim();

  // Limitar longitud
  if (sanitized.length > maxLength) {
    sanitized = sanitized.slice(0, maxLength);
  }

  // Eliminar caracteres de control
  sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Normalizar espacios
  sanitized = sanitized.replace(/\s+/g, " ");

  // Escapar HTML
  sanitized = escapeHtml(sanitized);

  return sanitized;
}

/**
 * Sanitiza email
 */
export function sanitizeEmail(input: unknown): string {
  if (typeof input !== "string") return "";

  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9@._+-]/g, "")
    .slice(0, 320); // Max RFC 5321
}

/**
 * Sanitiza URL
 */
export function sanitizeUrl(input: unknown): string {
  if (typeof input !== "string") return "";

  try {
    const url = new URL(input);
    // Solo permitir http y https
    if (!["http:", "https:"].includes(url.protocol)) {
      return "";
    }
    return url.toString();
  } catch {
    return "";
  }
}

/**
 * Sanitiza número
 */
export function sanitizeNumber(
  input: unknown,
  options: { min?: number; max?: number; integer?: boolean } = {}
): number | null {
  const num = Number(input);

  if (isNaN(num)) return null;
  if (options.integer && !Number.isInteger(num)) return null;
  if (options.min !== undefined && num < options.min) return null;
  if (options.max !== undefined && num > options.max) return null;

  return num;
}

/**
 * Sanitiza objeto completo (recursivo)
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  schema: Partial<Record<keyof T, (value: unknown) => unknown>>
): Partial<T> {
  const result: Partial<T> = {};

  for (const [key, sanitizer] of Object.entries(schema)) {
    if (key in obj && typeof sanitizer === "function") {
      result[key as keyof T] = sanitizer(obj[key]) as T[keyof T];
    }
  }

  return result;
}

/**
 * Detecta patrones de SQL injection
 */
export function detectSQLInjection(input: string): boolean {
  const patterns = [
    /(\bOR\b|\bAND\b)\s+\d+=\d+/i,
    /'\s*(OR|AND)\s*'[^']*'\s*=\s*'/i,
    /;\s*(DROP|DELETE|INSERT|UPDATE|TRUNCATE|ALTER)\b/i,
    /UNION\s+(ALL\s+)?SELECT/i,
    /--\s*$/m,
    /\/\*[\s\S]*?\*\//,
    /EXEC\s*\(/i,
    /xp_\w+/i,
    /CAST\s*\(/i,
    /CONVERT\s*\(/i,
    /CHAR\s*\(\d+\)/i,
    /0x[0-9a-f]+/i,
  ];

  return patterns.some((pattern) => pattern.test(input));
}

/**
 * Detecta patrones de XSS
 */
export function detectXSS(input: string): boolean {
  const patterns = [
    /<script[^>]*>/i,
    /javascript:/i,
    /on\w+\s*=/i,                  // onclick=, onload=, etc.
    /<iframe[^>]*>/i,
    /<object[^>]*>/i,
    /<embed[^>]*>/i,
    /eval\s*\(/i,
    /expression\s*\(/i,
    /vbscript:/i,
    /data:text\/html/i,
    /&#x?[0-9a-f]+;/i,            // HTML entities encoding
    /%3Cscript/i,                  // URL encoded <script>
    /\u0000/,                      // Null byte
    /document\.cookie/i,
    /document\.location/i,
    /window\.location/i,
    /alert\s*\(/i,
    /confirm\s*\(/i,
    /prompt\s*\(/i,
  ];

  return patterns.some((pattern) => pattern.test(input));
}

/**
 * Sanitiza el body de un request de contacto
 */
export function sanitizeContactForm(body: unknown): {
  name: string;
  email: string;
  company: string;
  service: string;
  budget: string;
  message: string;
} {
  if (typeof body !== "object" || body === null) {
    throw new Error("Invalid request body");
  }

  const raw = body as Record<string, unknown>;

  // Detectar ataques en todos los campos
  const allFields = Object.values(raw).join(" ");
  if (detectXSS(allFields) || detectSQLInjection(allFields)) {
    throw new Error("Invalid characters detected");
  }

  return {
    name:    sanitizeText(raw.name, { maxLength: 100 }),
    email:   sanitizeEmail(raw.email),
    company: sanitizeText(raw.company, { maxLength: 200 }),
    service: sanitizeText(raw.service, { maxLength: 100 }),
    budget:  sanitizeText(raw.budget, { maxLength: 50 }),
    message: sanitizeText(raw.message, { maxLength: 5000 }),
  };
}
