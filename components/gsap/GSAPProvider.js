"use client";

import React, { createContext, useContext, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { killAllGSAP } from "../../hooks/useGSAP";

// Создаем контекст для GSAP
const GSAPContext = createContext({});

// Регистрируем плагины один раз
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function GSAPProvider({ children }) {
  const contextRef = useRef();
  const isDev = process.env.NODE_ENV === "development";
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;

    // Проверяем, находимся ли мы на проблемной странице
    const isOrderPage =
      typeof window !== "undefined" &&
      window.location.pathname.includes("/order");

    // В dev-режиме настраиваем более агрессивную очистку (кроме страницы order)
    if (isDev && !isOrderPage) {
      // Отключаем предупреждения GSAP в консоли для dev
      gsap.config({
        nullTargetWarn: false,
        trialWarn: false,
      });

      // Обработчик для HMR
      const handleHMR = () => {
        if (mountedRef.current) {
          killAllGSAP();

          // Небольшая задержка перед рефрешем
          setTimeout(() => {
            if (mountedRef.current) {
              ScrollTrigger.refresh();
            }
          }, 200);
        }
      };

      // Добавляем обработчик для сброса стилей при навигации
      const handleNavigation = () => {
        // Сбрасываем все GSAP стили с элементов
        const allElements = document.querySelectorAll("*[style]");
        allElements.forEach((el) => {
          if (el.style.opacity === "0" || el.style.visibility === "hidden") {
            gsap.set(el, {
              clearProps: "opacity,visibility",
            });
          }
        });
        ScrollTrigger.refresh();
      };

      // Слушаем события навигации
      window.addEventListener("popstate", handleNavigation);
      window.addEventListener("pushstate", handleNavigation);
      window.addEventListener("replacestate", handleNavigation);

      // Слушаем события HMR (отключено для страницы order)
      if (module.hot && !isOrderPage) {
        module.hot.accept();
        module.hot.dispose(() => {
          handleHMR();
        });
      }

      // Слушаем beforeunload для очистки при перезагрузке
      const handleBeforeUnload = () => {
        killAllGSAP();
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      // Очистка при размонтировании
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handleNavigation);
        window.removeEventListener("pushstate", handleNavigation);
        window.removeEventListener("replacestate", handleNavigation);
        mountedRef.current = false;
        handleHMR();
      };
    }

    return () => {
      mountedRef.current = false;
    };
  }, [isDev]);

  // Создаем глобальный контекст GSAP
  useEffect(() => {
    contextRef.current = gsap.context(() => {
      // Глобальные настройки для всех анимаций
      gsap.defaults({
        ease: "power2.out",
        duration: 0.6,
      });

      // Настройки ScrollTrigger
      ScrollTrigger.defaults({
        scroller: typeof window !== "undefined" ? window : null,
        markers: isDev ? false : false, // можно включить для отладки
        refreshPriority: 0,
      });
    });

    return () => {
      if (contextRef.current) {
        contextRef.current.kill();
      }
    };
  }, [isDev]);

  // Функции для управления анимациями
  const gsapUtils = {
    // Безопасное создание анимации
    to: (target, vars) => {
      if (!mountedRef.current) return;
      return gsap.to(target, vars);
    },

    // Безопасное создание timeline
    timeline: (vars) => {
      if (!mountedRef.current) return;
      return gsap.timeline(vars);
    },

    // Безопасное создание ScrollTrigger
    scrollTrigger: (vars) => {
      if (!mountedRef.current) return;
      return ScrollTrigger.create(vars);
    },

    // Принудительный рефреш
    refresh: () => {
      if (mountedRef.current) {
        // Сбрасываем скрытые элементы
        const hiddenElements = document.querySelectorAll(
          '[style*="opacity: 0"], [style*="visibility: hidden"]',
        );
        hiddenElements.forEach((el) => {
          if (!el.closest(".loadingOverlay")) {
            gsap.set(el, { clearProps: "opacity,visibility" });
          }
        });

        if (isDev) {
          setTimeout(() => ScrollTrigger.refresh(), 100);
        } else {
          ScrollTrigger.refresh();
        }
      }
    },

    // Убить все анимации
    killAll: () => {
      killAllGSAP();
    },

    // Проверка монтирования
    isMounted: () => mountedRef.current,

    // Контекст
    context: contextRef.current,
  };

  return (
    <GSAPContext.Provider value={gsapUtils}>{children}</GSAPContext.Provider>
  );
}

// Хук для использования GSAP контекста
export function useGSAPContext() {
  const context = useContext(GSAPContext);

  if (!context) {
    throw new Error("useGSAPContext must be used within GSAPProvider");
  }

  return context;
}

export default GSAPProvider;
