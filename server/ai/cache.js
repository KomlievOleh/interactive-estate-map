const cache = new Map();

const DEFAULT_TTL_MS = 1000 * 60 * 60;

export function getCachedValue(key) {
    const item = cache.get(key);

    if (!item) return null;

    if (Date.now() > item.expiresAt) {
        cache.delete(key);
        return null;
    }

    return item.value;
}

export function setCachedValue(key, value, ttlMs = DEFAULT_TTL_MS) {
    cache.set(key, {
        value,
        expiresAt: Date.now() + ttlMs,
    });
}