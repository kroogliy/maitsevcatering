"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";

// import { oswald } from "../../../lib/fonts";
import { RiCheckboxCircleFill } from "react-icons/ri";
import {
  FiCheck,
  FiClock,
  FiMapPin,
  FiShoppingBag,
  FiPhone,
  FiMail,
} from "react-icons/fi";
import { formatPrice } from "../../../utils/priceUtils";
import "../thanks/thanks.css";

// Демо данные для тестирования
const mockOrder = {
  line_items: [
    {
      title: {
        en: "Dragon Roll Sushi",
        ru: "Ролл Дракон",
        ee: "Draakoni Sushi",
      },
      price: 14.5,
      quantity: 2,
      images: ["/images/cateringpage1.jpg"],
    },
    {
      title: {
        en: "Salmon Nigiri",
        ru: "Нигири с лососем",
        ee: "Lõhe Nigiri",
      },
      price: 8.9,
      quantity: 3,
      images: ["/images/cateringpage1.jpg"],
    },
    {
      name: "Sake Premium",
      price: 24.0,
      quantity: 1,
      images: ["/images/cateringpage1.jpg"],
    },
  ],
  deliveryType: "delivery",
  deliveryTimeOption: "scheduled",
  deliveryDate: "2024-01-15",
  deliveryTime: "18:30",
};

const mockOrderId = "MS20240115001";

// Функция для создания конфетти
const createConfetti = () => {
  const confettiContainer = document.createElement("div");
  confettiContainer.className = "confetti-container";
  document.body.appendChild(confettiContainer);

  const colors = ["#000", "#333", "#666", "#999"];

  for (let i = 0; i < 30; i++) {
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
    if (confettiContainer.parentNode) {
      confettiContainer.remove();
    }
  }, 5000);
};

export default function ThanksTest() {
  const t = useTranslations("Thanks");
  const { locale } = useParams();
  const [isVisible, setIsVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("+3725023599");

  const localize = (item, locale) => {
    if (!item || !item.title) {
      return "";
    }
    return item.title[locale] || item.title.en || item.title;
  };

  useEffect(() => {
    // Анимация появления страницы
    setTimeout(() => {
      setIsVisible(true);
      // Запускаем конфетти
      createConfetti();
    }, 500);
  }, []);

  const deliveryPrice = mockOrder.deliveryType === "delivery" ? 5 : 0;
  const totalPrice =
    mockOrder.line_items.reduce(
      (total, item) => total + item.price * item.quantity,
      0,
    ) + deliveryPrice;
  const productAmount = mockOrder.line_items.reduce(
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

  const formattedDate = formatDate(mockOrder.deliveryDate);
  const formattedDateTime = `${formattedDate} ${mockOrder.deliveryTime}`;

  return (
    <>
      <div
        className={`container ${oswald.className} ${isVisible ? "visible" : ""}`}
      >
        <div className="success-icon">
          <FiCheck size="6rem" color="#22c55e" strokeWidth={2} />
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
            {mockOrderId
              ? `${t("orderNumber")}: ${mockOrderId.slice(-7)}`
              : "N/A"}
          </div>
          <h3 className="summary-header">{t("orderSummary")}</h3>
          <div className="item-list">
            {mockOrder.line_items.map((item, index) => {
              const productName =
                item.name ||
                (typeof item.title === "object"
                  ? item.title[locale] || item.title.en
                  : item.title);
              const imageClass = item.name
                ? "item-imageAlkohol"
                : "item-imageProduct";
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
              {mockOrder.deliveryType === "delivery"
                ? t("deliveryOption")
                : t("takeawayOption")}
            </div>
          </div>
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
              <div className="stat-number">{mockOrder.line_items.length}</div>
              <div className="stat-label">
                {t("itemsOrdered") || "Items Ordered"}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-number">
                {mockOrder.line_items.reduce(
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
    </>
  );
}
