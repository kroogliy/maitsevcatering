import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.js");

const nextConfig = {
  trailingSlash: true, // Важно для корректной генерации ссылок
  skipTrailingSlashRedirect: true, // Отключаем автоматические редиректы 308

  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: true,

  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ibb.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "allure-ecommerce.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "maitsevtallinn.s3.amazonaws.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "balmerk.ee",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "maitsevtallinn.s3.eu-north-1.amazonaws.com",
        pathname: "/**",
      },
    ],
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Caching headers
  async headers() {
    const isDev = process.env.NODE_ENV === "development";

    return [
      {
        source: "/api/products/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=7200",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, max-age=86400",
          },
          {
            key: "Vercel-CDN-Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=172800",
          },
        ],
      },
      {
        source: "/api/alkohols/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=7200",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, max-age=86400",
          },
          {
            key: "Vercel-CDN-Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=172800",
          },
        ],
      },
      {
        source: "/api/categories/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=7200",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, max-age=86400",
          },
          {
            key: "Vercel-CDN-Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=172800",
          },
        ],
      },
      {
        source: "/api/subcategories/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, stale-while-revalidate=7200",
          },
          {
            key: "CDN-Cache-Control",
            value: "public, max-age=86400",
          },
          {
            key: "Vercel-CDN-Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=172800",
          },
        ],
      },
      // Warmup API endpoint (no cache for monitoring)
      {
        source: "/api/warmup",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
      // Static assets caching (disabled for CSS in development)
      {
        source:
          "/:path*\\.(js|woff|woff2|ttf|eot|ico|png|jpg|jpeg|gif|svg|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: isDev
              ? "no-cache, no-store, must-revalidate"
              : "public, max-age=31536000, immutable",
          },
        ],
      },
      // CSS and HTML no-cache for development
      {
        source: "/:path*\\.(css|html)",
        headers: [
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Pragma",
            value: "no-cache",
          },
          {
            key: "Expires",
            value: "0",
          },
        ],
      },
    ];
  },

  experimental: {
    optimizeCss: false,
    optimizeServerReact: false,
    serverMinification: false,
    serverSourceMaps: true,
    scrollRestoration: false,
  },

  // Dev server optimizations
  ...(process.env.NODE_ENV === "development" && {
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    },
  }),

  // Bundle analyzer for production optimization
  webpack: (config, { dev, isServer }) => {
    // Development optimizations
    if (dev) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };

      // Disable caching in development
      config.cache = false;

      // Better error overlay
      config.stats = {
        errorDetails: true,
      };
    }

    // Production optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: "all",
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
        },
      };
    }

    return config;
  },
};

export default withNextIntl(nextConfig);
