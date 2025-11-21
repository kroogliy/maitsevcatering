import { mongooseConnect } from "../../lib/mongoose";
import { Product } from "../../models/Product";
import { Alkohol } from "../../models/Alkohol";
import { Category } from "../../models/Category";
import { Subcategory } from "../../models/Subcategory";

// Keep track of warmup statistics
let warmupStats = {
  totalRuns: 0,
  successfulRuns: 0,
  lastRun: null,
  averageDuration: 0,
  lastError: null,
};

export default async function handler(req, res) {
  // Only allow GET requests for warmup
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const startTime = Date.now();
  const requestSource = req.headers["user-agent"] || "Unknown";

  // Increment total runs
  warmupStats.totalRuns++;

  try {
    // Connect to database with timeout
    const dbConnectPromise = mongooseConnect();
    const dbTimeout = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Database connection timeout")), 10000),
    );

    await Promise.race([dbConnectPromise, dbTimeout]);

    // Warmup operations with error handling
    const warmupTasks = [
      // Warmup Product queries with fallback
      Product.countDocuments()
        .lean()
        .catch(() => 0),
      Product.findOne()
        .lean()
        .catch(() => null),

      // Warmup Alkohol queries with fallback
      Alkohol.countDocuments()
        .lean()
        .catch(() => 0),
      Alkohol.findOne()
        .lean()
        .catch(() => null),

      // Warmup Category queries with fallback
      Category.countDocuments()
        .lean()
        .catch(() => 0),
      Category.findOne()
        .lean()
        .catch(() => null),

      // Warmup Subcategory queries with fallback
      Subcategory.countDocuments()
        .lean()
        .catch(() => 0),
      Subcategory.findOne()
        .lean()
        .catch(() => null),
    ];

    // Execute all warmup tasks concurrently
    const results = await Promise.allSettled(warmupTasks);
    const successfulTasks = results.filter(
      (r) => r.status === "fulfilled",
    ).length;

    const endTime = Date.now();
    const duration = endTime - startTime;

    // Update statistics
    warmupStats.successfulRuns++;
    warmupStats.lastRun = new Date().toISOString();
    warmupStats.averageDuration = Math.round(
      (warmupStats.averageDuration * (warmupStats.successfulRuns - 1) +
        duration) /
        warmupStats.successfulRuns,
    );
    warmupStats.lastError = null;

    // Set cache headers optimized for monitoring services
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("X-Warmup-Duration", duration.toString());
    res.setHeader("X-Warmup-Success", "true");

    return res.status(200).json({
      success: true,
      message: "Warmup completed successfully",
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      stats: {
        totalRuns: warmupStats.totalRuns,
        successfulRuns: warmupStats.successfulRuns,
        successRate: Math.round(
          (warmupStats.successfulRuns / warmupStats.totalRuns) * 100,
        ),
        averageDuration: `${warmupStats.averageDuration}ms`,
        lastRun: warmupStats.lastRun,
      },
      taskResults: {
        successful: successfulTasks,
        total: warmupTasks.length,
        details: results.map((result, index) => ({
          task: [
            "Product count",
            "Product sample",
            "Alkohol count",
            "Alkohol sample",
            "Category count",
            "Category sample",
            "Subcategory count",
            "Subcategory sample",
          ][index],
          status: result.status,
          error: result.status === "rejected" ? result.reason?.message : null,
        })),
      },
      warmedUp: [
        "Database connection",
        "Product model (count + sample)",
        "Alkohol model (count + sample)",
        "Category model (count + sample)",
        "Subcategory model (count + sample)",
      ],
      source: requestSource.includes("UptimeRobot")
        ? "UptimeRobot"
        : requestSource.includes("Pingdom")
          ? "Pingdom"
          : requestSource.includes("GitHub")
            ? "GitHub Actions"
            : requestSource.includes("curl")
              ? "Manual curl"
              : "Unknown",
    });
  } catch (error) {
    const endTime = Date.now();
    const duration = endTime - startTime;

    // Update error statistics
    warmupStats.lastError = {
      message: error.message,
      timestamp: new Date().toISOString(),
    };

    console.error("❌ Warmup failed:", error);

    // Set error headers for monitoring
    res.setHeader("X-Warmup-Duration", duration.toString());
    res.setHeader("X-Warmup-Success", "false");
    res.setHeader("X-Warmup-Error", error.message);

    return res.status(500).json({
      success: false,
      error: "Warmup failed",
      message: error.message,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString(),
      stats: {
        totalRuns: warmupStats.totalRuns,
        successfulRuns: warmupStats.successfulRuns,
        successRate: Math.round(
          (warmupStats.successfulRuns / warmupStats.totalRuns) * 100,
        ),
        lastError: warmupStats.lastError,
      },
      source: requestSource,
    });
  }
}
