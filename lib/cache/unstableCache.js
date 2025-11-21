import { unstable_cache } from 'next/cache';
import { mongooseConnect } from "../mongoose";

// Cache tags for invalidation
export const CACHE_TAGS = {
  PRODUCTS: 'products',
  ALKOHOLS: 'alkohols',
  CATEGORIES: 'categories',
  SUBCATEGORIES: 'subcategories',
  ALL: 'all'
};

// Cache durations (in seconds)
export const CACHE_DURATIONS = {
  SHORT: 300,    // 5 minutes
  MEDIUM: 1800,  // 30 minutes
  LONG: 3600,    // 1 hour
  VERY_LONG: 86400 // 24 hours
};

/**
 * Create a cached version of a database query function
 * @param {Function} queryFn - The database query function to cache
 * @param {Array<string>} tags - Cache tags for invalidation
 * @param {number} revalidate - Revalidation time in seconds
 * @param {string} keyPrefix - Prefix for cache key
 */
export function createCachedQuery(queryFn, tags = [CACHE_TAGS.ALL], revalidate = CACHE_DURATIONS.LONG, keyPrefix = 'query') {
  return unstable_cache(
    async (...args) => {
      await mongooseConnect();
      return await queryFn(...args);
    },
    [`${keyPrefix}-${queryFn.name}`],
    {
      tags,
      revalidate
    }
  );
}

/**
 * Cached product queries
 */
export const cachedProductQueries = {
  // Get all products with pagination
  getProducts: createCachedQuery(
    async (filter = {}, page = 1, limit = 24) => {
      const { Product } = await import('../../models/Product');

      const skip = (page - 1) * limit;
      const [products, total] = await Promise.all([
        Product.find(filter)
          .skip(skip)
          .limit(Number(limit))
          .populate('category', 'name')
          .populate('subcategory', 'name')
          .sort({ createdAt: -1 })
          .lean(),
        Product.countDocuments(filter)
      ]);

      return {
        products: products.map(product => ({
          ...product,
          _id: product._id.toString(),
          category: product.category ? {
            ...product.category,
            _id: product.category._id.toString()
          } : null,
          subcategory: product.subcategory ? {
            ...product.subcategory,
            _id: product.subcategory._id.toString()
          } : null
        })),
        pagination: {
          currentPage: Number(page),
          perPage: Number(limit),
          totalItems: total,
          totalPages: Math.ceil(total / limit)
        }
      };
    },
    [CACHE_TAGS.PRODUCTS],
    CACHE_DURATIONS.LONG,
    'products'
  ),

  // Get single product by slug
  getProductBySlug: createCachedQuery(
    async (slug) => {
      const { Product } = await import('../../models/Product');

      const product = await Product.findOne({ slug })
        .populate('category', 'name')
        .populate('subcategory', 'name')
        .lean();

      if (!product) return null;

      return {
        ...product,
        _id: product._id.toString(),
        category: product.category ? {
          ...product.category,
          _id: product.category._id.toString()
        } : null,
        subcategory: product.subcategory ? {
          ...product.subcategory,
          _id: product.subcategory._id.toString()
        } : null
      };
    },
    [CACHE_TAGS.PRODUCTS],
    CACHE_DURATIONS.VERY_LONG,
    'product-slug'
  )
};

/**
 * Cached alkohol queries
 */
