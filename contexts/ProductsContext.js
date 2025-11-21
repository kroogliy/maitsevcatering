"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import useAllProductsStore from "../store/useAllProductsStore";
import {
  extractCategoriesFromAllProducts,
  extractSubcategoriesFromAllProducts,
  extractProductsFromAllProducts,
  extractAlkoholsFromAllProducts,
  searchItems,
  sortItems,
  filterItemsBySubcategory,
} from "../utils/dataExtractors";

const ProductsContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error("useProducts must be used within a ProductsProvider");
  }
  return context;
};

export const ProductsProvider = ({ children }) => {
  // Используем новый Zustand стор
  const {
    allProductsData,
    isLoading,
    isInitialized,
    error: storeError,
    categories,
    subcategories,
    allItems,
    products: storeProducts,
    alkohols: storeAlkohols,
    fetchAllProducts,
    initialize,
    refresh,
    isReady,
    getItemsBySubcategory,
    searchInSubcategory,
    getItemBySlug,
    getStats,
  } = useAllProductsStore();

  // Сохраняем старые state для обратной совместимости
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Синхронизируем состояния
  useEffect(() => {
    setLoading(isLoading);
    setLoaded(isInitialized && isReady());
    setError(storeError);
  }, [isLoading, isInitialized, storeError, isReady]);

  // Функция для загрузки всех товаров (обертка для совместимости)
  const loadAllProducts = async () => {
    try {
      await fetchAllProducts();
    } catch (err) {
      // Error loading products
    }
  };

  // Автоматическая инициализация убрана - теперь инициализация происходит только через HomePageClient
  // useEffect(() => {
  //   if (!isInitialized) {
  //     initialize();
  //   }
  // }, [isInitialized, initialize]);

  // Функции для фильтрации товаров из кэша (используем новый стор)
  const getProductsBySlug = useCallback(
    (slugs) => {
      if (!isReady()) return [];

      const products = extractProductsFromAllProducts(allProductsData);
      const filtered = products.filter((product) =>
        slugs.includes(product.slug),
      );
      // Сортируем по порядку в списке slugs
      return slugs
        .map((slug) => filtered.find((product) => product.slug === slug))
        .filter(Boolean);
    },
    [allProductsData, isReady],
  );

  const getAlkoholsBySlug = useCallback(
    (slugs) => {
      if (!isReady()) return [];

      const alkohols = extractAlkoholsFromAllProducts(allProductsData);
      const filtered = alkohols.filter((alkohol) =>
        slugs.includes(alkohol.slug),
      );
      // Сортируем по порядку в списке slugs
      return slugs
        .map((slug) => filtered.find((alkohol) => alkohol.slug === slug))
        .filter(Boolean);
    },
    [allProductsData, isReady],
  );

  const getProductsByCategory = useCallback(
    (categorySlug, subcategorySlug = null) => {
      if (!isReady()) return [];

      const products = extractProductsFromAllProducts(allProductsData);
      return products.filter((product) => {
        if (subcategorySlug) {
          return (
            product.category?.slug === categorySlug &&
            product.subcategory?.slug === subcategorySlug
          );
        }
        return product.category?.slug === categorySlug;
      });
    },
    [allProductsData, isReady],
  );

  const searchProducts = useCallback(
    (query, locale = "ru") => {
      if (!isReady()) return [];

      const products = extractProductsFromAllProducts(allProductsData);
      return searchItems(products, query, locale);
    },
    [allProductsData, isReady],
  );

  const searchAlkohols = useCallback(
    (query, locale = "ru") => {
      if (!isReady()) return [];

      const alkohols = extractAlkoholsFromAllProducts(allProductsData);
      return searchItems(alkohols, query, locale);
    },
    [allProductsData, isReady],
  );

  // Новые функции с использованием стора
  const getAllProducts = () => {
    return isReady() ? extractProductsFromAllProducts(allProductsData) : [];
  };

  const getAllAlkohols = () => {
    return isReady() ? extractAlkoholsFromAllProducts(allProductsData) : [];
  };

  const getAllCategories = () => {
    return isReady() ? extractCategoriesFromAllProducts(allProductsData) : [];
  };

  const getAllSubcategories = () => {
    return isReady()
      ? extractSubcategoriesFromAllProducts(allProductsData)
      : [];
  };

  const getItemsBySubcategorySlug = (subcategorySlug, options = {}) => {
    if (!isReady())
      return {
        items: [],
        pagination: {
          currentPage: 1,
          perPage: 12,
          totalItems: 0,
          totalPages: 0,
        },
      };

    const subcategory = subcategories.find(
      (sub) => sub.slug === subcategorySlug,
    );
    if (!subcategory)
      return {
        items: [],
        pagination: {
          currentPage: 1,
          perPage: 12,
          totalItems: 0,
          totalPages: 0,
        },
      };

    return getItemsBySubcategory(subcategory._id, options);
  };

  const searchInSubcategorySlug = (
    subcategorySlug,
    searchTerm,
    locale = "ru",
  ) => {
    if (!isReady()) return [];

    const subcategory = subcategories.find(
      (sub) => sub.slug === subcategorySlug,
    );
    if (!subcategory) return [];

    return searchInSubcategory(subcategory._id, searchTerm, locale);
  };

  // Получение локализованного текста
  const getLocalizedText = useCallback(
    (field, locale = "en", fallback = "") => {
      if (!field) return fallback;
      if (typeof field === "string") return field;
      if (typeof field === "object") {
        return (
          field[locale] ||
          field.en ||
          field.et ||
          field.ru ||
          Object.values(field)[0] ||
          fallback
        );
      }
      return fallback;
    },
    [],
  );

  const value = {
    // Состояние (для обратной совместимости)
    products: getAllProducts(),
    alkohols: getAllAlkohols(),
    loading,
    loaded,
    error,

    // Новые данные из стора
    allProductsData,
    categories: getAllCategories(),
    subcategories: getAllSubcategories(),
    allItems,

    // Функции (улучшенные)
    loadAllProducts,
    refresh,
    getProductsBySlug,
    getAlkoholsBySlug,
    getProductsByCategory,
    searchProducts,
    searchAlkohols,
    getLocalizedText,

    // Новые функции
    getAllProducts,
    getAllAlkohols,
    getAllCategories,
    getAllSubcategories,
    getItemsBySubcategorySlug,
    searchInSubcategorySlug,
    getItemBySlug,

    // Прямой доступ к функциям стора
    getItemsBySubcategory,
    searchInSubcategory,

    // Статистика
    stats: isReady()
      ? getStats()
      : {
          totalProducts: 0,
          totalAlkohols: 0,
          totalItems: 0,
          isReady: false,
        },
  };

  return (
    <ProductsContext.Provider value={value}>
      {children}
    </ProductsContext.Provider>
  );
};
