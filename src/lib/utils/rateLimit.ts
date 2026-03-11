import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter (per-IP, resets on cold start).
// For production, swap this for @upstash/ratelimit + your Redis instance
// (see docs/RAG-UPGRADE.md for the Upstash setup pattern).
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 20; // max requests per window per IP

const ipMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = ipMap.get(ip);

  if (!record || now > record.resetAt) {
    ipMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

export function rateLimit(request: NextRequest): NextResponse | null {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  const { allowed, remaining } = checkRateLimit(ip);

  if (!allowed) {
    return new NextResponse(
      JSON.stringify({ error: "Too many requests. Please wait a minute and try again." }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": "60",
          "X-RateLimit-Limit": String(RATE_LIMIT_MAX),
          "X-RateLimit-Remaining": "0",
        },
      },
    );
  }

  // Attach remaining count to headers so caller can forward them
  // (not returned from this function — caller adds them to their own response)
  void remaining; // suppresses unused-variable lint

  return null; // null = request is allowed
}
