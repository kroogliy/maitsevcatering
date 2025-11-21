/**
 * Утилиты для локализации текстов
 * Этот файл не содержит импортов Mongoose и безопасен для клиентского кода
 */

/**
 * Получает локализованный текст из объекта с переводами
 * @param {string|object} field - Поле с переводами или строка
 * @param {string} locale - Код локали (en, et, ru)
 * @param {string} fallback - Значение по умолчанию
 * @returns {string} Локализованный текст
 */
export function getLocalizedText(field, locale = 'en', fallback = '') {
  if (!field) return fallback;
  if (typeof field === 'string') return field;
  if (typeof field === 'number') return String(field);
  if (typeof field === 'object' && field !== null) {
    return field[locale] || field.en || field.et || field.ru ||
           Object.values(field)[0] || fallback;
  }
  return fallback;
}

/**
 * Получает локализованное имя/название
 * @param {object} item - Объект с полем name или title
 * @param {string} locale - Код локали
 * @param {string} fallback - Значение по умолчанию
 * @returns {string} Локализованное имя
 */
export function getLocalizedName(item, locale = 'en', fallback = '') {
  if (!item) return fallback;

  // Пробуем name, потом title
  const name = getLocalizedText(item.name, locale) ||
               getLocalizedText(item.title, locale);

  return name || fallback;
}

/**
 * Получает локализованное описание
 * @param {object} item - Объект с полем description
 * @param {string} locale - Код локали
 * @param {string} fallback - Значение по умолчанию
 * @returns {string} Локализованное описание
 */
export function getLocalizedDescription(item, locale = 'en', fallback = '') {
  if (!item || !item.description) return fallback;
  return getLocalizedText(item.description, locale, fallback);
}

/**
 * Форматирует цену в зависимости от локали
 * @param {number} price - Цена
 * @param {string} locale - Код локали
 * @param {string} currency - Валюта
 * @returns {string} Отформатированная цена
 */
export function formatLocalizedPrice(price, locale = 'en', currency = 'EUR') {
  if (!price || isNaN(price)) return '';

  const options = {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };

  try {
    return new Intl.NumberFormat(locale === 'et' ? 'et-EE' : locale === 'ru' ? 'ru-RU' : 'en-US', options).format(price);
  } catch (error) {
    // Fallback formatting
    return `${price.toFixed(2)} €`;
  }
}

/**
 * Проверяет, является ли объект переводом (имеет ключи локалей)
 * @param {any} obj - Объект для проверки
 * @returns {boolean} true если объект содержит переводы
 */
export function isTranslationObject(obj) {
  if (!obj || typeof obj !== 'object') return false;
  const localeKeys = ['en', 'et', 'ru'];
  return Object.keys(obj).some(key => localeKeys.includes(key));
}

/**
 * Получает доступные локали из объекта перевода
 * @param {object} translationObj - Объект с переводами
 * @returns {string[]} Массив доступных локалей
 */
export function getAvailableLocales(translationObj) {
  if (!isTranslationObject(translationObj)) return [];
  const localeKeys = ['en', 'et', 'ru'];
  return localeKeys.filter(locale => translationObj[locale]);
}

/**
 * Создает объект перевода из строки
 * @param {string} text - Текст
 * @param {string} locale - Локаль для текста
 * @returns {object} Объект перевода
 */
export function createTranslation(text, locale = 'en') {
  return { [locale]: text };
}

/**
 * Объединяет несколько объектов переводов
 * @param {...object} translations - Объекты переводов
 * @returns {object} Объединенный объект переводов
 */
export function mergeTranslations(...translations) {
  return translations.reduce((merged, translation) => {
    if (isTranslationObject(translation)) {
      return { ...merged, ...translation };
    }
    return merged;
  }, {});
}
