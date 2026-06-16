import {
  decryptMemoryRoot,
  hasPhotoAtRoot,
  parseMemoryContentFromBuffer,
} from "@/lib/storage";
import { NextResponse } from "next/server";

export const maxDuration = 60;

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ rootHash: string }> },
) {
  try {
    const { rootHash } = await params;

    if (!rootHash) {
      return jsonError("rootHash is required", 400);
    }

    const authorized = await hasPhotoAtRoot(rootHash);
    if (!authorized) {
      return jsonError("Not found", 404);
    }

    const bytes = await decryptMemoryRoot(rootHash);
    const parsed = parseMemoryContentFromBuffer(bytes);

    if (!parsed.image?.bytes.length) {
      return jsonError("No photo for this memory", 404);
    }

    return new NextResponse(Buffer.from(parsed.image.bytes), {
      headers: {
        "Content-Type": parsed.image.mime,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return jsonError(message, 500);
  }
}
