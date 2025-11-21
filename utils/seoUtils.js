// Функции для применения скидок и форматирования цен
export const applyDiscount = (price, discountPercent) => {
  if (!discountPercent || discountPercent <= 0) return price;
  return price * (1 - discountPercent / 100);
};

export const formatPrice = (price) => {
  return `€${price.toFixed(2)}`;
};

// Основная информация о сайте
export const SITE_CONFIG = {
  siteName: "MAITSEV GRUUSIA",
  siteUrl: "https://www.maitsevgruusia.ee",
  defaultLocale: "et",
  supportedLocales: ["et", "en", "ru"],
  businessInfo: {
    phone: "+372 502 3599",
    email: "info@maitsevgruusia.ee",
    address: "Tallinn, Estonia",
    openingHours: "Mo-Su 10:00-22:00",
    established: "2024",
  },
};

// SEO мета-теги по умолчанию для разных локалей
export const DEFAULT_SEO = {
  et: {
    title: "Restoran Maitsev Gruusia | Gruusia Köök & Veinid | Tallinn",
    description:
      "Gruusia restoran Tallinnas. Gruusia köök, suur valik gruusia veine ja 6000+ alkohoolset jooki. Kohaletoimetamine, ärilõunad. Roosikrantsi 16. Avatud 10:00-22:00.",
    keywords:
      "gruusia restoran tallinn, gruusia köök, gruusia veinid, gruusia toidu kohaletoimetamine, khachapuri, khinkali, mtsvadi, satsivi, saperavi, kindzmarauli, restoran roosikrantsi, gruusia toit tallinn, georgian restaurant tallinn",
    openGraph: {
      title: "Restoran Maitsev Gruusia | Gruusia Köök & Veinid | Tallinn",
      description:
        "Gruusia restoran Tallinnas. Gruusia köök, suur valik gruusia veine ja 6000+ alkohoolset jooki. Kohaletoimetamine. Roosikrantsi 16.",
      image: `${SITE_CONFIG.siteUrl}/images/cateringpage1.jpg`,
    },
  },
  en: {
    title:
      "Georgian Restaurant Maitsev Gruusia | Georgian Cuisine & Wine | Tallinn",
    description:
      "Georgian restaurant in Tallinn. Georgian cuisine, extensive Georgian wine collection and 6000+ drinks. Food delivery, business lunch. Roosikrantsi 16. Open 10:00-22:00.",
    keywords:
      "georgian restaurant tallinn, georgian cuisine, georgian wine, georgian food delivery, khachapuri, khinkali, mtsvadi, satsivi, saperavi, kindzmarauli, restaurant roosikrantsi, georgian food tallinn, gruusia restoran",
    openGraph: {
      title:
        "Georgian Restaurant Maitsev Gruusia | Georgian Cuisine & Wine | Tallinn",
      description:
        "Georgian restaurant in Tallinn. Georgian cuisine, extensive wine collection and 6000+ drinks. Delivery available. Roosikrantsi 16.",
      image: `${SITE_CONFIG.siteUrl}/images/cateringpage1.jpg`,
    },
  },
  ru: {
    title:
      "Грузинский Ресторан Maitsev Gruusia | Грузинская Кухня и Вина | Таллинн",
    description:
      "Грузинский ресторан в Таллинне. Грузинская кухня, большой выбор грузинских вин и 6000+ напитков. Доставка еды, бизнес-ланчи. Roosikrantsi 16. Открыто 10:00-22:00.",
    keywords:
      "грузинский ресторан таллинн, грузинская кухня, грузинские вина, доставка грузинской еды, хачапури, хинкали, мцвади, сациви, саперави, киндзмараули, ресторан roosikrantsi, грузинская еда таллинн, georgian restaurant tallinn",
    openGraph: {
      title:
        "Грузинский Ресторан Maitsev Gruusia | Грузинская Кухня и Вина | Таллинн",
      description:
        "Грузинский ресторан в Таллинне. Грузинская кухня, большой выбор вин и 6000+ напитков. Доставка. Roosikrantsi 16.",
      image: `${SITE_CONFIG.siteUrl}/images/cateringpage1.jpg`,
    },
  },
};

