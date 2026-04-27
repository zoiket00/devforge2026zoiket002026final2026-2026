// app/api/chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit } from "@/lib/security/rate-limit";
import { validateCsrf } from "@/lib/security/csrf";
import { logSecurityEvent } from "@/lib/security/audit";
import { SYSTEM_PROMPT, detectContext } from "@/lib/chat/knowledge-base";

export const runtime = "edge";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown";

  // Rate limiting
  const rl = await rateLimit(ip, "/api/chat", { requests: 30, window: 60 });
  if (rl.exceeded) {
    logSecurityEvent("RATE_LIMIT_EXCEEDED", { ip, path: "/api/chat" });
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }

  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const context = detectContext(messages);

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: messages.map((msg: { role: string; content: string }) => ({
        role: msg.role,
        content: msg.content,
      })),
    });

    const textContent = response.content[0];
    if (textContent.type !== "text") {
      throw new Error("Unexpected response type");
    }

    return new NextResponse(
      new ReadableStream({
        start(controller) {
          controller.enqueue(`data: ${JSON.stringify({ text: textContent.text })}\n\n`);
          controller.close();
        },
      }),
      {
        headers: {
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          Connection: "keep-alive",
        },
      }
    );
  } catch (error) {
    console.error("Chat API error:", error);
    logSecurityEvent("CHAT_API_ERROR", { ip, error: String(error) });

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}