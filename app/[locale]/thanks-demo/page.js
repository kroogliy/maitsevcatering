"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

import {
  FiCheck,
  FiClock,
  FiMapPin,
  FiShoppingBag,
  FiPhone,
  FiMail,
  FiPackage,
  FiTruck,
  FiCalendar,
} from "react-icons/fi";
import { formatPrice } from "../../../utils/priceUtils";
import styles from "../thanks/thanks-new.module.css";

// Функция для создания премиум конфетти
const createConfetti = () => {
  const confettiContainer = document.createElement("div");
  confettiContainer.className = styles.confettiContainer;
  document.body.appendChild(confettiContainer);

  const colors = [
    "#d4af37",
    "#e6c757",
    "#c49f31",
    "#f4e4c1",
    "#1a1a1a",
    "#4ade80",
  ];

  // Создаем больше конфетти для более эффектной анимации
  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement("div");
    confetti.className = styles.confetti;
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.animationDelay = Math.random() * 3 + "s";
    confetti.style.animationDuration = Math.random() * 3 + 3 + "s";

    // Добавляем разные размеры конфетти
    const size = Math.random() * 8 + 4;
    confetti.style.width = size + "px";
    confetti.style.height = size + "px";

    // Добавляем разные формы
    if (Math.random() > 0.5) {
      confetti.style.borderRadius = "50%";
    }

    confettiContainer.appendChild(confetti);
  }

  // Удаляем конфетти через 6 секунд
  setTimeout(() => {
    confettiContainer.style.opacity = "0";
    confettiContainer.style.transition = "opacity 1s ease-out";
    setTimeout(() => {
      confettiContainer.remove();
    }, 1000);
  }, 5000);
};