export const cachedAlkoholQueries = {
  // Get all alkohols with pagination
  getAlkohols: createCachedQuery(
    async (filter = {}, page = 1, limit = 24) => {
      const { Alkohol } = await import('../../models/Alkohol');

      const skip = (page - 1) * limit;
      const [alkohols, total] = await Promise.all([
        Alkohol.find(filter)
          .skip(skip)
          .limit(Number(limit))
          .populate('category', 'name slug')
          .populate('subcategory', 'name slug')
          .sort({ createdAt: -1 })
          .lean(),
        Alkohol.countDocuments(filter)
      ]);

      return {
        alkohols: alkohols.map(alkohol => ({
          ...alkohol,
          _id: alkohol._id.toString(),
          category: alkohol.category ? {
            ...alkohol.category,
            _id: alkohol.category._id.toString()
          } : null,
          subcategory: alkohol.subcategory ? {
            ...alkohol.subcategory,
            _id: alkohol.subcategory._id.toString()
          } : null
        })),
        pagination: {
          currentPage: Number(page),
          perPage: Number(limit),
          totalItems: total,
          totalPages: Math.ceil(total / limit)
        }
      };
    },
    [CACHE_TAGS.ALKOHOLS],
    CACHE_DURATIONS.LONG,
    'alkohols'
  ),

  // Get single alkohol by slug
  getAlkoholBySlug: createCachedQuery(
    async (slug) => {
      const { Alkohol } = await import('../../models/Alkohol');

      const alkohol = await Alkohol.findOne({ slug })
        .populate('category', 'name slug')
        .populate('subcategory', 'name slug')
        .lean();

      if (!alkohol) return null;

      return {
        ...alkohol,
        _id: alkohol._id.toString(),
        category: alkohol.category ? {
          ...alkohol.category,
          _id: alkohol.category._id.toString()
        } : null,
        subcategory: alkohol.subcategory ? {
          ...alkohol.subcategory,
          _id: alkohol.subcategory._id.toString()
        } : null
      };
    },
    [CACHE_TAGS.ALKOHOLS],
    CACHE_DURATIONS.VERY_LONG,
    'alkohol-slug'
  ),

  // Get alkohols by subcategory
  getAlkoholsBySubcategory: createCachedQuery(
    async () => {
      const { Alkohol } = await import('../../models/Alkohol');

      const subcategories = await Alkohol.distinct("subcategory");
      const alkoholsBySubcategory = {};

      await Promise.all(
        subcategories.map(async (subId) => {
          const subAlkohols = await Alkohol.find({ subcategory: subId })
            .limit(24)
            .populate("category", "name")
            .populate("subcategory", "name")
            .lean();

          alkoholsBySubcategory[subId] = subAlkohols.map(alkohol => ({
            ...alkohol,
            _id: alkohol._id.toString(),
            category: alkohol.category ? {
              ...alkohol.category,
              _id: alkohol.category._id.toString()
            } : null,
            subcategory: alkohol.subcategory ? {
              ...alkohol.subcategory,
              _id: alkohol.subcategory._id.toString()
            } : null
          }));
        })
      );

      return { alkoholsBySubcategory };
    },
    [CACHE_TAGS.ALKOHOLS, CACHE_TAGS.SUBCATEGORIES],
    CACHE_DURATIONS.LONG,
    'alkohols-by-subcategory'
  )
};

/**
 * Cached category and subcategory queries
 */
export const cachedCategoryQueries = {
  // Get subcategory by slug
  getSubcategoryBySlug: createCachedQuery(
    async (slug) => {
      const { Subcategory } = await import('../../models/Subcategory');

      const subcategory = await Subcategory.findOne({ slug }).lean();

      if (!subcategory) return null;

      return {
        ...subcategory,
        _id: subcategory._id.toString()
      };
    },
    [CACHE_TAGS.SUBCATEGORIES],
    CACHE_DURATIONS.VERY_LONG,
    'subcategory-slug'
  ),

  // Get all categories
  getCategories: createCachedQuery(
    async () => {
      const { Category } = await import('../../models/Category');

      const categories = await Category.find({}).lean();

      return categories.map(category => ({
        ...category,
        _id: category._id.toString()
      }));
    },
    [CACHE_TAGS.CATEGORIES],
    CACHE_DURATIONS.VERY_LONG,
    'categories'
  ),

  // Get all subcategories
  getSubcategories: createCachedQuery(
    async () => {
      const { Subcategory } = await import('../../models/Subcategory');

      const subcategories = await Subcategory.find({}).lean();

      return subcategories.map(subcategory => ({
        ...subcategory,
        _id: subcategory._id.toString()
      }));
    },
    [CACHE_TAGS.SUBCATEGORIES],
    CACHE_DURATIONS.VERY_LONG,
    'subcategories'
  )
};

/**
 * Helper function to create cache key from parameters
 */
export function createCacheKey(prefix, params) {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {});

  return `${prefix}:${JSON.stringify(sortedParams)}`;
}

/**
 * Manual cache revalidation (for use in admin panels or webhooks)
 */
export async function revalidateCache(tags = [CACHE_TAGS.ALL]) {
  const { revalidateTag } = await import('next/cache');

  for (const tag of tags) {
    revalidateTag(tag);
  }
}
