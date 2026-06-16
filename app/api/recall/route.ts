import { MemoryProvenance, readMemories } from "@/lib/memories";
import { compute, indexer, OG_COMPUTE_MODEL, signer } from "@/lib/og";
import { extractComputeProof } from "@/lib/trace";
import { NextResponse } from "next/server";

interface RecallRequest {
  query?: string;
}

interface DecryptedMemory extends MemoryProvenance {
  text: string;
}

function isRelevant(text: string, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  const normalizedText = text.toLowerCase();
  const tokens = normalizedQuery.split(/\s+/).filter((token) => token.length > 0);

  return tokens.some((token) => normalizedText.includes(token));
}

async function decryptMemory(
  memory: MemoryProvenance,
): Promise<DecryptedMemory | null> {
  const [blob, downloadError] = await indexer.downloadToBlob(memory.rootHash, {
    decryption: { privateKey: signer.privateKey },
  });

  if (downloadError || !blob) {
    return null;
  }

  const text = new TextDecoder().decode(
    new Uint8Array(await blob.arrayBuffer()),
  );

  return { ...memory, text };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RecallRequest;
    const query = body.query?.trim() ?? "";

    const provenance = await readMemories();
    if (provenance.length === 0) {
      return NextResponse.json(
        { error: "No memories stored yet" },
        { status: 404 },
      );
    }

    const decrypted = (
      await Promise.all(provenance.map((memory) => decryptMemory(memory)))
    ).filter((memory): memory is DecryptedMemory => memory !== null);

    if (decrypted.length === 0) {
      return NextResponse.json(
        { error: "Failed to decrypt stored memories" },
        { status: 500 },
      );
    }

    const relevant = query
      ? decrypted.filter((memory) => isRelevant(memory.text, query))
      : decrypted;
    const memories = relevant.length > 0 ? relevant : decrypted;

    const memoryContext = memories
      .map(
        (memory, index) =>
          `[${index + 1}] (${memory.createdAt})\n${memory.text}`,
      )
      .join("\n\n");

    const completionPromise = compute.chat.completions.create({
      model: OG_COMPUTE_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are Keepsake, a warm AI memory companion. Using the personal memories below, weave a short reflective story that connects them to the user's query. Be gentle, personal, and grounded only in the provided memories.",
        },
        {
          role: "user",
          content: `Query: ${query || "Tell me what these memories mean together."}\n\nMemories:\n${memoryContext}`,
        },
      ],
      max_tokens: 512,
    });

    const { data, response } = await completionPromise.withResponse();
    const story = data.choices[0]?.message?.content?.trim() ?? "";

    if (!story) {
      throw new Error("Compute returned an empty story");
    }

    const computeProof = extractComputeProof(response, data);

    return NextResponse.json({
      story,
      proof: {
        rootHashes: memories.map((memory) => memory.rootHash),
        provider: computeProof.provider,
        requestId: computeProof.requestId,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
