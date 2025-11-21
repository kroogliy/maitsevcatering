"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { getCookie } from "cookies-next";

import { oswald } from "../../../lib/fonts";
import { RiCheckboxCircleFill } from "react-icons/ri";
import {
  FiCheck,
  FiClock,
  FiMapPin,
  FiShoppingBag,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { useCart } from "../../../contexts/CartContext";
import { applyDiscount, formatPrice } from "../../../utils/priceUtils";
import "./thanks.css";

// Функция для создания конфетти
const createConfetti = () => {
  const confettiContainer = document.createElement("div");
  confettiContainer.className = "confetti-container";
  document.body.appendChild(confettiContainer);

  const colors = [
    "#2d6c45",
    "#45a049",
    "#4ade80",
    "#ff4e00",
    "#f74c01",
    "#e84903",
  ];

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = Math.random() * 100 + "%";
    confetti.style.animationDelay = Math.random() * 3 + "s";
    confetti.style.animationDuration = Math.random() * 3 + 2 + "s";
    confettiContainer.appendChild(confetti);
  }

  // Удаляем конфетти через 5 секунд
  setTimeout(() => {
    confettiContainer.remove();
  }, 5000);
};

export default function Thanks() {
  const searchParams = useSearchParams();
  const orderToken = searchParams.get("order-token");
  const t = useTranslations("Thanks");
  const { clearCart } = useCart();

  const localize = (item, locale) => {
    if (!item || !item.title) {
      return "";
    }
    return item.title[locale] || item.title.en || item.title;
  };

  const { locale } = useParams();

  const [orderId, setOrderId] = useState(null);
  const [uuid, setUuid] = useState(null);
  const [order, setOrder] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("+3725023599"); // Номер телефона по умолчанию
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (orderToken) {
      setLoading(true);
      const csrfToken = getCookie("_csrf"); // Получаем CSRF-токен из кук
      fetch("/api/payment-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken, // Передаем CSRF-токен в заголовке
        },
        body: JSON.stringify({ orderToken }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.orderId && data.uuid) {
            setOrderId(data.orderId);
            setUuid(data.uuid);
            setPaymentStatus("PAID");
            // Очищаем корзину при успешном заказе

            clearCart();
          } else {
            setPaymentStatus("FAILED");
          }
        })
        .catch((error) => {
          setPaymentStatus("FAILED");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [orderToken, clearCart]);

  useEffect(() => {
    const orderInfo = JSON.parse(localStorage.getItem("orderInfo"));
    if (orderInfo) {
      setOrder(orderInfo);
    } else {
    }

    // Анимация появления страницы
    setTimeout(() => {
      setIsVisible(true);
      // Запускаем конфетти при успешном заказе
      if (paymentStatus === "PAID" || paymentStatus !== "FAILED") {
        createConfetti();
      }
    }, 500);
  }, [paymentStatus]);

  // Отдельный useEffect для очистки корзины
  useEffect(() => {
    // Очищаем корзину сразу при открытии страницы благодарности

    clearCart();
  }, [clearCart]);

  if (loading) {
    return (
      <div className={`container ${oswald.className}`}>
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p className="spinner-text">{t("loadingOrderDetails")}</p>
        </div>
      </div>
    );
  }

  if (!order || !orderId || paymentStatus === "FAILED") {
    return (
      <div className={`container ${oswald.className}`}>
        <div className="success-icon">
          <RiCheckboxCircleFill size="8rem" color="#94a3b8" />
        </div>
        <div className="success-message">
          <h1 className="title">{t("errorLoadingOrderDetails")}</h1>
          <h2 className="subtitle">{t("errorTryAgainLater")}</h2>
        </div>
      </div>
    );
  }

  const deliveryPrice = order.deliveryType === "delivery" ? 5 : 0;
  const totalPrice =
    order.line_items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    ) + deliveryPrice;
  const productAmount = order.line_items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const formattedDate = formatDate(order.deliveryDate);
  const formattedDateTime = `${formattedDate} ${order.deliveryTime}`;

  return (
    <>
      <div
        className={`container ${oswald.className} ${isVisible ? "visible" : ""}`}
      >
        <div className="success-icon">
          <FiCheck size="6rem" color="#4ade80" strokeWidth={2} />
        </div>
        <div className="success-message">
          <h1 className="title">{t("successMessageTitle")}</h1>
          <h2 className="subtitle">
            {t("successMessageSubtitle")}{" "}
            <a href={`tel:${phoneNumber}`} className="phone-link">
              <FiPhone size="1rem" style={{ marginRight: "0.3rem" }} />
              {phoneNumber}
            </a>{" "}
            {t("successMessageSubtitleSecond")}
          </h2>
        </div>
        <div className="order-summary-container">
          <div className="order-id">
            <FiShoppingBag size="1rem" style={{ marginRight: "0.5rem" }} />
            {orderId ? `${t("orderNumber")}: ${orderId.slice(-7)}` : "N/A"}
          </div>
          <h3 className="summary-header">{t("orderSummary")}</h3>
          <div className="item-list">
            {order.line_items.map((item, index) => {
              const productName =
                item.name ||
                (typeof item.title === "object"
                  ? item.title[locale] || item.title.en
                  : item.title);
              const imageClass = item.name
                ? "item-imageAlkohol"
                : "item-imageProduct"; // Определяем класс стиля
              return (
                <div className="item-row" key={index}>
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
                    width={750}
                    height={350}
                  />
                  <div className="item-details">
                    <span className="item-name">{productName}</span>
                  </div>
                  <div className="item-info">
                    <span className="item-price">
                      {formatPrice(item.price * item.quantity)}€
                    </span>
                    <span className="item-quantity">
                      {t("itemQuantity")}
                      <span className="quantity-badge">{item.quantity}</span>
                    </span>
                  </div>
                </div>
              );
            })}
            <div className="sub-total">
              <span>{t("productAmount")}:</span>
              <span className="amount">{formatPrice(productAmount)}€</span>
            </div>
          </div>
          <div className="summary-footer">
            <div>
              <FiMapPin
                size="1.1rem"
                style={{ marginRight: "0.5rem", verticalAlign: "middle" }}
              />
              {t("deliveryOptionTitle")}:
            </div>
            <div>
              {order.deliveryType === "delivery"
                ? t("deliveryOption")
                : t("takeawayOption")}
            </div>
          </div>
          {order.deliveryTimeOption === "scheduled" ? (
            <div className="summary-footer">
              <div>
                <FiClock
                  size="1.1rem"
                  style={{ marginRight: "0.5rem", verticalAlign: "middle" }}
                />
                {t("orderDateAndTime")}:
              </div>
              <div>{formattedDateTime}</div>
            </div>
          ) : (
            <div className="summary-footer">
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
          <div className="summary-footer">
            <div>{t("deliveryPrice")}:</div>
            <div
              className={
                deliveryPrice > 0 ? "delivery" : "delivery delivery-free"
              }
            >
              {deliveryPrice > 0 ? `${formatPrice(deliveryPrice)}€` : "FREE"}
            </div>
          </div>
          <div className="summary-footer final-total">
            <div className="total">{t("totalPrice")}:</div>
            <div className="total">{formatPrice(totalPrice)}€</div>
          </div>

          <div className="order-stats">
            <div className="stat-item">
              <div className="stat-number">{order.line_items.length}</div>
              <div className="stat-label">
                {t("itemsOrdered") || "Items Ordered"}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {order.line_items.reduce(
                  (total, item) => total + item.quantity,
                  0,
                )}
              </div>
              <div className="stat-label">
                {t("totalQuantity") || "Total Quantity"}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{formatPrice(totalPrice)}€</div>
              <div className="stat-label">
                {t("orderValue") || "Order Value"}
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button
              className="contact-button"
              onClick={() => window.open(`tel:${phoneNumber}`, "_self")}
            >
              <FiPhone size="1.2rem" />
              {t("contactUs") || "Contact Us"}
            </button>
            <button
              className="email-button"
              onClick={() => window.open("mailto:info@maitsev.ee", "_self")}
            >
              <FiMail size="1.2rem" />
              {t("emailUs") || "Email Us"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
