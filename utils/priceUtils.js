// Утилита для управления ценами и скидками
// Позволяет легко изменять процент скидки для всего сайта

// Процент скидки (можно легко изменить)
const DISCOUNT_PERCENTAGE = 3; // 3% скидка

/**
 * Применяет скидку к цене
 * @param {number} originalPrice - Оригинальная цена из БД
 * @returns {number} - Цена со скидкой, округленная до 2 знаков после запятой
 */
export const applyDiscount = (originalPrice) => {
  if (!originalPrice || originalPrice <= 0) {
    return originalPrice;
  }

  const discountedPrice = originalPrice * (1 - DISCOUNT_PERCENTAGE / 100);
  return Math.round(discountedPrice * 100) / 100; // Округляем до 2 знаков после запятой
};

/**
 * Применяет скидку к массиву продуктов
 * @param {Array} products - Массив продуктов
 * @returns {Array} - Массив продуктов с примененной скидкой
 */
export const applyDiscountToProducts = (products) => {
  if (!Array.isArray(products)) {
    return products;
  }

  return products.map((product) => ({
    ...product,
    price: applyDiscount(product.price),
    originalPrice: product.price, // Сохраняем оригинальную цену для внутренних расчетов
  }));
};

/**
 * Получает оригинальную цену (для проверок на сервере)
 * @param {number} discountedPrice - Цена со скидкой
 * @returns {number} - Оригинальная цена
 */
export const getOriginalPrice = (discountedPrice) => {
  if (!discountedPrice || discountedPrice <= 0) {
    return discountedPrice;
  }

  const originalPrice = discountedPrice / (1 - DISCOUNT_PERCENTAGE / 100);
  return Math.round(originalPrice * 100) / 100;
};

/**
 * Проверяет, соответствует ли цена со скидкой оригинальной цене из БД
 * @param {number} discountedPrice - Цена со скидкой (от клиента)
 * @param {number} originalPrice - Оригинальная цена из БД
 * @returns {boolean} - true если цены соответствуют
 */
export const validateDiscountedPrice = (discountedPrice, originalPrice) => {
  if (!discountedPrice || !originalPrice) {
    return false;
  }

  const expectedDiscountedPrice = applyDiscount(originalPrice);
  // Сравниваем с допуском в 0.01 из-за округления
  return Math.abs(discountedPrice - expectedDiscountedPrice) < 0.01;
};

/**
 * Получает текущий процент скидки
 * @returns {number} - Процент скидки
 */
export const getDiscountPercentage = () => {
  return DISCOUNT_PERCENTAGE;
};

/**
 * Форматирует цену для отображения
 * @param {number} price - Цена
 * @returns {string} - Отформатированная цена
 */
export const formatPrice = (price) => {
  if (!price || price <= 0) {
    return "0.00";
  }

  return price.toFixed(2);
};

/**
 * Применяет скидку к общей сумме заказа
 * @param {Array} lineItems - Элементы заказа
 * @param {number} deliveryFee - Стоимость доставки (не подлежит скидке)
 * @returns {number} - Общая сумма со скидкой
 */
export const calculateDiscountedTotal = (lineItems, deliveryFee = 0) => {
  if (!Array.isArray(lineItems)) {
    return deliveryFee;
  }

  const itemsTotal = lineItems.reduce((sum, item) => {
    const discountedPrice = applyDiscount(item.price || 0);
    return sum + discountedPrice * (item.quantity || 1);
  }, 0);

  return Math.round((itemsTotal + deliveryFee) * 100) / 100;
};

/**
 * Мигрирует старые элементы корзины к новому формату с ценами со скидкой
 * @param {Array} cartItems - Элементы корзины
 * @returns {Array} - Мигрированные элементы корзины
 */
export const migrateCartItems = (cartItems) => {
  if (!Array.isArray(cartItems)) {
    return cartItems;
  }

  return cartItems.map((item) => {
    // Если у товара нет originalPrice, это старый товар - нужно мигрировать
    if (!item.originalPrice && item.price) {
      return {
        ...item,
        originalPrice: item.price, // Сохраняем оригинальную цену
        price: applyDiscount(item.price), // Применяем скидку
      };
    }
    return item;
  });
};

/**
 * Создает товар для корзины с примененной скидкой
 * @param {Object} product - Товар из каталога
 * @returns {Object} - Товар с примененной скидкой для корзины
 */
export const createCartProduct = (product) => {
  if (!product || !product.price) {
    return product;
  }

  return {
    ...product,
    originalPrice: product.price,
    price: applyDiscount(product.price),
  };
};

/**
 * Очищает корзину от товаров и обновляет их цены
 * Используется для принудительного обновления цен в корзине
 */
export const clearCartAndResetPrices = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("cart");
  }
};