// Генерация мета-тегов для главной страницы
export const generateHomeSEO = (locale = "et") => {
  const seo = DEFAULT_SEO[locale] || DEFAULT_SEO.et;

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords,
    canonical: `${SITE_CONFIG.siteUrl}/${locale}`,
    openGraph: {
      title: seo.openGraph.title,
      description: seo.openGraph.description,
      images: [
        {
          url: `${SITE_CONFIG.siteUrl}${seo.openGraph.image}`,
          width: 1600,
          height: 1080,
          alt: seo.openGraph.title,
          type: "image/jpeg",
        },
      ],
      url: `${SITE_CONFIG.siteUrl}/${locale}`,
      type: "website",
      siteName: SITE_CONFIG.siteName,
      locale: locale === "et" ? "et_EE" : locale === "en" ? "en_US" : "ru_RU",
    },
    twitter: {
      card: "summary_large_image",
      title: seo.openGraph.title,
      description: seo.openGraph.description,
      image: `${SITE_CONFIG.siteUrl}${seo.openGraph.image}`,
      site: "@maitsevgruusia",
      creator: "@maitsevgruusia",
    },
    alternates: {
      canonical: `${SITE_CONFIG.siteUrl}/${locale}`,
      languages: SITE_CONFIG.supportedLocales.reduce((acc, loc) => {
        acc[loc] = `${SITE_CONFIG.siteUrl}/${loc}`;
        return acc;
      }, {}),
    },
    other: {
      "business:contact_data:phone_number": SITE_CONFIG.businessInfo.phone,
      "business:contact_data:email": SITE_CONFIG.businessInfo.email,
      "business:contact_data:street_address": SITE_CONFIG.businessInfo.address,
      "business:hours": SITE_CONFIG.businessInfo.openingHours,
    },
  };
};

// Генерация мета-тегов для страницы еды (menu/menu)
export const generateFoodMenuSEO = (locale = "et") => {
  const titles = {
    et: "Gruusia Köök - Khachapuri, Khinkali, Mtsvadi | Maitsev Gruusia Tallinn",
    en: "Georgian Cuisine - Khachapuri, Khinkali, Mtsvadi | Maitsev Gruusia Tallinn",
    ru: "Грузинская Кухня - Хачапури, Хинкали, Мцвади | Maitsev Gruusia Таллинн",
  };

  const descriptions = {
    et: "Avasta gruusia kööki Tallinnas! Khachapuri, khinkali, mtsvadi ja gruusia veinid. Traditsioonilised retseptid, värskelt valmistatud. Kohaletoimetamine või kohapeal. Roosikrantsi 16.",
    en: "Discover Georgian cuisine in Tallinn! Khachapuri, khinkali, mtsvadi and Georgian wines. Traditional recipes, freshly prepared. Delivery or dine-in. Roosikrantsi 16.",
    ru: "Откройте грузинскую кухню в Таллинне! Хачапури, хинкали, мцвади и грузинские вина. Традиционные рецепты, свежее приготовление. Доставка или в ресторане. Roosikrantsi 16.",
  };

  const keywords = {
    et: "gruusia köök tallinn, khachapuri, khinkali, mtsvadi, satsivi, gruusia veinid, gruusia restoran, gruusia toit, roosikrantsi",
    en: "georgian cuisine tallinn, khachapuri, khinkali, mtsvadi, satsivi, georgian wines, georgian restaurant, georgian food, roosikrantsi",
    ru: "грузинская кухня таллинн, хачапури, хинкали, мцвади, сациви, грузинские вина, грузинский ресторан, грузинская еда, roosikrantsi",
  };

  return {
    title: titles[locale] || titles.et,
    description: descriptions[locale] || descriptions.et,
    keywords: keywords[locale] || keywords.et,
    canonical: `${SITE_CONFIG.siteUrl}/${locale}/menu/menu`,
    openGraph: {
      title: titles[locale] || titles.et,
      description: descriptions[locale] || descriptions.et,
      images: [
        {
          url: `${SITE_CONFIG.siteUrl}/images/georgian-menu.jpg`,
          width: 1200,
          height: 630,
          alt: "Gruusia köök",
          type: "image/jpeg",
        },
      ],
      url: `${SITE_CONFIG.siteUrl}/${locale}/menu/menu`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] || titles.et,
      description: descriptions[locale] || descriptions.et,
      image: `${SITE_CONFIG.siteUrl}/images/georgian-menu.jpg`,
    },
    alternates: {
      canonical: `${SITE_CONFIG.siteUrl}/${locale}/menu/menu`,
      languages: SITE_CONFIG.supportedLocales.reduce((acc, loc) => {
        acc[loc] = `${SITE_CONFIG.siteUrl}/${loc}/menu/menu`;
        return acc;
      }, {}),
    },
  };
};

