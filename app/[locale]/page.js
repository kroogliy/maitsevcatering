// app/[locale]/page.js
import {
  generateEnhancedHomeSEO,
  generateRestaurantSchema,
  generateRobotsMeta,
  SITE_CONFIG,
} from "../../utils/seoUtils";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const seoData = generateEnhancedHomeSEO(locale);

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: seoData.alternates,
    openGraph: seoData.openGraph,
    twitter: seoData.twitter,
    other: {
      ...seoData.other,
      ...generateRobotsMeta(),
      "theme-color": "#d32f2f",
      "format-detection": "telephone=yes",
    },
  };
}

import SlideShow from "../../components/slideshow/slideshow";
import Intro from "../../components/intro/intro";
import ParallaxSection from "../../components/parallax-section/parallax-section";
import MenuShowcase from "../../components/menu-showcase/menu-showcase";
import ChefsMastery from "../../components/chefs-mastery/chefs-mastery";
import MenuSection from "../../components/menu-section/menu-section";
import HomePageClient from "./HomePageClient";
// import HomePageLoadingWrapper from "./HomePageLoadingWrapper";
import Benefits from "../../components/benefits/benefits";
import Contact from "../../components/contacts/contact";
import FAQ from "../../components/faq/faq";
import VenuesSection from "../../components/venuesection/venuesection";

