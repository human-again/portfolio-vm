import { PortfolioOverrideSchema, type PortfolioOverride } from "./types";

// ── Upstash Redis client (lazy-init) ────────────────────────────────────────

function isKvConfigured(): boolean {
  return !!(
    process.env.UPSTASH_REDIS_REST_URL &&
    process.env.UPSTASH_REDIS_REST_TOKEN
  );
}

async function getRedis() {
  const { Redis } = await import("@upstash/redis");
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

/**
 * Get the resume blob URL from KV.
 */
export async function getResumeBlobUrl(): Promise<string | null> {
  if (!isKvConfigured()) return null;
  try {
    const redis = await getRedis();
    return await redis.get<string>(BLOB_URL_KEY);
  } catch {
    return null;
  }
}

/**
 * Store the resume blob URL in KV.
 */
export async function setResumeBlobUrl(url: string): Promise<void> {
  if (!isKvConfigured()) {
    throw new Error("Upstash Redis is not configured (missing env vars)");
  }
  const redis = await getRedis();
  await redis.set(BLOB_URL_KEY, url);
}
