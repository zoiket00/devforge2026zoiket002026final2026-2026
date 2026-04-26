// lib/security/crypto.ts
// ┌─────────────────────────────────────────────────────────────┐
// │  CRYPTOGRAPHY - AES-256-GCM + bcrypt + HMAC                 │
// │  Encripta datos sensibles, hashea passwords                 │
// └─────────────────────────────────────────────────────────────┘

import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 16;
const TAG_LENGTH = 16;
const SALT_LENGTH = 32;

// Derivar clave desde variable de entorno
function getEncryptionKey(): Buffer {
  const keyHex = process.env.ENCRYPTION_KEY;
  if (!keyHex || keyHex.length < 32) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ENCRYPTION_KEY no está configurada en producción");
    }
    // Clave de desarrollo (NUNCA usar en producción)
    return Buffer.from("dev-key-00000000000000000000000000", "utf-8").slice(0, 32);
  }
  return Buffer.from(keyHex, "hex").slice(0, 32);
}

/**
 * Encripta un string con AES-256-GCM
 * Retorna: iv:tag:encrypted (todo en base64)
 */
export function encrypt(plaintext: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);

  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf-8"),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    tag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

/**
 * Desencripta un string encriptado con AES-256-GCM
 */
export function decrypt(ciphertext: string): string {
  const key = getEncryptionKey();
  const [ivB64, tagB64, encryptedB64] = ciphertext.split(":");

  if (!ivB64 || !tagB64 || !encryptedB64) {
    throw new Error("Formato de ciphertext inválido");
  }

  const iv        = Buffer.from(ivB64, "base64");
  const tag       = Buffer.from(tagB64, "base64");
  const encrypted = Buffer.from(encryptedB64, "base64");

  const decipher = createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(tag);

  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString("utf-8");
}

/**
 * Hashea un password con scrypt (alternativa a bcrypt, nativa en Node)
 */
export function hashPassword(password: string): string {
  const salt = randomBytes(SALT_LENGTH);
  const hash = scryptSync(password, salt, 64) as Buffer;
  return `${salt.toString("hex")}:${hash.toString("hex")}`;
}

/**
 * Verifica un password contra su hash (timing-safe)
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [saltHex, hashHex] = storedHash.split(":");
    if (!saltHex || !hashHex) return false;

    const salt         = Buffer.from(saltHex, "hex");
    const storedBuffer = Buffer.from(hashHex, "hex");
    const derivedHash  = scryptSync(password, salt, 64) as Buffer;

    // Comparación en tiempo constante (previene timing attacks)
    return timingSafeEqual(storedBuffer, derivedHash);
  } catch {
    return false;
  }
}

/**
 * Genera HMAC-SHA256 para verificar integridad
 */
export function generateHmac(data: string, secret?: string): string {
  const key = secret || process.env.CSRF_SECRET || "dev-hmac-secret";
  return createHmac("sha256", key).update(data).digest("hex");
}

/**
 * Verifica HMAC en tiempo constante
 */
export function verifyHmac(data: string, signature: string, secret?: string): boolean {
  const expected = generateHmac(data, secret);
  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(signature, "hex");
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/**
 * Genera un token seguro aleatorio
 */
export function generateSecureToken(bytes: number = 32): string {
  return randomBytes(bytes).toString("hex");
}

/**
 * Genera un código numérico OTP de N dígitos
 */
export function generateOTP(digits: number = 6): string {
  const max = Math.pow(10, digits);
  const randomNum = Number(randomBytes(4).readUInt32BE(0)) % max;
  return String(randomNum).padStart(digits, "0");
}

/**
 * Genera un UUID v4 seguro
 */
export function generateUUID(): string {
  const bytes = randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join("-");
}

/**
 * Ofusca email para mostrar (ej: j***@g***.com)
 */
export function obfuscateEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!user || !domain) return "***";
  const [domainName, ...tld] = domain.split(".");
  return `${user[0]}***@${domainName[0]}***.${tld.join(".")}`;
}

/**
 * Ofusca número de teléfono
 */
export function obfuscatePhone(phone: string): string {
  return phone.slice(0, 3) + "****" + phone.slice(-2);
}
