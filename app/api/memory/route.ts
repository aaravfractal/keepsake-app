import { appendMemory } from "@/lib/memories";
import { signer } from "@/lib/og";
import {
  MAX_IMAGE_BYTES,
  uploadEncryptedImage,
  uploadEncryptedText,
  validateImageUpload,
} from "@/lib/storage";
import { NextResponse } from "next/server";

export const maxDuration = 120;

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let text = "";
    let imageFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      const form = await request.formData();
      text = String(form.get("text") ?? "").trim();
      const imageField = form.get("image");

      if (imageField instanceof File && imageField.size > 0) {
        imageFile = imageField;
      }
    } else {
      const body = (await request.json()) as { text?: string };
      text = body.text?.trim() ?? "";
    }

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    if (imageFile) {
      const validationError = validateImageUpload(imageFile);
      if (validationError) {
        return NextResponse.json({ error: validationError }, { status: 400 });
      }

      if (imageFile.size > MAX_IMAGE_BYTES) {
        return NextResponse.json(
          { error: "Photo must be 4 MB or smaller." },
          { status: 400 },
        );
      }
    }

    const owner = await signer.getAddress();
    const textUpload = await uploadEncryptedText(text);

    let imageUpload: { rootHash: string; txHash: string } | undefined;

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageUpload = await uploadEncryptedImage(buffer, imageFile.type);
    }

    const provenance = {
      rootHash: textUpload.rootHash,
      txHash: textUpload.txHash,
      owner,
      createdAt: new Date().toISOString(),
      ...(imageUpload
        ? {
            imageRootHash: imageUpload.rootHash,
            imageTxHash: imageUpload.txHash,
          }
        : {}),
    };

    await appendMemory(provenance);

    return NextResponse.json({
      rootHash: textUpload.rootHash,
      txHash: textUpload.txHash,
      ...(imageUpload
        ? {
            imageRootHash: imageUpload.rootHash,
            imageTxHash: imageUpload.txHash,
          }
        : {}),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