// Генерация мета-тегов для страницы напитков (menu/drinks)
export const generateDrinksMenuSEO = (locale = "et") => {
  const titles = {
    et: "6000+ Alkohoolset Jooki | Gruusia Veinid | Maitsev Gruusia",
    en: "6000+ Alcoholic Drinks | Georgian Wines | Maitsev Gruusia",
    ru: "6000+ Алкогольных Напитков | Грузинские Вина | Maitsev Gruusia",
  };

  const descriptions = {
    et: "Eesti suurim alkoholi kollektsioon! 6000+ jooki: gruusia veinid, saperavi, kindzmarauli, chacha. Haruldased aastakäigud ja kollektsioonid.",
    en: "Estonia's largest alcohol collection! 6000+ drinks: Georgian wines, saperavi, kindzmarauli, chacha. Rare vintages and collections.",
    ru: "Крупнейшая коллекция алкоголя в Эстонии! 6000+ напитков: грузинские вина, саперави, киндзмараули, чача. Редкие винтажи и коллекции.",
  };

  const keywords = {
    et: "gruusia veinid, saperavi, kindzmarauli, chacha, kollektsiooni viin, haruldased joogid, 6000 jooki, alkohol tallinn",
    en: "georgian wines, saperavi, kindzmarauli, chacha, collection wine, rare drinks, 6000 drinks, alcohol tallinn",
    ru: "грузинские вина, саперави, киндзмараули, чача, коллекционное вино, редкие напитки, 6000 напитков, алкоголь таллинн",
  };

  return {
    title: titles[locale] || titles.et,
    description: descriptions[locale] || descriptions.et,
    keywords: keywords[locale] || keywords.et,
    canonical: `${SITE_CONFIG.siteUrl}/${locale}/menu/drinks`,
    openGraph: {
      title: titles[locale] || titles.et,
      description: descriptions[locale] || descriptions.et,
      images: [
        {
          url: `${SITE_CONFIG.siteUrl}/images/premium-drinks.jpg`,
          width: 1200,
          height: 630,
          alt: "Premium alkohoolsed joogid",
          type: "image/jpeg",
        },
      ],
      url: `${SITE_CONFIG.siteUrl}/${locale}/menu/drinks`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] || titles.et,
      description: descriptions[locale] || descriptions.et,
      image: `${SITE_CONFIG.siteUrl}/images/premium-drinks.jpg`,
    },
    alternates: {
      canonical: `${SITE_CONFIG.siteUrl}/${locale}/menu/drinks`,
      languages: SITE_CONFIG.supportedLocales.reduce((acc, loc) => {
        acc[loc] = `${SITE_CONFIG.siteUrl}/${loc}/menu/drinks`;
        return acc;
      }, {}),
    },
  };
};

