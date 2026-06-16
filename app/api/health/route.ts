import { compute, OG_COMPUTE_MODEL, signer } from "@/lib/og";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const address = await signer.getAddress();

    const completion = await compute.chat.completions.create({
      model: OG_COMPUTE_MODEL,
      messages: [{ role: "user", content: "Reply with exactly: ok" }],
      max_tokens: 16,
    });

    const response = completion.choices[0]?.message?.content ?? null;

    return NextResponse.json({
      ok: true,
      signer: { address },
      compute: {
        model: OG_COMPUTE_MODEL,
        response,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
