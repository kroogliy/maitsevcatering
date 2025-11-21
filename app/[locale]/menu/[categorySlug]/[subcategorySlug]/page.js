import MenuPage from "../../page";
import axios from "axios";

// Utility function to get first product image from subcategory
async function getFirstProductImage(subcategoryId, categorySlug) {
  try {
    const isFood = categorySlug === "menu";
    const endpoint = isFood
      ? "https://www.maitsevgruusia.ee/api/products"
      : "https://www.maitsevgruusia.ee/api/alkohols";
    const response = await axios.get(endpoint, {
      params: { subcategoryId, limit: 1 },
      timeout: 5000,
    });

    if (
      response.data &&
      Array.isArray(response.data) &&
      response.data.length > 0
    ) {
      const product = response.data[0];
      if (
        product.images &&
        Array.isArray(product.images) &&
        product.images.length > 0
      ) {
        return product.images[0];
      }
    }
  } catch (error) {
    // Failed to fetch product image for subcategory
  }
  return null;
}

// Функция для загрузки данных о подкатегории
async function fetchSubcategoryData(categorySlug, subcategorySlug) {
  try {
    const subcategoriesResponse = await axios.get(
      "https://www.maitsevsushi.ee/api/subcategories",
      {
        timeout: 5000,
      },
    );

    const foundSubcategory = subcategoriesResponse.data.find(
      (subcat) => subcat.slug === subcategorySlug,
    );

    if (!foundSubcategory) {
      // Subcategory genuinely not found in the API response
      return { notFound: true };
    }

    return { subcategory: foundSubcategory };
  } catch (error) {
    // Network or server error - don't show "not found", create fallback

    // Format the slug into a readable name for English
    const formattedNameEn = subcategorySlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Common subcategory translations
    const translations = {
      // Food categories
      georgian: { et: "Gruusia", en: "Georgian", ru: "Грузинские" },
      khachapuri: { et: "Khachapuri", en: "Khachapuri", ru: "Хачапури" },
      khinkali: { et: "Khinkali", en: "Khinkali", ru: "Хинкали" },
      soups: { et: "Supid", en: "Soups", ru: "Супы" },
      salads: { et: "Salatid", en: "Salads", ru: "Салаты" },
      "hot-dishes": { et: "Praed", en: "Hot Dishes", ru: "Горячие блюда" },
      "main-dishes": { et: "Pearoad", en: "Main Dishes", ru: "Основные блюда" },
      appetizers: { et: "Eelroad", en: "Appetizers", ru: "Закуски" },
      "cold-appetizers": {
        et: "Külmad eelroad",
        en: "Cold Appetizers",
        ru: "Холодные закуски",
      },
      "hot-appetizers": {
        et: "Kuumad eelroad",
        en: "Hot Appetizers",
        ru: "Горячие закуски",
      },
      desserts: { et: "Magustoidud", en: "Desserts", ru: "Десерты" },
      bread: { et: "Leib", en: "Bread", ru: "Хлеб" },
      sauces: { et: "Kastmed", en: "Sauces", ru: "Соусы" },
      "grilled-dishes": {
        et: "Grillroad",
        en: "Grilled Dishes",
        ru: "Блюда на гриле",
      },
      mtsvadi: { et: "Mtsvadi", en: "Mtsvadi", ru: "Мцвади" },
      satsivi: { et: "Satsivi", en: "Satsivi", ru: "Сациви" },
      lobio: { et: "Lobio", en: "Lobio", ru: "Лобио" },
      pkhali: { et: "Pkhali", en: "Pkhali", ru: "Пхали" },

      // Drink categories
      wine: { et: "Veinid", en: "Wine", ru: "Вина" },
      "georgian-wine": {
        et: "Gruusia veinid",
        en: "Georgian Wine",
        ru: "Грузинские вина",
      },
      "red-wine": { et: "Punased veinid", en: "Red Wine", ru: "Красные вина" },
      "white-wine": { et: "Valged veinid", en: "White Wine", ru: "Белые вина" },
      "sparkling-wine": {
        et: "Vahuveinid",
        en: "Sparkling Wine",
        ru: "Игристые вина",
      },
      beer: { et: "Õlu", en: "Beer", ru: "Пиво" },
      spirits: { et: "Kanged joogid", en: "Spirits", ru: "Крепкие напитки" },
      chacha: { et: "Chacha", en: "Chacha", ru: "Чача" },
      cognac: { et: "Konjak", en: "Cognac", ru: "Коньяк" },
      whiskey: { et: "Viski", en: "Whiskey", ru: "Виски" },
      vodka: { et: "Viin", en: "Vodka", ru: "Водка" },
      "soft-drinks": {
        et: "Karastusjoogid",
        en: "Soft Drinks",
        ru: "Безалкогольные напитки",
      },
    };

    const fallbackNames = translations[subcategorySlug] || {
      et: formattedNameEn,
      en: formattedNameEn,
      ru: formattedNameEn,
    };

    // Return fallback data to allow page to render
    return {
      subcategory: {
        slug: subcategorySlug,
        name: fallbackNames,
        _id: subcategorySlug,
        image: null,
      },
      isOffline: true, // Flag to indicate we're using fallback data
    };
  }
}

