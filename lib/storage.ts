import { readMemories } from "@/lib/memories";
import { indexer, OG_RPC_URL, signer } from "@/lib/og";
import {
  MemData,
  ZgFile,
} from "@0gfoundation/0g-storage-ts-sdk";
import { mkdtemp, unlink, writeFile } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import { randomUUID } from "crypto";

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export interface UploadResult {
  rootHash: string;
  txHash: string;
}

export function eciesUploadOptions() {
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

export function normalizeUploadResult(result: unknown): UploadResult {
  if (isSingleUploadResult(result)) {
    return { rootHash: result.rootHash, txHash: result.txHash };
  }

  const multi = result as {
    rootHashes: string[];
    txHashes: string[];
  };

  return {
    rootHash: multi.rootHashes[0],
    txHash: multi.txHashes[0],
  };
}

export async function uploadEncryptedFile(
  file: MemData | ZgFile,
): Promise<UploadResult> {
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

export async function uploadEncryptedText(text: string): Promise<UploadResult> {
  const file = new MemData(new TextEncoder().encode(text));
  return uploadEncryptedFile(file);
}

export async function uploadEncryptedImage(
  buffer: Buffer,
  mimeType: string,
): Promise<UploadResult> {
  const dir = await mkdtemp(join(tmpdir(), "keepsake-"));
  const extension = extensionForMime(mimeType);
  const tempPath = join(dir, `${randomUUID()}${extension}`);

  await writeFile(tempPath, buffer);

  const file = await ZgFile.fromFilePath(tempPath);

  try {
    return await uploadEncryptedFile(file);
  } finally {
    await file.close();
    await unlink(tempPath).catch(() => {});
  }
}

export async function decryptRootHash(rootHash: string): Promise<Uint8Array> {
  const [blob, downloadError] = await indexer.downloadToBlob(rootHash, {
    decryption: { privateKey: signer.privateKey },
  });

  if (downloadError || !blob) {
    throw downloadError ?? new Error("Failed to download memory");
  }

  return new Uint8Array(await blob.arrayBuffer());
}

export async function isAuthorizedImageRoot(rootHash: string): Promise<boolean> {
  const memories = await readMemories();
  const normalized = rootHash.toLowerCase();

  return memories.some(
    (memory) => memory.imageRootHash?.toLowerCase() === normalized,
  );
}

export function validateImageUpload(file: File): string | null {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Photo must be JPEG, PNG, WebP, or GIF.";
  }

  if (file.size > MAX_IMAGE_BYTES) {
    return "Photo must be 4 MB or smaller.";
  }

  return null;
}

export function detectImageMimeType(bytes: Uint8Array): string {
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "image/jpeg";
  }

  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47
  ) {
    return "image/png";
  }

  if (
    bytes.length >= 6 &&
    bytes[0] === 0x47 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46
  ) {
    return "image/gif";
  }

  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }

  return "application/octet-stream";
}

function extensionForMime(mimeType: string): string {
  switch (mimeType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/webp":
      return ".webp";
    case "image/gif":
      return ".gif";
    default:
      return ".bin";
  }
}

export function memoryRootHashes(memory: {
  rootHash: string;
  imageRootHash?: string;
}): string[] {
  return memory.imageRootHash
    ? [memory.rootHash, memory.imageRootHash]
    : [memory.rootHash];
}
