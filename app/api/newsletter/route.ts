// app/api/newsletter/route.ts
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rate-limit";
import { sanitizeEmail } from "@/lib/security/sanitizer";
import { apiSecurityHeaders } from "@/lib/security/headers";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const headers = apiSecurityHeaders();

  const rl = await rateLimit(ip, "/api/newsletter", { requests: 3, window: 60 });
  if (rl.exceeded) {
    return NextResponse.json(
      { success: false, error: "Demasiadas solicitudes." },
      { status: 429, headers }
    );
  }

  let body: { email?: unknown };
  try { body = await req.json(); }
  catch { return NextResponse.json({ success: false, error: "JSON inválido" }, { status: 400, headers }); }

  const email = sanitizeEmail(body.email);
  if (!email || !email.includes("@")) {
    return NextResponse.json({ success: false, error: "Email inválido" }, { status: 422, headers });
  }

  // Aquí conectarías con Mailchimp, Resend, ConvertKit, etc.
  console.log("📧 [Newsletter] Nueva suscripción:", email);

  return NextResponse.json(
    { success: true, message: "¡Suscripción exitosa!" },
    { status: 200, headers }
  );
}
