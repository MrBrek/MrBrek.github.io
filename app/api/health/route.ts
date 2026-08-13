import { NextResponse } from "next/server";
import { checkAIHealth } from "@/lib/ai";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const health = await checkAIHealth();
    return NextResponse.json(health, { status: health.connected ? 200 : 503 });
  } catch {
    return NextResponse.json({ connected: false, message: "AI service is not configured" }, { status: 503 });
  }
}
