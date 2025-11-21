import { generateCateringSEO } from "../../../utils/seoUtils";

export async function generateMetadata({ params }) {
  const { locale } = await params;

  const titles = {
    et: "Kuidas tellida? | Gruusia toidu kohaletoimetamine Tallinn | Maitsev Gruusia",
    en: "How to Order? | Georgian food delivery Tallinn | Maitsev Gruusia",
    ru: "Как заказать? | Доставка грузинской еды Таллинн | Maitsev Gruusia",
  };

  const descriptions = {
    et: "Lihtne ja kiire gruusia toidu tellimine ja kohaletoimetamine Tallinnas. Tellimise samm-sammult juhis. Gruusia köök ja 6000+ alkohoolset jooki kohale 45 minutiga.",
    en: "Easy and fast Georgian food ordering and delivery in Tallinn. Step-by-step ordering guide. Georgian cuisine and 6000+ alcoholic drinks delivered in 45 minutes.",
    ru: "Легкий и быстрый заказ грузинской еды с доставкой в Таллинне. Пошаговое руководство по заказу. Грузинская кухня и 6000+ алкогольных напитков с доставкой за 45 минут.",
  };

  const keywords = {
    et: "gruusia toidu kohaletoimetamine tallinn, kuidas tellida gruusia toitu, food delivery, gruusia köök tallinn, khachapuri kohaletoimetamine, gruusia veinid, alkohoolsed joogid",
    en: "georgian food delivery tallinn, how to order georgian food, food delivery, georgian food tallinn, khachapuri delivery, georgian wines, alcoholic drinks",
    ru: "доставка грузинской еды таллинн, как заказать грузинскую еду, food delivery, грузинская еда таллинн, доставка хачапури, грузинские вина, алкогольные напитки",
  };

  return {
    title: titles[locale] || titles.et,
    description: descriptions[locale] || descriptions.et,
    keywords: keywords[locale] || keywords.et,
    alternates: {
      canonical: `https://www.maitsevgruusia.ee/${locale}/order`,
      languages: {
        "et-EE": "/et/order",
        "en-US": "/en/order",
        "ru-RU": "/ru/order",
      },
    },
    openGraph: {
      title: titles[locale] || titles.et,
      description: descriptions[locale] || descriptions.et,
      images: [
        {
          url: "/images/order-process.jpg",
          width: 1200,
          height: 630,
          alt: "Georgian food ordering process",
        },
      ],
      url: `https://www.maitsevgruusia.ee/${locale}/order`,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: titles[locale] || titles.et,
      description: descriptions[locale] || descriptions.et,
      image: "/images/order-process.jpg",
    },
    other: {
      "theme-color": "#d32f2f",
      "format-detection": "telephone=yes",
    },
  };
}

export default function OrderLayout({ children }) {
  return children;
}
