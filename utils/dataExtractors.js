// Утилиты для извлечения данных из all-products API ответа

/**
 * Извлекает уникальные категории из данных all-products
 * @param {Object} allProductsData - данные от API all-products
 * @returns {Array} массив уникальных категорий
 */
export function extractCategoriesFromAllProducts(allProductsData) {
  if (!allProductsData) return [];

  const categoriesMap = new Map();

  // Извлекаем категории из продуктов
  if (allProductsData.products) {
    allProductsData.products.forEach(product => {
      if (product.category && product.category._id) {
        categoriesMap.set(product.category._id, {
          _id: product.category._id,
          name: product.category.name,
          slug: product.category.slug,
        });
      }
    });
  }

  // Извлекаем категории из напитков
  if (allProductsData.alkohols) {
    allProductsData.alkohols.forEach(alkohol => {
      if (alkohol.category && alkohol.category._id) {
        categoriesMap.set(alkohol.category._id, {
          _id: alkohol.category._id,
          name: alkohol.category.name,
          slug: alkohol.category.slug,
        });
      }
    });
  }

  return Array.from(categoriesMap.values());
}

/**
 * Извлекает уникальные подкатегории из данных all-products
 * @param {Object} allProductsData - данные от API all-products
 * @returns {Array} массив уникальных подкатегорий
 */
export function extractSubcategoriesFromAllProducts(allProductsData) {
  if (!allProductsData) return [];

  const subcategoriesMap = new Map();

  // Извлекаем подкатегории из продуктов
  if (allProductsData.products) {
    allProductsData.products.forEach(product => {
      if (product.subcategory && product.subcategory._id) {
        subcategoriesMap.set(product.subcategory._id, {
          _id: product.subcategory._id,
          name: product.subcategory.name,
          slug: product.subcategory.slug,
          parentCategory: product.category?._id || null,
        });
      }
    });
  }

  // Извлекаем подкатегории из напитков
  if (allProductsData.alkohols) {
    allProductsData.alkohols.forEach(alkohol => {
      if (alkohol.subcategory && alkohol.subcategory._id) {
        subcategoriesMap.set(alkohol.subcategory._id, {
          _id: alkohol.subcategory._id,
          name: alkohol.subcategory.name,
          slug: alkohol.subcategory.slug,
          parentCategory: alkohol.category?._id || null,
        });
      }
    });
  }

  return Array.from(subcategoriesMap.values());
}

/**
 * Получает все продукты (не напитки) из данных all-products
 * @param {Object} allProductsData - данные от API all-products
 * @returns {Array} массив продуктов с добавленными полями
 */
export function extractProductsFromAllProducts(allProductsData) {
  if (!allProductsData?.products) return [];

  return allProductsData.products.map(product => ({
    ...product,
    categoryId: product.category?._id || null,
    subcategoryId: product.subcategory?._id || null,
    isDrink: false,
  }));
}

/**
 * Получает все напитки из данных all-products
 * @param {Object} allProductsData - данные от API all-products
 * @returns {Array} массив напитков с добавленными полями
 */
export function extractAlkoholsFromAllProducts(allProductsData) {
  if (!allProductsData?.alkohols) return [];

  return allProductsData.alkohols.map(alkohol => ({
    ...alkohol,
    categoryId: alkohol.category?._id || null,
    subcategoryId: alkohol.subcategory?._id || null,
    isDrink: true,
  }));
}

/**
 * Получает все товары (продукты + напитки) из данных all-products
 * @param {Object} allProductsData - данные от API all-products
 * @returns {Array} объединенный массив всех товаров
 */
export function extractAllItemsFromAllProducts(allProductsData) {
  const products = extractProductsFromAllProducts(allProductsData);
  const alkohols = extractAlkoholsFromAllProducts(allProductsData);

  return [...products, ...alkohols];
}

/**
 * Фильтрует товары по подкатегории
 * @param {Array} items - массив товаров
 * @param {string} subcategoryId - ID подкатегории
 * @returns {Array} отфильтрованные товары
 */
export function filterItemsBySubcategory(items, subcategoryId) {
  if (!subcategoryId || !Array.isArray(items)) return [];

  return items.filter(item => item.subcategoryId === subcategoryId);
}

/**
 * Фильтрует товары по категории
 * @param {Array} items - массив товаров
 * @param {string} categoryId - ID категории
 * @returns {Array} отфильтрованные товары
 */
export function filterItemsByCategory(items, categoryId) {
  if (!categoryId || !Array.isArray(items)) return [];

  return items.filter(item => item.categoryId === categoryId);
}

/**
 * Поиск товаров по названию
 * @param {Array} items - массив товаров
 * @param {string} searchTerm - поисковый запрос
 * @param {string} locale - локаль для поиска в title
 * @returns {Array} найденные товары
 */
