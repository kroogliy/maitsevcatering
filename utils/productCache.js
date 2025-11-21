// Утилита для клиентского кэширования продуктов
class ProductCache {
  constructor() {
    this.CACHE_KEY = "maitsevsushi_products_cache";
    this.VERSION_KEY = "maitsevsushi_cache_version";
    this.CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 часа
    this.CURRENT_VERSION = "1.0.0";

    this.products = new Map();
    this.alkohols = new Map();
    this.categories = new Map();
    this.subcategories = new Map();

    this.isLoading = false;
    this.isInitialized = false;
    this.lastUpdated = null;

    // Callbacks для уведомления компонентов об обновлениях
    this.updateCallbacks = new Set();
  }

  // Проверка поддержки localStorage
  isStorageAvailable() {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Получение данных из localStorage
  getFromStorage() {
    if (!this.isStorageAvailable()) return null;

    try {
      const cached = localStorage.getItem(this.CACHE_KEY);
      const version = localStorage.getItem(this.VERSION_KEY);

      if (!cached || version !== this.CURRENT_VERSION) {
        this.clearStorage();
        return null;
      }

      const data = JSON.parse(cached);
      const now = Date.now();

      // Проверяем срок годности кэша
      if (data.timestamp && now - data.timestamp > this.CACHE_DURATION) {
        this.clearStorage();
        return null;
      }

      return data;
    } catch (error) {
      // Error reading cache
      this.clearStorage();
      return null;
    }
  }

  // Сохранение данных в localStorage
  saveToStorage(data) {
    if (!this.isStorageAvailable()) return;

    try {
      const cacheData = {
        ...data,
        timestamp: Date.now(),
        version: this.CURRENT_VERSION,
      };

      localStorage.setItem(this.CACHE_KEY, JSON.stringify(cacheData));
      localStorage.setItem(this.VERSION_KEY, this.CURRENT_VERSION);
    } catch (error) {
      // Error saving cache - clear old cache if storage is full
      this.clearStorage();
    }
  }

  // Очистка кэша
  clearStorage() {
    if (!this.isStorageAvailable()) return;

    try {
      localStorage.removeItem(this.CACHE_KEY);
      localStorage.removeItem(this.VERSION_KEY);
    } catch (error) {
      // Error clearing cache
    }
  }

  // Заполнение внутренних Map'ов из данных
  populateMaps(data) {
    // Очищаем существующие данные
    this.products.clear();
    this.alkohols.clear();
    this.categories.clear();
    this.subcategories.clear();

    // Заполняем продуктами
    if (data.products) {
      data.products.forEach((product) => {
        this.products.set(product._id, product);

        // Добавляем категории и подкатегории
        if (product.category) {
          this.categories.set(product.category._id, product.category);
        }
        if (product.subcategory) {
          this.subcategories.set(product.subcategory._id, product.subcategory);
        }
      });
    }

    // Заполняем напитками
    if (data.alkohols) {
      data.alkohols.forEach((alkohol) => {
        this.alkohols.set(alkohol._id, alkohol);

        // Добавляем категории и подкатегории
        if (alkohol.category) {
          this.categories.set(alkohol.category._id, alkohol.category);
        }
        if (alkohol.subcategory) {
          this.subcategories.set(alkohol.subcategory._id, alkohol.subcategory);
        }
      });
    }

    this.lastUpdated = data.timestamp || Date.now();
    this.isInitialized = true;
  }

  // Инициализация кэша
  async initialize() {
    if (this.isLoading || this.isInitialized) return;

    this.isLoading = true;

    try {
      // Сначала пытаемся загрузить из localStorage
      const cachedData = this.getFromStorage();

      if (cachedData) {
        this.populateMaps(cachedData);
        this.notifyCallbacks("cache-loaded");

        // В фоне проверяем обновления
        this.loadFreshDataInBackground();
      } else {
        // Если кэша нет, загружаем свежие данные
        await this.loadFreshData();
      }
    } catch (error) {
      // Error initializing cache
      // Пытаемся загрузить хотя бы свежие данные
      await this.loadFreshData();
    } finally {
      this.isLoading = false;
    }
  }

  // Загрузка свежих данных с сервера
  async loadFreshData() {
    try {
      // Стратегия поэтапной загрузки
      const [menuResponse, drinksResponse] = await Promise.allSettled([
        fetch("/api/all-products-optimized?priority=menu"),
        fetch("/api/all-products-optimized?priority=drinks"),
      ]);

      let products = [];
      let alkohols = [];

      // Обрабатываем ответ с продуктами меню
      if (menuResponse.status === "fulfilled" && menuResponse.value.ok) {
        const menuData = await menuResponse.value.json();
        products = menuData.products || [];
      }

      // Обрабатываем ответ с напитками
      if (drinksResponse.status === "fulfilled" && drinksResponse.value.ok) {
        const drinksData = await drinksResponse.value.json();
        alkohols = drinksData.alkohols || [];
      }

      // Если ни один запрос не удался, пытаемся загрузить все сразу
      if (products.length === 0 && alkohols.length === 0) {
        const allResponse = await fetch("/api/all-products");

        if (allResponse.ok) {
          const allData = await allResponse.json();
          products = allData.products || [];
          alkohols = allData.alkohols || [];
        }
      }

      const data = { products, alkohols };

      // Сохраняем данные
      this.populateMaps(data);
      this.saveToStorage(data);

      this.notifyCallbacks("fresh-loaded");
    } catch (error) {
      throw error;
    }
  }

  // Фоновая загрузка свежих данных
  async loadFreshDataInBackground() {
    try {
      await this.loadFreshData();
    } catch (error) {
      // Background update failed
    }
  }

  // Подписка на обновления кэша
  subscribe(callback) {
    this.updateCallbacks.add(callback);

    // Возвращаем функцию отписки
    return () => {
      this.updateCallbacks.delete(callback);
    };
  }

  // Уведомление подписчиков
  notifyCallbacks(event) {
    this.updateCallbacks.forEach((callback) => {
      try {
        callback(event, this.getStats());
      } catch (error) {
        // Error in callback
      }
    });
  }

  // Получение статистики кэша
  getStats() {
    return {
      productsCount: this.products.size,
      alkoholsCount: this.alkohols.size,
      categoriesCount: this.categories.size,
      subcategoriesCount: this.subcategories.size,
      totalItems: this.products.size + this.alkohols.size,
      lastUpdated: this.lastUpdated,
      isInitialized: this.isInitialized,
      isLoading: this.isLoading,
    };
  }

  // Получение всех продуктов
  getAllProducts() {
    return Array.from(this.products.values());
  }

  // Получение всех напитков
  getAllAlkohols() {
    return Array.from(this.alkohols.values());
  }

  // Получение продукта по ID
  getProductById(id) {
    return this.products.get(id);
  }

  // Получение напитка по ID
  getAlkoholById(id) {
    return this.alkohols.get(id);
  }

  // Получение продукта или напитка по slug
  getBySlug(slug) {
    // Ищем среди продуктов
    for (const product of this.products.values()) {
      if (product.slug === slug) {
        return { ...product, type: "product" };
      }
    }

    // Ищем среди напитков
    for (const alkohol of this.alkohols.values()) {
      if (alkohol.slug === slug) {
        return { ...alkohol, type: "alkohol" };
      }
    }

    return null;
  }

  // Фильтрация продуктов по подкатегории
  getProductsBySubcategory(subcategoryId) {
    return this.getAllProducts().filter(
      (product) =>
        product.subcategory && product.subcategory._id === subcategoryId,
    );
  }

  // Фильтрация напитков по подкатегории
  getAlkoholsBySubcategory(subcategoryId) {
    return this.getAllAlkohols().filter(
      (alkohol) =>
        alkohol.subcategory && alkohol.subcategory._id === subcategoryId,
    );
  }

  // Поиск по названию
  search(query, options = {}) {
    const {
      includeProducts = true,
      includeAlkohols = true,
      limit = 50,
    } = options;

    const results = [];
    const searchQuery = query.toLowerCase().trim();

    if (includeProducts) {
      for (const product of this.products.values()) {
        const title = product.title?.toLowerCase() || "";
        const name = product.name?.toLowerCase() || "";

        if (title.includes(searchQuery) || name.includes(searchQuery)) {
          results.push({ ...product, type: "product" });
        }

        if (results.length >= limit) break;
      }
    }

    if (includeAlkohols && results.length < limit) {
      for (const alkohol of this.alkohols.values()) {
        const name = alkohol.name?.toLowerCase() || "";

        if (name.includes(searchQuery)) {
          results.push({ ...alkohol, type: "alkohol" });
        }

        if (results.length >= limit) break;
      }
    }

    return results;
  }

  // Получение всех категорий
  getAllCategories() {
    return Array.from(this.categories.values());
  }

  // Получение всех подкатегорий
  getAllSubcategories() {
    return Array.from(this.subcategories.values());
  }

  // Принудительное обновление кэша
  async forceRefresh() {
    this.clearStorage();
    this.isInitialized = false;
    await this.loadFreshData();
  }

  // Проверка готовности кэша
  isReady() {
    return this.isInitialized && !this.isLoading;
  }
}

// Создаем глобальный экземпляр
const productCache = new ProductCache();

export default productCache;

// Также экспортируем класс для создания дополнительных экземпляров
export { ProductCache };
