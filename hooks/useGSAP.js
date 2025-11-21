"use client";

import { useEffect, useRef, useLayoutEffect, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Регистрируем плагины один раз
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Безопасный хук для работы с GSAP анимациями
 * Автоматически очищает все созданные анимации при размонтировании
 * или перезагрузке в dev-режиме
 */
export function useGSAP(callback, dependencies = []) {
  const contextRef = useRef();
  const cleanupRef = useRef();
  const isDev = process.env.NODE_ENV === "development";

  // Стабилизируем callback
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableCallback = useCallback(callback, dependencies);

  // Используем useLayoutEffect для синхронного выполнения
  useLayoutEffect(() => {
    // Очищаем предыдущие анимации
    if (cleanupRef.current) {
      cleanupRef.current();
    }

    // Создаем новый GSAP контекст
    contextRef.current = gsap.context(() => {
      if (stableCallback && typeof stableCallback === "function") {
        const cleanup = stableCallback();
        if (typeof cleanup === "function") {
          cleanupRef.current = cleanup;
        }
      }
    });

    // В dev-режиме добавляем дополнительную очистку
    if (isDev) {
      const handleBeforeUnload = () => {
        if (contextRef.current) {
          contextRef.current.kill();
        }
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };

      window.addEventListener("beforeunload", handleBeforeUnload);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        handleBeforeUnload();
      };
    }

    return () => {
      if (contextRef.current) {
        contextRef.current.kill();
      }
      if (cleanupRef.current) {
        cleanupRef.current();
      }
    };
  }, [stableCallback, isDev]);

  // Возвращаем объект с утилитами
  return {
    context: contextRef.current,
    gsap,
    ScrollTrigger,
  };
}

/**
 * Хук для создания ScrollTrigger с автоматической очисткой
 */
export function useScrollTrigger(config, dependencies = []) {
  const triggerRef = useRef();

  useLayoutEffect(() => {
    // Очищаем предыдущий триггер
    if (triggerRef.current) {
      triggerRef.current.kill();
    }

    // Создаем новый триггер с задержкой для стабильности
    const createTrigger = () => {
      if (config && typeof config === "object") {
        triggerRef.current = ScrollTrigger.create(config);
      }
    };

    // В dev-режиме добавляем небольшую задержку
    if (process.env.NODE_ENV === "development") {
      const timeout = setTimeout(createTrigger, 100);
      return () => {
        clearTimeout(timeout);
        if (triggerRef.current) {
          triggerRef.current.kill();
        }
      };
    } else {
      createTrigger();
    }

    return () => {
      if (triggerRef.current) {
        triggerRef.current.kill();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, ...dependencies]);

  return triggerRef.current;
}

/**
 * Хук для создания timeline с автоматической очисткой
 */
export function useTimeline(vars = {}, dependencies = []) {
  const timelineRef = useRef();

  useLayoutEffect(() => {
    // Очищаем предыдущую timeline
    if (timelineRef.current) {
      timelineRef.current.kill();
    }

    // Создаем новую timeline
    timelineRef.current = gsap.timeline(vars);

    return () => {
      if (timelineRef.current) {
        timelineRef.current.kill();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vars, ...dependencies]);

  return timelineRef.current;
}

/**
 * Утилита для безопасного рефреша ScrollTrigger
 */
export function refreshScrollTrigger() {
  if (typeof window !== "undefined") {
    // В dev-режиме добавляем задержку
    if (process.env.NODE_ENV === "development") {
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    } else {
      ScrollTrigger.refresh();
    }
  }
}

/**
 * Утилита для полной очистки всех GSAP анимаций
 */
export function killAllGSAP() {
  if (typeof window !== "undefined") {
    // Убиваем все ScrollTrigger
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

    // Убиваем все активные tweens
    gsap.killTweensOf("*");

    // Очищаем все контексты
    gsap.globalTimeline.clear();

    // Рефрешим ScrollTrigger
    ScrollTrigger.refresh();
  }
}

export default useGSAP;
