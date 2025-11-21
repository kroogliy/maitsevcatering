"use client";
import Image from "next/image";
import { oswald } from "../../../../lib/fonts";
import { applyDiscount, formatPrice } from "../../utils/priceUtils";
import styles from "./productclient.module.css";

// Функция для локализации полей
const localize = (field, locale) => {
  if (typeof field === "object" && field !== null) {
    return field[locale] || field.en || ""; // Возвращаем значение для текущей локали или английский вариант
  }
  return field || ""; // Если поле — строка, возвращаем её
};

// Функция для нормализации изображений
const normalizeImage = (images) => {
  if (typeof images === "string") {
    return images; // Если изображение — строка, возвращаем как есть
  }
  if (Array.isArray(images) && images.length > 0) {
    return images[0]; // Если изображение — массив, возвращаем первый элемент
  }
  return "/images/cateringpage1.jpg"; // Если изображение отсутствует, используем fallback
};

export default function ProductPageClient({ product, locale }) {
  if (!product) {
    return <div>Loading...</div>; // Показываем индикатор загрузки
  }

  // Определяем, является ли товар напитком, на основе наличия поля `name`
  const isDrink = product.name !== undefined;

  const imageUrl = normalizeImage(product.images);

  return (
    <div className={styles.productPageContainer}>
      <h1 className={`${styles.productTitle} ${oswald.className}`}>
        {product.name ? product.name : localize(product.title, locale)}
      </h1>
      <div className={styles.productImageWrapper}>
        <Image
          src={imageUrl}
          alt={product.name ? product.name : localize(product.title, locale)}
          width={300}
          height={300}
          className={
            isDrink ? styles.productImageDrinks : styles.productImageMenu
          }
        />
      </div>
      <div className={styles.productDetails}>
        <p className={styles.productDescription}>
          {isDrink
            ? `${product.volume}cl`
            : localize(product.description, locale)}
          {isDrink && product.degree > 0 && `, vol. ${product.degree}%`}
        </p>

        {isDrink && (
          <>
            <p className={styles.productRegion}>
              {localize(product.region, locale) || "No region specified"}
            </p>
            <p className={styles.productColor}>
              {localize(product.color, locale) || "No color specified"}
            </p>
          </>
        )}

        {!isDrink && (
          <p className={styles.productAllergens}>
            Allergens: {product.allergens?.join(", ") || "No allergens"}
          </p>
        )}

        <p className={styles.productPrice}>
          Price: {formatPrice(applyDiscount(product.price))}€
        </p>
      </div>
    </div>
  );
}
