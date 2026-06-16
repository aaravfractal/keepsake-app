import { readMemories } from "@/lib/memories";
import {
  encodePayload,
  MemoryPayloadV1,
  parseMemoryContentFromBuffer,
} from "@/lib/memory-payload";
import { indexer, OG_RPC_URL, signer } from "@/lib/og";
import { MemData } from "@0gfoundation/0g-storage-ts-sdk";

export interface UploadResult {
  rootHash: string;
  txHash: string;
}

function eciesUploadOptions() {
  return {
    encryption: {
      type: "ecies" as const,
      recipientPubKey: signer.signingKey.publicKey,
    },
  };
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

function normalizeUploadResult(result: unknown): UploadResult {
  if (isSingleUploadResult(result)) {
    return { rootHash: result.rootHash, txHash: result.txHash };
  }

  const multi = result as { rootHashes: string[]; txHashes: string[] };
  return {
    rootHash: multi.rootHashes[0],
    txHash: multi.txHashes[0],
  };
}

async function uploadBytes(bytes: Uint8Array): Promise<UploadResult> {
  const file = new MemData(bytes);
  const [result, uploadError] = await indexer.upload(
    file,
    OG_RPC_URL,
    signer,
    eciesUploadOptions(),
  );

  if (uploadError || !result) {
    throw uploadError ?? new Error("Upload failed");
  }

  const { rootHash, txHash } = normalizeUploadResult(result);

  if (!rootHash || !txHash) {
    throw new Error("Upload did not return rootHash and txHash");
  }

  return { rootHash, txHash };
}

/** Text-only upload — raw UTF-8 bytes, unchanged from the original flow. */
export async function uploadTextOnly(text: string): Promise<UploadResult> {
  return uploadBytes(new TextEncoder().encode(text));
}

/** Bundled text + photo in one encrypted MemData payload. */
export async function uploadBundledMemory(
  payload: MemoryPayloadV1,
): Promise<UploadResult> {
  return uploadBytes(encodePayload(payload));
}

export async function decryptMemoryRoot(rootHash: string): Promise<Buffer> {
  const [blob, downloadError] = await indexer.downloadToBlob(rootHash, {
    decryption: { privateKey: signer.privateKey },
  });

  if (downloadError || !blob) {
    throw downloadError ?? new Error("Failed to download memory");
  }

  return Buffer.from(await blob.arrayBuffer());
}

export async function hasPhotoAtRoot(rootHash: string): Promise<boolean> {
  const memories = await readMemories();
  const normalized = rootHash.toLowerCase();

  return memories.some(
    (memory) =>
      memory.hasPhoto &&
      memory.rootHash.toLowerCase() === normalized,
  );
}

export { parseMemoryContentFromBuffer };
