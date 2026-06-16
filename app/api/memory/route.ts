import { appendMemory } from "@/lib/memories";
import { indexer, OG_RPC_URL, signer } from "@/lib/og";
import { MemData } from "@0gfoundation/0g-storage-ts-sdk";
import { NextResponse } from "next/server";

interface MemoryRequest {
  text?: string;
}

function isSingleUploadResult(
  result: unknown,
): result is { txHash: string; rootHash: string; txSeq: number } {
  return (
    typeof result === "object" &&
    result !== null &&
    "rootHash" in result &&
    typeof (result as { rootHash: unknown }).rootHash === "string"
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MemoryRequest;
    const text = body.text?.trim();

    if (!text) {
      return NextResponse.json({ error: "text is required" }, { status: 400 });
    }

    const owner = await signer.getAddress();
    const file = new MemData(new TextEncoder().encode(text));

    const [result, uploadError] = await indexer.upload(
      file,
      OG_RPC_URL,
      signer,
      {
        encryption: {
          type: "ecies",
          recipientPubKey: signer.signingKey.publicKey,
        },
      },
    );

    if (uploadError || !result) {
      throw uploadError ?? new Error("Upload failed");
    }

    const { rootHash, txHash } = isSingleUploadResult(result)
      ? result
      : {
          rootHash: result.rootHashes[0],
          txHash: result.txHashes[0],
        };

    if (!rootHash || !txHash) {
      throw new Error("Upload did not return rootHash and txHash");
    }

    const provenance = {
      rootHash,
      txHash,
      owner,
      createdAt: new Date().toISOString(),
    };

    await appendMemory(provenance);

    return NextResponse.json({ rootHash, txHash });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
