"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollController() {
  const pathname = usePathname();

  // Настраиваем корректное поведение скролла при навигации
  useEffect(() => {
    // Отключаем автоматическое восстановление позиции скролла в браузере
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    // Обновляем Lenis для новой страницы
    const updateLenis = () => {
      if (window.lenis) {
        window.lenis.resize();
        window.lenis.start();
      }
    };

    // Небольшая задержка для корректной работы
    const updateTimer = setTimeout(updateLenis, 100);

    return () => clearTimeout(updateTimer);
  }, [pathname]);

  // Обработчик для кнопок Назад/Вперед браузера
  useEffect(() => {
    const handlePopState = () => {
      // Для навигации браузером можем делать плавный скролл к верху
      setTimeout(() => {
        if (window.scrollToTop) {
          window.scrollToTop();
        }
      }, 100);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  return null; // Компонент не рендерит ничего видимого
}
