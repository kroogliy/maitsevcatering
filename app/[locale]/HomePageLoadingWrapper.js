"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./HomePageLoadingWrapper.module.css";

export default function HomePageLoadingWrapper({
  children,
  pageName = "page",
}) {
  // Проверяем на стороне клиента, была ли внутренняя навигация
  const [showLoading, setShowLoading] = useState(() => {
    if (typeof window !== "undefined") {
      const isInternal =
        window.sessionStorage.getItem("internalNavigation") === "true";
      return !isInternal;
    }
    return true;
  });
  const [progress, setProgress] = useState(0);
  const [showMusicChoice, setShowMusicChoice] = useState(false);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [audioLoaded, setAudioLoaded] = useState(false);
  const audioRef = useRef(null);
  const progressRef = useRef(0);
  const animationRef = useRef(null);

  // Инициализация аудио
  useEffect(() => {
    if (typeof window !== "undefined" && showLoading) {
      // Проверяем, есть ли уже глобальное аудио
      if (window.globalAudio) {
        audioRef.current = window.globalAudio;
      } else {
        audioRef.current = new Audio("/folk.mp3");
        audioRef.current.loop = true;
        audioRef.current.volume = 0.6;
        audioRef.current.preload = "auto";
        window.globalAudio = audioRef.current;
      }

      // Сохраняем глобально для доступа из других компонентов
      window.globalAudio = audioRef.current;

      audioRef.current.addEventListener("canplaythrough", () => {
        setAudioLoaded(true);
      });

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = "";
          window.globalAudio = null;
        }
      };
    }
  }, [showLoading]);

  // Анимация прогресса от 0 до 100
  useEffect(() => {
    // Проверяем, была ли это внутренняя навигация
    const isInternalNavigation =
      window.sessionStorage.getItem("internalNavigation") === "true";

    if (isInternalNavigation) {
      // Если это внутренняя навигация, сразу скрываем загрузчик
      window.sessionStorage.removeItem("internalNavigation");
      setShowLoading(false);
      setProgress(100);
      return;
    }

    let startTime = null;
    const duration = 4000;

    const animateProgress = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progressValue = Math.min((elapsed / duration) * 100, 100);

      progressRef.current = progressValue;
      setProgress(Math.floor(progressValue));

      if (progressValue < 100) {
        animationRef.current = requestAnimationFrame(animateProgress);
      } else {
        setTimeout(() => {
          setShowMusicChoice(true);
        }, 800);
      }
    };

    animationRef.current = requestAnimationFrame(animateProgress);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Выбор музыки и вход на сайт
  const chooseMusicAndEnter = (enableMusic) => {
    if (enableMusic && audioRef.current && audioLoaded) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setMusicEnabled(true);
            localStorage.setItem("musicEnabled", "true");
          })
          .catch(() => {});
      }
    } else {
      setMusicEnabled(false);
      localStorage.setItem("musicEnabled", "false");
    }

    // Диспатчим событие что загрузчик закрывается
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("loadingWrapperClosed"));
    }

    setTimeout(() => {
      setShowLoading(false);
    }, 500);
  };

  // Восстановление музыки при переходах между страницами
  useEffect(() => {
    if (typeof window !== "undefined" && !showLoading) {
      const savedState = localStorage.getItem("musicEnabled");
      if (savedState === "true" && audioLoaded && audioRef.current) {
        setTimeout(() => {
          audioRef.current.play().catch(() => {});
          setMusicEnabled(true);
        }, 1000);
      }
    }
  }, [audioLoaded, showLoading]);

  // Глобальное управление музыкой
  useEffect(() => {
    if (!showLoading && audioLoaded && musicEnabled) {
      const handleVisibilityChange = () => {
        if (document.hidden && audioRef.current && !audioRef.current.paused) {
          audioRef.current.pause();
        } else if (!document.hidden && musicEnabled && audioRef.current) {
          audioRef.current.play().catch(() => {});
        }
      };

      document.addEventListener("visibilitychange", handleVisibilityChange);
      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange,
        );
      };
    }
  }, [showLoading, audioLoaded, musicEnabled]);

  return (
    <div className={styles.container}>
      {/* Скрываем children через opacity чтобы GSAP мог инициализироваться */}
      <div
        style={{
          opacity: showLoading ? 0 : 1,
          pointerEvents: showLoading ? "none" : "auto",
          transition: showLoading ? "none" : "opacity 0.5s ease",
        }}
      >
        {children}
      </div>

      {showLoading && (
        <div className={styles.loadingOverlay}>
          {!showMusicChoice && (
            <>
              <div className={styles.logo}>maitsev gruusia</div>
              <div className={styles.logoSubtext}>
                Georgian Culinary Experience
              </div>
              <div className={styles.progressNumber}>
                {progress.toString().padStart(2, "0")}
              </div>
            </>
          )}

          {showMusicChoice && (
            <>
              <div className={styles.musicChoiceContainer}>
                <div className={styles.musicChoiceTitle}>
                  Your Journey Begins
                </div>

                <div className={styles.musicChoiceSubtitle}>
                  Immerse yourself in authentic Georgian atmosphere
                </div>

                <div className={styles.musicChoiceDescription}>
                  Let the soul of Georgia accompany your culinary adventure
                  through centuries-old flavors and traditions. Experience the
                  warmth of Georgian hospitality with every taste.
                </div>

                <div className={styles.buttonContainer}>
                  <button
                    onClick={() => chooseMusicAndEnter(true)}
                    disabled={!audioLoaded}
                    className={styles.primaryButton}
                  >
                    Enter with Music
                  </button>

                  <button
                    onClick={() => chooseMusicAndEnter(false)}
                    className={styles.secondaryButton}
                  >
                    Continue in Silence
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
