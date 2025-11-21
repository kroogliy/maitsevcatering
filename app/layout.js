import "./globals.css";
import "./fonts/font.css";
import { montserrat, lora, literata } from "../lib/fonts";

export const metadata = {
  title: {
    default: "Restoran Maitsev Gruusia | Gruusia Köök & Veinid | Tallinn",
    template: "%s | Maitsev Gruusia",
  },
  description:
    "Грузинский ресторан в Таллинне. Грузинская кухня, большой выбор грузинских вин и 6000+ алкогольных напитков. Доставка по Таллинну, бизнес-ланчи. Roosikrantsi 16. Открыто 10:00-22:00.",
  keywords:
    "грузинский ресторан таллинн, грузинская кухня, грузинские вина, доставка грузинской еды, хачапури, хинкали, мцвади, сациви, саперави, киндзмараули, ресторан roosikrantsi, грузинская еда таллинн, georgian restaurant tallinn, gruusia restoran, gruusia köök",
  authors: [{ name: "Maitsev Gruusia" }],
  creator: "Maitsev Gruusia",
  publisher: "Maitsev Gruusia",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://www.maitsevgruusia.ee"),
  alternates: {
    canonical: "/",
    languages: {
      "et-EE": "/et",
      "en-US": "/en",
      "ru-RU": "/ru",
    },
  },
  openGraph: {
    type: "website",
    siteName: "Maitsev Gruusia",
    locale: "et_EE",
    url: "https://www.maitsevgruusia.ee",
    title:
      "Georgian Restaurant Maitsev Gruusia | Georgian Cuisine & Wine | Tallinn",
    description:
      "Georgian restaurant in Tallinn. Georgian cuisine, extensive Georgian wine collection and 6000+ drinks. Food delivery, business lunch. Roosikrantsi 16. Open 10:00-22:00.",
    images: [
      {
        url: "/images/cateringpage1.jpg",
        width: 1200,
        height: 630,
        alt: "Maitsev Gruusia - Authentic Georgian Restaurant",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@maitsevgruusia",
    creator: "@maitsevgruusia",
    images: ["/images/cateringpage1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="et"
      className={`
        ${lora.variable}
        ${literata.variable}
        ${montserrat.variable}
      `}
    >
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#1a1a1a" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-title" content="Maitsev Gruusia" />
        <meta name="application-name" content="Maitsev Gruusia" />
        <meta name="msapplication-TileColor" content="#1a1a1a" />
        <meta name="format-detection" content="telephone=yes" />

        {/* Favicon */}
        <link rel="icon" type="image/png" href="/images/logoms.png" />
        <link rel="apple-touch-icon" href="/images/logoms.png" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Предзагрузка видео для мгновенного показа */}
        <link
          rel="preload"
          as="video"
          href="/images/maitsevgruusia.mp4"
          type="video/mp4"
        />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body>{children}</body>
    </html>
  );
}
