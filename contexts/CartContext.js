"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import gsap from "gsap";
import {
  applyDiscount,
  migrateCartItems,
  createCartProduct,
} from "../utils/priceUtils";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [selectedQuantities, setSelectedQuantities] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [showCartIcon, setShowCartIcon] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pendingProduct, setPendingProduct] = useState(null);
  const notificationTimeoutRef = useRef(null);
  const [isAgeModalOpen, setIsAgeModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isFirstLoad = useRef(true);

  // Calculate totals (prices already discounted in cart)
  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const totalCount = cart.reduce((count, item) => count + item.quantity, 0);

  const localize = (item, locale) => {
    if (!item) {
      return "";
    }
    return item[locale] || item.en;
  };

  const showNotificationWithType = (
    message,
    type = "success",
    duration = 3000,
  ) => {
    // If notification is already showing, briefly hide it to restart animation
    if (showNotification) {
      setShowNotification(false);
      // Use requestAnimationFrame to ensure DOM updates
      requestAnimationFrame(() => {
        setNotificationMessage(message);
        setNotificationType(type);
        setShowNotification(true);
      });
    } else {
      setNotificationMessage(message);
      setNotificationType(type);
      setShowNotification(true);
    }

    // Clear previous timeout and set new one
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setShowNotification(false);
    }, duration);
  };

  const addToCart = (product, locale, t) => {
    if (product.isAlcoholic) {
      setPendingProduct(product);
      setIsAgeModalOpen(true);
      return;
    }
    addProductToCart(product, locale, t);
  };

  const addProductToCart = (product, locale, t) => {
    const quantity = selectedQuantities[product._id] || 1;

    // Create product with discounted price for cart storage
    const productWithDiscountedPrice = createCartProduct(product);

    let isExistingItem = false;
    let totalQuantity = quantity;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item._id === product._id);
      if (existingItem) {
        isExistingItem = true;
        totalQuantity = existingItem.quantity + quantity;
        const updatedCart = prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: totalQuantity }
            : item,
        );
        sessionStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      } else {
        const updatedCart = [
          ...prevCart,
          { ...productWithDiscountedPrice, quantity },
        ];
        sessionStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      }
    });

    // Show notification with different messages for new/updated items
    const productName = product.name
      ? product.name
      : localize(product.title, locale);

    const message =
      quantity > 1
        ? `${productName} ×${quantity} ${t("addedToCart")}`
        : `${productName} ${t("addedToCart")}`;

    showNotificationWithType(message, "success", 3000);

    // Clear previous timeout and set new one
    if (notificationTimeoutRef.current) {
      clearTimeout(notificationTimeoutRef.current);
    }
    notificationTimeoutRef.current = setTimeout(() => {
      setShowNotification(false);
      setShowNotification(false);
    }, 3000);

    // Премиальная тряска корзины
    shakeCartIcon();

    // Animate cart icon (оставляем для совместимости)
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const decreaseSelectedQuantity = (productId) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1),
    }));
  };

  const increaseSelectedQuantity = (productId) => {
    setSelectedQuantities((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1,
    }));
  };

  const handleConfirmAge = (locale, t) => {
    setIsAgeModalOpen(false);
    if (pendingProduct) {
      addProductToCart(pendingProduct, locale, t);
      setPendingProduct(null);
    }
  };

  // Премиальная тряска корзины при добавлении товара
  const shakeCartIcon = useCallback(() => {
    // Находим иконки корзины
    const cartIcons = document.querySelectorAll("[data-cart-icon]");

    if (cartIcons.length === 0) {
      return;
    }

    cartIcons.forEach((cartIcon, index) => {
      if (cartIcon) {
        // Метод 1: CSS класс
        cartIcon.classList.add("cart-shake-animation");
        setTimeout(() => {
          cartIcon.classList.remove("cart-shake-animation");
        }, 800);

        // Метод 2: Покачивание через стили (fallback)
        const originalTransform = cartIcon.style.transform || "";

        cartIcon.style.transition = "transform 0.16s ease-out";
        cartIcon.style.transform = "translateY(-8px) scale(1.1)";

        setTimeout(() => {
          cartIcon.style.transform =
            "translateY(-8px) rotate(-4deg) scale(1.1)";
        }, 160);

        setTimeout(() => {
          cartIcon.style.transform = "translateY(-8px) rotate(4deg) scale(1.1)";
        }, 320);

        setTimeout(() => {
          cartIcon.style.transform =
            "translateY(-4px) rotate(-2deg) scale(1.05)";
        }, 480);

        setTimeout(() => {
          cartIcon.style.transform =
            "translateY(-2px) rotate(1deg) scale(1.02)";
        }, 640);

        setTimeout(() => {
          cartIcon.style.transform = originalTransform;
          cartIcon.style.transition = "";
        }, 800);
      }
    });
  }, []);

  const handleDeleteProduct = (productId) => {
    setCart(cart.filter((product) => product._id !== productId));
  };

  const handleCartClick = () => {
    setShowModal(true);
    // Не блокируем body - используем обработчики событий в модалке
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Не убираем класс с body так как не добавляли
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const clearCart = useCallback(() => {
    setCart([]);
    setSelectedQuantities({});
    sessionStorage.removeItem("cart");
    sessionStorage.removeItem("orderInfo");
    setShowCartIcon(false);
    setShowModal(false);
    // Убираем классы модалки при очистке корзины
    document.body.classList.remove("modal-open");
  }, [cart.length]);

  // Debug function to clear cart and reset prices
  const clearCartWithPriceReset = useCallback(() => {
    setCart([]);
    setSelectedQuantities({});
    sessionStorage.removeItem("cart");
    sessionStorage.removeItem("orderInfo");
    setShowCartIcon(false);
    setShowModal(false);
    // Не убираем классы модалки так как не добавляли
    // Force reload to ensure fresh product data
    if (typeof window !== "undefined") {
      alert("Корзина очищена для обновления цен. Добавьте товары заново.");
    }
  }, [cart]);

  // Cart persistence - load from session storage on mount
  useEffect(() => {
    const savedCart = sessionStorage.getItem("cart");
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      // Migrate old cart items that don't have discounted prices
      const migratedCart = migrateCartItems(parsedCart);
      setCart(migratedCart);
      // Update storage with migrated cart
      if (
        migratedCart.some((item, index) => !parsedCart[index].originalPrice)
      ) {
        sessionStorage.setItem("cart", JSON.stringify(migratedCart));
      }
    }

    // Cleanup notification timeout on unmount
    return () => {
      if (notificationTimeoutRef.current) {
        clearTimeout(notificationTimeoutRef.current);
      }
    };
  }, []);

  // Update session storage when cart changes
  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }

    // Отключаем плавающую иконку корзины - используется только иконка в header
    // setShowCartIcon(cart.length > 0);
    setShowCartIcon(false);

    if (cart.length > 0) {
      sessionStorage.setItem("cart", JSON.stringify(cart));
    } else {
      sessionStorage.removeItem("cart");
    }
  }, [cart]);

  // Сохраняем позицию скролла в ref чтобы она не терялась
  const scrollPosition = useRef(0);

  // useEffect(() => {
  //   // НЕ БЛОКИРУЕМ СКРОЛЛ ВООБЩЕ ДЛЯ ORDER МОДАЛКИ
  // }, [showModal]);

  const value = {
    cart,
    setCart,
    selectedQuantities,
    setSelectedQuantities,
    showModal,
    setShowModal,
    showNotification,
    setShowNotification,
    notificationMessage,
    setNotificationMessage,
    notificationType,
    setNotificationType,
    showNotificationWithType,
    showCartIcon,
    setShowCartIcon,
    isAnimating,
    setIsAnimating,
    pendingProduct,
    setPendingProduct,
    isAgeModalOpen,
    setIsAgeModalOpen,
    isHovered,
    setIsHovered,
    totalPrice,
    totalCount,
    addToCart,
    addProductToCart,
    decreaseSelectedQuantity,
    increaseSelectedQuantity,
    handleConfirmAge,
    handleDeleteProduct,
    handleCartClick,
    handleCloseModal,
    handleMouseEnter,
    handleMouseLeave,
    clearCart,
    clearCartWithPriceReset,
    localize,
    shakeCartIcon,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