// Генерация мета-тегов для подкатегорий еды
export const generateFoodSubcategorySEO = (
  locale = "et",
  subcategory = null,
) => {
  if (!subcategory) return generateFoodMenuSEO(locale);

  const subcategoryName = getLocalizedText(subcategory.name, locale);
  const subcategoryDescription = getLocalizedText(
    subcategory.description,
    locale,
  );

  const titles = {
    et: `${subcategoryName} - Gruusia Köök | Maitsev Gruusia Tallinn`,
    en: `${subcategoryName} - Georgian Cuisine | Maitsev Gruusia Tallinn`,
    ru: `${subcategoryName} - Грузинская Кухня | Maitsev Gruusia Таллинн`,
  };

  const descriptions = {
    et: `Avasta meie ${subcategoryName.toLowerCase()} kollektsiooni! ${subcategoryDescription || "Gruusia köök traditsiooniliste retseptidega. Värskelt valmistatud."} Kohaletoimetamine või kohapeal Tallinnas.`,
    en: `Discover our ${subcategoryName.toLowerCase()} collection! ${subcategoryDescription || "Georgian cuisine with traditional recipes. Freshly prepared."} Delivery or dine-in in Tallinn.`,
    ru: `Откройте нашу коллекцию ${subcategoryName.toLowerCase()}! ${subcategoryDescription || "Грузинская кухня с традиционными рецептами. Свежее приготовление."} Доставка или в ресторане в Таллинне.`,
  };

  const keywords = {
    et: `${subcategoryName.toLowerCase()}, gruusia köök, gruusia toit, ${subcategory.slug}, tallinn, roosikrantsi`,
    en: `${subcategoryName.toLowerCase()}, georgian cuisine, georgian food, ${subcategory.slug}, tallinn, roosikrantsi`,
    ru: `${subcategoryName.toLowerCase()}, грузинская кухня, грузинская еда, ${subcategory.slug}, таллинн, roosikrantsi`,
  };

  return {
    title: titles[locale] || titles.et,
    description: descriptions[locale] || descriptions.et,
    keywords: keywords[locale] || keywords.et,
    canonical: `${SITE_CONFIG.siteUrl}/${locale}/menu/menu/${subcategory.slug}`,
    openGraph: {
      title: titles[locale] || titles.et,
      description: descriptions[locale] || descriptions.et,
      images: [
        {
          url: `${SITE_CONFIG.siteUrl}/images/${subcategory.slug || "khachapuri"}.jpg`,
          width: 1200,
          height: 630,
          alt: subcategoryName,
          type: "image/jpeg",
        },
      ],
      url: `${SITE_CONFIG.siteUrl}/${locale}/menu/menu/${subcategory.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] || titles.et,
      description: descriptions[locale] || descriptions.et,
      image: `${SITE_CONFIG.siteUrl}/images/${subcategory.slug || "khachapuri"}.jpg`,
    },
    alternates: {
      canonical: `${SITE_CONFIG.siteUrl}/${locale}/menu/menu/${subcategory.slug}`,
      languages: SITE_CONFIG.supportedLocales.reduce((acc, loc) => {
        acc[loc] =
          `${SITE_CONFIG.siteUrl}/${loc}/menu/menu/${subcategory.slug}`;
        return acc;
      }, {}),
    },
  };
};

// Генерация мета-тегов для подкатегорий напитков
export const generateDrinksSubcategorySEO = (
  locale = "et",
  subcategory = null,
) => {
  if (!subcategory) return generateDrinksMenuSEO(locale);

  const subcategoryName = getLocalizedText(subcategory.name, locale);
  const subcategoryDescription = getLocalizedText(
    subcategory.description,
    locale,
  );

  const titles = {
    et: `${subcategoryName} - Alkohol & Veinid | Maitsev Gruusia Tallinn`,
    en: `${subcategoryName} - Alcohol & Wines | Maitsev Gruusia Tallinn`,
    ru: `${subcategoryName} - Алкоголь и Вина | Maitsev Gruusia Таллинн`,
  };

  const descriptions = {
    et: `Avasta meie ${subcategoryName.toLowerCase()} kollektsiooni! ${subcategoryDescription || "Alkohoolsed joogid ja haruldased kollektsioonid."} Suurim valik Eestis - 6000+ jooki.`,
    en: `Discover our ${subcategoryName.toLowerCase()} collection! ${subcategoryDescription || "Alcoholic drinks and rare collections."} Largest selection in Estonia - 6000+ drinks.`,
    ru: `Откройте нашу коллекцию ${subcategoryName.toLowerCase()}! ${subcategoryDescription || "Алкогольные напитки и редкие коллекции."} Крупнейший выбор в Эстонии - 6000+ напитков.`,
  };

  const keywords = {
    et: `${subcategoryName.toLowerCase()}, alkohol, haruldased joogid, ${subcategory.slug}, kollektsioon, tallinn`,
    en: `${subcategoryName.toLowerCase()}, alcohol, rare drinks, ${subcategory.slug}, collection, tallinn`,
    ru: `${subcategoryName.toLowerCase()}, алкоголь, редкие напитки, ${subcategory.slug}, коллекция, таллинн`,
  };

  return {
    title: titles[locale] || titles.et,
    description: descriptions[locale] || descriptions.et,
    keywords: keywords[locale] || keywords.et,
    canonical: `${SITE_CONFIG.siteUrl}/${locale}/menu/drinks/${subcategory.slug}`,
    openGraph: {
      title: titles[locale] || titles.et,
      description: descriptions[locale] || descriptions.et,
      images: [
        {
          url: `${SITE_CONFIG.siteUrl}/images/${subcategory.slug || "alcohol"}.jpg`,
          width: 1200,
          height: 630,
          alt: subcategoryName,
          type: "image/jpeg",
        },
      ],
      url: `${SITE_CONFIG.siteUrl}/${locale}/menu/drinks/${subcategory.slug}`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] || titles.et,
      description: descriptions[locale] || descriptions.et,
      image: `${SITE_CONFIG.siteUrl}/images/${subcategory.slug || "alcohol"}.jpg`,
    },
    alternates: {
      canonical: `${SITE_CONFIG.siteUrl}/${locale}/menu/drinks/${subcategory.slug}`,
      languages: SITE_CONFIG.supportedLocales.reduce((acc, loc) => {
        acc[loc] =
          `${SITE_CONFIG.siteUrl}/${loc}/menu/drinks/${subcategory.slug}`;
        return acc;
      }, {}),
    },
  };
};

// Генерация мета-тегов для продуктов
export const generateProductSEO = (
  locale = "et",
  product = null,
  subcategory = null,
  categoryType = "menu",
) => {
  if (!product) return null;

  const productName = getLocalizedText(product.title || product.name, locale);
  const productDescription = getLocalizedText(product.description, locale);
  const subcategoryName = subcategory
    ? getLocalizedText(subcategory.name, locale)
    : "";

  const isAlcohol = categoryType === "drinks";
  const price = product.price || product.priceRange?.min || 0;
  const discountedPrice = product.discountPercent
    ? applyDiscount(price, product.discountPercent)
    : price;

  const titles = {
    et: `${productName} - ${subcategoryName} | Maitsev Gruusia Tallinn`,
    en: `${productName} - ${subcategoryName} | Maitsev Gruusia Tallinn`,
    ru: `${productName} - ${subcategoryName} | Maitsev Gruusia Таллинн`,
  };

  const descriptions = {
    et: `${productName} - ${productDescription || (isAlcohol ? "Alkohoolne jook meie kollektsioonist" : "Gruusia roog traditsiooniliste retseptidega")}. ${isAlcohol ? "Haruldane kollektsiooni alkohol" : "Värskelt valmistatud"}. Alates ${formatPrice(discountedPrice)}.`,
    en: `${productName} - ${productDescription || (isAlcohol ? "Alcoholic drink from our collection" : "Georgian dish with traditional recipes")}. ${isAlcohol ? "Rare collection alcohol" : "Freshly prepared"}. From ${formatPrice(discountedPrice)}.`,
    ru: `${productName} - ${productDescription || (isAlcohol ? "Алкогольный напиток из нашей коллекции" : "Грузинское блюдо с традиционными рецептами")}. ${isAlcohol ? "Редкий коллекционный алкоголь" : "Свежее приготовление"}. От ${formatPrice(discountedPrice)}.`,
  };

  const keywords = {
    et: `${productName}, ${subcategoryName}, ${isAlcohol ? "alkohol tallinn, haruldased joogid eesti, kollektsiooni alkohol" : "gruusia köök tallinn, gruusia toit, kohaletoimetamine"}, tallinn, ${product.slug}`,
    en: `${productName}, ${subcategoryName}, ${isAlcohol ? "alcohol tallinn, rare drinks estonia, collection spirits" : "georgian cuisine tallinn, georgian food, delivery"}, tallinn, ${product.slug}`,
    ru: `${productName}, ${subcategoryName}, ${isAlcohol ? "алкоголь таллинн, редкие напитки эстония, коллекционные спиртные" : "грузинская кухня таллинн, грузинская еда, доставка"}, таллинн, ${product.slug}`,
  };

  const basePath = isAlcohol ? "drinks" : "menu";
  const productUrl = `${SITE_CONFIG.siteUrl}/${locale}/menu/${basePath}/${subcategory?.slug}/${product.slug}`;

  return {
    title: titles[locale] || titles.et,
    description: descriptions[locale] || descriptions.et,
    keywords: keywords[locale] || keywords.et,
    canonical: productUrl,
    openGraph: {
      title: titles[locale] || titles.et,
      description: descriptions[locale] || descriptions.et,
      images: [
        {
          url: product.imageUrl
            ? `${SITE_CONFIG.siteUrl}${product.imageUrl}`
            : `${SITE_CONFIG.siteUrl}/images/${product.slug || "default"}.jpg`,
          width: 800,
          height: 600,
          alt: productName,
          type: "image/jpeg",
        },
      ],
      url: productUrl,
      type: "product",
      product: {
        price: {
          amount: discountedPrice.toFixed(2),
          currency: "EUR",
        },
        availability: product.available !== false ? "in stock" : "out of stock",
        category: subcategoryName,
      },
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] || titles.et,
      description: descriptions[locale] || descriptions.et,
      image: product.imageUrl
        ? `${SITE_CONFIG.siteUrl}${product.imageUrl}`
        : `${SITE_CONFIG.siteUrl}/images/${product.slug || "default"}.jpg`,
    },
    alternates: {
      canonical: productUrl,
      languages: SITE_CONFIG.supportedLocales.reduce((acc, loc) => {
        acc[loc] =
          `${SITE_CONFIG.siteUrl}/${loc}/menu/${basePath}/${subcategory?.slug}/${product.slug}`;
        return acc;
      }, {}),
    },
  };
};

// Генерация мета-тегов для страницы кейтеринга
export const generateCateringSEO = (locale = "et") => {
  const titles = {
    et: "Gruusia Toidu Tellimine | Ärilõunad | Ürituste Toitlustus | Maitsev Gruusia",
    en: "Georgian Food Delivery | Business Lunch | Event Catering | Maitsev Gruusia",
    ru: "Доставка Грузинской Еды | Бизнес-Ланчи | Кейтеринг | Maitsev Gruusia",
  };

  const descriptions = {
    et: "Gruusia toidu tellimine Tallinnas! Khachapuri, khinkali, gruusia veinid. Ärilõunad, ürituste toitlustus. 6000+ alkohoolset jooki. Tellimine +372 502 3599",
    en: "Georgian food delivery in Tallinn! Khachapuri, khinkali, Georgian wines. Business lunch, event catering. 6000+ alcoholic drinks. Order +372 502 3599",
    ru: "Доставка грузинской еды в Таллинне! Хачапури, хинкали, грузинские вина. Бизнес-ланчи, кейтеринг мероприятий. 6000+ алкогольных напитков. Заказ +372 502 3599",
  };

  const keywords = {
    et: "gruusia toidu tellimine tallinn, ärilõuna tallinn, toitlustus tallinn, korporatiivne toitlustus, kontori lõuna tallinn, äriüritused tallinn, gruusia köök catering, ärilunch, kontori toitlustus eesti, lõuna kohaletoimetamine, gruusia toitlustus teenused, ürituste toitlustus tallinn, koosoleku toitlustus tallinn, konverentsi toitlustus eesti, firma lõuna, töökoha toitlustus",
    en: "georgian food delivery tallinn, business lunch tallinn, catering tallinn, corporate catering tallinn, business events tallinn, catering estonia, georgian catering services, office catering tallinn, corporate lunch delivery, meeting catering, conference catering, company catering estonia, workplace lunch, business meeting catering, event catering tallinn, executive lunch catering",
    ru: "доставка грузинской еды таллинн, бизнес ланч таллинн, кейтеринг таллинн, корпоративный кейтеринг таллинн, командный ланч таллинн, бизнес мероприятия таллинн, кейтеринг эстония, грузинский кейтеринг услуги, офисный кейтеринг таллинн, корпоративный ланч доставка, кейтеринг совещаний, конференц кейтеринг, компании кейтеринг эстония, рабочий ланч, бизнес встречи кейтеринг",
  };

  return {
    title: titles[locale] || titles.et,
    description: descriptions[locale] || descriptions.et,
    keywords: keywords[locale] || keywords.et,
    canonical: `${SITE_CONFIG.siteUrl}/${locale}/catering`,
    openGraph: {
      title: titles[locale] || titles.et,
      description: descriptions[locale] || descriptions.et,
      images: [
        {
          url: `${SITE_CONFIG.siteUrl}/images/catering.jpg`,
          width: 1200,
          height: 630,
          alt: "Gruusia toidu tellimine",
          type: "image/jpeg",
        },
      ],
      url: `${SITE_CONFIG.siteUrl}/${locale}/catering`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] || titles.et,
      description: descriptions[locale] || descriptions.et,
      image: `${SITE_CONFIG.siteUrl}/images/catering.jpg`,
    },
    alternates: {
      canonical: `${SITE_CONFIG.siteUrl}/${locale}/catering`,
      languages: SITE_CONFIG.supportedLocales.reduce((acc, loc) => {
        acc[loc] = `${SITE_CONFIG.siteUrl}/${loc}/catering`;
        return acc;
      }, {}),
    },
  };
};

// Генерация Schema.org для ресторана
export const generateRestaurantSchema = (locale = "et") => {
  return {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "@id": `${SITE_CONFIG.siteUrl}#restaurant`,
    name: SITE_CONFIG.siteName,
    description: DEFAULT_SEO[locale].description,
    url: `${SITE_CONFIG.siteUrl}/${locale}`,
    telephone: SITE_CONFIG.businessInfo.phone,
    email: SITE_CONFIG.businessInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.businessInfo.address,
      addressLocality: "Tallinn",
      addressCountry: "EE",
    },
    servesCuisine: ["Georgian", "Caucasian", "European"],
    priceRange: "€€",
    hasDeliveryService: true,
    acceptsReservations: true,
    image: `${SITE_CONFIG.siteUrl}/images/cateringpage1.jpg`,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "11:00",
      closes: "23:00",
    },
  };
};

