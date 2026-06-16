import {
  decryptRootHash,
  detectImageMimeType,
  isAuthorizedImageRoot,
} from "@/lib/storage";
import { NextResponse } from "next/server";

export const maxDuration = 60;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ rootHash: string }> },
) {
  try {
    const { rootHash } = await params;

    if (!rootHash) {
      return NextResponse.json({ error: "rootHash is required" }, { status: 400 });
    }

    const authorized = await isAuthorizedImageRoot(rootHash);
    if (!authorized) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const bytes = await decryptRootHash(rootHash);
    const mimeType = detectImageMimeType(bytes);

    if (!mimeType.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid image" }, { status: 500 });
    }

    return new NextResponse(Buffer.from(bytes), {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
