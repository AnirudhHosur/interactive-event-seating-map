import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { LRUCache } from "./cache";
import { SimpleFetchQueue } from "./queue";
import { rateLimiterMiddleware } from "./rateLimiter";
import { getUserFromMock, createUserInMock, mockUsers } from "./mockData";
import { User } from "./types";
import { metrics } from "./metrics";

const app = express();
app.set("trust proxy", true);

app.use(cors());
app.use(bodyParser.json()); // body-parser (explicit per requirement)
app.use(rateLimiterMiddleware);

// response time middleware & metrics
app.use((req, res, next) => {
    const start = process.hrtime.bigint();
    res.on("finish", () => {
        const durationMs = Number((process.hrtime.bigint() - start) / BigInt(1e6));
        metrics.record(durationMs);
    });
    next();
});

// Create the cache with TTL 60 seconds and reasonable max size
const cache = new LRUCache<number, User>({ ttlSeconds: 60, maxSize: 1000 });

// background sweeper: every 5 seconds remove stale entries
setInterval(() => {
    const removed = cache.sweepStale();
    if (removed > 0) {
        console.log(`[Cache Sweeper] removed ${removed} stale entries, cache size: ${cache.size()}`);
    }
}, 5000);

// In-flight map for request deduplication: id -> promise
const inFlight = new Map<number, Promise<User>>();

// Simple queue to manage "database" fetches (with concurrency)
const queue = new SimpleFetchQueue(4);

// Helper: fetch user via queue and update cache if still not present
function fetchUserThroughQueueAndCache(id: number): Promise<User> {
    // If cache got filled in the meantime, return immediately
    const cached = cache.get(id);
    if (cached) return Promise.resolve(cached);

    // If already in-flight, return that promise
    const existing = inFlight.get(id);
    if (existing) return existing;

    // Enqueue a fetch job and store the promise in-flight for deduplication
    const p = queue
        .enqueueFetch(id)
        .then((user) => {
            // Only set into cache if still not cached (requirement)
            if (!cache.has(id)) {
                cache.set(id, user);
            }
            inFlight.delete(id);
            return user;
        })
        .catch((err) => {
            inFlight.delete(id);
            // propagate error
            throw err;
        });

    inFlight.set(id, p);
    return p;
}

/**
 * GET /users/:id
 * - if cached => return immediately
 * - else => use queue to fetch (200ms simulated) and dedupe concurrent requests via inFlight
 */
app.get("/users/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
        res.status(400).json({ message: "Invalid user id" });
        return;
    }

    // Check cache
    const cached = cache.get(id);
    if (cached) {
        res.json({ source: "cache", user: cached });
        return;
    }

    try {
        const user = await fetchUserThroughQueueAndCache(id);
        res.json({ source: "db", user });
    } catch (err: any) {
        if (err && err.status === 404) {
            res.status(404).json({ message: err.message || `User ${id} not found` });
        } else {
            res.status(500).json({ message: "Internal error fetching user", detail: err });
        }
    }
});

/**
 * POST /users
 * - create new user in the mock store and cache it
 */
app.post("/users", (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        res.status(400).json({ message: "name and email are required" });
        return;
    }
    const newUser = createUserInMock(name, email);
    // Add directly to cache
    cache.set(newUser.id, newUser);
    res.status(201).json({ message: "User created", user: newUser });
});

/**
 * GET /users
 * - get all users from the mock store
 */
app.get("/users", (_req, res) => {
    const users = Array.from(mockUsers.values());
    res.json({ users, count: users.length });
});

/**
 * DELETE /cache - clear entire cache (manual cache management)
 */
app.delete("/cache", (_req, res) => {
    cache.clear();
    res.json({ message: "Cache cleared" });
});

/**
 * GET /cache-status - cache stats + avg response time
 */
app.get("/cache-status", (_req, res) => {
    res.json({
        cache: cache.stats(),
        metrics: {
            totalRequests: metrics.totalRequests,
            avgResponseTimeMs: Number(metrics.avgResponseTimeMs().toFixed(2))
        },
        inFlightCount: inFlight.size
    });
});

// small health endpoint
app.get("/health", (_req, res) => res.json({ status: "ok" }));

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
    console.log(`Server listening on http://localhost:${port}`);
});
