"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getCookie } from "cookies-next";

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
import { useCart } from "../../../contexts/CartContext";
import { formatPrice } from "../../../utils/priceUtils";
import styles from "./thanks-new.module.css";

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

export default function ThanksPage() {
  const searchParams = useSearchParams();
  const orderToken = searchParams.get("order-token");
  const t = useTranslations("Thanks");
  const { clearCart } = useCart();
  const { locale } = useParams();

  const [merchantReference, setMerchantReference] = useState(null);
  const [uuid, setUuid] = useState(null);
  const [order, setOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phoneNumber] = useState("+3725023599");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (orderToken) {
      setLoading(true);
      const csrfToken = getCookie("_csrf");

      fetch("/api/payment-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify({ orderToken }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Payment notification response:", data);

          if (data.merchantReference && data.uuid) {
            setMerchantReference(data.merchantReference);
            setUuid(data.uuid);
            setPaymentStatus("PAID");
            clearCart();
          } else {
            console.error(
              "Missing merchantReference or uuid in response:",
              data,
            );
            setPaymentStatus("FAILED");
          }
        })
        .catch((error) => {
          console.error("Payment notification error:", error);
          setPaymentStatus("FAILED");
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.error("No order token found in URL");
      setLoading(false);
    }
  }, [orderToken, clearCart]);

  useEffect(() => {
    const orderInfo = JSON.parse(localStorage.getItem("orderInfo"));
    if (orderInfo) {
      setOrder(orderInfo);
      console.log("Order info from localStorage:", orderInfo);
    } else {
      console.warn("No order info found in localStorage");
    }

    // Анимация появления страницы
    setTimeout(() => {
      setIsVisible(true);
      // Запускаем конфетти при успешном заказе
      if (paymentStatus === "PAID" || (!loading && order)) {
        createConfetti();
      }
    }, 500);
  }, [paymentStatus, loading, order]);

  // Очистка корзины при монтировании
  useEffect(() => {
    clearCart();
  }, [clearCart]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.loadingSpinner}>
        <div className={styles.spinner}></div>
        <p className={styles.spinnerText}>{t("loadingOrderDetails")}</p>
      </div>
    );
  }

  // Error state
  if (!order || !merchantReference || paymentStatus === "FAILED") {
    return (
      <div className={`${styles.container} ${isVisible ? styles.visible : ""}`}>
        <div className={styles.successIconWrapper}>
          <div className={styles.successIcon}>
            <FiPackage size="3rem" color="#94a3b8" />
          </div>
        </div>
        <div className={styles.successMessage}>
          <h1 className={styles.title}>{t("errorLoadingOrderDetails")}</h1>
          <h2 className={styles.subtitle}>{t("errorTryAgainLater")}</h2>
        </div>
      </div>
    );
  }

  // Calculate totals
  const deliveryPrice = order.deliveryType === "delivery" ? 5 : 0;
  const productAmount = order.line_items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const totalPrice = productAmount + deliveryPrice;

  const formattedDate = formatDate(order.deliveryDate);
  const formattedDateTime = `${formattedDate} ${order.deliveryTime}`;

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ""}`}>
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
          {merchantReference
            ? `${t("orderNumber")}: ${merchantReference}`
            : "N/A"}
        </div>

        {/* Summary Header */}
        <h3 className={styles.summaryHeader}>{t("orderSummary")}</h3>

        {/* Items List */}
        <div className={styles.itemList}>
          {order.line_items.map((item, index) => {
            const productName =
              item.name ||
              (typeof item.title === "object"
                ? item.title[locale] || item.title.en
                : item.title);
            const imageClass = item.name
              ? styles.itemImageAlkohol
              : styles.itemImageProduct;

            return (
              <div className={styles.itemRow} key={index}>
                <Image
                  className={imageClass}
                  src={
                    Array.isArray(item.images) && item.images.length > 0
                      ? item.images[0]
                      : typeof item.images === "string"
                        ? item.images
                        : "/images/cateringpage1.jpg"
                  }
                  alt={productName}
                  width={80}
                  height={80}
                />
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
            {order.deliveryType === "delivery" ? (
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
        {order.deliveryTimeOption === "scheduled" ? (
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
            <div className={styles.statNumber}>{order.line_items.length}</div>
            <div className={styles.statLabel}>
              {t("itemsOrdered") || "Items Ordered"}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>
              {order.line_items.reduce(
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
