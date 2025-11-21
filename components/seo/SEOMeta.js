"use client";

import Head from "next/head";
import { usePathname } from "next/navigation";
import { SITE_CONFIG } from "../../utils/seoUtils";

const SEOMeta = ({
  title,
  description,
  keywords,
  canonical,
  openGraph = {},
  twitter = {},
  alternates = {},
  structuredData = null,
  robots = "index, follow",
  other = {},
  locale = "et",
}) => {
  const pathname = usePathname();

  // Генерируем полный canonical URL если не указан
  const canonicalUrl = canonical || `${SITE_CONFIG.siteUrl}${pathname}`;

  // Дефолтные Open Graph данные
  const defaultOpenGraph = {
    type: "website",
    siteName: SITE_CONFIG.siteName,
    locale: locale === "et" ? "et_EE" : locale === "en" ? "en_US" : "ru_RU",
    ...openGraph,
  };

  // Дефолтные Twitter данные
  const defaultTwitter = {
    card: "summary_large_image",
    site: "@maitsevgruusia",
    creator: "@maitsevgruusia",
    ...twitter,
  };

  return (
    <Head>
      {/* Основные мета-теги */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={robots} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Языковые альтернативы */}
      {alternates.languages &&
        Object.entries(alternates.languages).map(([lang, url]) => (
          <link key={lang} rel="alternate" hrefLang={lang} href={url} />
        ))}

      {/* Open Graph мета-теги */}
      {defaultOpenGraph.title && (
        <meta property="og:title" content={defaultOpenGraph.title} />
      )}
      {defaultOpenGraph.description && (
        <meta
          property="og:description"
          content={defaultOpenGraph.description}
        />
      )}
      {defaultOpenGraph.image && (
        <meta property="og:image" content={defaultOpenGraph.image} />
      )}
      {defaultOpenGraph.url && (
        <meta property="og:url" content={defaultOpenGraph.url} />
      )}
      <meta property="og:type" content={defaultOpenGraph.type} />
      <meta property="og:site_name" content={defaultOpenGraph.siteName} />
      <meta property="og:locale" content={defaultOpenGraph.locale} />

      {/* Дополнительные Open Graph данные для продуктов */}
      {defaultOpenGraph.product && (
        <>
          <meta
            property="product:price:amount"
            content={defaultOpenGraph.product.price.amount}
          />
          <meta
            property="product:price:currency"
            content={defaultOpenGraph.product.price.currency}
          />
          <meta
            property="product:availability"
            content={defaultOpenGraph.product.availability}
          />
          <meta
            property="product:category"
            content={defaultOpenGraph.product.category}
          />
        </>
      )}

      {/* Twitter мета-теги */}
      <meta name="twitter:card" content={defaultTwitter.card} />
      {defaultTwitter.site && (
        <meta name="twitter:site" content={defaultTwitter.site} />
      )}
      {defaultTwitter.creator && (
        <meta name="twitter:creator" content={defaultTwitter.creator} />
      )}
      {defaultTwitter.title && (
        <meta name="twitter:title" content={defaultTwitter.title} />
      )}
      {defaultTwitter.description && (
        <meta name="twitter:description" content={defaultTwitter.description} />
      )}
      {defaultTwitter.image && (
        <meta name="twitter:image" content={defaultTwitter.image} />
      )}

      {/* Бизнес-информация */}
      <meta
        name="business:contact_data:phone_number"
        content={SITE_CONFIG.businessInfo.phone}
      />
      <meta
        name="business:contact_data:email"
        content={SITE_CONFIG.businessInfo.email}
      />
      <meta
        name="business:contact_data:street_address"
        content={SITE_CONFIG.businessInfo.address}
      />
      <meta
        name="business:hours"
        content={SITE_CONFIG.businessInfo.openingHours}
      />

      {/* Дополнительные мета-теги */}
      {Object.entries(other).map(([key, value]) => (
        <meta key={key} name={key} content={value} />
      ))}

      {/* Технические мета-теги */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="format-detection" content="telephone=yes" />
      <meta name="theme-color" content="#1a1a1a" />

      {/* Favicon и иконки */}
      <link rel="icon" type="image/png" href="/images/logoms.png" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/images/logoms.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/images/logoms.png"
      />
      <link rel="apple-touch-icon" sizes="180x180" href="/images/logoms.png" />
      <link rel="shortcut icon" href="/images/logoms.png" />

      {/* DNS Prefetch для оптимизации загрузки */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />

      {/* Структурированные данные JSON-LD */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
    </Head>
  );
};

export default SEOMeta;
