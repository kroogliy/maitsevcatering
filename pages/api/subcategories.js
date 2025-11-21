import { Subcategory } from "../../models/Subcategory";
import { Category } from "../../models/Category";
import { mongooseConnect } from "../../lib/mongoose";

// Improved caching with request deduplication
const cache = new Map();
const activeRequests = new Map(); // For request deduplication
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_SIZE = 100;

function getCacheKey(query) {
  return `subcategories:${JSON.stringify(query)}`;
}

function getFromCache(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    // Update access time for LRU
    cached.lastAccess = Date.now();
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(key, data) {
  // Clean old entries if cache is too large
  if (cache.size >= MAX_CACHE_SIZE) {
    const oldestKey = [...cache.entries()].sort(
      ([, a], [, b]) => a.lastAccess - b.lastAccess,
    )[0][0];
    cache.delete(oldestKey);
  }

  cache.set(key, {
    data,
    timestamp: Date.now(),
    lastAccess: Date.now(),
  });
}

// Request deduplication function
async function getOrCreateRequest(key, requestFn) {
  if (activeRequests.has(key)) {
    return activeRequests.get(key);
  }

  const requestPromise = requestFn();
  activeRequests.set(key, requestPromise);

  try {
    const result = await requestPromise;
    return result;
  } finally {
    activeRequests.delete(key);
  }
}

export default async function handler(req, res) {
  const { method } = req;

  // Improved cache headers for cold start optimization
  res.setHeader(
    "Cache-Control",
    "public, max-age=3600, stale-while-revalidate=7200",
  );
  res.setHeader("CDN-Cache-Control", "public, max-age=86400"); // 24 hours for CDN
  res.setHeader(
    "Vercel-CDN-Cache-Control",
    "public, max-age=86400, stale-while-revalidate=172800",
  ); // 48 hours stale

  if (method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { slug, categoryId } = req.query;
  const cacheKey = getCacheKey({ slug, categoryId });

  try {
    // Check cache first
    const cachedResult = getFromCache(cacheKey);
    if (cachedResult) {
      return res.status(200).json(cachedResult);
    }

    // Use request deduplication to prevent concurrent identical requests
    const result = await getOrCreateRequest(cacheKey, async () => {
      await mongooseConnect();

      if (slug) {
        // Возвращаем подкатегорию по slug
        const subcategory = await Subcategory.findOne({ slug }).lean();

        if (!subcategory) {
          return { error: "Subcategory not found", status: 404 };
        }

        return {
          data: {
            ...subcategory,
            _id: subcategory._id.toString(),
          },
          status: 200,
        };
      }

      // Возвращаем подкатегории по categoryId, если slug не указан
      const filter = categoryId ? { parentCategory: categoryId } : {};

      // Build query with safe sorting
      let query = Subcategory.find(filter).lean();

      // Add sorting with fallback
      try {
        query = query.sort({ createdAt: 1 });
      } catch (sortError) {
        query = query.sort({ _id: 1 });
      }

      const subcategories = await query;

      return {
        data: subcategories.map((subcategory) => ({
          ...subcategory,
          _id: subcategory._id.toString(),
        })),
        status: 200,
      };
    });

    // Handle error results
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }

    // Cache and return successful result
    setCache(cacheKey, result.data);

    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Subcategories API Error:", error);

    return res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
