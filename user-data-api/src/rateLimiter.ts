import { Request, Response, NextFunction } from "express";

/**
 * Two-bucket token bucket rate limiter:
 * - shortBucket: capacity 5, refill 5 tokens / 10s (burst)
 * - longBucket: capacity 10, refill 10 tokens / 60s (overall)
 *
 * We keep state per key (IP). For production you'd want a distributed store.
 */

type Bucket = {
    capacity: number;
    tokens: number;
    refillPerMs: number; // tokens per ms
    lastRefill: number;
};

type State = {
    short: Bucket;
    long: Bucket;
};

const store = new Map<string, State>();

function createBuckets(): State {
    const now = Date.now();
    return {
        short: {
            capacity: 5,
            tokens: 5,
            refillPerMs: 5 / 10000, // 5 tokens per 10,000 ms
            lastRefill: now
        },
        long: {
            capacity: 10,
            tokens: 10,
            refillPerMs: 10 / 60000, // 10 tokens per 60,000 ms
            lastRefill: now
        }
    };
}

function refill(bucket: Bucket) {
    const now = Date.now();
    const elapsed = now - bucket.lastRefill;
    if (elapsed <= 0) return;
    const add = elapsed * bucket.refillPerMs;
    bucket.tokens = Math.min(bucket.capacity, bucket.tokens + add);
    bucket.lastRefill = now;
}

export function rateLimiterMiddleware(req: Request, res: Response, next: NextFunction) {
    const ip = (req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown").toString();

    let state = store.get(ip);
    if (!state) {
        state = createBuckets();
        store.set(ip, state);
    }

    // refill both buckets
    refill(state.short);
    refill(state.long);

    const allowedShort = state.short.tokens >= 1;
    const allowedLong = state.long.tokens >= 1;

    if (allowedShort && allowedLong) {
        state.short.tokens -= 1;
        state.long.tokens -= 1;
        next();
        return;
    }

    // not allowed: compute minimal retry-after in seconds (rough estimate)
    const need = 1;
    const now = Date.now();

    let waitShort = 0;
    if (state.short.tokens < need) {
        const neededTokens = need - state.short.tokens;
        waitShort = Math.ceil((neededTokens / state.short.refillPerMs) / 1000);
    }

    let waitLong = 0;
    if (state.long.tokens < need) {
        const neededTokens = need - state.long.tokens;
        waitLong = Math.ceil((neededTokens / state.long.refillPerMs) / 1000);
    }

    const retryAfter = Math.max(waitShort, waitLong, 1);

    res.setHeader("Retry-After", String(retryAfter));
    res.status(429).json({
        message:
            "Rate limit exceeded. Allowed: max 10 requests/min with burst capacity of 5 requests per 10 seconds. Try again later.",
        retryAfterSeconds: retryAfter
    });
}
