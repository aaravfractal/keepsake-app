import { readMemories } from "@/lib/memories";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const memories = await readMemories();
    return NextResponse.json({ memories });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
