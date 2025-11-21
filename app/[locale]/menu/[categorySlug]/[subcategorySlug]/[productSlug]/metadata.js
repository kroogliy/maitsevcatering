// SEO Metadata for Product Pages - MAITSEV GRUUSIA
// Advanced SEO optimization for individual products with structured data

import { formatPrice, applyDiscount } from "../../../../../../utils/seoUtils";

export async function generateProductMetadata({
  params,
  product,
  category,
  subcategory,
}) {
  const { locale } = await params;

  if (!product) {
    return {
      title: {
        et: "Toode ei leitud - MAITSEV GRUUSIA",
        en: "Product not found - MAITSEV GRUUSIA",
        ru: "Товар не найден - MAITSEV GRUUSIA",
      }[locale],
      robots: "noindex, nofollow",
    };
  }

  // Extract product information
  const productName =
    product.name ||
    product.title?.[locale] ||
    product.title?.et ||
    product.title ||
    "Toode";
  const productDesc =
    product.description?.[locale] ||
    product.description?.et ||
    product.description ||
    "";
  const categoryName =
    category?.name?.[locale] || category?.name?.et || category?.name || "";
  const subcategoryName =
    subcategory?.name?.[locale] ||
    subcategory?.name?.et ||
    subcategory?.name ||
    "";

  // Apply discount to price for SEO
  const originalPrice = product.price || 0;
  const discountedPrice = product.discountPercent
    ? applyDiscount(originalPrice, product.discountPercent)
    : originalPrice;
  const formattedPrice = formatPrice(discountedPrice);

  // Determine product type
  const isDrink = category?.slug === "drinks" || product.volume !== undefined;
  const isAlcoholic = product.isAlcoholic || product.degree > 0;
  const isKhachapuri =
    !isDrink &&
    (subcategoryName.toLowerCase().includes("khachapuri") ||
      productName.toLowerCase().includes("khachapuri"));
  const isWine =
    isDrink &&
    (productName.toLowerCase().includes("wine") ||
      productName.toLowerCase().includes("saperavi") ||
      productName.toLowerCase().includes("kindzmarauli"));

  // Generate SEO data based on locale and product type
  const seoData = {
    et: {
      title: isDrink
        ? `${productName} - ${formattedPrice} | Gruusia Veinid & Alkohol | MAITSEV GRUUSIA`
        : `${productName} - ${formattedPrice} | Gruusia Köök | MAITSEV GRUUSIA`,
      description: `🍴 Tellida ${productName} - gruusia köök. ${productDesc || ""} Hind ${formattedPrice}. Kohaletoimetamine Tallinnas. Roosikrantsi 16.`,
      keywords: isKhachapuri
        ? `${productName}, khachapuri, gruusia köök, ${subcategoryName}, gruusia restoran tallinn, ${formattedPrice}`
        : isWine
          ? `${productName}, gruusia vein, saperavi, kindzmarauli, ${subcategoryName}, gruusia veinid tallinn, ${formattedPrice}`
          : isDrink
            ? `${productName}, alkohol, ${subcategoryName}, alkohoolsed joogid tallinn, haruldased joogid, ${formattedPrice}`
            : `${productName}, gruusia köök, ${subcategoryName}, tallinn restoran, gruusia toit, ${formattedPrice}`,
    },
    en: {
      title: isDrink
        ? `${productName} - ${formattedPrice} | Georgian Wine & Alcohol | MAITSEV GRUUSIA`
        : `${productName} - ${formattedPrice} | Georgian Cuisine | MAITSEV GRUUSIA`,
      description: `🍴 Order ${productName} - Georgian cuisine. ${productDesc || ""} Price ${formattedPrice}. Delivery in Tallinn. Roosikrantsi 16.`,
      keywords: isKhachapuri
        ? `${productName}, khachapuri, georgian cuisine, ${subcategoryName}, georgian restaurant tallinn, ${formattedPrice}`
        : isWine
          ? `${productName}, georgian wine, saperavi, kindzmarauli, ${subcategoryName}, georgian wines tallinn, ${formattedPrice}`
          : isDrink
            ? `${productName}, alcohol, ${subcategoryName}, alcoholic drinks tallinn, rare drinks, ${formattedPrice}`
            : `${productName}, georgian cuisine, ${subcategoryName}, tallinn restaurant, georgian food, ${formattedPrice}`,
    },
    ru: {
      title: isDrink
        ? `${productName} - ${formattedPrice} | Грузинские Вина и Алкоголь | MAITSEV GRUUSIA`
        : `${productName} - ${formattedPrice} | Грузинская Кухня | MAITSEV GRUUSIA`,
      description: `🍴 Заказать ${productName} - грузинская кухня. ${productDesc || ""} Цена ${formattedPrice}. Доставка по Таллинну. Roosikrantsi 16.`,
      keywords: isKhachapuri
        ? `${productName}, хачапури, грузинская кухня, ${subcategoryName}, грузинский ресторан таллинн, ${formattedPrice}`
        : isWine
          ? `${productName}, грузинское вино, саперави, киндзмараули, ${subcategoryName}, грузинские вина таллинн, ${formattedPrice}`
          : isDrink
            ? `${productName}, алкоголь, ${subcategoryName}, алкогольные напитки таллинн, редкие напитки, ${formattedPrice}`
            : `${productName}, грузинская кухня, ${subcategoryName}, ресторан таллинн, грузинская еда, ${formattedPrice}`,
    },
  };

  const currentSEO = seoData[locale] || seoData.et;
  const canonicalUrl = `https://www.maitsevgruusia.ee/${locale}/menu/${category?.slug || "menu"}/${subcategory?.slug}/${product.slug}`;

  // Product image for SEO
  const productImage = product.imageUrl
    ? `https://www.maitsevgruusia.ee${product.imageUrl}`
    : product.images &&
        Array.isArray(product.images) &&
        product.images.length > 0
      ? `https://www.maitsevgruusia.ee${product.images[0]}`
      : `https://www.maitsevgruusia.ee/images/cateringpage1.jpg`;

  // Enhanced Schema.org markup for products
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${canonicalUrl}#product`,
    name: productName,
    description: currentSEO.description,
    image: productImage,
    url: canonicalUrl,
    brand: {
      "@type": "Brand",
      name: "MAITSEV GRUUSIA",
    },
    category: subcategoryName,
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: "EUR",
      price: discountedPrice.toFixed(2),
      priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0], // 30 days
      availability:
        product.available !== false
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Restaurant",
        name: "MAITSEV GRUUSIA",
        url: `https://www.maitsevgruusia.ee/${locale}`,
        telephone: "+372 502 3599",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Tallinn",
          addressCountry: "EE",
        },
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "95",
      bestRating: "5",
      worstRating: "1",
    },
  };

  // Add specific properties for different product types
  if (isDrink && product.volume) {
    productSchema.size = `${product.volume}ml`;
  }

  if (isAlcoholic && product.degree) {
    productSchema.alcoholByVolume = `${product.degree}%`;
  }

  if (!isDrink) {
    productSchema.nutrition = {
      "@type": "NutritionInformation",
      servingSize: "1 portion",
    };
  }

  // Breadcrumb schema
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
        name: isDrink
          ? {
              et: "Alkohol & Veinid",
              en: "Alcohol & Wines",
              ru: "Алкоголь и Вина",
            }[locale]
          : {
              et: "Gruusia Köök",
              en: "Georgian Cuisine",
              ru: "Грузинская Кухня",
            }[locale],
        item: `https://www.maitsevgruusia.ee/${locale}/menu/${category?.slug || "menu"}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: subcategoryName,
        item: `https://www.maitsevgruusia.ee/${locale}/menu/${category?.slug || "menu"}/${subcategory?.slug}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: productName,
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
        et: `https://www.maitsevgruusia.ee/et/menu/${category?.slug || "menu"}/${subcategory?.slug}/${product.slug}`,
        en: `https://www.maitsevgruusia.ee/en/menu/${category?.slug || "menu"}/${subcategory?.slug}/${product.slug}`,
        ru: `https://www.maitsevgruusia.ee/ru/menu/${category?.slug || "menu"}/${subcategory?.slug}/${product.slug}`,
      },
    },
    openGraph: {
      title: currentSEO.title,
      description: currentSEO.description,
      url: canonicalUrl,
      type: "product",
      siteName: "MAITSEV GRUUSIA",
      locale: locale === "et" ? "et_EE" : locale === "en" ? "en_US" : "ru_RU",
      images: [
        {
          url: productImage,
          width: 800,
          height: 600,
          alt: productName,
        },
      ],
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
      title: currentSEO.title,
      description: currentSEO.description,
      image: productImage,
      site: "@maitsevgruusia",
      creator: "@maitsevgruusia",
    },
    other: {
      robots:
        "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      "format-detection": "telephone=yes",
      "product:price:amount": discountedPrice.toFixed(2),
      "product:price:currency": "EUR",
      "product:availability":
        product.available !== false ? "in stock" : "out of stock",
      "product:condition": "new",
      schema: JSON.stringify([productSchema, breadcrumbSchema]),
    },
  };
}

