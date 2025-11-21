const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  // Для разработки - показывает все
  // Для продакшена - ничего не показывает клиенту
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },

  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  // Ошибки видны только в серверных логах (Vercel)
  error: (...args) => {
    // В продакшене логи ошибок идут только в серверные логи
    // Клиент их не видит
    console.error(...args);
  },

  // Для критичных операций - только серверные логи
  serverOnly: (...args) => {
    // Эти логи никогда не попадают в браузер
    // Только в серверные логи Vercel
    console.log(...args);
  },

  // Полностью отключенные логи
  disabled: (...args) => {
    // Ничего не делает
  }
};

// Экспортируем для CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { logger };
}
