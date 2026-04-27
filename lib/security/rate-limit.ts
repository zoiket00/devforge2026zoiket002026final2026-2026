// lib/security/rate-limit.ts
// ┌─────────────────────────────────────────────────────────────┐
// │  RATE LIMITING - Sliding Window + Token Bucket              │
// │  DDoS protection · Brute-force · API abuse prevention       │
// └─────────────────────────────────────────────────────────────┘

interface RateLimitConfig {
  requests: number;
  window: number;
}

interface RateLimitResult {
  exceeded: boolean;
  count: number;
  remaining: number;
  resetAt: number;
  resetIn: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    firstRequest: number;
    lastRequest: number;
  };
}

const store: RateLimitStore = {};

if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const key of Object.keys(store)) {
      if (now - store[key].lastRequest > 600_000) {
        delete store[key];
      }
    }
  }, 600_000);
}

export async function rateLimit(
  identifier: string,
  route: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const key = `${route}:${identifier}`;
  const now = Date.now();
  const windowMs = config.window * 1000;

  if (!store[key]) {
    store[key] = {
      count: 0,
      firstRequest: now,
      lastRequest: now,
    };
  }

  const entry = store[key];

  if (now - entry.firstRequest > windowMs) {
    entry.count = 0;
    entry.firstRequest = now;
  }

  entry.count++;
  entry.lastRequest = now;

  const resetAt = Math.floor((entry.firstRequest + windowMs) / 1000);
  const resetIn = Math.max(0, Math.ceil((entry.firstRequest + windowMs - now) / 1000));
  const remaining = Math.max(0, config.requests - entry.count);

  return {
    exceeded: entry.count > config.requests,
    count: entry.count,
    remaining,
    resetAt,
    resetIn,
  };
}

export async function userRateLimit(
  userId: string,
  action: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  return rateLimit(`user:${userId}`, action, config);
}

export async function loginRateLimit(ip: string): Promise<RateLimitResult> {
  return rateLimit(ip, "login", {
    requests: 5,
    window: 900,
  });
}

export async function passwordResetRateLimit(email: string): Promise<RateLimitResult> {
  return rateLimit(`email:${email}`, "password-reset", {
    requests: 3,
    window: 3600,
  });
}

export async function apiKeyRateLimit(
  apiKey: string,
  tier: "free" | "pro" | "enterprise" = "free"
): Promise<RateLimitResult> {
  const tiers: Record<string, RateLimitConfig> = {
    free:       { requests: 100,  window: 3600 },
    pro:        { requests: 5000, window: 3600 },
    enterprise: { requests: 50000, window: 3600 },
  };

  return rateLimit(`apikey:${apiKey}`, "api", tiers[tier]);
}

export function withRateLimit(
  handler: (req: Request) => Promise<Response>,
  config: RateLimitConfig = { requests: 10, window: 60 }
) {
  return async (req: Request) => {
    const ip =
      req.headers.get("x-real-ip") ||
      req.headers.get("x-forwarded-for")?.split(",")[0] ||
      "unknown";

    const url = new URL(req.url);
    const result = await rateLimit(ip, url.pathname, config);

    if (result.exceeded) {
      return new Response(
        JSON.stringify({
          error: "Demasiadas solicitudes. Intenta de nuevo más tarde.",
          retryAfter: result.resetIn,
        }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(result.resetIn),
            "X-RateLimit-Limit": String(config.requests),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(result.resetAt),
          },
        }
      );
    }

    return handler(req);
  };
}

export class TokenBucket {
  private tokens: number;
  private lastRefill: number;

  constructor(
    private capacity: number,
    private refillRate: number
  ) {
    this.tokens = capacity;
    this.lastRefill = Date.now();
  }

  consume(tokens: number = 1): boolean {
    this.refill();

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }

    return false;
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(
      this.capacity,
      this.tokens + elapsed * this.refillRate
    );
    this.lastRefill = now;
  }

  get available(): number {
    this.refill();
    return Math.floor(this.tokens);
  }
}