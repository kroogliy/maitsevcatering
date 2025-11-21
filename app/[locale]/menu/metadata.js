// SEO Metadata for Menu Pages - MAITSEV GRUUSIA
// Оптимизированные мета-данные для грузинского ресторана

import {
  generateFoodMenuSEO,
  generateDrinksMenuSEO,
  generateFoodSubcategorySEO,
  generateDrinksSubcategorySEO,
  generateRestaurantSchema,
  generateBreadcrumbSchema,
  SITE_CONFIG,
  getLocalizedText,
} from "../../../utils/seoUtils";

// Метаданные для страницы /menu/menu (грузинская кухня)
export async function generateFoodMenuMetadata({ params }) {
  const { locale } = await params;
  const seoData = generateFoodMenuSEO(locale);

  // Schema.org для меню грузинской кухни
  const foodMenuSchema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: {
      et: "Gruusia Köök - Menüü Tallinn",
      en: "Georgian Cuisine - Menu Tallinn",
      ru: "Грузинская Кухня - Меню Таллинн",
    }[locale],
    description: seoData.description,
    url: `${SITE_CONFIG.siteUrl}/${locale}/menu/menu`,
    provider: {
      "@type": "Restaurant",
      name: SITE_CONFIG.siteName,
      url: `${SITE_CONFIG.siteUrl}/${locale}`,
      telephone: SITE_CONFIG.businessInfo.phone,
      servesCuisine: ["Georgian", "Caucasian", "European"],
    },
    hasMenuSection: [
      {
        "@type": "MenuSection",
        name: {
          et: "Premium Sushi",
          en: "Premium Sushi",
          ru: "Премиум Суши",
        }[locale],
        description: {
          et: "Autentne Kyoto sushi traditsiooniliste tehnikatega",
          en: "Authentic Kyoto sushi with traditional techniques",
          ru: "Аутентичные суши Киото с традиционными техниками",
        }[locale],
      },
      {
        "@type": "MenuSection",
        name: {
          et: "Nigiri ja Sashimi",
          en: "Nigiri & Sashimi",
          ru: "Нигири и Сашими",
        }[locale],
        description: {
          et: "Värske kala igapäev, traditsiooniliselt valmistatud",
          en: "Fresh fish daily, traditionally prepared",
          ru: "Свежая рыба ежедневно, приготовленная традиционно",
        }[locale],
      },
      {
        "@type": "MenuSection",
        name: {
          et: "Maki Rullid",
          en: "Maki Rolls",
          ru: "Маки Роллы",
        }[locale],
        description: {
          et: "Klassikalised ja autorirullid premium koostisosadega",
          en: "Classic and signature rolls with premium ingredients",
          ru: "Классические и авторские роллы с премиум ингредиентами",
        }[locale],
      },
      {
        "@type": "MenuSection",
        name: {
          et: "Tempura",
          en: "Tempura",
          ru: "Темпура",
        }[locale],
        description: {
          et: "Kerge ja krõbe tempura Kyoto stiilis",
          en: "Light and crispy tempura Kyoto style",
          ru: "Легкая и хрустящая темпура в стиле Киото",
        }[locale],
      },
    ],
    speciality: [
      {
        et: "Autentne Kyoto sushi",
        en: "Authentic Kyoto sushi",
        ru: "Аутентичные суши Киото",
      }[locale],
      {
        et: "Värske kala igapäev",
        en: "Fresh fish daily",
        ru: "Свежая рыба ежедневно",
      }[locale],
      {
        et: "Traditsioonilised tehnikad",
        en: "Traditional techniques",
        ru: "Традиционные техники",
      }[locale],
    ],
  };

  return {
    ...seoData,
    other: {
      ...seoData.other,
      "structured-data": JSON.stringify(foodMenuSchema),
    },
  };
}

