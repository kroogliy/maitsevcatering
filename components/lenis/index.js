// Экспорт всех компонентов и хуков Lenis
export { default as LenisProvider } from "./LenisProvider";
export { useLenis, useLenisScroll, useLenisParallax } from "./useLenis";

// Утилиты для работы с Lenis
export const lenisUtils = {
  /**
   * Получает экземпляр Lenis из window
   * @returns {Object|null} Экземпляр Lenis или null
   */
  getInstance: () => {
    return typeof window !== "undefined" ? window.lenis : null;
  },

  /**
   * Проверяет, инициализирован ли Lenis
   * @returns {boolean} Состояние инициализации
   */
  isInitialized: () => {
    return typeof window !== "undefined" && !!window.lenis;
  },

  /**
   * Получает контроллер Lenis
   * @returns {Object|null} Контроллер Lenis или null
   */
  getController: () => {
    return typeof window !== "undefined" ? window.lenisControl : null;
  },

  /**
   * Безопасный скролл к элементу с fallback
   * @param {string|number|HTMLElement} target - Цель скролла
   * @param {Object} options - Опции скролла
   */
  safeScrollTo: (target, options = {}) => {
    const lenis = lenisUtils.getInstance();

    if (lenis) {
      const isMobile = window.innerWidth < 1024;
      const defaultOptions = {
        duration: isMobile ? 0.8 : 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        ...options,
      };

      lenis.scrollTo(target, defaultOptions);
    } else {
      // Fallback к нативному скроллу
      if (typeof target === "number") {
        window.scrollTo({
          top: target,
          behavior: "smooth",
        });
      } else if (typeof target === "string") {
        const element = document.querySelector(target);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  },

  /**
   * Добавляет класс data-lenis-prevent к элементу
   * @param {HTMLElement} element - Элемент для исключения из smooth scroll
   */
  preventScroll: (element) => {
    if (element instanceof HTMLElement) {
      element.setAttribute("data-lenis-prevent", "");
    }
  },

  /**
   * Удаляет класс data-lenis-prevent с элемента
   * @param {HTMLElement} element - Элемент для включения в smooth scroll
   */
  allowScroll: (element) => {
    if (element instanceof HTMLElement) {
      element.removeAttribute("data-lenis-prevent");
    }
  },
};

// Константы для настройки Lenis
export const LENIS_CONFIG = {
  mobile: {
    duration: 0.8,
    touchMultiplier: 1.5,
    wheelMultiplier: 0.8,
    lerp: 0.1,
    smoothTouch: true,
    syncTouch: true,
    syncTouchLerp: 0.1,
    touchInertiaMultiplier: 25,
  },
  desktop: {
    duration: 1.2,
    touchMultiplier: 1,
    wheelMultiplier: 1,
    lerp: 0.07,
    smoothTouch: false,
    syncTouch: false,
    syncTouchLerp: 0.075,
    touchInertiaMultiplier: 35,
  },
  common: {
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: "vertical",
    gestureDirection: "vertical",
    smooth: true,
    infinite: false,
    autoResize: true,
    normalizeWheel: true,
    eventsTarget: window,
  },
};
