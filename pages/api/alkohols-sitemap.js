import { Alkohol } from "../../models/Alkohol";
import { mongooseConnect } from "../../lib/mongoose";
import mongoose from "mongoose";

export default async function handler(req, res) {
  const { method } = req;

  // Cache headers for sitemap generation (longer cache since this is for SEO)
  res.setHeader(
    "Cache-Control",
    "public, max-age=7200, stale-while-revalidate=14400",
  ); // 2 hours + 4 hours stale
  res.setHeader("CDN-Cache-Control", "public, max-age=86400"); // 24 hours for CDN
  res.setHeader("Vercel-CDN-Cache-Control", "public, max-age=172800"); // 48 hours for Vercel Edge

  if (method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    await mongooseConnect();

    // Get total count first
    const totalCount = await Alkohol.countDocuments();

    // Get ALL alkohols without any limits - this is specifically for sitemap
    const startTime = Date.now();

    const allAlkohols = await Alkohol.find({
      // Only include drinks that have required fields for sitemap
      slug: { $exists: true, $ne: null, $ne: "" },
      subcategory: { $exists: true, $ne: null },
    })
      .populate("category", "name slug")
      .populate("subcategory", "name slug")
      .select(
        "_id slug title name subcategory category isAlcoholic degree updatedAt createdAt",
      )
      .lean();

    const endTime = Date.now();

    // Check for drinks without subcategory
    const drinksWithoutSubcat = await Alkohol.countDocuments({
      $or: [
        { subcategory: null },
        { subcategory: { $exists: false } },
        { slug: null },
        { slug: { $exists: false } },
        { slug: "" },
      ],
    });

    if (drinksWithoutSubcat > 0) {
      // Some drinks excluded (missing slug or subcategory)
    }

    // Transform for sitemap consumption
    const transformedAlkohols = allAlkohols.map((alkohol) => ({
      _id: alkohol._id.toString(),
      slug: alkohol.slug,
      title: alkohol.title || alkohol.name,
      subcategory: alkohol.subcategory
        ? {
            _id: alkohol.subcategory._id.toString(),
            name: alkohol.subcategory.name,
            slug: alkohol.subcategory.slug,
          }
        : null,
      category: alkohol.category
        ? {
            _id: alkohol.category._id.toString(),
            name: alkohol.category.name,
            slug: alkohol.category.slug,
          }
        : null,
      isAlcoholic: alkohol.isAlcoholic,
      degree: alkohol.degree,
      updatedAt: alkohol.updatedAt,
      createdAt: alkohol.createdAt,
    }));

    // Group by subcategory for easier consumption (similar to regular API)
    const alkoholsBySubcategory = {};
    transformedAlkohols.forEach((alkohol) => {
      if (alkohol.subcategory) {
        const subId = alkohol.subcategory._id;
        if (!alkoholsBySubcategory[subId]) {
          alkoholsBySubcategory[subId] = [];
        }
        alkoholsBySubcategory[subId].push(alkohol);
      }
    });

    const subcategoryCount = Object.keys(alkoholsBySubcategory).length;

    // Log subcategory breakdown
    Object.entries(alkoholsBySubcategory).forEach(([subId, drinks]) => {
      if (drinks.length > 0) {
        const subcatName =
          drinks[0].subcategory?.name?.en ||
          drinks[0].subcategory?.name ||
          "Unknown";
      }
    });

    // Return in the expected format for sitemap
    return res.status(200).json({
      alkoholsBySubcategory,
      meta: {
        total: transformedAlkohols.length,
        subcategories: subcategoryCount,
        excluded: drinksWithoutSubcat,
        queryTime: endTime - startTime,
        generatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Sitemap alkohols API error:", error);

    return res.status(500).json({
      error: "Internal server error",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch alkohols for sitemap",
      details:
        process.env.NODE_ENV === "development"
          ? {
              stack: error.stack,
              timestamp: new Date().toISOString(),
            }
          : undefined,
    });
  }
}
