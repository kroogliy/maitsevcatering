"use client";

import React, { useState, useEffect, useCallback, memo } from "react";
import { useTranslations } from "next-intl";
import { IoClose } from "react-icons/io5";
import { IoIosArrowRoundForward } from "react-icons/io";
import { TbShieldCheck } from "react-icons/tb";
import styles from "./ageconfirmation.module.css";

const AgeConfirmation = memo(function AgeConfirmation({
  isOpen,
  onClose,
  onConfirm,
}) {
  const t = useTranslations("AgeConfirmation");
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Добавляем CSS класс для блокировки скролла
      document.body.classList.add("modal-open");

      // Останавливаем smooth scroll библиотеки
      if (window.lenis) {
        window.lenis.stop();
      }

      // Блокируем события скролла с capture: true
      const preventScroll = (e) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };

      const preventKeyScroll = (e) => {
        if ([32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)) {
          e.preventDefault();
        }
      };

      // Добавляем обработчики с capture: true
      document.addEventListener("wheel", preventScroll, {
        passive: false,
        capture: true,
      });
      document.addEventListener("touchmove", preventScroll, {
        passive: false,
        capture: true,
      });
      document.addEventListener("scroll", preventScroll, {
        passive: false,
        capture: true,
      });
      document.addEventListener("keydown", preventKeyScroll, { capture: true });
      window.addEventListener("scroll", preventScroll, {
        passive: false,
        capture: true,
      });

      // Сохраняем функции для очистки
      window.ageModalCleanup = () => {
        document.body.classList.remove("modal-open");

        // Включаем smooth scroll обратно
        if (window.lenis) {
          setTimeout(() => window.lenis.start(), 100);
        }

        // Убираем все обработчики
        document.removeEventListener("wheel", preventScroll, { capture: true });
        document.removeEventListener("touchmove", preventScroll, {
          capture: true,
        });
        document.removeEventListener("scroll", preventScroll, {
          capture: true,
        });
        document.removeEventListener("keydown", preventKeyScroll, {
          capture: true,
        });
        window.removeEventListener("scroll", preventScroll, { capture: true });
      };
    }

    return () => {
      if (isOpen && window.ageModalCleanup) {
        window.ageModalCleanup();
        window.ageModalCleanup = null;
      }
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsClosing(true);

    if (window.ageModalCleanup) {
      window.ageModalCleanup();
      window.ageModalCleanup = null;
    }

    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  }, [onClose]);

  const handleConfirm = useCallback(() => {
    setIsClosing(true);

    if (window.ageModalCleanup) {
      window.ageModalCleanup();
      window.ageModalCleanup = null;
    }

    setTimeout(() => {
      onConfirm();
      setIsClosing(false);
    }, 300);
  }, [onConfirm]);

  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        handleClose();
      }
    },
    [handleClose],
  );

  if (!isOpen) return null;

  return (
    <div
      className={`${styles["modal-overlay"]} ${isClosing ? styles["closing"] : ""}`}
      onClick={handleOverlayClick}
      data-lenis-prevent
    >
      <div
        className={`${styles["modal-content"]} ${isClosing ? styles["closing"] : ""}`}
        data-lenis-prevent
      >
        <button
          className={styles["close-button"]}
          onClick={handleClose}
          aria-label="Close modal"
        >
          <IoClose size={24} />
        </button>

        {/* Декоративные элементы */}
        <div className={styles["modal-decoration"]}>
          <div
            className={`${styles["decoration-circle"]} ${styles["circle-1"]}`}
          ></div>
          <div
            className={`${styles["decoration-circle"]} ${styles["circle-2"]}`}
          ></div>
          <div
            className={`${styles["decoration-line"]} ${styles["line-1"]}`}
          ></div>
          <div
            className={`${styles["decoration-line"]} ${styles["line-2"]}`}
          ></div>
        </div>

        {/* Основной контент */}
        <div className={styles["modal-main-content"]}>
          {/* Заголовок с иконкой */}
          <div className={styles["modal-header"]}>
            <div className={styles["age-badge"]}>
              <div className={styles["badge-text"]}>
                <span className={styles["age-number"]}>18+</span>
              </div>
            </div>
          </div>

          {/* Заголовок */}
          <div className={styles["modal-title-section"]}>
            <h2 className={styles["modal-title"]}>{t("ageConfirm")}</h2>
          </div>

          {/* Подзаголовок */}
          <div className={styles["modal-subtitle-section"]}>
            <p className={styles["modal-subtitle"]}>{t("disclaimer")}</p>
            <div className={styles["subtitle-decoration"]}>
              <TbShieldCheck className={styles["shield-icon"]} />
            </div>
          </div>

          {/* Кнопки */}
          <div className={styles["modal-buttons"]}>
            <button
              onClick={handleConfirm}
              className={styles["confirm-button"]}
            >
              <div className={styles["button-content"]}>
                <span className={styles["button-text"]}>{t("iAm18")}</span>
                <span className={styles["button-icon"]}>
                  <IoIosArrowRoundForward />
                </span>
              </div>
              <div className={styles["button-background"]}></div>
            </button>

            <button onClick={handleClose} className={styles["decline-button"]}>
              <span className={styles["decline-text"]}>
                {t("iAmNot18") || "I'M UNDER 18"}
              </span>
            </button>
          </div>

          {/* Логотип */}
          <div className={styles["logo-container"]}>
            <div className={styles["logo-wrapper"]}>
              <img
                src="/images/mblogo.png"
                width="1536"
                height="1024"
                alt="Maitsev Gruusia Logo"
                className={styles["modal-logo"]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AgeConfirmation;
