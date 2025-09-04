/**
 * Lightweight LRU cache using Map to maintain order.
 * - TTL per entry (milliseconds)
 * - Stats: hits, misses
 * - Background sweep to remove expired entries
 */

export interface CacheStats {
    hits: number;
    misses: number;
    size: number;
    maxSize: number;
    ttlSeconds: number;
}

type Entry<V> = { value: V; expiresAt: number };

export class LRUCache<K, V> {
    private map: Map<K, Entry<V>>;
    public hits = 0;
    public misses = 0;
    private ttlMs: number;
    private maxSize: number;

    constructor(opts?: { ttlSeconds?: number; maxSize?: number }) {
        this.ttlMs = (opts?.ttlSeconds ?? 60) * 1000;
        this.maxSize = opts?.maxSize ?? 1000;
        this.map = new Map();
    }

    get(key: K): V | undefined {
        const entry = this.map.get(key);
        if (!entry) {
            this.misses++;
            return undefined;
        }
        if (Date.now() > entry.expiresAt) {
            // stale
            this.map.delete(key);
            this.misses++;
            return undefined;
        }
        // hit: move to end (MRU)
        this.map.delete(key);
        this.map.set(key, entry);
        this.hits++;
        return entry.value;
    }

    set(key: K, value: V) {
        // If already present, delete to update recency
        if (this.map.has(key)) this.map.delete(key);

        // Evict LRU entries if size exceeded
        while (this.map.size >= this.maxSize) {
            const firstKey = this.map.keys().next().value!;
            this.map.delete(firstKey);
        }

        this.map.set(key, { value, expiresAt: Date.now() + this.ttlMs });
    }

    has(key: K): boolean {
        const entry = this.map.get(key);
        if (!entry) return false;
        if (Date.now() > entry.expiresAt) {
            this.map.delete(key);
            return false;
        }
        return true;
    }

    delete(key: K) {
        this.map.delete(key);
    }

    clear() {
        this.map.clear();
        this.hits = 0;
        this.misses = 0;
    }

    size() {
        return this.map.size;
    }

    // remove expired entries; return number removed
    sweepStale(): number {
        const now = Date.now();
        let removed = 0;
        for (const [k, entry] of Array.from(this.map.entries())) {
            if (entry.expiresAt <= now) {
                this.map.delete(k);
                removed++;
            }
        }
        return removed;
    }

    stats(): CacheStats {
        return {
            hits: this.hits,
            misses: this.misses,
            size: this.size(),
            maxSize: this.maxSize,
            ttlSeconds: Math.round(this.ttlMs / 1000)
        };
    }
}
