import { generateCateringSEO } from "../../../utils/seoUtils";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const seoData = generateCateringSEO(locale);

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    alternates: seoData.alternates,
    openGraph: seoData.openGraph,
    twitter: seoData.twitter,
    canonical: seoData.canonical,
    other: {
      "format-detection": "telephone=yes",
    },
  };
}

export default function CateringLayout({ children }) {
  return children;
}
