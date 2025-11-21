import { Product } from "../../models/Product";
import { Category } from "../../models/Category";
import { Subcategory } from "../../models/Subcategory";
import { mongooseConnect } from "../../lib/mongoose";

// Improved caching with request deduplication
const cache = new Map();
const activeRequests = new Map(); // For request deduplication
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes
const MAX_CACHE_SIZE = 100;

function getCacheKey(query) {
  return JSON.stringify(query);
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
  const { method, query } = req;
  const { slug, subcategorySlug, page = 1, limit = 24 } = query;

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

  const cacheKey = getCacheKey(query);

  try {
    // Check cache first
    const cachedResult = getFromCache(cacheKey);
    if (cachedResult) {
      return res.status(200).json(cachedResult);
    }

    // Use request deduplication to prevent concurrent identical requests
    const result = await getOrCreateRequest(cacheKey, async () => {
      await mongooseConnect();

      let queryFilter = {};

      if (slug) {
        queryFilter.slug = slug;
      }

      // Handle subcategorySlug with caching
      if (subcategorySlug) {
        const subcategoryCacheKey = `products-subcategory:${subcategorySlug}`;
        let subcategory = getFromCache(subcategoryCacheKey);

        if (!subcategory) {
          subcategory = await Subcategory.findOne({
            slug: subcategorySlug,
          }).lean();
          if (subcategory) {
            setCache(subcategoryCacheKey, subcategory);
          }
        }

        if (subcategory) {
          queryFilter.subcategory = subcategory._id;
        } else {
          return { products: [], message: "Subcategory not found" };
        }
      }

      // Build query with safe sorting
      let query = Product.find(queryFilter)
        .populate("category", "name")
        .populate("subcategory", "name")
        .lean();

      // Add sorting with fallback
      try {
        query = query.sort({ createdAt: -1 });
      } catch (sortError) {
        query = query.sort({ _id: -1 });
      }

      const products = await query;

      // Handle single product request
      if (slug) {
        const product = products[0];
        if (!product) {
          return { error: "Продукт не найден" };
        }
        return product;
      }

      // Process all products
      const simplifiedProducts = products.map((product) => ({
        _id: product._id.toString(),
        title: product.title,
        description: product.description,
        price: product.price,
        images: product.images,
        category: product.category
          ? {
              _id: product.category._id.toString(),
              name:
                product.category.name?.en || product.category.name || "Unknown",
            }
          : null,
        subcategory: product.subcategory
          ? {
              _id: product.subcategory._id.toString(),
              name:
                product.subcategory.name?.en ||
                product.subcategory.name ||
                "Unknown",
            }
          : null,
        allergens: product.allergens || [],
        isAlcoholic: product.isAlcoholic || false,
        degree: product.degree,
        slug: product.slug,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      }));

      return simplifiedProducts;
    });

    // Handle error results
    if (result.error) {
      return res.status(404).json({ error: result.error });
    }

    // Cache and return successful result
    setCache(cacheKey, result);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Products API Error:", error);

    return res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
