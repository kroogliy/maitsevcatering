import { Alkohol } from "../../models/Alkohol";
import { Category } from "../../models/Category";
import { Subcategory } from "../../models/Subcategory";
import { mongooseConnect } from "../../lib/mongoose";
import mongoose from "mongoose";

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
  const {
    slug,
    subcategorySlug,
    subcategoryId,
    page = 1,
    limit = 24,
    homepage,
    sitemap,
  } = query;

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

  const cacheKey = getCacheKey({
    slug,
    subcategorySlug,
    subcategoryId,
    page,
    limit,
    homepage,
    sitemap,
  });

  try {
    // Check cache first (skip cache for sitemap requests)
    if (sitemap !== "true") {
      const cachedResult = getFromCache(cacheKey);
      if (cachedResult) {
        return res.status(200).json(cachedResult);
      }
    }

    // Use request deduplication to prevent concurrent identical requests
    const result = await getOrCreateRequest(cacheKey, async () => {
      await mongooseConnect();

      let filter = {};

      // 1. Запрос конкретного напитка по slug (ОСНОВНОЕ ИЗМЕНЕНИЕ)
      if (slug && !subcategoryId && !subcategorySlug) {
        const product = await Alkohol.findOne({ slug })
          .populate("category", "name slug")
          .populate("subcategory", "name slug")
          .lean();

        if (!product) {
          return { error: "Product not found", status: 404 };
        }
        return { data: transformProduct(product), status: 200 };
      }

      // 2. Handle subcategorySlug with caching
      if (subcategorySlug) {
        const subcategoryCacheKey = `alkohol-subcategory:${subcategorySlug}`;
        let subcategory = getFromCache(subcategoryCacheKey);

        if (!subcategory) {
          subcategory = await Subcategory.findOne({
            slug: subcategorySlug,
          }).lean();
          if (subcategory) {
            setCache(subcategoryCacheKey, subcategory);
          }
        }

        if (!subcategory) {
          return { error: "Subcategory not found", status: 404 };
        }
        filter.subcategory = subcategory._id;
      }

      if (subcategoryId) {
        filter.subcategory = subcategoryId;
      }

      // Special homepage API with alkoholsByType structure
      if (homepage === "true") {
        const allAlkohols = await Alkohol.find({})
          .populate("category", "name")
          .populate("subcategory", "name")
          .lean();

        // Mix drinks from all subcategories, not grouped by subcategory
        const shuffledAlkohols = allAlkohols.sort(() => 0.5 - Math.random());

        const nonAlcoholic = shuffledAlkohols
          .filter((drink) => {
            const isNonAlc =
              !drink.isAlcoholic &&
              (drink.degree === 0 ||
                drink.degree === null ||
                drink.degree === undefined);
            return isNonAlc;
          })
          .slice(0, 12)
          .map((product) => {
            // Transform product and remove original subcategory to avoid grouping
            const transformed = transformProduct(product);
            return {
              ...transformed,
              // Don't include original subcategory to prevent UI from grouping by real categories
              originalSubcategory: transformed.subcategory,
              subcategory: null,
            };
          });

        const alcoholic = shuffledAlkohols
          .filter((drink) => {
            const isAlc =
              drink.isAlcoholic || (drink.degree && drink.degree > 0);
            return isAlc;
          })
          .slice(0, 12)
          .map((product) => {
            // Transform product and remove original subcategory
            const transformed = transformProduct(product);
            return {
              ...transformed,
              originalSubcategory: transformed.subcategory,
              subcategory: null,
            };
          });

        return {
          data: {
            alkoholsByType: {
              nonAlcoholic,
              alcoholic,
            },
          },
          status: 200,
        };
      }

      if (!slug && !subcategoryId && !subcategorySlug) {
        const subcategories = await Alkohol.distinct("subcategory");
        const totalDrinks = await Alkohol.countDocuments();

        const alkoholsBySubcategory = {};
        let totalReturned = 0;

        await Promise.all(
          subcategories.map(async (subId) => {
            let query = Alkohol.find({ subcategory: subId })
              .populate("category", "name")
              .populate("subcategory", "name")
              .lean();

            // Only limit if NOT sitemap request
            if (sitemap !== "true") {
              query = query.limit(24);
            }

            const subAlkohols = await query;

            totalReturned += subAlkohols.length;

            if (subAlkohols.length > 0) {
              const subcatName =
                subAlkohols[0].subcategory?.name?.en || "Unknown";
            }

            alkoholsBySubcategory[subId] = subAlkohols.map(transformProduct);
          }),
        );

        // Check for drinks without subcategory
        const drinksWithoutSubcat = await Alkohol.countDocuments({
          $or: [{ subcategory: null }, { subcategory: { $exists: false } }],
        });

        return { data: { alkoholsBySubcategory }, status: 200 };
      }

      const total = await Alkohol.countDocuments(filter);

      // Build query with safe sorting
      let query = Alkohol.find(filter)
        .skip((page - 1) * limit)
        .limit(Number(limit))
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

      return {
        data: {
          data: products.map(transformProduct),
          pagination: {
            currentPage: Number(page),
            perPage: Number(limit),
            totalItems: total,
            totalPages: Math.ceil(total / limit),
          },
        },
        status: 200,
      };
    });

    // Handle error results
    if (result.error) {
      return res.status(result.status || 500).json({ error: result.error });
    }

    // Cache and return successful result (skip caching for sitemap requests)
    if (sitemap !== "true") {
      setCache(cacheKey, result.data);
    }

    return res.status(result.status).json(result.data);
  } catch (error) {
    console.error("Alkohol API Error:", error);

    return res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}

// Добавляем slug в transformProduct
function transformProduct(product) {
  return {
    ...product,
    _id: product._id?.toString(),
    category: product.category
      ? {
          ...product.category,
          _id: product.category._id.toString(),
          slug: product.category.slug || null,
        }
      : null,
    subcategory: product.subcategory
      ? {
          ...product.subcategory,
          _id: product.subcategory._id.toString(),
          slug: product.subcategory.slug || null,
        }
      : null,
  };
}
