import { useEffect } from 'react';
import useAllProductsStore from '../store/useAllProductsStore';

/**
 * Основной хук для работы с all-products данными
 * @param {Object} options - опции
 * @param {boolean} options.autoInitialize - автоматическая инициализация при монтировании
 * @param {boolean} options.refreshIfStale - обновлять данные если они устарели
 * @param {number} options.maxAge - максимальный возраст данных в мс
 * @returns {Object} объект с данными и методами
 */
export function useAllProducts(options = {}) {
  const {
    autoInitialize = true,
    refreshIfStale = true,
    maxAge = 10 * 60 * 1000, // 10 минут
  } = options;

  const {
    allProductsData,
    isLoading,
    isInitialized,
    error,
    categories,
    subcategories,
    allItems,
    products,
    alkohols,
    fetchAllProducts,
    initialize,
    refresh,
    refreshIfStale: storeRefreshIfStale,
    isReady,
    getStats,
    clearData,
  } = useAllProductsStore();

  // Автоматическая инициализация
  useEffect(() => {
    if (autoInitialize && !isInitialized) {
      initialize();
    }
  }, [autoInitialize, isInitialized, initialize]);

  // Обновление устаревших данных
  useEffect(() => {
    if (refreshIfStale && isInitialized && isReady()) {
      storeRefreshIfStale(maxAge);
    }
  }, [refreshIfStale, isInitialized, maxAge, storeRefreshIfStale, isReady]);

  return {
    // Данные
    allProductsData,
    categories,
    subcategories,
    allItems,
    products,
    alkohols,

    // Состояние
    isLoading,
    isInitialized,
    isReady: isReady(),
    error,

    // Статистика
    stats: getStats(),

    // Методы
    fetchAllProducts,
    refresh,
    clearData,
  };
}

/**
 * Хук для работы с данными конкретной подкатегории
 * @param {string} subcategoryId - ID подкатегории
 * @param {Object} options - опции фильтрации и пагинации
 * @returns {Object} объект с отфильтрованными данными
 */
export function useSubcategoryProducts(subcategoryId, options = {}) {
  const {
    searchTerm = '',
    sortField = 'name',
    sortDirection = 'asc',
    page = 1,
    limit = 12,
    locale = 'ru',
  } = options;

  const {
    getItemsBySubcategory,
    searchInSubcategory,
    isReady,
    isLoading,
  } = useAllProductsStore();

  // Автоматическая инициализация
  const { isInitialized } = useAllProducts();

  // Получаем данные для подкатегории
  const subcategoryData = subcategoryId && isReady()
    ? getItemsBySubcategory(subcategoryId, {
        searchTerm,
        sortField,
        sortDirection,
        page,
        limit,
        locale,
      })
    : {
        items: [],
        pagination: {
          currentPage: 1,
          perPage: limit,
          totalItems: 0,
          totalPages: 0,
        }
      };

  // Функция для поиска в текущей подкатегории
  const performSearch = (term) => {
    if (!subcategoryId || !isReady()) return [];
    return searchInSubcategory(subcategoryId, term, locale);
  };

  return {
    // Данные
    items: subcategoryData.items,
    pagination: subcategoryData.pagination,

    // Состояние
    isLoading: isLoading || !isInitialized,
    isReady: isReady() && isInitialized,

    // Методы
    search: performSearch,

    // Мета-информация
    subcategoryId,
    hasItems: subcategoryData.items.length > 0,
    totalItems: subcategoryData.pagination.totalItems,
  };
}

/**
 * Хук для поиска товаров
 * @param {string} searchTerm - поисковый запрос
 * @param {Object} options - опции поиска
 * @returns {Object} результаты поиска
 */
export function useProductSearch(searchTerm, options = {}) {
  const {
    subcategoryId = null,
    locale = 'ru',
    sortField = 'name',
    sortDirection = 'asc',
    limit = 50,
  } = options;

  const {
    searchInSubcategory,
    getAllItems,
    isReady,
    isLoading,
  } = useAllProductsStore();

  const { isInitialized } = useAllProducts();

  // Выполняем поиск
  const searchResults = (() => {
    if (!searchTerm || !isReady()) return [];

    let items;

    if (subcategoryId) {
      // Поиск в конкретной подкатегории
      items = searchInSubcategory(subcategoryId, searchTerm, locale);
    } else {
      // Глобальный поиск
      const allItems = getAllItems();
      items = allItems.filter(item => {
        const term = searchTerm.toLowerCase().trim();

        if (item.isDrink && item.name) {
          return item.name.toLowerCase().includes(term);
        }

        if (!item.isDrink && item.title) {
          const localizedTitle = typeof item.title === 'object'
            ? (item.title[locale] || item.title.ru || '')
            : item.title;
          return localizedTitle.toLowerCase().includes(term);
        }

        return false;
      });
    }

    // Сортируем результаты
    return items
      .sort((a, b) => {
        if (sortField === 'price') {
          const priceA = parseFloat(a.price) || 0;
          const priceB = parseFloat(b.price) || 0;
          return sortDirection === 'asc' ? priceA - priceB : priceB - priceA;
        } else {
          let nameA, nameB;

          if (a.isDrink) {
            nameA = a.name || '';
          } else {
            nameA = typeof a.title === 'object'
              ? (a.title[locale] || a.title.ru || '')
              : (a.title || '');
          }

          if (b.isDrink) {
            nameB = b.name || '';
          } else {
            nameB = typeof b.title === 'object'
              ? (b.title[locale] || b.title.ru || '')
              : (b.title || '');
          }

          return sortDirection === 'asc'
            ? nameA.localeCompare(nameB, locale)
            : nameB.localeCompare(nameA, locale);
        }
      })
      .slice(0, limit);
  })();

  return {
    // Результаты
    results: searchResults,
    count: searchResults.length,

    // Состояние
    isLoading: isLoading || !isInitialized,
    isReady: isReady() && isInitialized,
    hasResults: searchResults.length > 0,

    // Параметры поиска
    searchTerm,
    subcategoryId,
  };
}

/**
 * Хук для получения товара по slug
 * @param {string} slug - slug товара
 * @returns {Object} данные товара
 */
export function useProductBySlug(slug) {
  const { getItemBySlug, isReady, isLoading } = useAllProductsStore();
  const { isInitialized } = useAllProducts();

  const item = slug && isReady() ? getItemBySlug(slug) : null;

  return {
    // Данные
    item,

    // Состояние
    isLoading: isLoading || !isInitialized,
    isReady: isReady() && isInitialized,
    found: !!item,

    // Мета-информация
    slug,
    type: item?.isDrink ? 'alkohol' : 'product',
  };
}

/**
 * Хук для получения категорий и подкатегорий
 * @param {string} categoryId - ID категории для фильтрации подкатегорий
 * @returns {Object} категории и подкатегории
 */
export function useCategoriesAndSubcategories(categoryId = null) {
  const {
    getCategories,
    getSubcategories,
    isReady,
    isLoading,
  } = useAllProductsStore();

  const { isInitialized } = useAllProducts();

  const categories = isReady() ? getCategories() : [];
  const subcategories = isReady() ? getSubcategories(categoryId) : [];

  return {
    // Данные
    categories,
    subcategories,

    // Состояние
    isLoading: isLoading || !isInitialized,
    isReady: isReady() && isInitialized,

    // Количество
    categoriesCount: categories.length,
    subcategoriesCount: subcategories.length,
  };
}

export default useAllProducts;