// Метаданные для страницы /menu/drinks (напитки/алкоголь)
export async function generateDrinksMenuMetadata({ params }) {
  const { locale } = await params;
  const seoData = generateDrinksMenuSEO(locale);

  // Schema.org для коллекции алкогольных напитков
  const drinksMenuSchema = {
    "@context": "https://schema.org",
    "@type": "Menu",
    name: {
      et: "Premium Alkohol - 6000+ Haruldast Jooki Tallinn",
      en: "Premium Alcohol - 6000+ Rare Drinks Tallinn",
      ru: "Премиум Алкоголь - 6000+ Редких Напитков Таллинн",
    }[locale],
    description: seoData.description,
    url: `${SITE_CONFIG.siteUrl}/${locale}/menu/drinks`,
    provider: {
      "@type": "Restaurant",
      name: SITE_CONFIG.siteName,
      url: `${SITE_CONFIG.siteUrl}/${locale}`,
      telephone: SITE_CONFIG.businessInfo.phone,
    },
    hasMenuSection: [
      {
        "@type": "MenuSection",
        name: {
          et: "Gruusia Veinid",
          en: "Georgian Wines",
          ru: "Грузинские Вина",
        }[locale],
        description: {
          et: "Gruusia veinid - saperavi, kindzmarauli, rkatsiteli",
          en: "Georgian wines - saperavi, kindzmarauli, rkatsiteli",
          ru: "Грузинские вина - саперави, киндзмараули, ркацители",
        }[locale],
      },
      {
        "@type": "MenuSection",
        name: {
          et: "Kollektsiooni Viinid",
          en: "Collection Wines",
          ru: "Коллекционные Вина",
        }[locale],
        description: {
          et: "Haruldased ja kollektsiooni viinid üle maailma",
          en: "Rare and collection wines from around the world",
          ru: "Редкие и коллекционные вина со всего мира",
        }[locale],
      },
      {
        "@type": "MenuSection",
        name: {
          et: "Elite Viski ja Konjak",
          en: "Elite Whisky & Cognac",
          ru: "Элитный Виски и Коньяк",
        }[locale],
        description: {
          et: "Kollektsiooni viski ja premium konjak",
          en: "Collection whisky and premium cognac",
          ru: "Коллекционный виски и премиум коньяк",
        }[locale],
      },
      {
        "@type": "MenuSection",
        name: {
          et: "Craft Õlu ja Eksklusiivne",
          en: "Craft Beer & Exclusive",
          ru: "Крафтовое Пиво и Эксклюзив",
        }[locale],
        description: {
          et: "Käsitööõlu ja limiteeritud väljaanded",
          en: "Craft beer and limited editions",
          ru: "Крафтовое пиво и лимитированные издания",
        }[locale],
      },
    ],
    speciality: [
      {
        et: "6000+ alkohoolset jooki",
        en: "6000+ alcoholic drinks",
        ru: "6000+ алкогольных напитков",
      }[locale],
      {
        et: "Haruldased kollektsiooni joogid",
        en: "Rare collection drinks",
        ru: "Редкие коллекционные напитки",
      }[locale],
      {
        et: "Gruusia veinide kollektsioon",
        en: "Georgian wine collection",
        ru: "Коллекция грузинских вин",
      }[locale],
      {
        et: "Someljeede ekspertvalik",
        en: "Expert sommelier selection",
        ru: "Экспертный выбор сомелье",
      }[locale],
    ],
  };

  return {
    ...seoData,
    other: {
      ...seoData.other,
      "structured-data": JSON.stringify(drinksMenuSchema),
    },
  };
}

// Метаданные для подкатегорий грузинской кухни /menu/menu/[subcategorySlug]
export async function generateFoodSubcategoryMetadata({ params, subcategory }) {
  const { locale } = await params;

  if (!subcategory) {
    return generateFoodMenuMetadata({ params });
  }

  const seoData = generateFoodSubcategorySEO(locale, subcategory);
  const subcategoryName = getLocalizedText(subcategory.name, locale);

  // Schema для подкатегории грузинской кухни
  const subcategorySchema = {
    "@context": "https://schema.org",
    "@type": "MenuSection",
    name: subcategoryName,
    description: seoData.description,
    url: `${SITE_CONFIG.siteUrl}/${locale}/menu/menu/${subcategory.slug}`,
    image:
      subcategory.image ||
      `${SITE_CONFIG.siteUrl}/images/${subcategory.slug || "sushi"}.jpg`,
    provider: {
      "@type": "Restaurant",
      name: SITE_CONFIG.siteName,
      url: `${SITE_CONFIG.siteUrl}/${locale}`,
      servesCuisine: ["Georgian", "Caucasian", "European"],
    },
    parentMenu: {
      "@type": "Menu",
      name: {
        et: "Gruusia Köök",
        en: "Georgian Cuisine",
        ru: "Грузинская Кухня",
      }[locale],
      url: `${SITE_CONFIG.siteUrl}/${locale}/menu/menu`,
    },
    speciality: {
      et: `Premium ${subcategoryName.toLowerCase()} Kyoto traditsioonides`,
      en: `Premium ${subcategoryName.toLowerCase()} in Kyoto traditions`,
      ru: `Премиум ${subcategoryName.toLowerCase()} в традициях Киото`,
    }[locale],
  };

  // Хлебные крошки для грузинской кухни
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      {
        name: { et: "Avaleht", en: "Home", ru: "Главная" }[locale],
        url: `/${locale}`,
      },
      {
        name: {
          et: "Gruusia Köök",
          en: "Georgian Cuisine",
          ru: "Грузинская Кухня",
        }[locale],
        url: `/${locale}/menu/menu`,
      },
      {
        name: subcategoryName,
        url: `/${locale}/menu/menu/${subcategory.slug}`,
      },
    ],
    locale,
  );

  return {
    ...seoData,
    other: {
      ...seoData.other,
      "structured-data": JSON.stringify([subcategorySchema, breadcrumbSchema]),
    },
  };
}