// Helper function to generate meta tags for specific product types
export function getProductTypeKeywords(
  productName,
  subcategoryName,
  locale = "et",
) {
  const keywords = {
    et: {
      khachapuri: [
        "khachapuri",
        "gruusia juustupirukad",
        "adžaaria khachapuri",
        "imeruli khachapuri",
      ],
      khinkali: [
        "khinkali",
        "gruusia pelmeenid",
        "liha khinkali",
        "juustu khinkali",
      ],
      wine: ["gruusia vein", "saperavi", "kindzmarauli", "rkatsiteli"],
      alcohol: [
        "premium alkohol",
        "haruldased joogid",
        "kollektsiooni alkohol",
        "elite joogid",
      ],
    },
    en: {
      khachapuri: [
        "khachapuri",
        "georgian cheese bread",
        "adjarian khachapuri",
        "imeruli khachapuri",
      ],
      khinkali: [
        "khinkali",
        "georgian dumplings",
        "meat khinkali",
        "cheese khinkali",
      ],
      wine: ["georgian wine", "saperavi", "kindzmarauli", "rkatsiteli"],
      alcohol: [
        "premium alcohol",
        "rare drinks",
        "collection alcohol",
        "elite drinks",
      ],
    },
    ru: {
      khachapuri: [
        "хачапури",
        "грузинские сырные лепешки",
        "аджарские хачапури",
        "имерули хачапури",
      ],
      khinkali: [
        "хинкали",
        "грузинские пельмени",
        "хинкали с мясом",
        "хинкали с сыром",
      ],
      wine: ["грузинское вино", "саперави", "киндзмараули", "ркацители"],
      alcohol: [
        "премиум алкоголь",
        "редкие напитки",
        "коллекционный алкоголь",
        "элитные напитки",
      ],
    },
  };

  const productLower = productName.toLowerCase();
  const subcategoryLower = subcategoryName.toLowerCase();

  if (
    productLower.includes("wine") ||
    productLower.includes("vein") ||
    subcategoryLower.includes("wine")
  ) {
    return keywords[locale]?.wine || keywords.et.wine;
  }
  if (
    productLower.includes("khachapuri") ||
    subcategoryLower.includes("khachapuri")
  ) {
    return keywords[locale]?.khachapuri || keywords.et.khachapuri;
  }
  if (
    productLower.includes("khinkali") ||
    subcategoryLower.includes("khinkali")
  ) {
    return keywords[locale]?.khinkali || keywords.et.khinkali;
  }
  if (
    subcategoryLower.includes("alcohol") ||
    subcategoryLower.includes("wine") ||
    subcategoryLower.includes("beer")
  ) {
    return keywords[locale]?.alcohol || keywords.et.alcohol;
  }

  return [];
}
