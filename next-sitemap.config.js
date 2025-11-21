import axios from "axios";

const SITE_URL = "https://www.maitsevgruusia.ee";
const LOCALES = ["et", "en", "ru"];

// SEO-оптимизированные приоритеты для разных типов страниц
const PRIORITIES = {
  HOME: 1.0,
  FOOD_MENU: 0.95,
  DRINKS_MENU: 0.9,
  FOOD_SUBCATEGORIES: 0.85,
  DRINKS_SUBCATEGORIES: 0.85,
  GEORGIAN_PRODUCTS: 0.9,
  ALCOHOL_PRODUCTS: 0.85,
  OTHER_PRODUCTS: 0.8,
  STATIC_PAGES: 0.7,
};

// Частота обновления для разных типов контента
const CHANGE_FREQ = {
  HOME: "daily",
  MENU: "daily",
  PRODUCTS: "weekly",
  CATEGORIES: "weekly",
  STATIC: "monthly",
};

export default {
  siteUrl: SITE_URL,
  generateRobotsTxt: true,
  exclude: [
    "/api/*",
    "/dev-cart-reset",
    "/admin/*",
    "/login",
    "/register",
    "/_next/*",
    "/favicon.ico",
    "/robots.txt",
  ],

  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dev-cart-reset", "/_next/"],
        crawlDelay: 1,
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dev-cart-reset"],
        crawlDelay: 0.5,
      },
      {
        userAgent: "MJ12bot",
        disallow: "/",
      },
      {
        userAgent: "AhrefsBot",
        disallow: "/",
      },
    ],
    additionalSitemaps: [],
  },

  transform: async (config, path) => {
    let priority = PRIORITIES.STATIC_PAGES;
    let changefreq = CHANGE_FREQ.STATIC;

    // Главная страница
    if (path === "/" || path.match(/^\/[a-z]{2}$/)) {
      priority = PRIORITIES.HOME;
      changefreq = CHANGE_FREQ.HOME;
    }
    // Меню еды
    else if (path.match(/\/[a-z]{2}\/menu\/menu$/)) {
      priority = PRIORITIES.FOOD_MENU;
      changefreq = CHANGE_FREQ.MENU;
    }
    // Меню напитков
    else if (path.match(/\/[a-z]{2}\/menu\/drinks$/)) {
      priority = PRIORITIES.DRINKS_MENU;
      changefreq = CHANGE_FREQ.MENU;
    }
    // Подкатегории еды
    else if (path.match(/\/[a-z]{2}\/menu\/menu\/[^\/]+$/)) {
      priority = PRIORITIES.FOOD_SUBCATEGORIES;
      changefreq = CHANGE_FREQ.CATEGORIES;
    }
    // Подкатегории напитков
    else if (path.match(/\/[a-z]{2}\/menu\/drinks\/[^\/]+$/)) {
      priority = PRIORITIES.DRINKS_SUBCATEGORIES;
      changefreq = CHANGE_FREQ.CATEGORIES;
    }
    // Продукты еды
    else if (path.match(/\/[a-z]{2}\/menu\/menu\/[^\/]+\/[^\/]+$/)) {
      if (
        path.includes("khachapuri") ||
        path.includes("khinkali") ||
        path.includes("mtsvadi") ||
        path.includes("satsivi")
      ) {
        priority = PRIORITIES.GEORGIAN_PRODUCTS;
      } else {
        priority = PRIORITIES.OTHER_PRODUCTS;
      }
      changefreq = CHANGE_FREQ.PRODUCTS;
    }
    // Продукты напитков
    else if (path.match(/\/[a-z]{2}\/menu\/drinks\/[^\/]+\/[^\/]+$/)) {
      priority = PRIORITIES.ALCOHOL_PRODUCTS;
      changefreq = CHANGE_FREQ.PRODUCTS;
    }

    return {
      loc: path,
      changefreq,
      priority,
      lastmod: new Date().toISOString(),
    };
  },

  additionalPaths: async () => {
    const paths = [];

    // Добавляем главные страницы
    LOCALES.forEach((locale) => {
      paths.push({
        loc: `${SITE_URL}/${locale}`,
        changefreq: CHANGE_FREQ.HOME,
        priority: PRIORITIES.HOME,
        lastmod: new Date().toISOString(),
        // alternateRefs: LOCALES.map((altLocale) => ({
        //   href: `${SITE_URL}/${altLocale}`,
        //   hreflang:
        //     altLocale === "et"
        //       ? "et-EE"
        //       : altLocale === "en"
        //         ? "en-US"
        //         : "ru-RU",
        // })),
      });
    });

    // Безопасная функция для получения данных
    const fetchData = async (endpoint, retries = 2) => {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await axios.get(`${SITE_URL}/api/${endpoint}`, {
            timeout: 30000,
            headers: {
              userAgent: "MAITSEV-GRUUSIA-Sitemap-Generator",
              Accept: "application/json",
            },
          });

          if (response.data) {
            return response.data;
          }

          throw new Error(`Пустой ответ от ${endpoint}`);
        } catch (error) {
          if (i === retries - 1) {
            return null;
          }

          await new Promise((resolve) => setTimeout(resolve, 2000 * (i + 1)));
        }
      }
      return null;
    };

    // Функция для получения данных с параметрами
    const fetchDataWithParams = async (endpoint, params = {}, retries = 2) => {
      for (let i = 0; i < retries; i++) {
        try {
          const response = await axios.get(`${SITE_URL}/api/${endpoint}`, {
            params,
            timeout: 30000,
            headers: {
              "User-Agent": "MAITSEV-GRUUSIA-Sitemap-Generator",
              Accept: "application/json",
            },
          });

          if (response.data) {
            return response.data;
          }

          throw new Error(`Пустой ответ от ${endpoint}`);
        } catch (error) {
          if (i === retries - 1) {
            return null;
          }

          await new Promise((resolve) => setTimeout(resolve, 2000 * (i + 1)));
        }
      }
      return null;
    };

    try {
      console.log("[Sitemap] Starting to fetch data from APIs...");

      // Получаем данные параллельно с обработкой ошибок
      const [subcategoriesData, productsData, alkoholsData] =
        await Promise.allSettled([
          fetchData("subcategories"),
          fetchData("products"),
          fetchDataWithParams("alkohols", { sitemap: "true" }),
        ]);

      // Безопасно извлекаем данные
      const subcategories =
        subcategoriesData.status === "fulfilled" && subcategoriesData.value
          ? Array.isArray(subcategoriesData.value)
            ? subcategoriesData.value
            : []
          : [];

      const products =
        productsData.status === "fulfilled" && productsData.value
          ? Array.isArray(productsData.value)
            ? productsData.value
            : []
          : [];

      // Обрабатываем алкоголь с учетом разных структур данных
      let alkoholsArray = [];
      if (alkoholsData.status === "fulfilled" && alkoholsData.value) {
        const alkohols = alkoholsData.value;

        if (
          alkohols.alkoholsBySubcategory &&
          typeof alkohols.alkoholsBySubcategory === "object"
        ) {
          alkoholsArray = Object.values(alkohols.alkoholsBySubcategory).flat();
        } else if (Array.isArray(alkohols)) {
          alkoholsArray = alkohols;
        } else if (alkohols.data && Array.isArray(alkohols.data)) {
          alkoholsArray = alkohols.data;
        }
      }

      console.log(
        `[Sitemap] Fetched data - Subcategories: ${subcategories.length}, Products: ${products.length}, Alkohols: ${alkoholsArray.length}`,
      );

      const locales = ["et", "en", "ru"];
      // Классифицируем подкатегории
      const foodSubcategories = [];
      const drinkSubcategories = [];

      subcategories.forEach((subcategory) => {
        if (!subcategory.slug || !subcategory.name) {
          return;
        }

        const name = (
          subcategory.name?.en ||
          subcategory.name ||
          ""
        ).toLowerCase();

        const isDrink =
          [
            "drink",
            "alcohol",
            "wine",
            "beer",
            "cocktail",
            "vodka",
            "whisky",
            "cognac",
            "rum",
            "champagne",
            "brandy",
            "liqueur",
            "soft",
            "tequila",
            "absinthe",
            "water",
            "mezcal",
            "grappa",
            "chacha",
            "bitter",
            "cider",
          ].some((keyword) => name.includes(keyword)) ||
          subcategory.slug?.includes("alkohol");

        if (isDrink) {
          drinkSubcategories.push(subcategory);
        } else {
          foodSubcategories.push(subcategory);
        }
      });

      // Генерируем URL для подкатегорий еды
      // Добавляем подкатегории еды
      foodSubcategories.forEach((subcategory) => {
        LOCALES.forEach((locale) => {
          const isPizza = (subcategory.name?.en || subcategory.name || "")
            .toLowerCase()
            .includes("pizza");

          paths.push({
            loc: `${SITE_URL}/${locale}/menu/menu/${subcategory.slug}`,
            changefreq: CHANGE_FREQ.CATEGORIES,
            priority: isPizza
              ? PRIORITIES.FOOD_MENU
              : PRIORITIES.FOOD_SUBCATEGORIES,
            lastmod: subcategory.updatedAt || new Date().toISOString(),
            // alternateRefs: LOCALES.map((altLocale) => ({
            //   href: `${SITE_URL}/${altLocale}/menu/menu/${subcategory.slug}`,
            //   hreflang:
            //     altLocale === "et"
            //       ? "et-EE"
            //       : altLocale === "en"
            //         ? "en-US"
            //         : "ru-RU",
            // })),
          });
        });
      });

      // Добавляем подкатегории напитков
      drinkSubcategories.forEach((subcategory) => {
        LOCALES.forEach((locale) => {
          paths.push({
            loc: `${SITE_URL}/${locale}/menu/drinks/${subcategory.slug}`,
            changefreq: CHANGE_FREQ.CATEGORIES,
            priority: PRIORITIES.DRINKS_SUBCATEGORIES,
            lastmod: subcategory.updatedAt || new Date().toISOString(),
            // alternateRefs: LOCALES.map((altLocale) => ({
            //   href: `${SITE_URL}/${altLocale}/menu/drinks/${subcategory.slug}`,
            //   hreflang:
            //     altLocale === "et"
            //       ? "et-EE"
            //       : altLocale === "en"
            //         ? "en-US"
            //         : "ru-RU",
            // })),
          });
        });
      });

      // Создаем карту подкатегорий
      const subcategoryMap = {};
      [...foodSubcategories, ...drinkSubcategories].forEach((sc) => {
        if (sc._id) {
          subcategoryMap[sc._id] = sc;
          subcategoryMap[sc._id.toString()] = sc; // Also map string version
        }
      });

      console.log(
        `[Sitemap] Created subcategory map with ${Object.keys(subcategoryMap).length} entries`,
      );

      // Функция для добавления продуктов
      const addProducts = (items, basePath, isAlcohol = false) => {
        let addedCount = 0;
        let skippedCount = 0;

        items.forEach((item) => {
          if (!item.slug) {
            skippedCount++;
            return;
          }

          // Try multiple ways to get subcategory ID
          let subcategoryId =
            item.subcategory?._id || item.subcategory?.id || item.subcategory;

          // Convert to string if it's an object
          if (typeof subcategoryId === "object" && subcategoryId !== null) {
            subcategoryId = subcategoryId.toString();
          }

          const subcategory =
            subcategoryMap[subcategoryId] ||
            subcategoryMap[subcategoryId?.toString()];

          if (subcategory) {
            LOCALES.forEach((locale) => {
              let priority = PRIORITIES.OTHER_PRODUCTS;

              if (!isAlcohol) {
                const itemName = (
                  item.title?.en ||
                  item.title ||
                  item.name?.en ||
                  item.name ||
                  ""
                ).toLowerCase();
                if (
                  itemName.includes("khachapuri") ||
                  itemName.includes("khinkali") ||
                  itemName.includes("mtsvadi") ||
                  itemName.includes("satsivi")
                ) {
                  priority = PRIORITIES.GEORGIAN_PRODUCTS;
                }
              } else {
                priority = PRIORITIES.ALCOHOL_PRODUCTS;
              }

              const productUrl = `${SITE_URL}/${locale}/menu/${basePath}/${subcategory.slug}/${item.slug}`;
              paths.push({
                loc: productUrl,
                changefreq: CHANGE_FREQ.PRODUCTS,
                priority,
                lastmod: item.updatedAt || new Date().toISOString(),
              });
            });
            addedCount++;
          } else {
            skippedCount++;
            console.log(
              `[Sitemap] Skipped item ${item.slug} - subcategory not found: ${subcategoryId}`,
            );
          }
        });

        console.log(
          `[Sitemap] Added ${addedCount} ${isAlcohol ? "alcohol" : "food"} products, skipped ${skippedCount}`,
        );
        return addedCount;
      };

      // Добавляем продукты
      const foodProductsAdded = addProducts(products, "menu", false);
      const drinkProductsAdded = addProducts(alkoholsArray, "drinks", true);

      console.log(`[Sitemap] Total paths generated: ${paths.length}`);
      console.log(
        `[Sitemap] Successfully added ${foodProductsAdded} food products and ${drinkProductsAdded} drink products`,
      );
    } catch (error) {
      console.error("[Sitemap] Error during generation:", error);
    }

    return paths;
  },

  // Настройки для правильного XML
  generateIndexSitemap: true,
  outDir: "./public",
  sitemapSize: 7000,
  trailingSlash: false,
};