export default function ThanksDemoPage() {
  const t = useTranslations("Thanks");
  const { locale } = useParams();
  const [isVisible, setIsVisible] = useState(false);
  const phoneNumber = "+3725023599";

  // Тестовые данные для демонстрации
  const demoOrder = {
    deliveryType: "delivery",
    deliveryTimeOption: "scheduled",
    deliveryDate: "2024-12-25",
    deliveryTime: "18:00",
    line_items: [
      {
        name: "Хачапури по-аджарски",
        title: {
          en: "Adjarian Khachapuri",
          et: "Adžaaria khachapuri",
          ru: "Хачапури по-аджарски",
        },
        price: 18.5,
        quantity: 2,
        images: ["/images/menu/khachapuri.jpg"],
      },
      {
        name: "Хинкали с мясом",
        title: {
          en: "Meat Khinkali",
          et: "Liha khinkali",
          ru: "Хинкали с мясом",
        },
        price: 12.0,
        quantity: 3,
        images: ["/images/menu/khinkali.jpg"],
      },
      {
        name: "Саперави красное сухое",
        title: {
          en: "Saperavi Red Dry Wine",
          et: "Saperavi punane kuiv vein",
          ru: "Саперави красное сухое",
        },
        price: 28.0,
        quantity: 1,
        images: ["/images/menu/wine.jpg"],
      },
    ],
  };

  const demoOrderId = "DEMO-2024-001";

  useEffect(() => {
    // Анимация появления страницы
    setTimeout(() => {
      setIsVisible(true);
      createConfetti();
    }, 500);
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Calculate totals
  const deliveryPrice = demoOrder.deliveryType === "delivery" ? 5 : 0;
  const productAmount = demoOrder.line_items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const totalPrice = productAmount + deliveryPrice;

  const formattedDate = formatDate(demoOrder.deliveryDate);
  const formattedDateTime = `${formattedDate} ${demoOrder.deliveryTime}`;

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ""}`}>
      {/* Demo Notice */}
      <div
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          background: "linear-gradient(135deg, #d4af37 0%, #e6c757 100%)",
          color: "white",
          padding: "10px 20px",
          borderRadius: "50px",
          fontSize: "0.9rem",
          fontFamily: '"NyghtSerif", serif',
          zIndex: 1000,
          boxShadow: "0 4px 15px rgba(212, 175, 55, 0.25)",
        }}
      >
        DEMO MODE - Тестовый режим
      </div>

      {/* Success Icon */}
      <div className={styles.successIconWrapper}>
        <div className={styles.successIcon}>
          <FiCheck size="3rem" strokeWidth={3} />
        </div>
      </div>

      {/* Success Message */}
      <div className={styles.successMessage}>
        <h1 className={styles.title}>{t("successMessageTitle")}</h1>
        <h2 className={styles.subtitle}>
          {t("successMessageSubtitle")}{" "}
          <a href={`tel:${phoneNumber}`} className={styles.phoneLink}>
            <FiPhone size="1rem" />
            {phoneNumber}
          </a>{" "}
          {t("successMessageSubtitleSecond")}
        </h2>
      </div>

      {/* Order Summary Container */}
      <div className={styles.orderSummaryContainer}>
        {/* Order ID Badge */}
        <div className={styles.orderId}>
          <FiShoppingBag size="1.2rem" />
          {t("orderNumber")}: {demoOrderId}
        </div>

        {/* Summary Header */}
        <h3 className={styles.summaryHeader}>{t("orderSummary")}</h3>

        {/* Items List */}
        <div className={styles.itemList}>
          {demoOrder.line_items.map((item, index) => {
            const productName =
              item.name ||
              (typeof item.title === "object"
                ? item.title[locale] || item.title.en || item.title.ru
                : item.title);
            const imageClass =
              item.name.includes("вино") || item.name.includes("Wine")
                ? styles.itemImageAlkohol
                : styles.itemImageProduct;

            return (
              <div className={styles.itemRow} key={index}>
                <div
                  className={imageClass}
                  style={{
                    width: "80px",
                    height: "80px",
                    background: `linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)`,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: "1.25rem",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                    fontSize: "0.8rem",
                    color: "#999",
                    textAlign: "center",
                    padding: "10px",
                  }}
                >
                  {index === 0 ? "🥧" : index === 1 ? "🥟" : "🍷"}
                </div>
                <div className={styles.itemDetails}>
                  <span className={styles.itemName}>{productName}</span>
                </div>
                <div className={styles.itemInfo}>
                  <span className={styles.itemPrice}>
                    {formatPrice(item.price * item.quantity)}€
                  </span>
                  <span className={styles.itemQuantity}>
                    {t("itemQuantity")}
                    <span className={styles.quantityBadge}>
                      {item.quantity}
                    </span>
                  </span>
                </div>
              </div>
            );
          })}

          {/* Sub Total */}
          <div className={styles.subTotal}>
            <span>{t("productAmount")}:</span>
            <span className={styles.amount}>{formatPrice(productAmount)}€</span>
          </div>
        </div>

        {/* Delivery Info */}
        <div className={styles.summaryFooter}>
          <div>
            <FiMapPin
              size="1.1rem"
              style={{ marginRight: "0.5rem", verticalAlign: "middle" }}
            />
            {t("deliveryOptionTitle")}:
          </div>
          <div>
            {demoOrder.deliveryType === "delivery" ? (
              <>
                <FiTruck
                  size="1.1rem"
                  style={{ marginRight: "0.3rem", verticalAlign: "middle" }}
                />
                {t("deliveryOption")}
              </>
            ) : (
              <>
                <FiPackage
                  size="1.1rem"
                  style={{ marginRight: "0.3rem", verticalAlign: "middle" }}
                />
                {t("takeawayOption")}
              </>
            )}
          </div>
        </div>

        {/* Delivery Time */}
        {demoOrder.deliveryTimeOption === "scheduled" ? (
          <div className={styles.summaryFooter}>
            <div>
              <FiCalendar
                size="1.1rem"
                style={{ marginRight: "0.5rem", verticalAlign: "middle" }}
              />
              {t("orderDateAndTime")}:
            </div>
            <div>{formattedDateTime}</div>
          </div>
        ) : (
          <div className={styles.summaryFooter}>
            <div>
              <FiClock
                size="1.1rem"
                style={{ marginRight: "0.5rem", verticalAlign: "middle" }}
              />
              {t("orderDateAndTime")}:
            </div>
            <div>{t("orderAsap")}</div>
          </div>
        )}

        {/* Delivery Price */}
        <div className={styles.summaryFooter}>
          <div>{t("deliveryPrice")}:</div>
          <div
            className={
              deliveryPrice > 0
                ? styles.delivery
                : `${styles.delivery} ${styles.deliveryFree}`
            }
          >
            {deliveryPrice > 0 ? `${formatPrice(deliveryPrice)}€` : "FREE"}
          </div>
        </div>

        {/* Final Total */}
        <div className={`${styles.summaryFooter} ${styles.finalTotal}`}>
          <div className={styles.total}>{t("totalPrice")}:</div>
          <div className={styles.total}>{formatPrice(totalPrice)}€</div>
        </div>

        {/* Order Statistics */}
        <div className={styles.orderStats}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>
              {demoOrder.line_items.length}
            </div>
            <div className={styles.statLabel}>
              {t("itemsOrdered") || "Items Ordered"}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>
              {demoOrder.line_items.reduce(
                (total, item) => total + item.quantity,
                0,
              )}
            </div>
            <div className={styles.statLabel}>
              {t("totalQuantity") || "Total Quantity"}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>{formatPrice(totalPrice)}€</div>
            <div className={styles.statLabel}>
              {t("orderValue") || "Order Value"}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          <button
            className={styles.contactButton}
            onClick={() => window.open(`tel:${phoneNumber}`, "_self")}
          >
            <FiPhone size="1.2rem" />
            {t("contactUs") || "Contact Us"}
          </button>
          <button
            className={styles.emailButton}
            onClick={() =>
              window.open("mailto:info@maitsevgruusia.ee", "_self")
            }
          >
            <FiMail size="1.2rem" />
            {t("emailUs") || "Email Us"}
          </button>
        </div>
      </div>
    </div>
  );
}
