import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import { routing } from "./src/i18n/routing";

// Создаем middleware для локалей
const intlMiddleware = createMiddleware(routing);

// Performance optimization - cache static paths
const STATIC_PATHS = new Set([
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/manifest.json",
]);

// Cache for frequently accessed paths
const pathCache = new Map();
const CACHE_SIZE_LIMIT = 1000;

// Функция для генерации CSRF-токена с использованием Web Crypto API
async function generateCsrfToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array); // Используем Web Crypto API
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

// Функция для установки CSRF-токена в cookies
function setCsrfCookie(response, csrfToken) {
  response.cookies.set("_csrf", csrfToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 1800, // 30 минут
    path: "/",
  });
}

export async function middleware(request) {
  const pathname = request.nextUrl.pathname;
  const url = new URL(request.url);

  // Performance optimization - early return for static files
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/api/") ||
    STATIC_PATHS.has(pathname) ||
    pathname.match(
      /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|webp|avif)$/,
    )
  ) {
    const response = intlMiddleware(request);

    // Add caching headers for static assets
    if (
      pathname.match(
        /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot|webp|avif)$/,
      )
    ) {
      response.headers.set(
        "Cache-Control",
        "public, max-age=31536000, immutable",
      );
    }

    return response;
  }

  // Проверка CSRF-токена для POST-запросов
  if (request.method === "POST") {
    const csrfToken = request.cookies.get("_csrf")?.value;
    const headerToken = request.headers.get("X-CSRF-Token");

    if (!csrfToken || !headerToken || csrfToken !== headerToken) {
      // Only log CSRF errors in development
      if (process.env.NODE_ENV === "development") {
        // Invalid CSRF token
      }
      return new NextResponse("Invalid CSRF token", { status: 403 });
    }
  }

  // Генерация и установка CSRF-токена, если его нет
  const csrfToken = request.cookies.get("_csrf")?.value;

  // Get response from intl middleware
  const response = intlMiddleware(request);

  if (!csrfToken) {
    const newCsrfToken = await generateCsrfToken();
    setCsrfCookie(response, newCsrfToken);
  }

  // Add performance headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");

  // Add Vary header for proper caching
  response.headers.set("Vary", "Accept-Language, Accept-Encoding");

  // Cache dynamic pages for a short time
  if (!pathname.includes("/order") && !pathname.includes("/checkout")) {
    response.headers.set(
      "Cache-Control",
      "public, max-age=60, stale-while-revalidate=300",
    );
  }

  return response;
}

export const config = {
  matcher: ["/", "/(et|ru|en)/:path*"], // Применяем middleware ко всем страницам
};
