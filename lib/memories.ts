import { Redis } from "@upstash/redis";

const MEMORIES_KEY = "keepsake:memories";

let redis: Redis | null = null;

function getRedis(): Redis {
  if (redis) {
    return redis;
  }

  const url =
    process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    throw new Error(
      "Missing Redis credentials. Link Upstash Redis in Vercel Integrations (sets KV_REST_API_URL and KV_REST_API_TOKEN).",
    );
  }

  redis = new Redis({ url, token });
  return redis;
}

export interface MemoryProvenance {
  rootHash: string;
  txHash: string;
  owner: string;
  createdAt: string;
  hasPhoto?: boolean;
}

export async function readMemories(): Promise<MemoryProvenance[]> {
  const items = await getRedis().lrange<MemoryProvenance>(MEMORIES_KEY, 0, -1);
  return items ?? [];
}

export async function appendMemory(entry: MemoryProvenance): Promise<void> {
  await getRedis().rpush(MEMORIES_KEY, entry);
}
