"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import styles from "./loadingscreen.module.css";

export default function LoadingScreen({ onLoadingComplete, speed = "normal" }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Сохраняем текущую позицию скролла
    const scrollY = window.scrollY;
    const scrollX = window.scrollX;

    // Сохраняем оригинальные стили
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalLeft = document.body.style.left;
    const originalWidth = document.body.style.width;

    // Блокируем скролл страницы
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.left = `-${scrollX}px`;
    document.body.style.width = "100%";

    // Проверяем на dev режим
    const isDevelopment = process.env.NODE_ENV === "development";

    // Настройка скорости
    const speedMultipliers = {
      fast: 0.8,
      normal: 1,
      slow: 1.2,
      dev: 0.5,
    };

    const animationMultiplier = speedMultipliers[speed] || 1;
    const SHOW_TIME = 2000; // Ровно 2 секунды

    // В dev режиме проверяем состояние WebSocket
    let wsCheckTimer = null;
    if (isDevelopment) {
      wsCheckTimer = setTimeout(() => {
        // Принудительно завершаем если WebSocket висит
        const wsConnections = navigator.connection || {};
      }, 1500);
    }

    // НЕМЕДЛЕННО устанавливаем начальное состояние
    gsap.set(`.${styles.logo}`, {
      scale: 0.8,
      opacity: 0,
      filter: "blur(6px)",
      force3D: true,
      transformOrigin: "center center",
    });

    gsap.set(`.${styles.loadingScreen}`, {
      opacity: 1,
      force3D: true,
    });

    // Анимация появления логотипа
    gsap.to(`.${styles.logo}`, {
      scale: 1,
      opacity: 1,
      filter: "blur(0px)",
      duration: 1.0 * animationMultiplier,
      ease: "power2.out",
      delay: 0.2,
      force3D: true,
    });

    // Простой таймер - ровно 2 секунды
    const timer = setTimeout(() => {
      // Создаем timeline для последовательной анимации
      const exitTimeline = gsap.timeline();

      // Логотип уменьшается и исчезает
      exitTimeline.to(`.${styles.logo}`, {
        scale: 0.1,
        opacity: 0,
        duration: 0.8,
        ease: "power2.in",
        force3D: true,
      });

      // Фон исчезает ПОСЛЕ уменьшения логотипа
      exitTimeline.to(`.${styles.loadingScreen}`, {
        opacity: 0,
        duration: 0.4,
        ease: "power2.out",
        force3D: true,
        onComplete: () => {
          // Полная очистка всех GSAP свойств
          gsap.set(`.${styles.logo}`, { clearProps: "all" });
          gsap.set(`.${styles.loadingScreen}`, { clearProps: "all" });

          setIsVisible(false);
          if (onLoadingComplete) {
            onLoadingComplete();
          }
        },
      });
    }, SHOW_TIME);

    // Резервный таймер на случай проблем с GSAP или WebSocket
    const fallbackTimer = setTimeout(() => {
      setIsVisible(false);
      if (onLoadingComplete) {
        onLoadingComplete();
      }
    }, SHOW_TIME + 2000); // +2 секунды на случай зависания

    // Cleanup
    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
      if (wsCheckTimer) clearTimeout(wsCheckTimer);
      gsap.killTweensOf(`.${styles.logo}`);
      gsap.killTweensOf(`.${styles.loadingScreen}`);

      // Восстанавливаем скролл и позицию
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.left = originalLeft;
      document.body.style.width = originalWidth;

      // Восстанавливаем позицию скролла
      window.scrollTo(scrollX, scrollY);
    };
  }, [onLoadingComplete, speed]);

  // Не рендерим если не видимый
  if (!isVisible) {
    return null;
  }

  return (
    <div className={styles.loadingScreen}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>
            <Image
              src="/images/logoms.png"
              alt="Maitsev Gruusia"
              width={1024}
              height={1024}
              className={styles.logoImage}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
