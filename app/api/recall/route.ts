import { MemoryProvenance, readMemories } from "@/lib/memories";
import { compute, OG_COMPUTE_MODEL } from "@/lib/og";
import {
  decryptRootHash,
  detectImageMimeType,
  memoryRootHashes,
} from "@/lib/storage";
import { extractComputeProof } from "@/lib/trace";
import type { ChatCompletionContentPart } from "openai/resources/chat/completions";
import { NextResponse } from "next/server";

export const maxDuration = 120;

interface RecallRequest {
  query?: string;
}

interface DecryptedMemory extends MemoryProvenance {
  text: string;
  imageBase64?: string;
  imageMimeType?: string;
}

function isRelevant(memory: DecryptedMemory, query: string): boolean {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    return true;
  }

  const searchable = [
    memory.text,
    memory.imageRootHash ? "photo image picture" : "",
  ]
    .join(" ")
    .toLowerCase();

  const tokens = normalizedQuery.split(/\s+/).filter((token) => token.length > 0);
  return tokens.some((token) => searchable.includes(token));
}

async function decryptMemory(
  memory: MemoryProvenance,
): Promise<DecryptedMemory | null> {
  try {
    const textBytes = await decryptRootHash(memory.rootHash);
    const text = new TextDecoder().decode(textBytes);

    if (!memory.imageRootHash) {
      return { ...memory, text };
    }

    const imageBytes = await decryptRootHash(memory.imageRootHash);
    const imageMimeType = detectImageMimeType(imageBytes);

    return {
      ...memory,
      text,
      imageMimeType,
      imageBase64: Buffer.from(imageBytes).toString("base64"),
    };
  } catch {
    return null;
  }
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
      ? decrypted.filter((memory) => isRelevant(memory, query))
      : decrypted;
    const memories = relevant.length > 0 ? relevant : decrypted;

    const memoryContext = memories
      .map((memory, index) => {
        const photoNote = memory.imageRootHash
          ? "\n[includes a personal photo from this moment]"
          : "";
        return `[${index + 1}] (${memory.createdAt})\n${memory.text}${photoNote}`;
      })
      .join("\n\n");

    const userContent: ChatCompletionContentPart[] = [
      {
        type: "text",
        text: `Query: ${query || "Tell me what these memories mean together."}\n\nMemories:\n${memoryContext}`,
      },
    ];

    for (const memory of memories) {
      if (memory.imageBase64 && memory.imageMimeType?.startsWith("image/")) {
        userContent.push({
          type: "image_url",
          image_url: {
            url: `data:${memory.imageMimeType};base64,${memory.imageBase64}`,
          },
        });
      }
    }

    const completionPromise = compute.chat.completions.create({
      model: OG_COMPUTE_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are Keepsake, a warm AI memory companion. Using the personal memories below (including any attached photos), weave a short reflective story that connects them to the user's query. Be gentle, personal, and grounded only in the provided memories and images.",
        },
        {
          role: "user",
          content: userContent,
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
        rootHashes: memories.flatMap((memory) => memoryRootHashes(memory)),
        provider: computeProof.provider,
        requestId: computeProof.requestId,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