// Метаданные для подкатегорий напитков /menu/drinks/[subcategorySlug]
export async function generateDrinksSubcategoryMetadata({
  params,
  subcategory,
}) {
  const { locale } = await params;

  if (!subcategory) {
    return generateDrinksMenuMetadata({ params });
  }

  const seoData = generateDrinksSubcategorySEO(locale, subcategory);
  const subcategoryName = getLocalizedText(subcategory.name, locale);

  // Schema для подкатегории алкоголя
  const subcategorySchema = {
    "@context": "https://schema.org",
    "@type": "MenuSection",
    name: subcategoryName,
    description: seoData.description,
    url: `${SITE_CONFIG.siteUrl}/${locale}/menu/drinks/${subcategory.slug}`,
    image:
      subcategory.image ||
      `${SITE_CONFIG.siteUrl}/images/${subcategory.slug || "alcohol"}.jpg`,
    provider: {
      "@type": "Restaurant",
      name: SITE_CONFIG.siteName,
      url: `${SITE_CONFIG.siteUrl}/${locale}`,
    },
    parentMenu: {
      "@type": "Menu",
      name: {
        et: "Premium Alkohol - 6000+ Haruldast Jooki",
        en: "Premium Alcohol - 6000+ Rare Drinks",
        ru: "Премиум Алкоголь - 6000+ Редких Напитков",
      }[locale],
      url: `${SITE_CONFIG.siteUrl}/${locale}/menu/drinks`,
    },
    speciality: {
      et: `Haruldased ${subcategoryName.toLowerCase()} kollektsioonist`,
      en: `Rare ${subcategoryName.toLowerCase()} from collection`,
      ru: `Редкие ${subcategoryName.toLowerCase()} из коллекции`,
    }[locale],
  };

  // Хлебные крошки для напитков
  const breadcrumbSchema = generateBreadcrumbSchema(
    [
      {
        name: { et: "Avaleht", en: "Home", ru: "Главная" }[locale],
        url: `/${locale}`,
      },
      {
        name: {
          et: "Premium Alkohol",
          en: "Premium Alcohol",
          ru: "Премиум Алкоголь",
        }[locale],
        url: `/${locale}/menu/drinks`,
      },
      {
        name: subcategoryName,
        url: `/${locale}/menu/drinks/${subcategory.slug}`,
      },
    ],
    locale,
  );

  return {
    ...seoData,
    other: {
      ...seoData.other,
      "structured-data": JSON.stringify([subcategorySchema, breadcrumbSchema]),
    },
  };
}

// Универсальная функция для определения типа метаданных
export async function generateMenuMetadata({
  params,
  categorySlug,
  subcategorySlug,
  subcategory,
}) {
  const { locale } = await params;

  // Определяем тип категории по slug
  if (categorySlug === "menu" || categorySlug === "food") {
    if (subcategorySlug && subcategory) {
      return generateFoodSubcategoryMetadata({ params, subcategory });
    }
    return generateFoodMenuMetadata({ params });
  }

  if (categorySlug === "drinks" || categorySlug === "alcohol") {
    if (subcategorySlug && subcategory) {
      return generateDrinksSubcategoryMetadata({ params, subcategory });
    }
    return generateDrinksMenuMetadata({ params });
  }

  // По умолчанию - грузинская кухня
  return generateFoodMenuMetadata({ params });
}

