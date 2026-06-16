import { appendMemory } from "@/lib/memories";
import { MemoryPayloadV1 } from "@/lib/memory-payload";
import { signer } from "@/lib/og";
import { uploadBundledMemory, uploadTextOnly } from "@/lib/storage";
import { NextResponse } from "next/server";

export const maxDuration = 60;

interface MemoryRequest {
  text?: string;
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unknown error";
}

async function saveProvenance(
  upload: { rootHash: string; txHash: string },
  hasPhoto: boolean,
) {
  const owner = await signer.getAddress();

  await appendMemory({
    rootHash: upload.rootHash,
    txHash: upload.txHash,
    owner,
    createdAt: new Date().toISOString(),
    ...(hasPhoto ? { hasPhoto: true } : {}),
  });
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      const text = String(form.get("text") ?? "").trim();
      const imageField = form.get("image");

      if (!text) {
        return jsonError("text is required", 400);
      }

      const hasImage = imageField instanceof File && imageField.size > 0;
      let upload: { rootHash: string; txHash: string };
      let photoUploaded = false;

      if (hasImage) {
        const imageFieldTyped = imageField as File;
        const buffer = Buffer.from(await imageFieldTyped.arrayBuffer());

        try {
          const payload: MemoryPayloadV1 = {
            v: 1,
            text,
            image: {
              mime: imageFieldTyped.type || "image/jpeg",
              b64: buffer.toString("base64"),
            },
          };

          upload = await uploadBundledMemory(payload);
          photoUploaded = true;
        } catch (photoError) {
          try {
            upload = await uploadTextOnly(text);
          } catch (fallbackError) {
            return jsonError(errorMessage(fallbackError), 500);
          }

          photoUploaded = false;

          await saveProvenance(upload, false);

          return NextResponse.json({
            ok: true,
            rootHash: upload.rootHash,
            txHash: upload.txHash,
            photoUploaded: false,
            warning: "Memory saved — photo couldn't be attached.",
          });
        }
      } else {
        upload = await uploadTextOnly(text);
      }

      await saveProvenance(upload, photoUploaded);

      return NextResponse.json({
        ok: true,
        rootHash: upload.rootHash,
        txHash: upload.txHash,
        photoUploaded,
      });
    }

    let body: MemoryRequest;

    try {
      body = (await request.json()) as MemoryRequest;
    } catch {
      return jsonError("Invalid JSON body", 400);
    }

    const text = body.text?.trim();

    if (!text) {
      return jsonError("text is required", 400);
    }

    const upload = await uploadTextOnly(text);
    await saveProvenance(upload, false);

    return NextResponse.json({
      rootHash: upload.rootHash,
      txHash: upload.txHash,
    });
  } catch (error) {
    return jsonError(errorMessage(error), 500);
  }
}