// Генерация мощного SEO для подкатегорий японского ресторана
export async function generateMetadata({ params }) {
  const { locale, categorySlug, subcategorySlug } = await params;

  // Загружаем данные о подкатегории
  const data = await fetchSubcategoryData(categorySlug, subcategorySlug);

  // Only show "not found" if subcategory genuinely doesn't exist in the API
  if (data?.notFound === true) {
    return {
      title:
        {
          et: "Menüü ei leitud | MAITSEV GRUUSIA",
          en: "Menu Not Found | MAITSEV GRUUSIA",
          ru: "Меню не найдено | MAITSEV GRUUSIA",
        }[locale] || "Menu Not Found | MAITSEV GRUUSIA",
      description:
        {
          et: "Otsitud menüü ei leitud. Vaadake meie gruusia köögi valikut või alkohoolsete jookide kollektsiooni.",
          en: "The menu you are looking for was not found. Check our Georgian cuisine selection or alcoholic drinks collection.",
          ru: "Меню, которое вы ищете, не найдено. Ознакомьтесь с нашим выбором грузинской кухни или коллекцией алкогольных напитков.",
        }[locale] || "The menu you are looking for does not exist.",
    };
  }

  const { subcategory } = data;
  // Handle both string and object name formats
  const subcategoryName =
    typeof subcategory.name === "string"
      ? subcategory.name
      : subcategory.name?.[locale] ||
        subcategory.name?.en ||
        subcategory.name?.ru ||
        subcategory.slug ||
        "Menu";

  // Определяем тип контента и создаем SEO
  const isFood = categorySlug === "menu";
  const isDrinks = categorySlug === "drinks";

  let seoData;

  if (isFood) {
    // SEO для грузинской кухни
    const isKhachapuri =
      subcategorySlug.toLowerCase().includes("khachapuri") ||
      subcategorySlug.toLowerCase().includes("bread");
    const isKhinkali =
      subcategorySlug.toLowerCase().includes("khinkali") ||
      subcategorySlug.toLowerCase().includes("dumpling");

    seoData = {
      et: {
        title: isKhachapuri
          ? `${subcategoryName} Khachapuri Tallinn | Gruusia Köök | MAITSEV GRUUSIA`
          : isKhinkali
            ? `${subcategoryName} Khinkali Tallinn | Gruusia Köök | MAITSEV GRUUSIA`
            : `${subcategoryName} Tallinn | Gruusia Köök | MAITSEV GRUUSIA`,
        description: isKhachapuri
          ? `🥧 ${subcategoryName} khachapuri Tallinnas! Traditsioonilised gruusia retseptid, värskelt valmistatud. Kohaletoimetamine. Roosikrantsi 16!`
          : isKhinkali
            ? `🥟 ${subcategoryName} khinkali Tallinnas! Gruusia pelmeenid, traditsioonilised retseptid. Kohaletoimetamine. MAITSEV GRUUSIA!`
            : `🍴 ${subcategoryName} Tallinnas! Gruusia köök, värskelt valmistatud. MAITSEV GRUUSIA - parim gruusia restoran!`,
        keywords: isKhachapuri
          ? `${subcategoryName} khachapuri, gruusia khachapuri tallinn, ${subcategoryName} kohaletoimetamine, gruusia köök`
          : isKhinkali
            ? `${subcategoryName} khinkali, gruusia khinkali tallinn, ${subcategoryName} kohaletoimetamine, gruusia köök`
            : `${subcategoryName} tallinn, gruusia köök, ${subcategoryName} tellida, gruusia restoran`,
      },
      en: {
        title: isKhachapuri
          ? `${subcategoryName} Khachapuri Tallinn | Georgian Cuisine | MAITSEV GRUUSIA`
          : isKhinkali
            ? `${subcategoryName} Khinkali Tallinn | Georgian Cuisine | MAITSEV GRUUSIA`
            : `${subcategoryName} Tallinn | Georgian Cuisine | MAITSEV GRUUSIA`,
        description: isKhachapuri
          ? `🥧 ${subcategoryName} khachapuri in Tallinn! Traditional Georgian recipes, freshly made. Delivery available. Roosikrantsi 16!`
          : isKhinkali
            ? `🥟 ${subcategoryName} khinkali in Tallinn! Georgian dumplings, traditional recipes. Delivery available. MAITSEV GRUUSIA!`
            : `🍴 ${subcategoryName} in Tallinn! Georgian cuisine, freshly prepared. MAITSEV GRUUSIA - best Georgian restaurant!`,
        keywords: isKhachapuri
          ? `${subcategoryName} khachapuri, georgian khachapuri tallinn, ${subcategoryName} delivery, georgian cuisine`
          : isKhinkali
            ? `${subcategoryName} khinkali, georgian khinkali tallinn, ${subcategoryName} delivery, georgian cuisine`
            : `${subcategoryName} tallinn, georgian cuisine, order ${subcategoryName}, georgian restaurant`,
      },
      ru: {
        title: isKhachapuri
          ? `${subcategoryName} Хачапури Таллинн | Грузинская Кухня | MAITSEV GRUUSIA`
          : isKhinkali
            ? `${subcategoryName} Хинкали Таллинн | Грузинская Кухня | MAITSEV GRUUSIA`
            : `${subcategoryName} Таллинн | Грузинская Кухня | MAITSEV GRUUSIA`,
        description: isKhachapuri
          ? `🥧 ${subcategoryName} хачапури в Таллинне! Традиционные грузинские рецепты, свежее приготовление. Доставка. Roosikrantsi 16!`
          : isKhinkali
            ? `🥟 ${subcategoryName} хинкали в Таллинне! Грузинские пельмени, традиционные рецепты. Доставка. MAITSEV GRUUSIA!`
            : `🍴 ${subcategoryName} в Таллинне! Грузинская кухня, свежее приготовление. MAITSEV GRUUSIA - лучший грузинский ресторан!`,
        keywords: isKhachapuri
          ? `${subcategoryName} хачапури, грузинские хачапури таллинн, доставка ${subcategoryName}, грузинская кухня`
          : isKhinkali
            ? `${subcategoryName} хинкали, грузинские хинкали таллинн, доставка ${subcategoryName}, грузинская кухня`
            : `${subcategoryName} таллинн, грузинская кухня, заказать ${subcategoryName}, грузинский ресторан`,
      },
    };
  } else if (isDrinks) {
    // SEO для алкогольных напитков с акцентом на грузинские вина
    const isWine =
      subcategorySlug.toLowerCase().includes("wine") ||
      subcategorySlug.toLowerCase().includes("vein") ||
      subcategorySlug.toLowerCase().includes("saperavi") ||
      subcategorySlug.toLowerCase().includes("kindzmarauli");

    seoData = {
      et: {
        title: isWine
          ? `${subcategoryName} Gruusia Veinid | 6000+ Alkoholi | MAITSEV GRUUSIA`
          : `${subcategoryName} | 6000+ Alkohoolset Jooki | MAITSEV GRUUSIA`,
        description: isWine
          ? `🍷 ${subcategoryName} gruusia veinid Tallinnas! Saperavi, kindzmarauli, rkatsiteli. Osa meie 6000+ alkohoolse joogi kollektsioonist. Ekspertide valik!`
          : `🍷 ${subcategoryName} valik Tallinnas! Osa meie 6000+ alkohoolse joogi kollektsioonist. Haruldased ja kollektsiooni ${subcategoryName.toLowerCase()}. Kohaletoimetamine!`,
        keywords: isWine
          ? `${subcategoryName} gruusia vein, saperavi, kindzmarauli, gruusia veinid tallinn, 6000 alkohoolset jooki`
          : `${subcategoryName} tallinn, ${subcategoryName}, haruldased ${subcategoryName}, 6000 alkohoolset jooki, ${subcategoryName} kohaletoimetamine`,
      },
      en: {
        title: isWine
          ? `${subcategoryName} Georgian Wines | 6000+ Alcohol | MAITSEV GRUUSIA`
          : `${subcategoryName} | 6000+ Alcoholic Drinks | MAITSEV GRUUSIA`,
        description: isWine
          ? `🍷 ${subcategoryName} Georgian wines in Tallinn! Saperavi, kindzmarauli, rkatsiteli. Part of our 6000+ alcoholic beverage collection. Expert selection!`
          : `🍷 ${subcategoryName} selection in Tallinn! Part of our 6000+ alcoholic beverage collection. Rare and collection ${subcategoryName.toLowerCase()}. Delivery available!`,
        keywords: isWine
          ? `${subcategoryName} georgian wine, saperavi, kindzmarauli, georgian wines tallinn, 6000 alcoholic drinks`
          : `${subcategoryName} tallinn, ${subcategoryName}, rare ${subcategoryName}, 6000 alcoholic drinks, ${subcategoryName} delivery`,
      },
      ru: {
        title: isWine
          ? `${subcategoryName} Грузинские Вина | 6000+ Алкоголь | MAITSEV GRUUSIA`
          : `${subcategoryName} | 6000+ Алкогольных Напитков | MAITSEV GRUUSIA`,
        description: isWine
          ? `🍷 ${subcategoryName} грузинские вина в Таллинне! Саперави, киндзмараули, ркацители. Часть нашей коллекции 6000+ алкогольных напитков. Экспертный выбор!`
          : `🍷 Выбор ${subcategoryName} в Таллинне! Часть нашей коллекции 6000+ алкогольных напитков. Редкие и коллекционные ${subcategoryName.toLowerCase()}. Доставка!`,
        keywords: isWine
          ? `${subcategoryName} грузинское вино, саперави, киндзмараули, грузинские вина таллинн, 6000 алкогольных напитков`
          : `${subcategoryName} таллинн, ${subcategoryName}, редкие ${subcategoryName}, 6000 алкогольных напитков, доставка ${subcategoryName}`,
      },
    };
  } else {
    // Дефолтный SEO
    seoData = {
      et: {
        title: `${subcategoryName} | MAITSEV GRUUSIA`,
        description: `${subcategoryName} Tallinnas MAITSEV GRUUSIA restoranis. Roosikrantsi 16. Kohaletoimetamine.`,
        keywords: `${subcategoryName}, gruusia restoran tallinn, roosikrantsi`,
      },
      en: {
        title: `${subcategoryName} | MAITSEV GRUUSIA`,
        description: `${subcategoryName} at MAITSEV GRUUSIA restaurant in Tallinn. Roosikrantsi 16. Delivery available.`,
        keywords: `${subcategoryName}, georgian restaurant tallinn, roosikrantsi`,
      },
      ru: {
        title: `${subcategoryName} | MAITSEV GRUUSIA`,
        description: `${subcategoryName} в ресторане MAITSEV GRUUSIA в Таллинне. Roosikrantsi 16. Доставка.`,
        keywords: `${subcategoryName}, грузинский ресторан таллинн, roosikrantsi`,
      },
    };
  }

  const currentSEO = seoData[locale] || seoData.et;
  const canonicalUrl = `https://www.maitsevgruusia.ee/${locale}/menu/${categorySlug}/${subcategorySlug}`;

  // Try to get first product image for better SEO
  const productImage = await getFirstProductImage(
    subcategory._id,
    categorySlug,
  );
  const seoImage =
    subcategory.image ||
    productImage ||
    `https://www.maitsevgruusia.ee/images/cateringpage1.jpg`;

  // Schema.org разметка для грузинского ресторана
  const subcategorySchema = {
    "@context": "https://schema.org",
    "@type": "MenuSection",
    name: subcategoryName,
    description: currentSEO.description,
    image: seoImage,
    url: canonicalUrl,
    provider: {
      "@type": "Restaurant",
      name: "MAITSEV GRUUSIA",
      url: `https://www.maitsevgruusia.ee/${locale}`,
      servesCuisine: ["Georgian", "Caucasian"],
    },
    parentMenu: {
      "@type": "Menu",
      name: isFood
        ? {
            et: "Gruusia Köök",
            en: "Georgian Cuisine",
            ru: "Грузинская Кухня",
          }[locale]
        : {
            et: "6000+ Alkoholi",
            en: "6000+ Alcohol",
            ru: "6000+ Алкоголь",
          }[locale],
      url: `https://www.maitsevgruusia.ee/${locale}/menu/${categorySlug}`,
    },
    speciality: isFood
      ? {
          et: `${subcategoryName} gruusia traditsioonides`,
          en: `${subcategoryName} in Georgian traditions`,
          ru: `${subcategoryName} в грузинских традициях`,
        }[locale]
      : {
          et: `${subcategoryName} kollektsioonist`,
          en: `${subcategoryName} from collection`,
          ru: `${subcategoryName} из коллекции`,
        }[locale],
  };

  // Хлебные крошки
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: { et: "Avaleht", en: "Home", ru: "Главная" }[locale],
        item: `https://www.maitsevgruusia.ee/${locale}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: isFood
          ? {
              et: "Gruusia Köök",
              en: "Georgian Cuisine",
              ru: "Грузинская Кухня",
            }[locale]
          : {
              et: "Alkohol & Veinid",
              en: "Alcohol & Wines",
              ru: "Алкоголь и Вина",
            }[locale],
        item: `https://www.maitsevgruusia.ee/${locale}/menu/${categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: subcategoryName,
        item: canonicalUrl,
      },
    ],
  };

  return {
    title: currentSEO.title,
    description: currentSEO.description,
    keywords: currentSEO.keywords,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        et: `https://www.maitsevgruusia.ee/et/menu/${categorySlug}/${subcategorySlug}`,
        en: `https://www.maitsevgruusia.ee/en/menu/${categorySlug}/${subcategorySlug}`,
        ru: `https://www.maitsevgruusia.ee/ru/menu/${categorySlug}/${subcategorySlug}`,
      },
    },
    openGraph: {
      title: currentSEO.title,
      description: currentSEO.description,
      url: canonicalUrl,
      type: "website",
      siteName: "MAITSEV GRUUSIA",
      locale: locale === "et" ? "et_EE" : locale === "en" ? "en_US" : "ru_RU",
      images: [
        {
          url: seoImage,
          width: 1200,
          height: 630,
          alt: currentSEO.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: currentSEO.title,
      description: currentSEO.description,
      image: seoImage,
      site: "@maitsevgruusia",
      creator: "@maitsevgruusia",
    },
    other: {
      robots:
        "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      "format-detection": "telephone=yes",
      schema: JSON.stringify([subcategorySchema, breadcrumbSchema]),
    },
  };
}

export default async function SubCategoryPage({ params }) {
  const { locale, categorySlug, subcategorySlug } = await params;

  return (
    <MenuPage
      locale={locale}
      categorySlug={categorySlug}
      subcategorySlug={subcategorySlug}
    />
  );
}
