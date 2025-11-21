import { Product } from "../../models/Product";
import { Alkohol } from "../../models/Alkohol";
import { mongooseConnect } from "../../lib/mongoose";
import zlib from "zlib";

// Улучшенный server-side кэш
let cachedData = null;
let cacheTimestamp = null;
let compressedCache = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10 минут

// Минификация данных - убираем ненужные поля для первоначальной загрузки
function minifyProduct(product) {
  return {
    _id: product._id.toString(),
    title: product.title,
    name: product.name,
    description: product.description
      ? product.description.substring(0, 150)
      : "", // Обрезаем описание
    price: product.price,
    images: product.images ? product.images.slice(0, 2) : [], // Максимум 2 изображения
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
  };
}

function minifyAlkohol(alkohol) {
  return {
    _id: alkohol._id.toString(),
    name: alkohol.name,
    description: alkohol.description
      ? alkohol.description.substring(0, 100)
      : "",
    price: alkohol.price,
    images: alkohol.images ? alkohol.images.slice(0, 2) : [],
    slug: alkohol.slug,
    region: alkohol.region,
    color: alkohol.color,
    degree: alkohol.degree,
    volume: alkohol.volume,
    isAlcoholic: alkohol.isAlcoholic,
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
  };
}

// Сжатие данных
function compressData(data) {
  const jsonString = JSON.stringify(data);
  return zlib.gzipSync(jsonString);
}

function decompressData(compressedData) {
  const decompressed = zlib.gunzipSync(compressedData);
  return JSON.parse(decompressed.toString());
}

export default async function handler(req, res) {
  const { method, query } = req;
  const { mode = "full", priority = "all" } = query;

  // Только GET запросы
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Поддержка gzip сжатия
  const acceptsGzip = req.headers["accept-encoding"]?.includes("gzip");

  // Оптимальные cache headers
  res.setHeader(
    "Cache-Control",
    "public, max-age=600, stale-while-revalidate=3600",
  );
  res.setHeader("CDN-Cache-Control", "public, max-age=3600");
  res.setHeader(
    "Vercel-CDN-Cache-Control",
    "public, max-age=3600, stale-while-revalidate=7200",
  );

  if (acceptsGzip) {
    res.setHeader("Content-Encoding", "gzip");
  }

  try {
    const now = Date.now();

    // Проверяем кэш
    if (cachedData && cacheTimestamp && now - cacheTimestamp < CACHE_DURATION) {
      if (acceptsGzip && compressedCache) {
        res.setHeader("Content-Type", "application/json");
        return res.end(compressedCache);
      }

      return res.status(200).json(cachedData);
    }
    await mongooseConnect();

    let result;

    // Режим priority='menu' - сначала только продукты меню
    if (priority === "menu") {
      const products = await Product.find({})
        .populate("category", "name slug")
        .populate("subcategory", "name slug")
        .lean()
        .exec();

      result = {
        products: products.map(minifyProduct),
        alkohols: [], // Пустой массив, напитки загрузятся отдельно
        stats: {
          totalProducts: products.length,
          totalAlkohols: 0,
          totalItems: products.length,
          loadedAt: new Date().toISOString(),
          mode: "menu-priority",
        },
        success: true,
      };
    }
    // Режим priority='drinks' - только напитки
    else if (priority === "drinks") {
      const alkohols = await Alkohol.find({})
        .populate("category", "name slug")
        .populate("subcategory", "name slug")
        .lean()
        .exec();

      result = {
        products: [],
        alkohols: alkohols.map(minifyAlkohol),
        stats: {
          totalProducts: 0,
          totalAlkohols: alkohols.length,
          totalItems: alkohols.length,
          loadedAt: new Date().toISOString(),
          mode: "drinks-only",
        },
        success: true,
      };
    }
    // Режим 'all' - все товары (по умолчанию)
    else {
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

      const minifiedProducts = products.map(minifyProduct);
      const minifiedAlkohols = alkohols.map(minifyAlkohol);

      result = {
        products: minifiedProducts,
        alkohols: minifiedAlkohols,
        stats: {
          totalProducts: minifiedProducts.length,
          totalAlkohols: minifiedAlkohols.length,
          totalItems: minifiedProducts.length + minifiedAlkohols.length,
          loadedAt: new Date().toISOString(),
          mode: "full",
          compressionSavings:
            Math.round(
              (products.length + alkohols.length) * 0.4, // Примерная экономия 40%
            ) + " fields removed",
        },
        success: true,
      };
    }

    // Кэшируем результат
    cachedData = result;
    cacheTimestamp = now;

    // Создаем сжатую версию для gzip запросов
    if (acceptsGzip) {
      compressedCache = compressData(result);
      res.setHeader("Content-Type", "application/json");
      res.setHeader("X-Compression", "gzip");
      res.setHeader("X-Original-Size", JSON.stringify(result).length);
      res.setHeader("X-Compressed-Size", compressedCache.length);

      return res.end(compressedCache);
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error loading optimized products:", error);

    // Если есть кэшированные данные, возвращаем их даже при ошибке
    if (cachedData) {
      if (acceptsGzip && compressedCache) {
        res.setHeader("Content-Type", "application/json");
        res.setHeader("X-Fallback", "cached-compressed");
        return res.end(compressedCache);
      }

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
