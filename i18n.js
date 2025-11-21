import { getRequestConfig } from "next-intl/server";
import { headers } from "next/headers";

// Static imports for all locales
import enMessages from "./messages/en.json";
import ruMessages from "./messages/ru.json";
import etMessages from "./messages/et.json";

const supportedLocales = ["en", "ru", "et"];
const defaultLocale = "et";

// Messages map
const messages = {
  en: enMessages,
  ru: ruMessages,
  et: etMessages,
};

export default getRequestConfig(async () => {
  // Получаем заголовки запроса
  const requestHeaders = await headers();

  // Получаем локаль из заголовка
  const detectedLocale = requestHeaders.get("X-NEXT-INTL-LOCALE");

  // Определяем локаль
  let locale = supportedLocales.includes(detectedLocale) ? detectedLocale : defaultLocale;

  return {
    locale,
    messages: messages[locale] || messages[defaultLocale],
  };
});
