"use client";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

import { TfiWorld } from "react-icons/tfi";
import { RiColorFilterLine } from "react-icons/ri";
import { LiaWineBottleSolid } from "react-icons/lia";
import { GiWineGlass } from "react-icons/gi";
import { PiMinusCircleThin, PiPlusCircleThin } from "react-icons/pi";
import { IoIosArrowRoundBack } from "react-icons/io";

import { useCart } from "../../../../../../contexts/CartContext";
import AgeConfirmation from "../../../../../../components/ageconfirmation/ageconfirmation";
import { applyDiscount, formatPrice } from "../../../../../../utils/priceUtils";
import styles from "./productpage.module.css";

const normalizeImage = (images) => {
  if (typeof images === "string") {
    return images;
  }
  if (Array.isArray(images) && images.length > 0) {
    return images[0];
  }
  return "/images/cateringpage1.jpg";
};

// Функция для проверки наличия значимого содержимого
const hasValue = (value) => {
  if (!value) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "object") {
    return Object.values(value).some((v) => v && v.toString().trim() !== "");
  }
  return true;
};

// Функция для определения типа продукта
const isDrink = (product) => {
  return product.name !== undefined; // Если есть поле name, это напиток
};

// Компонент для хлебных крошек
const Breadcrumbs = ({
  category,
  subcategory,
  locale,
  t,
  categorySlug,
  subcategorySlug,
}) => {
  // Используем данные из URL если объекты undefined
  const catSlug = category?.slug || categorySlug || "menu";
  const subSlug = subcategory?.slug || subcategorySlug || "";

  return (
    <div className={styles.breadcrumbs}>
      <Link href={`/${locale}/menu/${catSlug}${subSlug ? `/${subSlug}` : ""}`}>
        <span
          onClick={() => sessionStorage.setItem("internalNavigation", "true")}
        >
          <IoIosArrowRoundBack />
          {t("backButton")}
        </span>
      </Link>
    </div>
  );
};

