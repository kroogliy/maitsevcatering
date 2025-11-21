// API Cache utility for better performance
class ApiCache {
  constructor(defaultTTL = 5 * 60 * 1000) {
    // 5 minutes default
    this.cache = new Map();
    this.defaultTTL = defaultTTL;
  }

  // Generate cache key from URL and params
  generateKey(url, params = {}) {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    return `${url}${sortedParams ? "?" + sortedParams : ""}`;
  }

  // Set cache entry
  set(key, data, ttl = this.defaultTTL) {
    const expiry = Date.now() + ttl;
    this.cache.set(key, {
      data,
      expiry,
      timestamp: Date.now(),
    });
  }

  // Get cache entry
  get(key) {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if expired
    if (Date.now() > entry.expiry) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  // Clear cache
  clear() {
    this.cache.clear();
  }

  // Remove expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key);
      }
    }
  }

  // Get cache stats
  getStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
        key,
        age: Date.now() - entry.timestamp,
        ttl: entry.expiry - Date.now(),
      })),
    };
  }
}

// Create singleton instance
const apiCache = new ApiCache();

// Enhanced fetch with caching
export const cachedFetch = async (url, options = {}) => {
  const { cache = true, ttl, ...fetchOptions } = options;

  if (!cache) {
    return fetch(url, fetchOptions);
  }

  const cacheKey = apiCache.generateKey(
    url,
    fetchOptions.body ? JSON.parse(fetchOptions.body) : {},
  );

  // Try to get from cache first
  const cachedData = apiCache.get(cacheKey);
  if (cachedData) {
    return {
      ok: true,
      json: () => Promise.resolve(cachedData),
      status: 200,
    };
  }

  try {
    const response = await fetch(url, fetchOptions);

    if (response.ok) {
      const data = await response.json();
      apiCache.set(cacheKey, data, ttl);

      return {
        ok: true,
        json: () => Promise.resolve(data),
        status: response.status,
      };
    }

    return response;
  } catch (error) {
    throw error;
  }
};

// Prefetch utility for critical data
export const prefetchData = async (urls) => {
  const promises = urls.map((url) => cachedFetch(url));
  await Promise.allSettled(promises);
};

// Cache management
export const cacheManager = {
  clear: () => apiCache.clear(),
  cleanup: () => apiCache.cleanup(),
  stats: () => apiCache.getStats(),
  invalidate: (pattern) => {
    for (const key of apiCache.cache.keys()) {
      if (key.includes(pattern)) {
        apiCache.cache.delete(key);
      }
    }
  },
};

export default apiCache;
