import {
  cachedAlkoholQueries,
  cachedCategoryQueries,
} from "../../lib/cache/unstableCache";

export default async function handler(req, res) {
  const { method, query } = req;
  const { slug, subcategorySlug, subcategoryId, page = 1, limit = 24 } = query;

  // Aggressive cache headers for static-like content
  res.setHeader(
    "Cache-Control",
    "public, max-age=3600, stale-while-revalidate=7200",
  );
  res.setHeader("CDN-Cache-Control", "public, max-age=86400");
  res.setHeader(
    "Vercel-CDN-Cache-Control",
    "public, max-age=86400, stale-while-revalidate=172800",
  );

  if (method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 1. Single alkohol by slug
    if (slug && !subcategoryId && !subcategorySlug) {
      const alkohol = await cachedAlkoholQueries.getAlkoholBySlug(slug);

      if (!alkohol) {
        return res.status(404).json({ error: "Product not found" });
      }

      return res.status(200).json(alkohol);
    }

    // 2. Alkohols by subcategory slug
    if (subcategorySlug) {
      const subcategory =
        await cachedCategoryQueries.getSubcategoryBySlug(subcategorySlug);

      if (!subcategory) {
        return res.status(404).json({ error: "Subcategory not found" });
      }

      const result = await cachedAlkoholQueries.getAlkohols(
        { subcategory: subcategory._id },
        page,
        limit,
      );

      return res.status(200).json({
        data: result.alkohols,
        pagination: result.pagination,
      });
    }

    // 3. Alkohols by subcategory ID
    if (subcategoryId) {
      const result = await cachedAlkoholQueries.getAlkohols(
        { subcategory: subcategoryId },
        page,
        limit,
      );

      return res.status(200).json({
        data: result.alkohols,
        pagination: result.pagination,
      });
    }

    // 4. All alkohols grouped by subcategory (default behavior)
    if (!slug && !subcategoryId && !subcategorySlug) {
      const result = await cachedAlkoholQueries.getAlkoholsBySubcategory();
      return res.status(200).json(result);
    }

    // 5. Fallback - all alkohols with pagination
    const result = await cachedAlkoholQueries.getAlkohols({}, page, limit);

    return res.status(200).json({
      data: result.alkohols,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error("Alkohol API Error:", error);

    return res.status(500).json({
      error: "Internal server error",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
}
