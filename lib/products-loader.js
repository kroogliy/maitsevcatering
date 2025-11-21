import { Product } from "../models/Product";
import { Alkohol } from "../models/Alkohol";
import { Category } from "../models/Category";
import { Subcategory } from "../models/Subcategory";
import { mongooseConnect } from "./mongoose";
import { getLocalizedText } from "./localization";

// Server-side кэш для Next.js ISR
let serverCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 минут

/**
 * Загружает все товары на сервере с кэшированием для ISR
 * Используется в getStaticProps/getServerSideProps
 */
export async function loadAllProducts(options = {}) {
  const {
    includeProducts = true,
    includeAlkohols = true,
    forceRefresh = false,
  } = options;

  const cacheKey = `all-products-${includeProducts}-${includeAlkohols}`;
  const now = Date.now();

  // Проверяем server-side кэш
  if (!forceRefresh && serverCache.has(cacheKey)) {
    const cached = serverCache.get(cacheKey);
    if (now - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }
  }

  try {
    await mongooseConnect();

    const promises = [];

    // Загружаем продукты
    if (includeProducts) {
      promises.push(
        Product.find({})
          .populate("category", "name slug")
          .populate("subcategory", "name slug")
          .lean()
          .exec(),
      );
    } else {
      promises.push(Promise.resolve([]));
    }

    // Загружаем алкоголь
    if (includeAlkohols) {
      promises.push(
        Alkohol.find({})
          .populate("category", "name slug")
          .populate("subcategory", "name slug")
          .lean()
          .exec(),
      );
    } else {
      promises.push(Promise.resolve([]));
    }

    const [products, alkohols] = await Promise.all(promises);

    // Трансформируем данные для фронтенда
    const transformedProducts = products.map(transformProduct);
    const transformedAlkohols = alkohols.map(transformAlkohol);

    const result = {
      products: transformedProducts,
      alkohols: transformedAlkohols,
      stats: {
        totalProducts: transformedProducts.length,
        totalAlkohols: transformedAlkohols.length,
        totalItems: transformedProducts.length + transformedAlkohols.length,
        loadedAt: new Date().toISOString(),
        cacheKey,
      },
      success: true,
    };

    // Сохраняем в server-side кэш
    serverCache.set(cacheKey, {
      data: result,
      timestamp: now,
    });

    // Очищаем старые записи кэша
    for (const [key, value] of serverCache.entries()) {
      if (now - value.timestamp > CACHE_DURATION * 2) {
        serverCache.delete(key);
      }
    }

    return result;
  } catch (error) {
    // Возвращаем кэшированные данные при ошибке
    if (serverCache.has(cacheKey)) {
      const cached = serverCache.get(cacheKey);
      return {
        ...cached.data,
        warning: "Returned stale data due to database error",
      };
    }

    throw error;
  }
}

/**
 * Фильтрует товары по slug'ам из предзагруженных данных
 */
export function filterProductsBySlug(products, slugs) {
  if (!Array.isArray(products) || !Array.isArray(slugs)) {
    return [];
  }

  return products.filter(
    (product) => product.slug && slugs.includes(product.slug),
  );
}

/**
 * Фильтрует алкоголь по slug'ам из предзагруженных данных
 */
export function filterAlkoholsBySlug(alkohols, slugs) {
  if (!Array.isArray(alkohols) || !Array.isArray(slugs)) {
    return [];
  }

  return alkohols.filter(
    (alkohol) => alkohol.slug && slugs.includes(alkohol.slug),
  );
}

/**
 * Трансформирует продукт для фронтенда
 */
function transformProduct(product) {
  return {
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
  };
}

/**
 * Трансформирует алкоголь для фронтенда
 */
function transformAlkohol(alkohol) {
  return {
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
  };
}

/**
 * Предзагружает данные для конкретной страницы
 */
export async function preloadPageData(pageType, options = {}) {
  switch (pageType) {
    case "homepage":
      // Для главной страницы нужны только конкретные товары
      const allData = await loadAllProducts();

      // Списки нужных товаров для главной страницы
      const sushiSlugs = [
        "tempura-with-eel",
        "tempura-with-salmon",
        "tempura-with-prawns",
        "roll-with-eel-and-shrimps",
        "roll-with-crab-and-prawns",
        "roll-vegan",
        "rainbow-roll",
        "philadelphia-with-salmon",
        "philadelphia-with-eel",
        "philadelphia-lux",
        "green-roll",
        "chicken-tempura-roll",
        "california-sun",
        "california",
        "baked-roll-with-shrimps",
        "baked-roll-with-salmon",
      ];

      const alkoholSlugs = [
        // Шампанское (4 шт)
        "gosset-celebris-extra-brut-champagne-75cl",
        "henriot-rose-brut-champagne-75cl",
        "laurent-perrier-cuvee-rose-magnum-150-cl",
        "billecart-salmon-brut-reserve-150-cl",
        // Коньяк (4 шт)
        "remy-martin-louis-xiii-40-0-7l-karbis",
        "briottet-cognac-vsop-40-grande-champagne-70-cl-02079",
        "monnet-vsop-40-0-7l-gb",
        "meukow-cognac-vsop-100cl",
        // Вино (4 шт)
        "rothschild-chateau-darmailhac-pauillac-ac-75cl",
        "tignanello-toscana-igt-75cl-2021",
        "merum-priorati-el-cel-priorat-75cl-2019",
        "torres-grans-muralles-75cl-2017",
        // Виски (4 шт)
        "macallan-15y-dbl-csk-70-cl-08469",
        "teerenpeli-aged-10-years-single-malt-43-50-cl-10598",
        "glenglassaugh-portsoy-49-1-0-7l",
        "bushmills-21-yo-70-kinkekarp",
      ];

      return {
        sushiProducts: filterProductsBySlug(allData.products, sushiSlugs),
        alkoholProducts: filterAlkoholsBySlug(allData.alkohols, alkoholSlugs),
        stats: allData.stats,
      };

    case "menu":
      // Для страницы меню нужны все товары
      return await loadAllProducts();

    case "category":
      // Для страницы категории можем фильтровать
      const categoryData = await loadAllProducts();
      const { categorySlug, subcategorySlug } = options;

      let filteredProducts = categoryData.products;
      if (categorySlug) {
        filteredProducts = filteredProducts.filter(
          (p) => p.category?.slug === categorySlug,
        );
      }
      if (subcategorySlug) {
        filteredProducts = filteredProducts.filter(
          (p) => p.subcategory?.slug === subcategorySlug,
        );
      }

      return {
        ...categoryData,
        products: filteredProducts,
      };

    default:
      return await loadAllProducts();
  }
}