export function searchItems(items, searchTerm, locale = 'ru') {
  if (!searchTerm || !Array.isArray(items)) return items;

  const term = searchTerm.toLowerCase().trim();

  return items.filter(item => {
    // Для напитков ищем в поле name
    if (item.isDrink && item.name) {
      return item.name.toLowerCase().includes(term);
    }

    // Для продуктов ищем в локализованном title
    if (!item.isDrink && item.title) {
      const localizedTitle = typeof item.title === 'object'
        ? (item.title[locale] || item.title.ru || '')
        : item.title;
      return localizedTitle.toLowerCase().includes(term);
    }

    return false;
  });
}

/**
 * Сортировка товаров
 * @param {Array} items - массив товаров
 * @param {string} field - поле для сортировки ('name' или 'price')
 * @param {string} direction - направление сортировки ('asc' или 'desc')
 * @param {string} locale - локаль для сортировки названий
 * @returns {Array} отсортированные товары
 */
export function sortItems(items, field = 'name', direction = 'asc', locale = 'ru') {
  if (!Array.isArray(items)) return [];

  return [...items].sort((a, b) => {
    let valueA, valueB;

    if (field === 'price') {
      valueA = parseFloat(a.price) || 0;
      valueB = parseFloat(b.price) || 0;

      return direction === 'asc' ? valueA - valueB : valueB - valueA;
    } else {
      // Для названий учитываем тип товара
      if (a.isDrink) {
        valueA = a.name || '';
      } else {
        valueA = typeof a.title === 'object'
          ? (a.title[locale] || a.title.ru || '')
          : (a.title || '');
      }

      if (b.isDrink) {
        valueB = b.name || '';
      } else {
        valueB = typeof b.title === 'object'
          ? (b.title[locale] || b.title.ru || '')
          : (b.title || '');
      }

      return direction === 'asc'
        ? valueA.localeCompare(valueB, locale)
        : valueB.localeCompare(valueA, locale);
    }
  });
}

/**
 * Пагинация товаров
 * @param {Array} items - массив товаров
 * @param {number} page - номер страницы (начиная с 1)
 * @param {number} limit - количество товаров на странице
 * @returns {Object} объект с товарами и информацией о пагинации
 */
export function paginateItems(items, page = 1, limit = 12) {
  if (!Array.isArray(items)) {
    return {
      items: [],
      pagination: {
        currentPage: 1,
        perPage: limit,
        totalItems: 0,
        totalPages: 0,
      }
    };
  }

  const totalItems = items.length;
  const totalPages = Math.ceil(totalItems / limit);
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    items: items.slice(startIndex, endIndex),
    pagination: {
      currentPage,
      perPage: limit,
      totalItems,
      totalPages,
    }
  };
}

/**
 * Группировка напитков по виртуальным подкатегориям (алкогольные/безалкогольные)
 * @param {Array} alkohols - массив напитков
 * @returns {Object} объект с группированными напитками
 */
export function groupAlkoholsByType(alkohols) {
  if (!Array.isArray(alkohols)) {
    return {
      alcoholic: [],
      nonAlcoholic: []
    };
  }

  const alcoholic = alkohols.filter(alkohol =>
    alkohol.isAlcoholic || (alkohol.degree && alkohol.degree > 0)
  );

  const nonAlcoholic = alkohols.filter(alkohol =>
    !alkohol.isAlcoholic && (!alkohol.degree || alkohol.degree === 0)
  );

  return {
    alcoholic,
    nonAlcoholic
  };
}

/**
 * Получение товара по slug
 * @param {Object} allProductsData - данные от API all-products
 * @param {string} slug - slug товара
 * @returns {Object|null} найденный товар или null
 */
export function getItemBySlug(allProductsData, slug) {
  if (!allProductsData || !slug) return null;

  // Ищем среди продуктов
  if (allProductsData.products) {
    const product = allProductsData.products.find(p => p.slug === slug);
    if (product) {
      return {
        ...product,
        categoryId: product.category?._id || null,
        subcategoryId: product.subcategory?._id || null,
        isDrink: false,
      };
    }
  }

  // Ищем среди напитков
  if (allProductsData.alkohols) {
    const alkohol = allProductsData.alkohols.find(a => a.slug === slug);
    if (alkohol) {
      return {
        ...alkohol,
        categoryId: alkohol.category?._id || null,
        subcategoryId: alkohol.subcategory?._id || null,
        isDrink: true,
      };
    }
  }

  return null;
}

/**
 * Получение статистики по данным
 * @param {Object} allProductsData - данные от API all-products
 * @returns {Object} объект со статистикой
 */
export function getDataStats(allProductsData) {
  if (!allProductsData) {
    return {
      totalProducts: 0,
      totalAlkohols: 0,
      totalItems: 0,
      totalCategories: 0,
      totalSubcategories: 0,
    };
  }

  const products = allProductsData.products || [];
  const alkohols = allProductsData.alkohols || [];
  const categories = extractCategoriesFromAllProducts(allProductsData);
  const subcategories = extractSubcategoriesFromAllProducts(allProductsData);

  return {
    totalProducts: products.length,
    totalAlkohols: alkohols.length,
    totalItems: products.length + alkohols.length,
    totalCategories: categories.length,
    totalSubcategories: subcategories.length,
  };
}
