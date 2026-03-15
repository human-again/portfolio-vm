import { PortfolioOverrideSchema, type PortfolioOverride } from "./types";

// ── Vercel KV / Upstash Redis client (lazy-init) ──────────────────────────

function isKvConfigured(): boolean {
  // Support both Vercel KV env vars and Upstash env vars
  return !!(
    (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) ||
    (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
  );
}

async function getRedis() {
  const { Redis } = await import("@upstash/redis");

  // Map Vercel KV env vars to Upstash format if needed
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    // Vercel KV is Upstash under the hood
    process.env.UPSTASH_REDIS_REST_URL = process.env.KV_REST_API_URL;
    process.env.UPSTASH_REDIS_REST_TOKEN = process.env.KV_REST_API_TOKEN;
  }

  return Redis.fromEnv();
}

const KV_KEY = "portfolio-override";
const BLOB_URL_KEY = "resume-blob-url";

// ── Portfolio override CRUD ─────────────────────────────────────────────────

/**
 * Read the portfolio override from KV.
 * Returns null if KV is not configured, key doesn't exist, or data is invalid.
 */
export async function getPortfolioOverride(): Promise<PortfolioOverride | null> {
  if (!isKvConfigured()) return null;

  try {
    const redis = await getRedis();
    const raw = await redis.get(KV_KEY);
    if (!raw) return null;

    const parsed = PortfolioOverrideSchema.safeParse(raw);
    if (!parsed.success) {
      console.warn("[KV] Override failed validation:", parsed.error);
      return null;
    }
    return parsed.data;
  } catch (err) {
    console.warn("[KV] Read failed, falling back to static data:", err);
    return null;
  }
}

/**
 * Write portfolio override to KV. Validates before writing.
 */
export async function setPortfolioOverride(
  data: PortfolioOverride,
): Promise<void> {
  if (!isKvConfigured()) {
    throw new Error("Upstash Redis is not configured (missing env vars)");
  }
  const validated = PortfolioOverrideSchema.parse(data);
  const redis = await getRedis();
  await redis.set(KV_KEY, JSON.stringify(validated));
}

/**
 * Delete the portfolio override (revert to static data).
 */
export async function deletePortfolioOverride(): Promise<void> {
  if (!isKvConfigured()) return;
  const redis = await getRedis();
  await redis.del(KV_KEY);
}

// ── Resume blob URL ─────────────────────────────────────────────────────────

// removed getResumeBlobUrl and setResumeBlobUrl

