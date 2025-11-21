import { Category } from "../../models/Category";
import { mongooseConnect } from "../../lib/mongoose";
import mongoose from "mongoose";

// Improved caching with request deduplication
const cache = new Map();
const activeRequests = new Map(); // For request deduplication
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_SIZE = 100;

function getCacheKey(query) {
  return `categories:${JSON.stringify(query)}`;
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

  const { slug } = req.query;
  const cacheKey = getCacheKey({ slug });

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
        // Возвращаем категорию по slug
        const category = await Category.findOne({ slug }).lean();

        if (!category) {
          return { error: "Category not found", status: 404 };
        }

        return {
          data: {
            ...category,
            _id: category._id.toString(),
          },
          status: 200,
        };
      }

      // Возвращаем все категории, если slug не указан
      // Build query with safe sorting
      let query = Category.find().lean();

      // Add sorting with fallback
      try {
        query = query.sort({ createdAt: 1 });
      } catch (sortError) {
        query = query.sort({ _id: 1 });
      }

      const categories = await query;

      return {
        data: categories.map((category) => ({
          ...category,
          _id: category._id.toString(),
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
    console.error("Categories API Error:", error);

    return res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