// Ключевые слова для разных типов грузинских продуктов
export const PRODUCT_KEYWORDS = {
  khachapuri: {
    et: [
      "khachapuri",
      "gruusia juustupirukad",
      "adžaaria khachapuri",
      "imeruli khachapuri",
      "megruli khachapuri",
      "gruusia köök",
      "traditsioonilised retseptid",
    ],
    en: [
      "khachapuri",
      "georgian cheese bread",
      "adjarian khachapuri",
      "imeruli khachapuri",
      "megruli khachapuri",
      "georgian cuisine",
      "traditional recipes",
    ],
    ru: [
      "хачапури",
      "грузинские сырные лепешки",
      "аджарские хачапури",
      "имерули хачапури",
      "мегрули хачапури",
      "грузинская кухня",
      "традиционные рецепты",
    ],
  },
  khinkali: {
    et: [
      "khinkali",
      "gruusia pelmeenid",
      "liha khinkali",
      "juustu khinkali",
      "seene khinkali",
    ],
    en: [
      "khinkali",
      "georgian dumplings",
      "meat khinkali",
      "cheese khinkali",
      "mushroom khinkali",
    ],
    ru: [
      "хинкали",
      "грузинские пельмени",
      "хинкали с мясом",
      "хинкали с сыром",
      "хинкали с грибами",
    ],
  },
  mtsvadi: {
    et: [
      "mtsvadi",
      "gruusia šašlõkk",
      "grillitud liha",
      "traditsiooniline grill",
    ],
    en: ["mtsvadi", "georgian shashlik", "grilled meat", "traditional bbq"],
    ru: ["мцвади", "грузинский шашлык", "жареное мясо", "традиционный гриль"],
  },
  satsivi: {
    et: ["satsivi", "pähklikaste", "gruusia kaste", "traditsiooniline roog"],
    en: ["satsivi", "walnut sauce", "georgian sauce", "traditional dish"],
    ru: ["сациви", "ореховый соус", "грузинский соус", "традиционное блюдо"],
  },
  lobio: {
    et: ["lobio", "gruusia oad", "traditsiooniline lobio", "gruusia köök"],
    en: ["lobio", "georgian beans", "traditional lobio", "georgian cuisine"],
    ru: [
      "лобио",
      "грузинская фасоль",
      "традиционное лобио",
      "грузинская кухня",
    ],
  },
  wine: {
    et: [
      "gruusia vein",
      "saperavi",
      "kindzmarauli",
      "rkatsiteli",
      "gruusia veinid",
    ],
    en: [
      "georgian wine",
      "saperavi",
      "kindzmarauli",
      "rkatsiteli",
      "georgian wines",
    ],
    ru: [
      "грузинское вино",
      "саперави",
      "киндзмараули",
      "ркацители",
      "грузинские вина",
    ],
  },
  alcohol: {
    et: [
      "alkohol",
      "premium joogid",
      "haruldased joogid",
      "kollektsiooni alkohol",
      "elite joogid",
      "someljeede valik",
    ],
    en: [
      "alcohol",
      "premium drinks",
      "rare drinks",
      "collection alcohol",
      "elite drinks",
      "sommelier selection",
    ],
    ru: [
      "алкоголь",
      "премиум напитки",
      "редкие напитки",
      "коллекционный алкоголь",
      "элитные напитки",
      "выбор сомелье",
    ],
  },
};

// Специальные предложения для SEO
export const SPECIAL_OFFERS = {
  et: [
    "Gruusia köök traditsioonid",
    "6000+ haruldast alkohoolset jooki",
    "Värskelt valmistatud igapäev",
    "Gruusia köök ja veinid",
    "Toidu tellimine ja kohaletoimetamine",
    "Someljeede ekspertvalik",
  ],
  en: [
    "Georgian cuisine traditions",
    "6000+ rare alcoholic drinks",
    "Freshly prepared daily",
    "Georgian cuisine and wines",
    "Food delivery service",
    "Expert sommelier selection",
  ],
  ru: [
    "Традиции грузинской кухни",
    "6000+ редких алкогольных напитков",
    "Свежее приготовление ежедневно",
    "Грузинская кухня и вина",
    "Доставка еды",
    "Экспертный выбор сомелье",
  ],
};

// Локальные SEO фразы для Таллинна
export const LOCAL_SEO_PHRASES = {
  et: [
    "parim gruusia restoran Tallinnas",
    "gruusia restoran Tallinn",
    "gruusia köök Tallinn",
    "gruusia toidu tellimine Tallinn",
    "gruusia veinid Tallinn",
  ],
  en: [
    "best georgian restaurant in Tallinn",
    "georgian restaurant Tallinn",
    "georgian cuisine Tallinn",
    "georgian food delivery Tallinn",
    "georgian wines Tallinn",
  ],
  ru: [
    "лучший грузинский ресторан в Таллинне",
    "грузинский ресторан Таллинн",
    "грузинская кухня Таллинн",
    "доставка грузинской еды Таллинн",
    "грузинские вина Таллинн",
  ],
};
