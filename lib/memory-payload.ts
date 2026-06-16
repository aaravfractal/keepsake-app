export interface MemoryPayloadV1 {
  v: 1;
  text: string;
  image?: {
    mime: string;
    b64: string;
  };
}

export interface ParsedMemoryContent {
  text: string;
  image?: {
    mime: string;
    bytes: Uint8Array;
  };
}

export function encodePayload(payload: MemoryPayloadV1): Uint8Array {
  return new TextEncoder().encode(JSON.stringify(payload));
}

function decodeBase64(b64: string): Uint8Array {
  return new Uint8Array(Buffer.from(b64, "base64"));
}

export function parseMemoryContent(bytes: Uint8Array): ParsedMemoryContent {
  const raw = new TextDecoder().decode(bytes);

  try {
    const parsed = JSON.parse(raw) as MemoryPayloadV1;

    if (parsed.v === 1 && typeof parsed.text === "string") {
      if (parsed.image?.b64) {
        return {
          text: parsed.text,
          image: {
            mime: parsed.image.mime || "image/jpeg",
            bytes: decodeBase64(parsed.image.b64),
          },
        };
      }

      return { text: parsed.text };
    }
  } catch {
    // Plain text memory (legacy text-only uploads).
  }

  return { text: raw };
}

export function parseMemoryContentFromBuffer(buffer: Buffer): ParsedMemoryContent {
  return parseMemoryContent(new Uint8Array(buffer));
}
