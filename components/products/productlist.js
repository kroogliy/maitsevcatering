"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion } from "framer-motion";

import { PiMinusCircleThin, PiPlusCircleThin } from "react-icons/pi";

import styles from "../../app/[locale]/menu/menu.module.css";
import modalStyles from "./productlist.module.css";
import AgeConfirmation from "../ageconfirmation/ageconfirmation";
import { useCart } from "../../contexts/CartContext";
import { applyDiscount, formatPrice } from "../../utils/priceUtils";
// import { oswald } from "../../lib/fonts";
// import { roboto } from "../../lib/fonts";

const ProductList = React.memo(
  ({
    products,
    addToCart,
    selectedQuantities,
    locale,
    t,
    isDrinksCategory,
    activeSubCategory,
    isVisible,
    decreaseSelectedQuantity,
    increaseSelectedQuantity,
    localize,
    categorySlug,
    subcategorySlug,
    isHomePage = false,
  }) => {
    const { isAgeModalOpen, setIsAgeModalOpen, handleConfirmAge } = useCart();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const normalizeImage = (images) => {
      if (typeof images === "string") {
        return images;
      }
      if (Array.isArray(images) && images.length > 0) {
        return images[0];
      }
      return "/images/cateringpage1.jpg";
    };

    const handleProductClick = (product) => {
      setSelectedProduct(product);
      setIsModalOpen(true);
      // Скрываем хедер для product модалки
      document.body.classList.add("product-modal-open");
      window.history.pushState(
        {},
        "",
        `/${locale}/menu/${categorySlug}/${subcategorySlug}/${product.slug}`,
      );
    };

    const handleCloseModal = useCallback(() => {
      setIsModalOpen(false);
      setSelectedProduct(null);
      const returnUrl = isHomePage
        ? `/${locale}`
        : `/${locale}/menu/${categorySlug}/${subcategorySlug}`;
      window.history.pushState({}, "", returnUrl);
    }, [locale, categorySlug, subcategorySlug, isHomePage]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          isModalOpen &&
          event.target.classList.contains(modalStyles.modalProductOverlay)
        ) {
          handleCloseModal();
        }
      };

      const handleEscapeKey = (event) => {
        if (event.key === "Escape" && isModalOpen) {
          handleCloseModal();
        }
      };

      if (isModalOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscapeKey);

        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
          document.removeEventListener("keydown", handleEscapeKey);
        };
      }
    }, [isModalOpen, handleCloseModal]);

    useEffect(() => {
      if (isModalOpen) {
        // Добавляем CSS класс
        document.body.classList.add("modal-open");

        // Останавливаем smooth scroll библиотеки
        if (window.lenis) {
          window.lenis.stop();
        }

        // ГЛАВНОЕ: Блокируем события с capture: true
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

        // capture: true = перехватываем ДО smooth scroll библиотек
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
        document.addEventListener("keydown", preventKeyScroll, {
          capture: true,
        });
        window.addEventListener("scroll", preventScroll, {
          passive: false,
          capture: true,
        });

        // Сохраняем функции для очистки
        window.productModalCleanup = () => {
          document.body.classList.remove("modal-open");

          // Включаем smooth scroll обратно
          if (window.lenis) {
            setTimeout(() => window.lenis.start(), 100);
          }

          // Убираем все обработчики (с capture: true!)
          document.removeEventListener("wheel", preventScroll, {
            capture: true,
          });
          document.removeEventListener("touchmove", preventScroll, {
            capture: true,
          });
          document.removeEventListener("scroll", preventScroll, {
            capture: true,
          });
          document.removeEventListener("keydown", preventKeyScroll, {
            capture: true,
          });
          window.removeEventListener("scroll", preventScroll, {
            capture: true,
          });
        };
      } else {
        if (window.productModalCleanup) {
          window.productModalCleanup();
          window.productModalCleanup = null;
        }
      }
    }, [isModalOpen]);

    return (
      <div className={styles.productContainer}>
        {products.map((item) => {
          const isDrink = item.name !== undefined;
          const imageUrl = normalizeImage(item.images);
          const imageWidth = isDrink ? 750 : 750;
          const imageHeight = isDrink ? 550 : 450;

          if (isDrinksCategory && activeSubCategory) {
            if (activeSubCategory._id === "alcoholic" && !item.isAlcoholic) {
              return null;
            }
            if (activeSubCategory._id === "non-alcoholic" && item.isAlcoholic) {
              return null;
            }
          }

          return (
            <div
              className={`${styles.productCard} ${isVisible ? styles.show : ""}`}
              key={item._id}
              style={{ cursor: "pointer" }}
            >
              <div className={styles.imageContainer}>
                <Image
                  width={imageWidth}
                  height={imageHeight}
                  src={imageUrl}
                  alt={item.name ? item.name : localize(item?.title, locale)}
                  className={
                    isDrink
                      ? styles.productImageDrinks
                      : styles.productImageMenu
                  }
                  onClick={() => handleProductClick(item)}
                  priority
                />
              </div>
              <div className={`${styles.productOverlay} overlay`}>
                <h2
                  onClick={() => handleProductClick(item)}
                  className={styles.overlayTitle}
                >
                  {item.name ? item.name : localize(item?.title, locale)}
                </h2>
                <p
                  className={styles.overlayDescription}
                  onClick={() => handleProductClick(item)}
                >
                  {isDrink
                    ? `${item.volume}cl`
                    : localize(item?.description, locale)}
                  {isDrink && item.degree > 0 && `, vol. ${item.degree}%`}
                </p>
                {isDrink && (
                  <>
                    <p className={styles.overlayDegree}>
                      {localize(item?.region, locale) &&
                        `${localize(item?.region, locale)} `}
                    </p>
                    <p className={styles.overlayDegree}>
                      {localize(item?.color, locale)}
                    </p>
                  </>
                )}
                {/* {!isDrink && (
                <p className={styles.overlayAllergens}>{item.allergens.join(", ")}</p>
              )} */}
                <p className={styles.overlayPrice}>
                  {formatPrice(applyDiscount(item.price))}€
                </p>
                <div className={styles["buttons"]}>
                  <button
                    className={styles.orderButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(item);
                    }}
                  >
                    {t("addButton")}
                  </button>

                  <div className={styles["controls"]}>
                    <button
                      className={styles["control-button"]}
                      onClick={(e) => {
                        e.stopPropagation();
                        decreaseSelectedQuantity(item._id);
                      }}
                    >
                      <PiMinusCircleThin />
                    </button>
                    <span className={styles["quantity-display"]}>
                      {selectedQuantities?.[item._id] ?? 1}
                    </span>
                    <button
                      className={styles["control-button"]}
                      onClick={(e) => {
                        e.stopPropagation();
                        increaseSelectedQuantity(item._id);
                      }}
                    >
                      <PiPlusCircleThin />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {isModalOpen &&
          selectedProduct &&
          typeof document !== "undefined" &&
          createPortal(
            <motion.div
              className={modalStyles.modalProductOverlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.div
                className={modalStyles.modalProductContent}
                initial={{
                  y: 100,
                  opacity: 0,
                  rotateX: -15,
                  scale: 0.8,
                }}
                animate={{
                  y: 0,
                  opacity: 1,
                  rotateX: 0,
                  scale: 1,
                }}
                exit={{
                  y: -100,
                  opacity: 0,
                  rotateX: 15,
                  scale: 0.8,
                }}
                transition={{
                  duration: 0.6,
                  ease: [0.4, 0, 0.2, 1],
                  type: "spring",
                  damping: 25,
                  stiffness: 200,
                }}
              >
                <button
                  className={modalStyles.productCloseButton}
                  onClick={handleCloseModal}
                >
                  ✕
                </button>

                <div className={modalStyles.productModalImageWrapper}>
                  <Image
                    src={normalizeImage(selectedProduct.images)}
                    alt={
                      selectedProduct.name !== undefined
                        ? selectedProduct.name
                        : localize(selectedProduct?.title, locale)
                    }
                    width={750}
                    height={300}
                    className={
                      selectedProduct.name !== undefined
                        ? modalStyles.productImageDrinks
                        : modalStyles.productImageMenu
                    }
                  />
                </div>

                <h2 className={modalStyles.productModalTitle}>
                  {selectedProduct.name !== undefined
                    ? selectedProduct.name
                    : localize(selectedProduct?.title, locale)}
                </h2>

                <div className={modalStyles.productModalDetails}>
                  <div className={modalStyles.productModalDetails}>
                    <div className={modalStyles.productModalDescription}>
                      {selectedProduct.name !== undefined ? (
                        <>
                          {/* Volume Icon + Text */}
                          <div className={modalStyles.productInfo}>
                            <span className={modalStyles.column}>
                              {`${selectedProduct.volume}cl`}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-droplet-icon lucide-droplet"
                              >
                                <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
                              </svg>
                            </span>

                            {/* Degree Icon + Text */}
                            {selectedProduct.degree > 0 && (
                              <>
                                <span className={modalStyles.column}>
                                  {selectedProduct.degree}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-percent-icon lucide-percent"
                                  >
                                    <line x1="19" x2="5" y1="5" y2="19" />
                                    <circle cx="6.5" cy="6.5" r="2.5" />
                                    <circle cx="17.5" cy="17.5" r="2.5" />
                                  </svg>
                                </span>
                              </>
                            )}
                          </div>
                        </>
                      ) : (
                        localize(selectedProduct?.description, locale)
                      )}
                    </div>

                    {selectedProduct.name !== undefined && (
                      <div>
                        {localize(selectedProduct?.region, locale) && (
                          <p className={modalStyles.productModalRegion}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                              >
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                                <path
                                  d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                                <path
                                  d="M2 12h20"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                />
                              </svg>
                              {localize(selectedProduct.region, locale)}
                            </span>
                          </p>
                        )}

                        {localize(selectedProduct?.color, locale) && (
                          <p className={modalStyles.productModalColor}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-wine-icon lucide-wine"
                              >
                                <path d="M8 22h8" />
                                <path d="M7 10h10" />
                                <path d="M12 15v7" />
                                <path d="M12 15a5 5 0 0 0 5-5c0-2-.5-4-2-8H9c-1.5 4-2 6-2 8a5 5 0 0 0 5 5Z" />
                              </svg>
                              {localize(selectedProduct.color, locale)}
                            </span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  <p className={modalStyles.productModalPrice}>
                    {formatPrice(applyDiscount(selectedProduct.price))}€
                  </p>

                  <div className={modalStyles.productButtons}>
                    <div className={modalStyles.productModalControls}>
                      <button
                        className={modalStyles.controlButton}
                        onClick={() =>
                          decreaseSelectedQuantity(selectedProduct._id)
                        }
                      >
                        <PiMinusCircleThin />
                      </button>
                      <span className={modalStyles.quantityDisplay}>
                        {selectedQuantities?.[selectedProduct._id] ?? 1}
                      </span>
                      <button
                        className={modalStyles.controlButton}
                        onClick={() =>
                          increaseSelectedQuantity(selectedProduct._id)
                        }
                      >
                        <PiPlusCircleThin />
                      </button>
                    </div>

                    <button
                      className={modalStyles.addToCartButton}
                      onClick={(e) => {
                        // Добавляем товар в корзину с правильными параметрами
                        addToCart(selectedProduct, locale, t);
                      }}
                    >
                      {t("addButton")}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>,
            document.body,
          )}

        {/* Одна модалка для всех продуктов */}
        {typeof document !== "undefined" &&
          createPortal(
            <AgeConfirmation
              isOpen={isAgeModalOpen}
              onClose={() => setIsAgeModalOpen(false)}
              onConfirm={() => handleConfirmAge(locale, t)}
            />,
            document.body,
          )}
      </div>
    );
  },
);

ProductList.displayName = "ProductList"; // Указываем имя компонента

export default ProductList;
