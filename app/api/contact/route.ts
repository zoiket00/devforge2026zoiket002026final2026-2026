// app/api/contact/route.ts
// ┌─────────────────────────────────────────────────────────────┐
// │  API CONTACT - Endpoint con seguridad completa              │
// │  Rate limit · Sanitización · Validación · Audit log        │
// └─────────────────────────────────────────────────────────────┘

import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/validations";
import { sanitizeContactForm, detectXSS, detectSQLInjection } from "@/lib/security/sanitizer";
import { rateLimit } from "@/lib/security/rate-limit";
import { logSecurityEvent } from "@/lib/security/audit";
import { apiSecurityHeaders } from "@/lib/security/headers";

export const runtime = "edge";

const RATE_CONFIG = { requests: 5, window: 60 };

export async function POST(req: NextRequest) {
  const headers = apiSecurityHeaders();
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown";

  // ── 1. Rate limiting ──────────────────────────────────────
  const rl = await rateLimit(ip, "/api/contact", RATE_CONFIG);
  if (rl.exceeded) {
    logSecurityEvent("RATE_LIMIT_EXCEEDED", { ip, path: "/api/contact" });
    return NextResponse.json(
      { success: false, error: "Demasiadas solicitudes. Intenta en unos minutos." },
      { status: 429, headers: { ...headers, "Retry-After": String(rl.resetIn) } }
    );
  }

  // ── 2. Verificar Content-Type ─────────────────────────────
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { success: false, error: "Content-Type inválido" },
      { status: 415, headers }
    );
  }

  // ── 3. Verificar tamaño del body ──────────────────────────
  const contentLength = Number(req.headers.get("content-length") || 0);
  if (contentLength > 10_000) {
    return NextResponse.json(
      { success: false, error: "Payload demasiado grande" },
      { status: 413, headers }
    );
  }

  // ── 4. Parsear body ───────────────────────────────────────
  let rawBody: unknown;
  try {
    rawBody = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, error: "JSON inválido" },
      { status: 400, headers }
    );
  }

  // ── 5. Sanitizar inputs ───────────────────────────────────
  let sanitized: ReturnType<typeof sanitizeContactForm>;
  try {
    sanitized = sanitizeContactForm(rawBody);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Invalid input";
    logSecurityEvent("XSS_ATTEMPT", { ip, path: "/api/contact", data: { error: msg } });
    return NextResponse.json(
      { success: false, error: "Datos inválidos" },
      { status: 400, headers }
    );
  }

  // ── 6. Validación Zod ─────────────────────────────────────
  const parsed = contactSchema.safeParse(sanitized);
  if (!parsed.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Datos inválidos",
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 422, headers }
    );
  }

  const data = parsed.data;

  // ── 7. Honeypot (anti-spam) ───────────────────────────────
  const body = rawBody as Record<string, unknown>;
  if (body._gotcha || body.website || body.url) {
    // Es un bot - devolver 200 falso para no revelar detección
    logSecurityEvent("BOT_BLOCKED", { ip, path: "/api/contact" });
    return NextResponse.json({ success: true }, { status: 200, headers });
  }

  // ── 8. Enviar email ───────────────────────────────────────
  try {
    await sendContactEmail(data);
    logSecurityEvent("CONTACT_FORM_SUBMITTED", {
      ip,
      path: "/api/contact",
      data: { email: data.email.slice(0, 5) + "***" },
    });

    return NextResponse.json(
      { success: true, message: "Mensaje enviado. Te contactamos pronto." },
      { status: 200, headers }
    );
  } catch (error) {
    console.error("Error enviando email:", error);
    return NextResponse.json(
      { success: false, error: "Error interno. Intenta de nuevo." },
      { status: 500, headers }
    );
  }
}

// Bloquear métodos no permitidos
export async function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

// ── Envío de email ─────────────────────────────────────────────
async function sendContactEmail(data: {
  name: string;
  email: string;
  company?: string;
  service: string;
  budget: string;
  message: string;
}): Promise<void> {
  // Opción 1: Resend (recomendado 2026)
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from:    process.env.SMTP_FROM || "noreply@devforge.dev",
      to:      [process.env.CONTACT_EMAIL || "hola@devforge.dev"],
      subject: `[DevForge] Nuevo contacto: ${data.name}`,
      html: `
        <h2>Nuevo mensaje de contacto</h2>
        <p><b>Nombre:</b> ${data.name}</p>
        <p><b>Email:</b> ${data.email}</p>
        <p><b>Empresa:</b> ${data.company || "No especificada"}</p>
        <p><b>Servicio:</b> ${data.service}</p>
        <p><b>Presupuesto:</b> ${data.budget}</p>
        <hr />
        <p><b>Mensaje:</b></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      `,
    });
    return;
  }

  // Opción 2: Nodemailer + SMTP (Deshabilitado - requiere módulos Node.js nativos)
  // if (process.env.SMTP_HOST) {
  //   const nodemailer = await import("nodemailer");
  //   const transporter = nodemailer.default.createTransport({
  //     host:   process.env.SMTP_HOST,
  //     port:   Number(process.env.SMTP_PORT || 587),
  //     secure: process.env.SMTP_PORT === "465",
  //     auth: {
  //       user: process.env.SMTP_USER,
  //       pass: process.env.SMTP_PASS,
  //     },
  //   });
  //
  //   await transporter.sendMail({
  //     from:    process.env.SMTP_FROM || "noreply@devforge.dev",
  //     to:      process.env.CONTACT_EMAIL || "hola@devforge.dev",
  //     subject: `[DevForge] Nuevo contacto: ${data.name}`,
  //     html: `<p>${JSON.stringify(data, null, 2)}</p>`,
  //   });
  //   return;
  // }

  // Fallback: Log en desarrollo
  if (process.env.NODE_ENV === "development") {
    console.log("📧 [DEV] Email de contacto:", data);
    return;
  }

  throw new Error("No hay proveedor de email configurado");
}