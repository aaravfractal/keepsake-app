import { Indexer } from "@0gfoundation/0g-storage-ts-sdk";
import { ethers } from "ethers";
import OpenAI from "openai";

export const OG_RPC_URL = "https://evmrpc-testnet.0g.ai";
export const OG_INDEXER_URL =
  "https://indexer-storage-testnet-turbo.0g.ai";
export const OG_COMPUTE_BASE_URL =
  "https://router-api-testnet.integratenetwork.work/v1";
export const OG_COMPUTE_MODEL = "qwen2.5-omni";

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizePrivateKey(key: string): string {
  return key.startsWith("0x") ? key : `0x${key}`;
}

const provider = new ethers.JsonRpcProvider(OG_RPC_URL);

export const signer = new ethers.Wallet(
  normalizePrivateKey(requireEnv("PRIVATE_KEY")),
  provider,
);

export const indexer = new Indexer(OG_INDEXER_URL);

export const compute = new OpenAI({
  baseURL: OG_COMPUTE_BASE_URL,
  apiKey: requireEnv("OG_API_KEY"),
});