export default function ProductPage({
  product,
  category,
  subcategory,
  locale,
  categorySlug,
  subcategorySlug,
}) {
  const t = useTranslations("ProductPage");
  const {
    selectedQuantities,
    addToCart,
    decreaseSelectedQuantity,
    increaseSelectedQuantity,
    isAgeModalOpen,
    setIsAgeModalOpen,
    handleConfirmAge,
  } = useCart();

  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Добавляем шрифт Jost, если его еще нет
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600&display=swap";
    link.rel = "stylesheet";
    if (!document.querySelector(`link[href="${link.href}"]`)) {
      document.head.appendChild(link);
    }
  }, []);

  if (!product) {
    return (
      <div className={styles.productPageContainer}>
        <div style={{ textAlign: "center", padding: "40px" }}>
          <h2
            style={{
              fontFamily: "Jost, sans-serif",
              fontSize: "24px",
              marginBottom: "16px",
            }}
          >
            {t("productNotFound")}
          </h2>
          <Link
            href={`/${locale}/menu`}
            style={{
              fontFamily: "Jost, sans-serif",
              fontSize: "14px",
              color: "#666",
              textDecoration: "none",
              borderBottom: "1px solid #666",
            }}
          >
            {t("backToMenu")}
          </Link>
        </div>
      </div>
    );
  }

  // Нормализуем изображение
  const imageUrl = normalizeImage(product.images);

  // Определяем тип продукта
  const isProductDrink = isDrink(product);

  // Wrapper function to pass locale and t to cart functions
  const handleAddToCart = () => {
    addToCart(product, locale, t);
  };

  // Get current quantity for this product
  const currentQuantity = selectedQuantities?.[product._id] ?? 1;

  // Получаем название продукта
  const productName =
    product.title?.[locale] || product.title?.en || product.name || "Product";

  // Определяем количество контента для динамических классов
  const hasDescription = !isProductDrink && product.description;
  const hasDetails =
    isProductDrink &&
    (hasValue(product.region?.[locale]) ||
      hasValue(product.color?.[locale]) ||
      hasValue(product.volume) ||
      (product.isAlcoholic && hasValue(product.degree)));

  // Определяем класс для infoSection
  const infoSectionClass = `${styles.infoSection} ${
    !hasDescription && !hasDetails ? styles.minimalContent : ""
  } ${hasDetails && hasValue(product.volume) && hasValue(product.degree) ? styles.extendedContent : ""}`;

  return (
    <div className={styles.productPageContainer}>
      {/* Хлебные крошки */}
      <Breadcrumbs
        category={category}
        subcategory={subcategory}
        locale={locale}
        t={t}
        categorySlug={categorySlug}
        subcategorySlug={subcategorySlug}
      />

      {/* Минималистичная карточка товара */}
      <div className={styles.productCard}>
        <div className={styles.cardBody}>
          {/* Левая часть - изображение */}
          <div className={styles.imageSection}>
            <div className={styles.imageWrapper}>
              <Image
                src={imageUrl}
                alt={productName}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className={
                  isProductDrink
                    ? styles.productImageDrinks
                    : styles.productImageMenu
                }
                onLoad={() => setImageLoaded(true)}
                priority
                style={{
                  opacity: imageLoaded ? 1 : 0,
                  transition: "opacity 0.3s ease",
                }}
              />
            </div>
          </div>

          {/* Правая часть - информация */}
          <div className={infoSectionClass}>
            {/* Верхняя часть - заголовок и основная информация */}
            <div className={styles.infoTop}>
              {/* Заголовок продукта */}
              <h1 className={styles.productTitle}>{productName}</h1>

              {/* Описание для еды или детали для напитков */}
              {!isProductDrink ? (
                // Описание для продуктов из меню
                product.description && (
                  <div className={styles.descriptionSection}>
                    <p className={styles.productDescription}>
                      {product.description?.[locale] ||
                        product.description?.en ||
                        product.description}
                    </p>
                  </div>
                )
              ) : (
                // Детали для напитков
                <>
                  {(hasValue(product.region?.[locale]) ||
                    hasValue(product.color?.[locale]) ||
                    hasValue(product.volume) ||
                    (product.isAlcoholic && hasValue(product.degree))) && (
                    <div className={styles.detailsSection}>
                      <div className={styles.detailsGrid}>
                        {/* Объем - первым для напитков */}
                        {hasValue(product.volume) && (
                          <div className={styles.detailItem}>
                            <LiaWineBottleSolid className={styles.detailIcon} />
                            <div className={styles.detailContent}>
                              <span className={styles.detailLabel}>
                                {t("productVolume")}
                              </span>
                              <span className={styles.detailValue}>
                                {product.volume}cl
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Градус - вторым если алкогольный */}
                        {product.isAlcoholic && hasValue(product.degree) && (
                          <div className={styles.detailItem}>
                            <GiWineGlass className={styles.detailIcon} />
                            <div className={styles.detailContent}>
                              <span className={styles.detailLabel}>
                                {t("productDegree")}
                              </span>
                              <span className={styles.detailValue}>
                                {product.degree}%
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Регион */}
                        {hasValue(product.region?.[locale]) && (
                          <div className={styles.detailItem}>
                            <TfiWorld className={styles.detailIcon} />
                            <div className={styles.detailContent}>
                              <span className={styles.detailLabel}>
                                {t("originRegion")}
                              </span>
                              <span className={styles.detailValue}>
                                {product.region[locale]}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Тип/Цвет */}
                        {hasValue(product.color?.[locale]) && (
                          <div className={styles.detailItem}>
                            <RiColorFilterLine className={styles.detailIcon} />
                            <div className={styles.detailContent}>
                              <span className={styles.detailLabel}>
                                {t("productColor")}
                              </span>
                              <span className={styles.detailValue}>
                                {product.color[locale]}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Нижняя часть - цена и корзина */}
            <div className={styles.infoBottom}>
              {/* Цена */}
              <div className={styles.priceSection}>
                <div className={styles.priceBox}>
                  <span className={styles.priceLabel}>{t("productPrice")}</span>
                  <span className={styles.priceValue}>
                    {formatPrice(applyDiscount(product.price))}€
                  </span>
                </div>
              </div>

              {/* Управление корзиной */}
              <div className={styles.cartSection}>
                <div className={styles.quantityControls}>
                  <button
                    className={styles.controlButton}
                    onClick={() => decreaseSelectedQuantity(product._id)}
                    aria-label={t("decreaseQuantity")}
                  >
                    <PiMinusCircleThin />
                  </button>
                  <span className={styles.quantityDisplay}>
                    {currentQuantity}
                  </span>
                  <button
                    className={styles.controlButton}
                    onClick={() => increaseSelectedQuantity(product._id)}
                    aria-label={t("increaseQuantity")}
                  >
                    <PiPlusCircleThin />
                  </button>
                </div>

                <button
                  className={styles.addToCartButton}
                  onClick={handleAddToCart}
                >
                  {t("addToCart") || "Add to Cart"}
                </button>
              </div>
            </div>

            {/* Дополнительная информация для еды */}
            {!isProductDrink && product.ingredients && (
              <div
                style={{
                  marginTop: "40px",
                  paddingTop: "32px",
                  borderTop: "1px solid #e5e5e5",
                }}
              >
                <h3
                  style={{
                    fontFamily: "Jost, sans-serif",
                    fontSize: "12px",
                    fontWeight: "400",
                    color: "#999",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: "12px",
                  }}
                >
                  {t("ingredients")}
                </h3>
                <p
                  style={{
                    fontFamily: "Jost, sans-serif",
                    fontSize: "14px",
                    lineHeight: "1.6",
                    color: "#666",
                  }}
                >
                  {product.ingredients?.[locale] ||
                    product.ingredients?.en ||
                    product.ingredients}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Age Confirmation Modal */}
      <AgeConfirmation
        isOpen={isAgeModalOpen}
        onClose={() => setIsAgeModalOpen(false)}
        onConfirm={() => handleConfirmAge(locale, t)}
      />
    </div>
  );
}