// Генерация хлебных крошек
export const generateBreadcrumbSchema = (breadcrumbs, locale = "et") => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${SITE_CONFIG.siteUrl}${crumb.url}`,
    })),
  };
};

// Генерация robots meta
export const generateRobotsMeta = () => {
  return {
    robots:
      "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    googlebot:
      "index, follow, max-video-preview:-1, max-image-preview:large, max-snippet:-1",
  };
};

// Генерация SEO для 404 страницы
export const generate404SEO = (locale = "et") => {
  const translations = {
    et: {
      title: "Leht ei leitud | MAITSEV GRUUSIA",
      description:
        "Otsitud lehte ei leitud. Külastage meie gruusia köögi menüüd või vaadake meie alkohoolsete jookide valikut.",
    },
    en: {
      title: "Page Not Found | MAITSEV GRUUSIA",
      description:
        "The page you are looking for was not found. Visit our Georgian cuisine menu or check out our alcoholic drinks selection.",
    },
    ru: {
      title: "Страница не найдена | MAITSEV GRUUSIA",
      description:
        "Страница, которую вы ищете, не найдена. Посетите наше меню грузинской кухни или ознакомьтесь с нашим выбором алкогольных напитков.",
    },
  };

  const content = translations[locale] || translations.et;

  return {
    title: content.title,
    description: content.description,
    robots: "noindex, nofollow",
  };
};

// Санитизация SEO данных
export const sanitizeSEOData = (data) => {
  if (!data || typeof data !== "object") return {};

  const sanitized = {};

  Object.keys(data).forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) {
      if (typeof data[key] === "string") {
        sanitized[key] = data[key].trim().replace(/\s+/g, " ");
      } else if (typeof data[key] === "object") {
        sanitized[key] = sanitizeSEOData(data[key]);
      } else {
        sanitized[key] = data[key];
      }
    }
  });

  return sanitized;
};

// Функция для получения локализованного текста
export const getLocalizedText = (textObj, locale = "et") => {
  if (!textObj) return "";
  if (typeof textObj === "string") return textObj;
  return (
    textObj[locale] ||
    textObj.en ||
    textObj.et ||
    Object.values(textObj)[0] ||
    ""
  );
};

// Функция для определения типа категории по slug
export const getCategoryType = (categorySlug) => {
  const drinkCategories = [
    "drinks",
    "alcohol",
    "beverage",
    "wine",
    "beer",
    "sake",
    "cocktail",
  ];

  if (
    drinkCategories.some((cat) => categorySlug?.toLowerCase().includes(cat))
  ) {
    return "drinks";
  }
  return "menu"; // по умолчанию еда
};

// Генерация универсального SEO в зависимости от типа
export const generateMenuSEO = (categorySlug, locale = "et") => {
  const categoryType = getCategoryType(categorySlug);

  if (categoryType === "drinks") {
    return generateDrinksMenuSEO(locale);
  } else {
    return generateFoodMenuSEO(locale);
  }
};

// Генерация универсального SEO для подкатегорий
export const generateSubcategorySEO = (
  locale = "et",
  subcategory = null,
  categorySlug = null,
) => {
  const categoryType = getCategoryType(categorySlug);

  if (categoryType === "drinks") {
    return generateDrinksSubcategorySEO(locale, subcategory);
  } else {
    return generateFoodSubcategorySEO(locale, subcategory);
  }
};

// ===== SEMANTIC KEYWORD HELPERS =====

// Семантические группы ключевых слов для разных типов контента
export const SEMANTIC_KEYWORDS = {
  food: {
    et: [
      "gruusia restoran tallinn",
      "gruusia köök",
      "khachapuri",
      "khinkali",
      "mtsvadi",
      "satsivi",
      "gruusia veinid",
      "saperavi",
      "kindzmarauli",
      "gruusia toidu kohaletoimetamine",
      "traditsioonilised retseptid",
      "käsitöö toit",
    ],
    en: [
      "georgian restaurant tallinn",
      "georgian cuisine",
      "khachapuri",
      "khinkali",
      "mtsvadi",
      "satsivi",
      "georgian wine",
      "saperavi",
      "kindzmarauli",
      "georgian food delivery",
      "traditional recipes",
      "handmade food",
    ],
    ru: [
      "грузинский ресторан таллинн",
      "грузинская кухня",
      "хачапури",
      "хинкали",
      "мцвади",
      "сациви",
      "грузинские вина",
      "саперави",
      "киндзмараули",
      "доставка грузинской еды",
      "традиционные рецепты",
      "ручная работа",
    ],
  },
  catering: {
    et: [
      "kateering Tallinn",
      "team lunch Tallinn",
      "äriüritused",
      "korporatiivne kateering",
      "office catering",
      "business lunch",
      "meeting catering",
      "conference catering",
      "workplace lunch",
      "company events",
      "corporate events",
      "executive catering",
    ],
    en: [
      "catering Tallinn",
      "team lunch Tallinn",
      "business events",
      "corporate catering",
      "office catering",
      "business lunch",
      "meeting catering",
      "conference catering",
      "workplace lunch",
      "company events",
      "corporate events",
      "executive catering",
    ],
    ru: [
      "кейтеринг Таллинн",
      "командный ланч Таллинн",
      "бизнес мероприятия",
      "корпоративный кейтеринг",
      "офисный кейтеринг",
      "бизнес ланч",
      "кейтеринг совещаний",
      "конференц кейтеринг",
      "рабочий ланч",
      "корпоративные мероприятия",
      "деловые события",
      "представительский кейтеринг",
    ],
  },
  alcohol: {
    et: [
      "alkohol",
      "haruldased joogid",
      "kollektsiooni alkohol",
      "craft spirits",
      "gruusia veinid",
      "chacha",
      "alkohol eesti",
      "haruldane alkohol",
      "kollektsiooni joogid",
      "eksklusiivsed joogid",
      "alkoholi kollektsioon",
    ],
    en: [
      "alcohol",
      "rare drinks",
      "collection spirits",
      "craft spirits",
      "georgian wines",
      "chacha",
      "spirits estonia",
      "rare alcohol",
      "collectible drinks",
      "exclusive spirits",
      "alcohol collection",
    ],
    ru: [
      "алкоголь",
      "редкие напитки",
      "коллекционные спиртные",
      "крафтовые спиртные",
      "грузинские вина",
      "чача",
      "алкоголь эстония",
      "редкий алкоголь",
      "коллекционные напитки",
      "эксклюзивные спиртные",
      "коллекция алкоголя",
    ],
  },
  georgian: {
    et: [
      "gruusia köök",
      "kaukaasia köök",
      "gruusia toit",
      "gruusia restoran",
      "lobio",
      "pkhali",
      "badrijani",
      "chakhokhbili",
      "kharcho",
      "gruusia söögikultuur",
      "gruusia traditsioonid",
      "gruusia veinid",
      "supra",
      "tamada",
    ],
    en: [
      "georgian cuisine",
      "caucasian food",
      "georgian food",
      "georgian restaurant",
      "lobio",
      "pkhali",
      "badrijani",
      "chakhokhbili",
      "kharcho",
      "georgian dining",
      "georgian traditions",
      "georgian wines",
      "supra",
      "tamada",
    ],
    ru: [
      "грузинская кухня",
      "кавказская еда",
      "грузинская еда",
      "грузинский ресторан",
      "лобио",
      "пхали",
      "бадриджани",
      "чахохбили",
      "харчо",
      "грузинский ресторан",
      "грузинские традиции",
      "грузинские вина",
      "супра",
      "тамада",
    ],
  },
};

// Функция для получения семантических ключевых слов по типу контента
export const getSemanticKeywords = (type, locale = "et", limit = 8) => {
  const keywords = SEMANTIC_KEYWORDS[type]?.[locale] || [];
  return limit ? keywords.slice(0, limit) : keywords;
};

// Функция для создания длинных хвостов (long-tail keywords)
export const generateLongTailKeywords = (
  baseKeyword,
  location = "Tallinn",
  locale = "et",
) => {
  const modifiers = {
    et: ["parim", "kvaliteetne", "autentne", "fresh", "professional", "kiire"],
    en: ["best", "quality", "authentic", "fresh", "professional", "fast"],
    ru: [
      "лучший",
      "качественный",
      "аутентичный",
      "свежий",
      "профессиональный",
      "быстрый",
    ],
  };

  const suffixes = {
    et: ["teenus", "kohaletoimetamine", "restoran", "köök", "tellimus"],
    en: ["service", "delivery", "restaurant", "cuisine", "order"],
    ru: ["услуга", "доставка", "ресторан", "кухня", "заказ"],
  };

  const longTails = [];
  const currentModifiers = modifiers[locale] || modifiers.et;
  const currentSuffixes = suffixes[locale] || suffixes.et;

  // Генерируем комбинации
  currentModifiers.forEach((modifier) => {
    longTails.push(`${modifier} ${baseKeyword} ${location}`);
  });

  currentSuffixes.forEach((suffix) => {
    longTails.push(`${baseKeyword} ${suffix} ${location}`);
  });

  return longTails.slice(0, 6); // Ограничиваем количество
};

// Функция для создания оптимального набора ключевых слов
export const buildOptimalKeywordSet = (
  primaryKeywords,
  semanticType,
  locale = "et",
) => {
  const semantic = getSemanticKeywords(semanticType, locale, 6);
  const longTail = generateLongTailKeywords(
    primaryKeywords[0],
    "Tallinn",
    locale,
  );

  // Объединяем и удаляем дубликаты
  const allKeywords = [...primaryKeywords, ...semantic, ...longTail];
  const uniqueKeywords = [...new Set(allKeywords)];

  // Ограничиваем до 20 ключевых слов для оптимальной плотности
  return uniqueKeywords.slice(0, 20).join(", ");
};

// Усовершенствованная функция генерации SEO для главной страницы
export const generateEnhancedHomeSEO = (locale = "et") => {
  const baseSEO = generateHomeSEO(locale);

  // Создаем улучшенные ключевые слова с использованием семантических групп
  const enhancedKeywords =
    buildOptimalKeywordSet(
      locale === "et"
        ? ["gruusia restoran tallinn", "gruusia köök", "khachapuri tallinn"]
        : locale === "en"
          ? [
              "georgian restaurant tallinn",
              "georgian cuisine",
              "khachapuri tallinn",
            ]
          : [
              "грузинский ресторан таллинн",
              "грузинская кухня",
              "хачапури таллинн",
            ],
      "food",
      locale,
    ) +
    ", " +
    getSemanticKeywords("catering", locale, 6).join(", ") +
    ", " +
    getSemanticKeywords("alcohol", locale, 4).join(", ");

  return {
    ...baseSEO,
    keywords: enhancedKeywords,
  };
};

// Функция для динамической генерации ключевых слов для любой страницы
export const generateDynamicKeywords = (
  type,
  locale = "et",
  customKeywords = [],
) => {
  const base = customKeywords.length > 0 ? customKeywords : ["sushi Tallinn"];
  return buildOptimalKeywordSet(base, type, locale);
};
