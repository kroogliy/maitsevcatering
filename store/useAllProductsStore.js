import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  extractCategoriesFromAllProducts,
  extractSubcategoriesFromAllProducts,
  extractAllItemsFromAllProducts,
  extractProductsFromAllProducts,
  extractAlkoholsFromAllProducts,
  filterItemsBySubcategory,
  searchItems,
  sortItems,
  paginateItems,
  getItemBySlug,
  getDataStats,
} from "../utils/dataExtractors";

const useAllProductsStore = create(
  persist(
    (set, get) => ({
      // Состояние данных
      allProductsData: null,
      isLoading: false,
      isInitialized: false,
      lastFetchTime: null,
      error: null,

      // Кэшированные извлеченные данные
      categories: [],
      subcategories: [],
      allItems: [],
      products: [],
      alkohols: [],

      // Действия
      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      // Основной метод для загрузки данных
      fetchAllProducts: async (force = false) => {
        const state = get();

        // Если данные уже загружены и не нужно принудительное обновление
        if (state.isInitialized && !force && state.allProductsData) {
          return state.allProductsData;
        }
        set({ isLoading: true, error: null });

        try {
          const response = await fetch("/api/all-products");

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (!data.success) {
            throw new Error(data.error || "Failed to fetch products");
          }

          // Обновляем основные данные
          set({
            allProductsData: data,
            lastFetchTime: Date.now(),
            isInitialized: true,
            error: null,
          });

          // Извлекаем и кэшируем производные данные
          get().updateDerivedData();

          return data;
        } catch (error) {
          set({
            error: error.message,
            isLoading: false,
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      // Обновление производных данных из allProductsData
      updateDerivedData: () => {
        const { allProductsData } = get();

        if (!allProductsData) return;

        const categories = extractCategoriesFromAllProducts(allProductsData);
        const subcategories =
          extractSubcategoriesFromAllProducts(allProductsData);
        const allItems = extractAllItemsFromAllProducts(allProductsData);
        const products = extractProductsFromAllProducts(allProductsData);
        const alkohols = extractAlkoholsFromAllProducts(allProductsData);

        set({
          categories,
          subcategories,
          allItems,
          products,
          alkohols,
        });
      },

      // Получение категорий
      getCategories: () => {
        const state = get();
        return state.categories;
      },

      // Получение подкатегорий
      getSubcategories: (categoryId = null) => {
        const state = get();

        if (!categoryId) {
          return state.subcategories;
        }

        return state.subcategories.filter(
          (sub) => sub.parentCategory === categoryId,
        );
      },

      // Получение всех товаров
      getAllItems: () => {
        const state = get();
        return state.allItems;
      },

      // Получение только продуктов (не напитков)
      getProducts: () => {
        const state = get();
        return state.products;
      },

      // Получение только напитков
      getAlkohols: () => {
        const state = get();
        return state.alkohols;
      },

      // Получение товаров по подкатегории с фильтрацией, поиском, сортировкой и пагинацией
      getItemsBySubcategory: (subcategoryId, options = {}) => {
        const {
          searchTerm = "",
          sortField = "name",
          sortDirection = "asc",
          page = 1,
          limit = 12,
          locale = "ru",
        } = options;

        const state = get();
        let items = filterItemsBySubcategory(state.allItems, subcategoryId);

        // Применяем поиск
        if (searchTerm) {
          items = searchItems(items, searchTerm, locale);
        }

        // Применяем сортировку
        items = sortItems(items, sortField, sortDirection, locale);

        // Применяем пагинацию
        return paginateItems(items, page, limit);
      },

      // Поиск товаров в конкретной подкатегории
      searchInSubcategory: (subcategoryId, searchTerm, locale = "ru") => {
        const state = get();
        const items = filterItemsBySubcategory(state.allItems, subcategoryId);
        return searchItems(items, searchTerm, locale);
      },

      // Получение товара по slug
      getItemBySlug: (slug) => {
        const { allProductsData } = get();
        return getItemBySlug(allProductsData, slug);
      },

      // Получение статистики
      getStats: () => {
        const { allProductsData } = get();
        return getDataStats(allProductsData);
      },

      // Проверка готовности данных
      isReady: () => {
        const state = get();
        return (
          state.isInitialized &&
          !state.isLoading &&
          state.allProductsData !== null
        );
      },

      // Очистка данных
      clearData: () => {
        set({
          allProductsData: null,
          isLoading: false,
          isInitialized: false,
          lastFetchTime: null,
          error: null,
          categories: [],
          subcategories: [],
          allItems: [],
          products: [],
          alkohols: [],
        });
      },

      // Инициализация (вызывается при старте приложения)
      initialize: async () => {
        const state = get();

        if (state.isInitialized) {
          // Если данные уже есть, просто обновляем производные данные
          state.updateDerivedData();
          return;
        }

        try {
          await state.fetchAllProducts();
        } catch (error) {
          // Failed to initialize all products store
        }
      },

      // Принудительное обновление данных
      refresh: async () => {
        const state = get();
        return await state.fetchAllProducts(true);
      },

      // Проверка актуальности данных
      isStale: (maxAge = 10 * 60 * 1000) => {
        // 10 минут по умолчанию
        const { lastFetchTime } = get();
        if (!lastFetchTime) return true;
        return Date.now() - lastFetchTime > maxAge;
      },

      // Обновление данных если они устарели
      refreshIfStale: async (maxAge = 10 * 60 * 1000) => {
        const state = get();

        if (state.isStale(maxAge)) {
          return await state.fetchAllProducts(true);
        }

        return state.allProductsData;
      },
    }),
    {
      name: "all-products-store",
      // Сохраняем только основные данные, производные будут пересчитаны
      partialize: (state) => ({
        allProductsData: state.allProductsData,
        lastFetchTime: state.lastFetchTime,
        isInitialized: state.isInitialized,
      }),
      // Восстанавливаем производные данные после загрузки из localStorage
      onRehydrateStorage: () => (state) => {
        if (state?.allProductsData) {
          state.updateDerivedData();
        }
      },
    },
  ),
);

export default useAllProductsStore;
