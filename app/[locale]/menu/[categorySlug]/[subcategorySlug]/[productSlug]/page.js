import ProductPage from "./product-page";

const normalizeImage = (images) => {
  return typeof images === "string"
    ? images
    : Array.isArray(images) && images.length > 0
      ? images[0]
      : "/images/cateringpage1.jpg";
};

async function fetchProductData(productSlug) {
  try {
    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://www.maitsevgruusia.ee"
        : "http://localhost:3000";

    // Сначала пробуем найти в продуктах еды
    try {
      const productResponse = await fetch(
        `${baseUrl}/api/products?slug=${productSlug}`,
        {
          cache: "no-cache",
        },
      );

      if (productResponse.ok) {
        const productData = await productResponse.json();
        if (productData && !productData.error) {
          return {
            product: productData,
            category: productData.category,
            subcategory: productData.subcategory,
            productType: "food",
          };
        }
      }
    } catch (productError) {
      // Product not found in food products, trying alkohols...
    }

    // Если не найден в продуктах еды, пробуем в алкоголе
    try {
      const alkoholResponse = await fetch(
        `${baseUrl}/api/alkohols?slug=${productSlug}`,
        {
          cache: "no-cache",
        },
      );

      if (alkoholResponse.ok) {
        const alkoholData = await alkoholResponse.json();
        if (alkoholData && !alkoholData.error) {
          return {
            product: alkoholData,
            category: alkoholData.category,
            subcategory: alkoholData.subcategory,
            productType: "alcohol",
          };
        }
      }
    } catch (alkoholError) {
      // Product not found in alkohols either
    }

    return null;
  } catch (error) {
    // Fetch error
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { locale, categorySlug, subcategorySlug, productSlug } = await params;
  const productData = await fetchProductData(productSlug);

  if (!productData) {
    return {
      title:
        {
          et: "Toode ei leitud | MAITSEV GRUUSIA",
          en: "Product Not Found | MAITSEV GRUUSIA",
          ru: "Товар не найден | MAITSEV GRUUSIA",
        }[locale] || "Product Not Found | MAITSEV GRUUSIA",
      description:
        {
          et: "Otsitud toode ei leitud. Vaadake meie gruusia köögi menüüd või alkohoolsete jookide valikut.",
          en: "The product you are looking for was not found. Check our Georgian cuisine menu or alcoholic drinks selection.",
          ru: "Товар, который вы ищете, не найден. Ознакомьтесь с нашим меню грузинской кухни или выбором алкогольных напитков.",
        }[locale] || "The product you are looking for was not found.",
      robots: "noindex, nofollow",
    };
  }

  const { product, category, subcategory, productType } = productData;
  const productName =
    product.name || product.title?.[locale] || product.title?.en || "Product";
  const productDesc =
    product.description?.[locale] || product.description?.en || "";
  const subcategoryName =
    subcategory?.name?.[locale] || subcategory?.name?.en || subcategorySlug;

  // Определяем реальную категорию
  const isFood = categorySlug === "menu" || productType === "food";
  const isDrinks = categorySlug === "drinks" || productType === "alcohol";

  // Определяем тип продукта для правильной терминологии
  const isKhachapuri =
    productName.toLowerCase().includes("khachapuri") ||
    subcategoryName.toLowerCase().includes("khachapuri");
  const isKhinkali =
    productName.toLowerCase().includes("khinkali") ||
    subcategoryName.toLowerCase().includes("khinkali");
  const isWine =
    productName.toLowerCase().includes("wine") ||
    productName.toLowerCase().includes("vein") ||
    productName.toLowerCase().includes("saperavi") ||
    productName.toLowerCase().includes("kindzmarauli");

  let seoData;

  if (isFood) {
    // SEO для грузинской кухни
    seoData = {
      et: {
        title: isKhachapuri
          ? `${productName} | Gruusia Khachapuri | MAITSEV GRUUSIA`
          : `${productName} | Gruusia Köök | MAITSEV GRUUSIA`,
        description: isKhachapuri
          ? `🥧 ${productName} - gruusia khachapuri Tallinnas! ${productDesc} Traditsioonilised retseptid, värskelt valmistatud. ${product.price ? `Hind: €${product.price}.` : ""} Tellimiseks kohe!`
          : `🍴 ${productName} - ${productDesc} Gruusia köök Tallinnas. ${product.price ? `Hind: €${product.price}.` : ""} Tellimiseks MAITSEV GRUUSIA!`,
        keywords: isKhachapuri
          ? `${productName}, khachapuri tallinn, gruusia khachapuri, ${productName} kohaletoimetamine, gruusia köök`
          : `${productName}, ${subcategoryName} tallinn, ${productName} tellida, gruusia köök, ${productName} kohaletoimetamine`,
      },
      en: {
        title: isKhachapuri
          ? `${productName} | Georgian Khachapuri | MAITSEV GRUUSIA`
          : `${productName} | Georgian Cuisine | MAITSEV GRUUSIA`,
        description: isKhachapuri
          ? `🥧 ${productName} - Georgian khachapuri in Tallinn! ${productDesc} Traditional recipes, freshly made. ${product.price ? `Price: €${product.price}.` : ""} Order now!`
          : `🍴 ${productName} - ${productDesc} Georgian cuisine in Tallinn. ${product.price ? `Price: €${product.price}.` : ""} Order from MAITSEV GRUUSIA!`,
        keywords: isKhachapuri
          ? `${productName}, khachapuri tallinn, georgian khachapuri, ${productName} delivery, georgian cuisine`
          : `${productName}, ${subcategoryName} tallinn, order ${productName}, georgian cuisine, ${productName} delivery`,
      },
      ru: {
        title: isKhachapuri
          ? `${productName} | Грузинские Хачапури | MAITSEV GRUUSIA`
          : `${productName} | Грузинская Кухня | MAITSEV GRUUSIA`,
        description: isKhachapuri
          ? `🥧 ${productName} - грузинские хачапури в Таллинне! ${productDesc} Традиционные рецепты, свежее приготовление. ${product.price ? `Цена: €${product.price}.` : ""} Заказывайте сейчас!`
          : `🍴 ${productName} - ${productDesc} Грузинская кухня в Таллинне. ${product.price ? `Цена: €${product.price}.` : ""} Заказывайте в MAITSEV GRUUSIA!`,
        keywords: isKhachapuri
          ? `${productName}, хачапури таллинн, грузинские хачапури, доставка ${productName}, грузинская кухня`
          : `${productName}, ${subcategoryName} таллинн, заказать ${productName}, грузинская кухня, доставка ${productName}`,
      },
    };
  } else if (isDrinks) {
    // SEO для алкогольных напитков
    const isGeorgianWine =
      productName.toLowerCase().includes("saperavi") ||
      productName.toLowerCase().includes("kindzmarauli") ||
      productName.toLowerCase().includes("rkatsiteli") ||
      subcategoryName.toLowerCase().includes("gruusia vein");

    seoData = {
      et: {
        title: isGeorgianWine
          ? `${productName} | Gruusia Veinid | MAITSEV GRUUSIA`
          : `${productName} | Alkohol | 6000+ Jooki | MAITSEV GRUUSIA`,
        description: isGeorgianWine
          ? `🍷 ${productName} - gruusia vein meie kollektsioonist! ${productDesc} ${product.volume ? `Maht: ${product.volume}ml.` : ""} ${product.degree ? `Kangus: ${product.degree}%.` : ""} ${product.price ? `Hind: €${product.price}.` : ""} Traditsiooniliselt valmistatud. Tellimiseks MAITSEV GRUUSIA!`
          : `🍷 ${productName} - osa meie 6000+ alkohoolse joogi kollektsioonist! ${productDesc} ${product.volume ? `Maht: ${product.volume}ml.` : ""} ${product.degree ? `Kangus: ${product.degree}%.` : ""} ${product.price ? `Hind: €${product.price}.` : ""} Haruldane ja eksklusiivne. Kohaletoimetamine Tallinna!`,
        keywords: isGeorgianWine
          ? `${productName}, gruusia vein, saperavi, kindzmarauli, ${subcategoryName}, gruusia veinid tallinn`
          : `${productName}, alkohol tallinn, ${subcategoryName} tallinn, haruldased joogid, kollektsiooni alkohol, ${productName} osta`,
      },
      en: {
        title: isGeorgianWine
          ? `${productName} | Georgian Wines | MAITSEV GRUUSIA`
          : `${productName} | Alcohol | 6000+ Drinks | MAITSEV GRUUSIA`,
        description: isGeorgianWine
          ? `🍷 ${productName} - Georgian wine from our collection! ${productDesc} ${product.volume ? `Volume: ${product.volume}ml.` : ""} ${product.degree ? `Strength: ${product.degree}%.` : ""} ${product.price ? `Price: €${product.price}.` : ""} Traditionally crafted. Order from MAITSEV GRUUSIA!`
          : `🍷 ${productName} - part of our 6000+ alcoholic beverage collection! ${productDesc} ${product.volume ? `Volume: ${product.volume}ml.` : ""} ${product.degree ? `Strength: ${product.degree}%.` : ""} ${product.price ? `Price: €${product.price}.` : ""} Rare and exclusive. Delivery to Tallinn!`,
        keywords: isGeorgianWine
          ? `${productName}, georgian wine, saperavi, kindzmarauli, ${subcategoryName}, georgian wines tallinn`
          : `${productName}, alcohol tallinn, ${subcategoryName} tallinn, rare drinks, collection alcohol, buy ${productName}`,
      },
      ru: {
        title: isGeorgianWine
          ? `${productName} | Грузинские Вина | MAITSEV GRUUSIA`
          : `${productName} | Алкоголь | 6000+ Напитков | MAITSEV GRUUSIA`,
        description: isGeorgianWine
          ? `🍷 ${productName} - грузинское вино из нашей коллекции! ${productDesc} ${product.volume ? `Объем: ${product.volume}мл.` : ""} ${product.degree ? `Крепость: ${product.degree}%.` : ""} ${product.price ? `Цена: €${product.price}.` : ""} Традиционное производство. Заказывайте в MAITSEV GRUUSIA!`
          : `🍷 ${productName} - часть нашей коллекции 6000+ алкогольных напитков! ${productDesc} ${product.volume ? `Объем: ${product.volume}мл.` : ""} ${product.degree ? `Крепость: ${product.degree}%.` : ""} ${product.price ? `Цена: €${product.price}.` : ""} Редкий и эксклюзивный. Доставка по Таллинну!`,
        keywords: isGeorgianWine
          ? `${productName}, грузинское вино, саперави, киндзмараули, ${subcategoryName}, грузинские вина таллинн`
          : `${productName}, алкоголь таллинн, ${subcategoryName} таллинн, редкие напитки, коллекционный алкоголь, купить ${productName}`,
      },
    };
  } else {
    // Дефолтный SEO для других продуктов
    seoData = {
      et: {
        title: `${productName} | MAITSEV GRUUSIA`,
        description: `${productName} - ${productDesc || "Gruusia restoran Tallinnas"}. Hind: ${product.price ? `€${product.price}` : "Küsi hinda"}. Kohaletoimetamine või kohapeal. Roosikrantsi 16.`,
        keywords: `${productName}, gruusia restoran tallinn, ${subcategoryName}, toidu tellimine, kohaletoimetamine tallinn, roosikrantsi`,
      },
      en: {
        title: `${productName} | MAITSEV GRUUSIA`,
        description: `${productName} - ${productDesc || "Georgian restaurant in Tallinn"}. Price: ${product.price ? `€${product.price}` : "Ask for price"}. Delivery or dine-in. Roosikrantsi 16.`,
        keywords: `${productName}, georgian restaurant tallinn, ${subcategoryName}, food delivery, delivery tallinn, roosikrantsi`,
      },
      ru: {
        title: `${productName} | MAITSEV GRUUSIA`,
        description: `${productName} - ${productDesc || "Грузинский ресторан в Таллинне"}. Цена: ${product.price ? `€${product.price}` : "Цена по запросу"}. Доставка или в ресторане. Roosikrantsi 16.`,
        keywords: `${productName}, грузинский ресторан таллинн, ${subcategoryName}, доставка еды, доставка таллинн, roosikrantsi`,
      },
    };
  }

  const currentSEO = seoData[locale] || seoData.et;
  const metaImage = normalizeImage(product.images);
  const canonicalUrl = `https://www.maitsevgruusia.ee/${locale}/menu/${categorySlug}/${subcategorySlug}/${productSlug}`;

  // Schema.org для продукта
  const productSchema = {
    "@context": "https://schema.org",
    "@type": isDrinks ? "Product" : "MenuItem",
    name: productName,
    description: currentSEO.description,
    image:
      product.images?.[0] ||
      `https://www.maitsevgruusia.ee/images/cateringpage1.jpg`,
    url: canonicalUrl,
    offers: {
      "@type": "Offer",
      price: product.price || "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Restaurant",
        name: "Maitsev Gruusia",
        telephone: "+372 502 3599",
        address: "Tallinn, Estonia",
      },
    },
    provider: {
      "@type": "Restaurant",
      name: "Maitsev Gruusia",
      url: `https://www.maitsevgruusia.ee/${locale}`,
    },
  };

  // Дополнительные поля для алкоголя
  if (isDrinks) {
    if (product.volume) {
      productSchema.additionalProperty = productSchema.additionalProperty || [];
      productSchema.additionalProperty.push({
        "@type": "PropertyValue",
        name: "Volume",
        value: `${product.volume}cl`,
      });
    }
    if (product.degree) {
      productSchema.additionalProperty = productSchema.additionalProperty || [];
      productSchema.additionalProperty.push({
        "@type": "PropertyValue",
        name: "Alcohol Content",
        value: `${product.degree}%`,
      });
    }
  }

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
              et: "Toit ja Pizza",
              en: "Food and Pizza",
              ru: "Еда и Пицца",
            }[locale]
          : {
              et: "Alkohoolsed Joogid",
              en: "Alcoholic Drinks",
              ru: "Алкогольные Напитки",
            }[locale],
        item: `https://www.maitsevgruusia.ee/${locale}/menu/${categorySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: subcategoryName,
        item: `https://www.maitsevgruusia.ee/${locale}/menu/${categorySlug}/${subcategorySlug}`,
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
        et: `https://www.maitsevgruusia.ee/et/menu/${categorySlug}/${subcategorySlug}/${productSlug}`,
        en: `https://www.maitsevgruusia.ee/en/menu/${categorySlug}/${subcategorySlug}/${productSlug}`,
        ru: `https://www.maitsevgruusia.ee/ru/menu/${categorySlug}/${subcategorySlug}/${productSlug}`,
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
          url: metaImage,
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
      image: metaImage,
    },
    other: {
      robots:
        "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
      "product:price:amount": product.price || "0",
      "product:price:currency": "EUR",
      "product:availability": "in stock",
      schema: JSON.stringify([productSchema, breadcrumbSchema]),
    },
  };
}

export default async function Page({ params }) {
  const { locale, categorySlug, subcategorySlug, productSlug } = await params;
  const productData = await fetchProductData(productSlug);

  if (!productData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">
          {{
            et: "Toode ei leitud",
            en: "Product Not Found",
            ru: "Товар не найден",
          }[locale] || "Product Not Found"}
        </h1>
        <p className="text-gray-600">
          {
            {
              et: "Otsitud toode ei leitud. Palun kontrollige URL-i või minge tagasi menüüsse.",
              en: "The product you are looking for was not found. Please check the URL or go back to the menu.",
              ru: "Товар, который вы ищете, не найден. Пожалуйста, проверьте URL или вернитесь в меню.",
            }[locale]
          }
        </p>
      </div>
    );
  }

  return (
    <ProductPage
      product={productData.product}
      category={productData.category}
      subcategory={productData.subcategory}
      locale={locale}
      categorySlug={categorySlug}
      subcategorySlug={subcategorySlug}
    />
  );
}
