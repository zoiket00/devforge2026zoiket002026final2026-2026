// app/api/chat/route.ts
// ┌─────────────────────────────────────────────────────────────┐
// │  CHAT API - Claude AI con streaming en tiempo real          │
// │  Rate limit · Sanitización · Streaming · Lead capture      │
// └─────────────────────────────────────────────────────────────┘

import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit } from "@/lib/security/rate-limit";
import { sanitizeText, detectXSS } from "@/lib/security/sanitizer";
import { logSecurityEvent } from "@/lib/security/audit";
import { SYSTEM_PROMPT, detectContext } from "@/lib/chat/knowledge-base";
import { apiSecurityHeaders } from "@/lib/security/headers";

export const runtime = "edge";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 1000;

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown";

  // ── 1. Rate limit: 30 mensajes por minuto por IP ───────────
  const rl = await rateLimit(ip, "/api/chat", { requests: 30, window: 60 });
  if (rl.exceeded) {
    logSecurityEvent("RATE_LIMIT_EXCEEDED", { ip, path: "/api/chat" });
    return new Response(
      JSON.stringify({ error: "Demasiados mensajes. Espera un momento." }),
      { status: 429, headers: apiSecurityHeaders() }
    );
  }

  // ── 2. Parsear body ───────────────────────────────────────
  let body: { messages?: unknown[]; sessionId?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Request inválido" }),
      { status: 400, headers: apiSecurityHeaders() }
    );
  }

  // ── 3. Validar mensajes ───────────────────────────────────
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "Mensajes requeridos" }),
      { status: 400, headers: apiSecurityHeaders() }
    );
  }

  // ── 4. Sanitizar y validar cada mensaje ───────────────────
  type RawMsg = { role: unknown; content: unknown };
  const rawMessages = (body.messages as RawMsg[]).slice(-MAX_MESSAGES);
  
  const messages: Anthropic.MessageParam[] = [];

  for (const msg of rawMessages) {
    if (
      typeof msg !== "object" ||
      (msg.role !== "user" && msg.role !== "assistant") ||
      typeof msg.content !== "string"
    ) {
      continue;
    }

    // Detectar y bloquear ataques
    if (detectXSS(msg.content as string)) {
      logSecurityEvent("XSS_ATTEMPT", { ip, path: "/api/chat" });
      return new Response(
        JSON.stringify({ error: "Contenido no permitido" }),
        { status: 400, headers: apiSecurityHeaders() }
      );
    }

    // Sanitizar
    const sanitized = sanitizeText(msg.content as string, {
      maxLength: MAX_MESSAGE_LENGTH,
    });

    if (sanitized.length > 0) {
      messages.push({
        role: msg.role as "user" | "assistant",
        content: sanitized,
      });
    }
  }

  if (messages.length === 0) {
    return new Response(
      JSON.stringify({ error: "Sin mensajes válidos" }),
      { status: 400, headers: apiSecurityHeaders() }
    );
  }

  // Verificar que el último mensaje sea del usuario
  if (messages[messages.length - 1].role !== "user") {
    return new Response(
      JSON.stringify({ error: "El último mensaje debe ser del usuario" }),
      { status: 400, headers: apiSecurityHeaders() }
    );
  }

  // ── 5. Detectar intención de lead ─────────────────────────
  const context = detectContext(
    messages.map((m) => ({ role: m.role, content: m.content as string }))
  );

  // ── 6. Crear stream con Claude ────────────────────────────
  try {
    const stream = client.messages.stream({
      model: "claude-sonnet-4-5",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages,
    });

    // ── 7. Retornar stream SSE ────────────────────────────
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === "content_block_delta" &&
              event.delta.type === "text_delta"
            ) {
              const chunk = `data: ${JSON.stringify({
                type: "delta",
                text: event.delta.text,
                context,
              })}\n\n`;
              controller.enqueue(encoder.encode(chunk));
            }

            if (event.type === "message_stop") {
              const done = `data: ${JSON.stringify({
                type: "done",
                context,
              })}\n\n`;
              controller.enqueue(encoder.encode(done));
            }
          }
        } catch (err) {
          const errChunk = `data: ${JSON.stringify({
            type: "error",
            error: "Error generando respuesta",
          })}\n\n`;
          controller.enqueue(encoder.encode(errChunk));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-store",
        Connection: "keep-alive",
        "X-Content-Type-Options": "nosniff",
        "Access-Control-Allow-Origin": process.env.NEXT_PUBLIC_SITE_URL || "*",
      },
    });
  } catch (error) {
    console.error("Claude API error:", error);
    return new Response(
      JSON.stringify({
        error: "Error conectando con el asistente. Intenta de nuevo.",
      }),
      { status: 500, headers: apiSecurityHeaders() }
    );
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
