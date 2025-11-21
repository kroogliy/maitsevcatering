"use client";

import { useEffect, useRef } from "react";

/**
 * Hook для работы с Lenis smooth scroll
 * @returns {Object} Объект с методами для управления Lenis
 */
export function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Получаем экземпляр Lenis из window
    lenisRef.current = window.lenis;
  }, []);

  /**
   * Скролл к элементу или позиции
   * @param {string|number|HTMLElement} target - Селектор, позиция или элемент
   * @param {Object} options - Опции для скролла
   */
  const scrollTo = (target, options = {}) => {
    if (!lenisRef.current) {
      // Fallback для случаев, когда Lenis недоступен
      if (typeof target === "number") {
        window.scrollTo({
          top: target,
          behavior: "smooth",
          ...options,
        });
      } else if (typeof target === "string") {
        const element = document.querySelector(target);
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
            ...options,
          });
        }
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
          ...options,
        });
      }
      return;
    }

    const isMobile = window.innerWidth < 1024;
    const defaultOptions = {
      duration: isMobile ? 0.8 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      offset: 0,
      ...options,
    };

    lenisRef.current.scrollTo(target, defaultOptions);
  };

  /**
   * Останавливает smooth scroll
   */
  const stop = () => {
    if (lenisRef.current) {
      lenisRef.current.stop();
    }
  };

  /**
   * Запускает smooth scroll
   */
  const start = () => {
    if (lenisRef.current) {
      lenisRef.current.start();
    }
  };

  /**
   * Получает текущую позицию скролла
   * @returns {number} Позиция скролла
   */
  const getScroll = () => {
    if (lenisRef.current) {
      return lenisRef.current.scroll;
    }
    return window.scrollY;
  };

  /**
   * Получает скорость скролла
   * @returns {number} Скорость скролла
   */
  const getVelocity = () => {
    if (lenisRef.current) {
      return lenisRef.current.velocity;
    }
    return 0;
  };

  /**
   * Проверяет, активен ли скролл
   * @returns {boolean} Состояние скролла
   */
  const isScrolling = () => {
    if (lenisRef.current) {
      return lenisRef.current.isScrolling;
    }
    return false;
  };

  /**
   * Проверяет, остановлен ли Lenis
   * @returns {boolean} Состояние Lenis
   */
  const isStopped = () => {
    if (lenisRef.current) {
      return lenisRef.current.isStopped;
    }
    return false;
  };

  /**
   * Добавляет слушатель событий Lenis
   * @param {string} event - Название события ('scroll', 'stop', 'start')
   * @param {Function} callback - Функция-обработчик
   */
  const on = (event, callback) => {
    if (lenisRef.current) {
      lenisRef.current.on(event, callback);
    }
  };

  /**
   * Удаляет слушатель событий Lenis
   * @param {string} event - Название события
   * @param {Function} callback - Функция-обработчик
   */
  const off = (event, callback) => {
    if (lenisRef.current) {
      lenisRef.current.off(event, callback);
    }
  };

  /**
   * Скролл к началу страницы
   */
  const scrollToTop = (options = {}) => {
    scrollTo(0, options);
  };

  /**
   * Скролл к концу страницы
   */
  const scrollToBottom = (options = {}) => {
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    scrollTo(maxScroll, options);
  };

  /**
   * Плавный скролл к следующей секции
   */
  const scrollToNextSection = () => {
    const sections = document.querySelectorAll("section, [data-section]");
    const currentScroll = getScroll();

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTop = section.offsetTop;

      if (sectionTop > currentScroll + 50) {
        scrollTo(section);
        break;
      }
    }
  };

  /**
   * Плавный скролл к предыдущей секции
   */
  const scrollToPrevSection = () => {
    const sections = document.querySelectorAll("section, [data-section]");
    const currentScroll = getScroll();

    for (let i = sections.length - 1; i >= 0; i--) {
      const section = sections[i];
      const sectionTop = section.offsetTop;

      if (sectionTop < currentScroll - 50) {
        scrollTo(section);
        break;
      }
    }
  };

  return {
    scrollTo,
    stop,
    start,
    getScroll,
    getVelocity,
    isScrolling,
    isStopped,
    on,
    off,
    scrollToTop,
    scrollToBottom,
    scrollToNextSection,
    scrollToPrevSection,
    lenis: lenisRef.current,
  };
}

/**
 * Hook для отслеживания прогресса скролла
 * @param {Function} callback - Функция, вызываемая при скролле
 */
export function useLenisScroll(callback) {
  const { on, off } = useLenis();

  useEffect(() => {
    if (typeof callback !== "function") return;

    const handleScroll = (data) => {
      const progress =
        data.scroll /
        (document.documentElement.scrollHeight - window.innerHeight);
      callback({
        scroll: data.scroll,
        progress: Math.min(1, Math.max(0, progress)),
        velocity: data.velocity,
        direction: data.direction,
      });
    };

    on("scroll", handleScroll);

    return () => {
      off("scroll", handleScroll);
    };
  }, [callback, on, off]);
}

/**
 * Hook для создания parallax эффекта
 * @param {number} speed - Скорость параллакса (0-1)
 */
export function useLenisParallax(speed = 0.5) {
  const elementRef = useRef(null);
  const { on, off, getScroll } = useLenis();

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    const handleScroll = () => {
      const scroll = getScroll();
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scroll;
      const windowHeight = window.innerHeight;

      // Вычисляем смещение для параллакса
      if (rect.top < windowHeight && rect.bottom > 0) {
        const offset = (scroll - elementTop + windowHeight) * speed;
        element.style.transform = `translate3d(0, ${offset}px, 0)`;
      }
    };

    on("scroll", handleScroll);

    return () => {
      off("scroll", handleScroll);
    };
  }, [speed, on, off, getScroll]);

  return elementRef;
}
