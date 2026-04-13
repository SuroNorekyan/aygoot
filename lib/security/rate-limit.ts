import { LRUCache } from "lru-cache";

type Entry = {
  count: number;
  resetAt: number;
};

const cache = new LRUCache<string, Entry>({
  max: 5000,
  ttl: 1000 * 60 * 60,
});

export const consumeRateLimit = (key: string, limit: number, windowMs: number) => {
  const now = Date.now();
  const existing = cache.get(key);

  if (!existing || existing.resetAt <= now) {
    const next = { count: 1, resetAt: now + windowMs };
    cache.set(key, next, { ttl: windowMs });
    return { success: true, remaining: limit - 1, resetAt: next.resetAt };
  }

  if (existing.count >= limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  const next = { count: existing.count + 1, resetAt: existing.resetAt };
  cache.set(key, next, { ttl: existing.resetAt - now });

  return {
    success: true,
    remaining: Math.max(0, limit - next.count),
    resetAt: next.resetAt,
  };
};
