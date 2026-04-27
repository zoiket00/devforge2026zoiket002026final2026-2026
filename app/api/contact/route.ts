// app/api/contact/route.ts

import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-real-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown";

  try {
    const rl = await rateLimit(ip, "/api/contact", { requests: 5, window: 60 });
    if (rl.exceeded) {
      return NextResponse.json(
        { error: "Too many requests" },
        { status: 429 }
      );
    }

    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Email placeholder - funcionalidad básica
    console.log("Contact form submitted:", { name, email, message });

    return NextResponse.json(
      { success: true, message: "Mensaje recibido. Te contactaremos pronto." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}