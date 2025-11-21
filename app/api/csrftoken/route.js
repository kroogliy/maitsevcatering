import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request) {
  try {
    // Проверяем Referer для безопасности
    const referer = request.headers.get("Referer");

    // Разрешаем локальные запросы в development-режиме
    const isLocalhost = referer && referer.startsWith("http://localhost:3000");
    const isProductionDomain =
      referer &&
      (referer.startsWith("https://www.maitsevgruusia.ee") ||
        referer.startsWith("https://maitsevgruusia.ee") ||
        referer.startsWith("https://maitsevgruusia.vercel.app"));

    if (!referer || (!isLocalhost && !isProductionDomain)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 403 });
    }

    // Получаем CSRF-токен из кук
    const cookieStore = await cookies();
    const csrfToken = cookieStore.get("_csrf")?.value;

    if (!csrfToken) {
      return NextResponse.json(
        { error: "CSRF Token отсутствует" },
        { status: 400 },
      );
    }

    return NextResponse.json({ csrfToken });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
