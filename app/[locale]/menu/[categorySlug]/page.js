// app/[locale]/menu/[categorySlug]/page.js
import MenuPage from "../page";
import { generateMenuSEO } from "../../../../utils/seoUtils";

export async function generateMetadata({ params }) {
  const { locale, categorySlug } = await params;
  const seoData = generateMenuSEO(categorySlug, locale);

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

export default async function CategoryPage({ params }) {
  const { locale, categorySlug } = await params;

  return <MenuPage categorySlug={categorySlug} />;
}
