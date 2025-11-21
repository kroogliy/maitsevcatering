import { Product } from "../../models/Product";
import { Alkohol } from "../../models/Alkohol";
import { Category } from "../../models/Category";
import { Subcategory } from "../../models/Subcategory";
import { mongooseConnect } from "../../lib/mongoose";

// Server-side кэш для всех товаров
let cachedData = null;
let cacheTimestamp = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 минут

export default async function handler(req, res) {
  const { method } = req;

  // Только GET запросы
  if (method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Оптимальные cache headers для e-commerce
  res.setHeader(
    "Cache-Control",
    "public, max-age=600, stale-while-revalidate=3600",
  );
  res.setHeader("CDN-Cache-Control", "public, max-age=3600");
  res.setHeader(
    "Vercel-CDN-Cache-Control",
    "public, max-age=3600, stale-while-revalidate=7200",
  );

  try {
    // Проверяем server-side кэш
    const now = Date.now();
    if (cachedData && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION) {
      return res.status(200).json(cachedData);
    }
    await mongooseConnect();

    // Загружаем ВСЕ товары параллельно
    const [products, alkohols] = await Promise.all([
      Product.find({})
        .populate("category", "name slug")
        .populate("subcategory", "name slug")
        .lean()
        .exec(),

      Alkohol.find({})
        .populate("category", "name slug")
        .populate("subcategory", "name slug")
        .lean()
        .exec(),
    ]);

    // Трансформируем продукты
    const transformedProducts = products.map((product) => ({
      _id: product._id.toString(),
      title: product.title,
      name: product.name,
      description: product.description,
      price: product.price,
      images: product.images,
      slug: product.slug,
      category: product.category
        ? {
            _id: product.category._id.toString(),
            name: product.category.name,
            slug: product.category.slug,
          }
        : null,
      subcategory: product.subcategory
        ? {
            _id: product.subcategory._id.toString(),
            name: product.subcategory.name,
            slug: product.subcategory.slug,
          }
        : null,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    }));

    // Трансформируем алкоголь
    const transformedAlkohols = alkohols.map((alkohol) => ({
      _id: alkohol._id.toString(),
      name: alkohol.name,
      description: alkohol.description,
      price: alkohol.price,
      images: alkohol.images,
      slug: alkohol.slug,
      region: alkohol.region,
      color: alkohol.color,
      degree: alkohol.degree,
      volume: alkohol.volume,
      isAlcoholic: alkohol.isAlcoholic,
      supplier: alkohol.supplier,
      eanCode: alkohol.eanCode,
      category: alkohol.category
        ? {
            _id: alkohol.category._id.toString(),
            name: alkohol.category.name,
            slug: alkohol.category.slug,
          }
        : null,
      subcategory: alkohol.subcategory
        ? {
            _id: alkohol.subcategory._id.toString(),
            name: alkohol.subcategory.name,
            slug: alkohol.subcategory.slug,
          }
        : null,
      createdAt: alkohol.createdAt,
      updatedAt: alkohol.updatedAt,
    }));

    // Формируем результат
    const result = {
      products: transformedProducts,
      alkohols: transformedAlkohols,
      stats: {
        totalProducts: transformedProducts.length,
        totalAlkohols: transformedAlkohols.length,
        totalItems: transformedProducts.length + transformedAlkohols.length,
        loadedAt: new Date().toISOString(),
      },
      success: true,
    };

    // Сохраняем в server-side кэш
    cachedData = result;
    cacheTimestamp = now;

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error loading all products:", error);

    // Если есть кэшированные данные, возвращаем их даже при ошибке
    if (cachedData) {
      return res.status(200).json({
        ...cachedData,
        warning: "Returned cached data due to database error",
      });
    }

    return res.status(500).json({
      error: "Failed to load products",
      message: error.message,
      success: false,
    });
  }
}