export default async function Home({ params }) {
  const { locale } = await params;

  // Описания для каждого языка с акцентом на грузинскую кухню и вина
  const descriptions = {
    et: "Maitsev Gruusia - Gruusia köök, khachapuri, khinkali ja 6000+ alkohoolset jooki",
    en: "Maitsev Gruusia - Georgian cuisine, khachapuri, khinkali and 6000+ alcoholic drinks",
    ru: "Maitsev Gruusia - Грузинская кухня, хачапури, хинкали и 6000+ алкогольных напитков",
  };

  // Расширенная Schema.org разметка для ресторана с акцентом на грузинскую кухню и вина
  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: "MAITSEV GRUUSIA",
    alternateName: {
      et: "Maitsev Gruusia Tallinn - Gruusia Köök ja Veinid",
      en: "Maitsev Gruusia Tallinn - Georgian Cuisine & Wines",
      ru: "Maitsev Gruusia Таллинн - Грузинская Кухня и Вина",
    }[locale],
    description: descriptions[locale],
    url: `${SITE_CONFIG.siteUrl}/${locale}`,
    image: [
      `${SITE_CONFIG.siteUrl}/images/cateringpage1.jpg`,
      `${SITE_CONFIG.siteUrl}/images/khachapuri.jpg`,
      `${SITE_CONFIG.siteUrl}/images/wine.png`,
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Tallinn",
      addressLocality: "Tallinn",
      addressCountry: "EE",
    },
    telephone: SITE_CONFIG.businessInfo.phone,
    email: SITE_CONFIG.businessInfo.email,
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
    menu: `${SITE_CONFIG.siteUrl}/${locale}/menu`,
    servesCuisine: ["Georgian", "Caucasian", "European"],
    priceRange: "€€",
    acceptsReservations: false,
    hasDeliveryService: true,
    paymentAccepted: ["Cash", "Credit Card", "Bank Transfer"],
    currenciesAccepted: "EUR",
    areaServed: "Tallinn",
    hasMenu: `${SITE_CONFIG.siteUrl}/${locale}/menu`,
    speciality: [
      "Georgian Khachapuri",
      "Traditional Khinkali",
      "Georgian Wines",
      "6000+ Drink Collection",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      bestRating: "5",
      worstRating: "1",
      ratingCount: "187",
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Elena K.",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody: {
          et: "Suurepärane gruusia köök ja tohutu veinide valik! Khachapuri ja khinkali on fantastilised.",
          en: "Amazing Georgian cuisine and huge wine selection! Khachapuri and khinkali are fantastic.",
          ru: "Потрясающая грузинская кухня и огромный выбор вин! Хачапури и хинкали фантастические.",
        }[locale],
      },
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Marcus L.",
        },
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
        reviewBody: {
          et: "6000 alkohoolset jooki ja gruusia köök - see on uskumatu! Gruusia veinide valik on muljetavaldav.",
          en: "6000 alcoholic drinks and Georgian cuisine - this is incredible! Georgian wine selection is impressive.",
          ru: "6000 алкогольных напитков и грузинская кухня - это невероятно! Выбор грузинских вин впечатляет.",
        }[locale],
      },
    ],
    makesOffer: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "MenuItem",
          name: {
            et: "Gruusia köök",
            en: "Georgian cuisine",
            ru: "Грузинская кухня",
          }[locale],
          description: {
            et: "Khachapuri, khinkali, traditsioonilised retseptid",
            en: "Khachapuri, khinkali, traditional recipes",
            ru: "Хачапури, хинкали, традиционные рецепты",
          }[locale],
        },
        price: "12.99",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Product",
          name: {
            et: "Premium alkohoolsed joogid",
            en: "Premium alcoholic drinks",
            ru: "Премиум алкогольные напитки",
          }[locale],
          description: {
            et: "6000+ haruldast ja kollektsiooni alkohoolset jooki",
            en: "6000+ rare and collection alcoholic drinks",
            ru: "6000+ редких и коллекционных алкогольных напитков",
          }[locale],
        },
        availability: "https://schema.org/InStock",
      },
    ],
    speciality: [
      {
        et: "Gruusia khachapuri",
        en: "Georgian khachapuri",
        ru: "Грузинские хачапури",
      }[locale],
      {
        et: "6000+ alkohoolset jooki",
        en: "6000+ alcoholic drinks",
        ru: "6000+ алкогольных напитков",
      }[locale],
      {
        et: "Kateeringteenused",
        en: "Catering services",
        ru: "Кейтеринг услуги",
      }[locale],
      {
        et: "Командный ланч",
        en: "Team lunch",
        ru: "Командный ланч",
      }[locale],
      {
        et: "Haruldased kollektsiooni joogid",
        en: "Rare collection drinks",
        ru: "Редкие коллекционные напитки",
      }[locale],
      {
        et: "Premium someljeede valik",
        en: "Premium sommelier selection",
        ru: "Премиум выбор сомелье",
      }[locale],
    ],
  };

  // FAQ Schema для лучшего SEO
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: {
          et: "Kas teie khachapuri on traditsioonilised?",
          en: "Are your khachapuri traditional?",
          ru: "Являются ли ваши хачапури традиционными?",
        }[locale],
        acceptedAnswer: {
          "@type": "Answer",
          text: {
            et: "Jah! Meie khachapuri on valmistatud traditsiooniliste gruusia retseptide järgi. Kasutame värskeid koostisosi ja traditsioonilisi valmistusviise. Meie kokad järgivad gruusia kulinaarseid traditsioone.",
            en: "Yes! Our khachapuri is prepared according to traditional Georgian recipes. We use fresh ingredients and traditional preparation methods. Our chefs follow Georgian culinary traditions.",
            ru: "Да! Наши хачапури готовятся по традиционным грузинским рецептам. Мы используем свежие ингредиенты и традиционные методы приготовления. Наши повара следуют грузинским кулинарным традициям.",
          }[locale],
        },
      },
      {
        "@type": "Question",
        name: {
          et: "Mitu alkohoolset jooki teil on?",
          en: "How many alcoholic drinks do you have?",
          ru: "Сколько у вас алкогольных напитков?",
        }[locale],
        acceptedAnswer: {
          "@type": "Answer",
          text: {
            et: "Meil on üle 6000 erineva alkohoolse joogi! Meie kollektsioon sisaldab haruldasi viine, kollektsiooni viskisid, elite konjaki, craft õlut ja palju muud. Kogenud someljeede valik garanteerib kvaliteedi.",
            en: "We have over 6000 different alcoholic drinks! Our collection includes rare wines, collection whiskies, elite cognacs, craft beers and much more. Expert sommelier selection guarantees quality.",
            ru: "У нас более 6000 различных алкогольных напитков! Наша коллекция включает редкие вина, коллекционные виски, элитные коньяки, крафтовое пиво и многое другое. Выбор экспертов-сомелье гарантирует качество.",
          }[locale],
        },
      },
      {
        "@type": "Question",
        name: {
          et: "Kas pakute kateeringteenuseid?",
          en: "Do you offer catering services and team lunch?",
          ru: "Предлагаете ли вы кейтеринг услуги и командный ланч?",
        }[locale],
        acceptedAnswer: {
          "@type": "Answer",
          text: {
            et: "Jah! Pakume toidu tellimise teenuseid ja ärilõunasid. Meie gruusia köök ja 6000+ alkohoolse joogi valik teeb iga ürituse eriliseks. Gruusia veinid lisavad erilist maitseelamust.",
            en: "Yes! We offer food delivery services and business lunches. Our Georgian cuisine and selection of 6000+ alcoholic drinks make any event special. Georgian wines add a special taste experience.",
            ru: "Да! Мы предлагаем услуги доставки еды и бизнес-ланчи. Наша грузинская кухня и выбор из 6000+ алкогольных напитков делают любое мероприятие особенным. Грузинские вина добавляют особый вкусовой опыт.",
          }[locale],
        },
      },
    ],
  };

  // Хлебные крошки
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: {
          et: "Avaleht",
          en: "Home",
          ru: "Главная",
        }[locale],
        item: `${SITE_CONFIG.siteUrl}/${locale}`,
      },
    ],
  };

  // LocalBusiness Schema для кейтеринг услуг
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_CONFIG.siteUrl}/${locale}#business`,
    name: "MAITSEV GRUUSIA",
    alternateName: {
      et: "Maitsev Gruusia - Gruusia Toidu Tellimine Tallinnas",
      en: "Maitsev Gruusia - Georgian Food Delivery Tallinn",
      ru: "Maitsev Gruusia - Доставка Грузинской Еды Таллинн",
    }[locale],
    description: {
      et: "Gruusia toidu tellimine Tallinnas. Khachapuri, khinkali, ärilõunad ja 6000+ alkohoolset jooki üritusteks.",
      en: "Georgian food delivery in Tallinn. Khachapuri, khinkali, business lunches and 6000+ alcoholic drinks for events.",
      ru: "Доставка грузинской еды в Таллинне. Хачапури, хинкали, бизнес-ланчи и 6000+ алкогольных напитков для мероприятий.",
    }[locale],
    url: `${SITE_CONFIG.siteUrl}/${locale}`,
    sameAs: [
      "https://www.facebook.com/maitsevgruusia",
      "https://www.instagram.com/maitsevgruusia",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Tallinn",
      addressLocality: "Tallinn",
      addressRegion: "Harju maakond",
      postalCode: "10000",
      addressCountry: "EE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: "59.4370",
      longitude: "24.7536",
    },
    telephone: SITE_CONFIG.businessInfo.phone,
    email: SITE_CONFIG.businessInfo.email,
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
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: {
        et: "Gruusia Toidu Tellimine",
        en: "Georgian Food Delivery",
        ru: "Доставка Грузинской Еды",
      }[locale],
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: {
              et: "Корпоративный кейтеринг",
              en: "Corporate Catering",
              ru: "Корпоративный кейтеринг",
            }[locale],
            description: {
              et: "Gruusia toidu tellimine ettevõtte üritusteks ja koosolekuteks",
              en: "Georgian food delivery for corporate events and meetings",
              ru: "Доставка грузинской еды для корпоративных мероприятий и встреч",
            }[locale],
          },
          availability: "https://schema.org/InStock",
          areaServed: "Tallinn",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: {
              et: "Командный ланч",
              en: "Team Lunch",
              ru: "Командный ланч",
            }[locale],
            description: {
              et: "Ärilõunad gruusia köögiga",
              en: "Business lunches with Georgian cuisine",
              ru: "Бизнес-ланчи с грузинской кухней",
            }[locale],
          },
          availability: "https://schema.org/InStock",
          areaServed: "Tallinn",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: {
              et: "Ürituste kateering",
              en: "Event Catering",
              ru: "Кейтеринг мероприятий",
            }[locale],
            description: {
              et: "Gruusia toidu tellimine eraüritusteks, sünnipäevadeks ja pidudeks",
              en: "Georgian food delivery for private events, birthdays and parties",
              ru: "Доставка грузинской еды для частных мероприятий, дней рождения и вечеринок",
            }[locale],
          },
          availability: "https://schema.org/InStock",
          areaServed: "Tallinn",
        },
      ],
    },
    makesOffer: {
      "@type": "Offer",
      name: {
        et: "Premium Sushi Kateeringteenused Tallinnas",
        en: "Premium Sushi Catering Services in Tallinn",
        ru: "Премиум Суши Кейтеринг Услуги в Таллинне",
      }[locale],
      description: {
        et: "Professionaalne sushi kateering autentse Kyoto sushiga ja 6000+ alkohoolse joogi valikuga",
        en: "Professional sushi catering with authentic Kyoto sushi and choice of 6000+ alcoholic drinks",
        ru: "Профессиональный суши кейтеринг с аутентичными суши Киото и выбором из 6000+ алкогольных напитков",
      }[locale],
      availability: "https://schema.org/InStock",
      areaServed: {
        "@type": "AdministrativeArea",
        name: "Tallinn",
      },
    },
    serviceArea: {
      "@type": "AdministrativeArea",
      name: "Tallinn",
    },
  };

  return (
    <div>
      {/* Основная Schema.org разметка для ресторана */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(restaurantSchema),
        }}
      />

      {/* LocalBusiness Schema для кейтеринг услуг */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema),
        }}
      />

      {/* FAQ Schema для лучшего SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema),
        }}
      />

      {/* Хлебные крошки */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <HomePageClient />
      <SlideShow />
      <Intro />
      {/* <ParallaxSection />*/}
      <Benefits />
      <VenuesSection />
      <Contact />
      <FAQ />
      {/* <MenuShowcase />*/}
      {/* <ChefsMastery />*/}
      {/* <MenuSection locale={locale} />*/}
    </div>
  );
}
