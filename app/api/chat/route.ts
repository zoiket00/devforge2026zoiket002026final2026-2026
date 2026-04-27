// app/api/chat/route.ts

import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { rateLimit } from "@/lib/security/rate-limit";

export const runtime = "edge";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown";

  try {
    // Rate limiting
    const rl = await rateLimit(ip, "/api/chat", { requests: 30, window: 60 });
    if (rl.exceeded) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 }
      );
    }

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1024,
      system: "Eres un asistente útil de DevForge Studio. Ayuda a los clientes con preguntas sobre nuestros servicios, proyectos y capacidades.",
      messages: messages as Message[],
    });

    const textContent = response.content[0];
    if (textContent.type !== "text") {
      throw new Error("Unexpected response type");
    }

    return new NextResponse(
      new ReadableStream({
        start(controller) {
          controller.enqueue(
            `data: ${JSON.stringify({ text: textContent.text })}\n\n`
          );
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}