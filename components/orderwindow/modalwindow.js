"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import DOMPurify from "dompurify";
import PopupModal from "../timedate/popupnotify";
import { getCookie } from "cookies-next";
import { IoClose } from "react-icons/io5";
import { LuCirclePlus, LuSquircle } from "react-icons/lu";
import { LuCircleMinus } from "react-icons/lu";
import { RxCrossCircled } from "react-icons/rx";
import {
  FaShoppingCart,
  FaUtensils,
  FaArrowRight,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaClock,
  FaStickyNote,
  FaGift,
  FaShieldAlt,
} from "react-icons/fa";

import styles from "./modalwindow.module.css";
import { applyDiscount, formatPrice } from "../../utils/priceUtils";

const OrderModal = ({ cart, setCart, onClose }) => {
  const [updatedCart, setUpdatedCart] = useState(cart || []);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [productsToDelete, setProductsToDelete] = useState({});
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [missingFieldMessage, setMissingFieldMessage] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [isClosing, setIsClosing] = useState(false);

  // Блокировка скролла только фона, разрешаем скролл модалки
  useEffect(() => {
    // НЕ добавляем CSS класс для body - это блокирует весь скролл
    // document.body.classList.add("modal-open");

    // Останавливаем smooth scroll библиотеки
    if (window.lenis) {
      window.lenis.stop();
    }

    // Сохраняем позицию скролла при открытии
    const initialScrollY = window.scrollY;

    // Блокируем скролл фона, но разрешаем в модальном окне
    const preventBackgroundScroll = (e) => {
      // Проверяем, находится ли элемент внутри модального overlay
      const modalOverlay = e.target.closest("[data-modal-overlay]");

      // Если скролл происходит не в области модального окна
      if (!modalOverlay) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }

      // Если скролл происходит в самом overlay (но не в контенте)
      if (
        e.target === modalOverlay ||
        e.target.classList.contains(styles["modal-scroll-container"])
      ) {
        // Проверяем направление скролла и границы
        const scrollContainer = modalOverlay;
        const scrollTop = scrollContainer.scrollTop;
        const scrollHeight = scrollContainer.scrollHeight;
        const clientHeight = scrollContainer.clientHeight;

        const delta = e.deltaY || -e.detail || e.wheelDelta;

        // Если скроллим вверх и уже наверху - блокируем
        if (delta < 0 && scrollTop <= 0) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }

        // Если скроллим вниз и уже внизу - блокируем
        if (delta > 0 && scrollTop + clientHeight >= scrollHeight) {
          e.preventDefault();
          e.stopPropagation();
          return false;
        }
      }
    };

    const preventKeyScroll = (e) => {
      // Проверяем, есть ли фокус внутри модального окна
      const activeElement = document.activeElement;
      const modalOverlay = activeElement
        ? activeElement.closest("[data-modal-overlay]")
        : null;

      if (
        !modalOverlay &&
        [32, 33, 34, 35, 36, 37, 38, 39, 40].includes(e.keyCode)
      ) {
        e.preventDefault();
      }
    };

    // Добавляем обработчики только для предотвращения скролла фона
    document.addEventListener("wheel", preventBackgroundScroll, {
      passive: false,
      capture: true,
    });
    document.addEventListener("touchmove", preventBackgroundScroll, {
      passive: false,
      capture: true,
    });
    document.addEventListener("touchstart", preventBackgroundScroll, {
      passive: false,
      capture: true,
    });
    document.addEventListener("keydown", preventKeyScroll, { capture: true });

    // Сохраняем функции для очистки
    window.orderModalCleanup = () => {
      // НЕ убираем класс с body так как не добавляли
      // document.body.classList.remove("modal-open");

      // Включаем smooth scroll обратно
      if (window.lenis) {
        setTimeout(() => window.lenis.start(), 100);
      }

      // Убираем все обработчики (с capture: true!)
      document.removeEventListener("wheel", preventBackgroundScroll, {
        capture: true,
      });
      document.removeEventListener("touchmove", preventBackgroundScroll, {
        capture: true,
      });
      document.removeEventListener("touchstart", preventBackgroundScroll, {
        capture: true,
      });
      document.removeEventListener("keydown", preventKeyScroll, {
        capture: true,
      });
    };

    return () => {
      if (window.orderModalCleanup) {
        window.orderModalCleanup();
        window.orderModalCleanup = null;
      }
    };
  }, []);

  // Обработчик скролла для предотвращения проваливания
  const handleOverlayScroll = useCallback((e) => {
    const overlay = e.currentTarget;
    const scrollTop = overlay.scrollTop;
    const scrollHeight = overlay.scrollHeight;
    const clientHeight = overlay.clientHeight;

    // Проверяем, достигли ли мы границ скролла
    const isAtTop = scrollTop <= 0;
    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;

    // Получаем направление скролла
    const delta = e.deltaY;

    // Если скроллим вверх и уже наверху - блокируем
    if (delta < 0 && isAtTop) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Если скроллим вниз и уже внизу - блокируем
    if (delta > 0 && isAtBottom) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    // Останавливаем всплытие для всех событий скролла в overlay
    e.stopPropagation();
  }, []);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch("/api/csrftoken", {
          method: "GET",
          credentials: "include",
        });

        if (response.status === 403) {
          return;
        }

        const data = await response.json();
        setCsrfToken(data.csrfToken);
      } catch (error) {
        // Будем показывать ошибку при попытке оформления заказа
      }
    };

    fetchCsrfToken();
  }, []);

  const localize = useCallback((item, locale) => {
    if (!item || typeof item !== "object") {
      return "";
    }
    if (!locale || !item[locale]) {
      return item.en || "";
    }
    return item[locale];
  }, []);

  const t = useTranslations("ModalWindow");
  const { locale } = useParams();

  const [formData, setFormData] = useState({
    name: "",
    surName: "",
    phone: "",
    email: "",
    address: "",
    deliveryType: "",
    deliveryTimeOption: "asap",
    deliveryDate: "",
    deliveryTime: "",
    notes: "",
    promoCode: "",
    agreed: false,
  });

  // Calculate product total (prices already discounted in cart)
  const productTotal = useMemo(() => {
    if (!updatedCart || !Array.isArray(updatedCart)) {
      return 0;
    }
    return updatedCart.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0,
    );
  }, [updatedCart]);

  // Calculate delivery fee
  useEffect(() => {
    if (formData.deliveryType === "delivery") {
      setDeliveryFee(5);
    } else {
      setDeliveryFee(0);
    }
  }, [formData.deliveryType]);

  const totalAmount = useMemo(() => {
    return Number((productTotal + deliveryFee).toFixed(2));
  }, [productTotal, deliveryFee]);

  // Input handler to update form state
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = DOMPurify.sanitize(value);
    setFormData((prevState) => ({
      ...prevState,
      [name]: sanitizedValue,
    }));
  };

  const handlePhoneChange = (phone) => {
    const sanitizedPhone = DOMPurify.sanitize(phone);
    setFormData((prevState) => ({
      ...prevState,
      phone: sanitizedPhone,
    }));
  };

  const validateOrderData = () => {
    const errors = {};
    const { name, surName, email, address, agreed, deliveryType } = formData;

    if (!name) errors.name = "Name required";
    if (!surName) errors.surName = "Surname required";
    if (!isPossiblePhoneNumber(formData.phone)) errors.phone = "phone required";

    if (!email) errors.email = "email required";

    if (!email) {
      errors.email = "email required";
    } else if (!validateEmail(email)) {
      errors.email = "enter valid email";
    }
    if (deliveryType === "delivery" && !address) {
      errors.address = "address required";
    }
    if (!deliveryType) errors.deliveryType = t("deliveryError");
    if (!agreed) errors.agreed = t("agreedError");

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePhone = () => {
    if (!isPossiblePhoneNumber(formData.phone || "")) {
      setPhoneError(true);
      return false;
    }
    setPhoneError("");
    return true;
  };

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateDateTime() || !validateOrderData() || !validatePhone()) return;

    const orderData = {
      ...formData,
      _csrf: csrfToken,
      locale: locale,
      line_items: (updatedCart || []).map((item) => ({
        productId: item._id,
        title: getProductName(item, locale),
        price: item.price,
        quantity: item.quantity,
        images: item.images,
      })),
      deliveryFee,
      totalAmount,
    };

    const orderInfo = {
      deliveryType: formData.deliveryType,
      deliveryTimeOption: formData.deliveryTimeOption,
      deliveryDate: formData.deliveryDate,
      deliveryTime: formData.deliveryTime,
      line_items: (updatedCart || []).map((item) => ({
        productId: item._id,
        title: item.title,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        images: item.images,
      })),
      deliveryFee: deliveryFee,
      productTotal: productTotal,
      totalAmount: totalAmount,
    };

    localStorage.setItem("orderInfo", JSON.stringify(orderInfo));

    if (!csrfToken) {
      setPopupMessage(t("csrfTokenExpired"));
      setShowPopup(true);
      return;
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": csrfToken,
        },
        body: JSON.stringify(orderData),
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok && data.paymentUrl) {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          window.location.href = data.paymentUrl;
        } else {
          const newWindow = window.open(data.paymentUrl, "_blank");
          if (
            !newWindow ||
            newWindow.closed ||
            typeof newWindow.closed === "undefined"
          ) {
            alert(
              "Пожалуйста, разрешите всплывающие окна для завершения оплаты. Нажмите на кнопку еще раз.",
            );
            window.location.href = data.paymentUrl;
          }
        }
      } else {
        if (response.status === 403) {
          setPopupMessage(t("csrfTokenExpired"));
          setShowPopup(true);
        } else {
          setPaymentError(data.error || "Error creating order");
        }
      }
    } catch (error) {
      setPaymentError("Error sending data to server");
    }
  };

  // Update cart quantities
  const updateCart = useCallback((productId, newQuantity) => {
    setUpdatedCart((prevCart) =>
      prevCart
        .map((product) =>
          product._id === productId
            ? { ...product, quantity: Math.max(1, newQuantity) }
            : product,
        )
        .filter((product) => product.quantity > 0),
    );
  }, []);

  // Handling timer for deleting products from the cart
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setProductsToDelete((prev) => {
        const updated = { ...prev };

        Object.keys(updated).forEach((productId) => {
          updated[productId] -= 1;

          if (updated[productId] <= 0) {
            setUpdatedCart((prevCart) =>
              prevCart.filter((product) => product._id !== productId),
            );
            delete updated[productId];
          }
        });

        return updated;
      });
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [updatedCart]);

  useEffect(() => {
    if (setCart && typeof setCart === "function") {
      setCart(updatedCart);
    }
  }, [updatedCart, setCart]);

  // Product deletion with timers
  const handleDeleteProduct = (productId) => {
    setProductsToDelete((prev) => ({
      ...prev,
      [productId]: 3,
    }));
  };

  const cancelDeleteProduct = (productId) => {
    setProductsToDelete((prev) => {
      const updated = { ...prev };
      delete updated[productId];
      return updated;
    });
  };

  // Animated close function
  const handleClose = () => {
    setIsClosing(true);

    if (window.orderModalCleanup) {
      window.orderModalCleanup();
      window.orderModalCleanup = null;
    }

    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  // Handling the overlay click to close modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const validateDateTime = () => {
    if (formData.deliveryTimeOption === "scheduled") {
      const now = new Date();
      const selectedDate = new Date(
        `${formData.deliveryDate}T${formData.deliveryTime}`,
      );

      if (selectedDate < now) {
        setPopupMessage(t("incorrectDateTime"));
        setShowPopup(true);
        return false;
      }
    }
    return true;
  };

  // Common function for item.name & item.title
  const getProductName = useCallback(
    (item, locale) => {
      if (item.title) {
        return localize(item.title, locale);
      } else if (item.name) {
        return item.name;
      }
      return "Unnamed Product";
    },
    [localize],
  );

  return (
    <div
      className={`${styles["modal-overlay"]} ${isClosing ? styles["closing"] : ""}`}
      onClick={handleOverlayClick}
      onWheel={handleOverlayScroll}
      onTouchMove={handleOverlayScroll}
      onScroll={handleOverlayScroll}
      data-lenis-prevent
      data-modal-overlay
    >
      <div className={styles["modal-scroll-container"]}>
        <div
          className={`${styles["modal-content"]} ${isClosing ? styles["closing"] : ""} ${!updatedCart || updatedCart.length === 0 ? styles["empty-cart-modal"] : ""}`}
          data-lenis-prevent
          data-modal-content
        >
          <button
            className={styles["close-button"]}
            onClick={handleClose}
            aria-label="Close modal"
          >
            <IoClose size={24} />
          </button>

          {missingFieldMessage && (
            <div className={styles["error-message"]}>{missingFieldMessage}</div>
          )}

          {orderSuccess ? (
            <div className={styles["success-message"]}>
              <p>Order successfully placed!</p>
              <p>Details have been sent to your phone or email.</p>
              <button className={styles["menu-button"]} onClick={handleClose}>
                Close
                <FaArrowRight className={styles["button-icon"]} />
              </button>
            </div>
          ) : !updatedCart || updatedCart.length === 0 ? (
            <div className={styles["empty-cart-wrapper"]}>
              <div className={styles["empty-cart-message"]}>
                <h2 className={styles["empty-cart-title"]}>{t("emptyCart")}</h2>
                <p className={styles["empty-cart-subtitle"]}>{t("addSmth")}</p>
                <button className={styles["menu-button"]} onClick={handleClose}>
                  {t("emptyCartButton")}
                  <FaArrowRight className={styles["button-icon"]} />
                </button>
              </div>
            </div>
          ) : (
            <div className={styles["container-info"]}>
              {/* Left Column - Products */}
              <div className={styles["left-column"]} data-lenis-prevent>
                {/* Cart Header - Fixed */}
                <div className={styles["cart-header"]}>
                  <h2>{t("titleCart")}</h2>
                </div>

                {(updatedCart || []).map((product) => (
                  <div className={styles["product-item"]} key={product._id}>
                    {productsToDelete[product._id] ? (
                      <div className={styles["delete-confirmation"]}>
                        <span className={styles["delete-message"]}>
                          {t("productDeleted")}{" "}
                          {getProductName(product, locale)}{" "}
                        </span>
                        <div className={styles["countdown-circle"]}>
                          <svg width="40" height="40" viewBox="0 0 40 40">
                            <circle
                              cx="20"
                              cy="20"
                              r="18"
                              fill="transparent"
                              stroke="#fff"
                              strokeWidth="4"
                            />
                            <circle
                              cx="20"
                              cy="20"
                              r="18"
                              fill="transparent"
                              stroke="#E2C251"
                              strokeWidth="4"
                              strokeDasharray="113"
                              strokeDashoffset={
                                113 -
                                (113 * (3 - productsToDelete[product._id])) / 2
                              }
                              style={{
                                transition: "stroke-dashoffset 1s linear",
                              }}
                            />
                          </svg>
                          <span className={styles["countdown-text"]}>
                            {productsToDelete[product._id]}
                          </span>
                        </div>
                        <button
                          className={styles["cancel-button"]}
                          onClick={() => cancelDeleteProduct(product._id)}
                        >
                          {t("cancelButton")}
                        </button>
                      </div>
                    ) : (
                      <>
                        <Image
                          className={
                            product.name
                              ? styles["item-imageAlkohol"]
                              : styles["item-imageProduct"]
                          }
                          src={
                            Array.isArray(product.images) &&
                            product.images.length > 0
                              ? product.images[0]
                              : typeof product.images === "string"
                                ? product.images
                                : "/images/cateringpage1.jpg"
                          }
                          alt={
                            getProductName(product, locale) || "Product image"
                          }
                          width={750}
                          height={350}
                        />
                        <div className={styles["product-info"]}>
                          {getProductName(product, locale)}
                          {product.degree && (
                            <span> vol. {product.degree}%</span>
                          )}
                        </div>
                        <div className={styles["controls"]}>
                          <button
                            className={styles["control-button"]}
                            onClick={() =>
                              product.quantity === 1
                                ? handleDeleteProduct(product._id)
                                : updateCart(product._id, product.quantity - 1)
                            }
                          >
                            <LuCircleMinus />
                          </button>
                          <span className={styles["quantity-display"]}>
                            {product.quantity}
                          </span>
                          <button
                            className={styles["control-button"]}
                            onClick={() =>
                              updateCart(product._id, product.quantity + 1)
                            }
                          >
                            <LuCirclePlus />
                          </button>
                        </div>
                        <div className={styles["product-price"]}>
                          €{" "}
                          <span>
                            {formatPrice(product.price * product.quantity)}
                          </span>
                        </div>
                        <div className={styles["controls"]}>
                          <button className={styles["delete-items-button"]}>
                            <RxCrossCircled
                              onClick={() => handleDeleteProduct(product._id)}
                            />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>

              {/* Right Column - Contact Info */}
              <div className={styles["right-column"]} data-lenis-prevent>
                <div className={styles["contact-info"]} data-lenis-prevent>
                  <div className={styles["contact-header"]}>
                    <h2>{t("contactInfo")}</h2>
                  </div>

                  <div className={styles["checkbox-container"]}>
                    {formErrors.deliveryType && (
                      <span className={styles["error-message"]}>
                        {formErrors.deliveryType}
                      </span>
                    )}

                    <label className={styles["radio-label"]}>
                      <input
                        type="radio"
                        name="deliveryType"
                        value="pickup"
                        checked={formData.deliveryType === "pickup"}
                        onChange={handleInputChange}
                      />
                      <span className={styles["radio-custom"]}></span>
                      {t("pickupOption")}
                    </label>
                    <label className={styles["radio-label"]}>
                      <input
                        type="radio"
                        name="deliveryType"
                        value="delivery"
                        checked={formData.deliveryType === "delivery"}
                        onChange={handleInputChange}
                      />
                      <span className={styles["radio-custom"]}></span>
                      {t("deliveryOption")}
                    </label>
                  </div>

                  <div className={styles["form-container"]}>
                    <div className={styles["input-wrapper"]}>
                      <FaUser className={styles["input-icon"]} />
                      <input
                        className={`${styles["input-field"]} ${formErrors.name ? styles["error"] : ""}`}
                        type="text"
                        placeholder={t("placeholderName")}
                        name="name"
                        value={DOMPurify.sanitize(formData.name)}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className={styles["input-wrapper"]}>
                      <FaUser className={styles["input-icon"]} />
                      <input
                        className={`${styles["input-field"]} ${formErrors.surName ? styles["error"] : ""}`}
                        type="text"
                        placeholder={t("placeholderSurname")}
                        name="surName"
                        value={DOMPurify.sanitize(formData.surName)}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className={styles["form-container"]}>
                    <div className={styles["input-wrapper"]}>
                      <PhoneInput
                        defaultCountry="EE"
                        international
                        value={formData.phone}
                        onChange={handlePhoneChange}
                        className={`${styles["input-field"]} ${phoneError ? styles["error"] : ""}`}
                        placeholder={t("placeholderTelephone")}
                      />
                      {phoneError && (
                        <span className={styles["error-message"]}>
                          {phoneError}
                        </span>
                      )}
                    </div>
                    <div className={styles["input-wrapper"]}>
                      <FaEnvelope className={styles["input-icon"]} />
                      <input
                        className={`${styles["input-field"]} ${formErrors.email ? styles["error"] : ""}`}
                        type="email"
                        placeholder={t("placeholderMail")}
                        name="email"
                        value={DOMPurify.sanitize(formData.email)}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {formData.deliveryType === "delivery" && (
                    <div className={styles["form-container-single"]}>
                      <div className={styles["input-wrapper"]}>
                        <FaMapMarkerAlt className={styles["input-icon"]} />
                        <input
                          className={`${styles["input-field"]} ${formErrors.address && formData.address === "" ? styles["error"] : ""}`}
                          type="text"
                          placeholder={t("placeholderAddress")}
                          name="address"
                          value={DOMPurify.sanitize(formData.address)}
                          onChange={handleInputChange}
                        />
                        {formErrors.address && formData.address === "" && (
                          <span className={styles["error-message"]}>
                            {formErrors.address}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className={styles["delivery-options"]}>
                    <div className={styles["section-header"]}>
                      <FaClock className={styles["section-icon"]} />
                      <label>{t("deliveryTimeTitle")}:</label>
                    </div>
                    <select
                      className={styles["delivery-select"]}
                      name="deliveryTimeOption"
                      value={formData.deliveryTimeOption}
                      onChange={handleInputChange}
                    >
                      <option value="asap">{t("deliveryTimeAsap")}</option>
                      <option value="scheduled">
                        {t("deliveryTimeDelivery")}
                      </option>
                    </select>
                  </div>

                  {formData.deliveryTimeOption === "scheduled" && (
                    <div className={styles["date-time-fields"]}>
                      <input
                        className={styles["input-field"]}
                        type="date"
                        name="deliveryDate"
                        value={formData.deliveryDate}
                        onChange={handleInputChange}
                        min={new Date().toISOString().split("T")[0]}
                      />
                      <input
                        className={styles["input-field"]}
                        type="time"
                        name="deliveryTime"
                        value={formData.deliveryTime}
                        onChange={handleInputChange}
                        min={
                          formData.deliveryDate ===
                          new Date().toISOString().split("T")[0]
                            ? new Date()
                                .toLocaleTimeString("en-US", { hour12: false })
                                .slice(0, 5)
                            : "00:00"
                        }
                      />
                    </div>
                  )}

                  <div className={styles["form-container-single"]}>
                    <div className={styles["input-wrapper"]}>
                      <textarea
                        className={styles["textarea"]}
                        placeholder={t("placeholderNotes")}
                        name="notes"
                        value={DOMPurify.sanitize(formData.notes)}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className={styles["input-wrapper"]}>
                      <FaGift className={styles["input-icon"]} />
                      <input
                        className={styles["input-field"]}
                        type="text"
                        placeholder={t("placeholderPromocode")}
                        name="promoCode"
                        value={DOMPurify.sanitize(formData.promoCode)}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  {formErrors.agreed && (
                    <span className={styles["error-message"]}>
                      {formErrors.agreed}
                    </span>
                  )}

                  <div className={styles["checkbox-privacy"]}>
                    <input
                      type="checkbox"
                      name="agreed"
                      checked={formData.agreed}
                      onChange={handleInputChange}
                    />
                    <span>
                      {t("politicsAgree")}{" "}
                      <a href={`/${locale}/politics`}>{t("politicsLink")}</a>
                    </span>
                  </div>

                  {showPopup && (
                    <PopupModal
                      message={popupMessage}
                      onClose={() => setShowPopup(false)}
                      showRefreshButton={popupMessage === t("csrfTokenExpired")}
                      refreshButtonText={t("refreshPageButton")}
                    />
                  )}
                </div>

                {/* Summary Footer - Fixed */}
                <div className={styles["sum-info"]}>
                  {formData.deliveryType === "pickup" ? (
                    <div className={styles["summary-footer"]}>
                      <span className={styles["total"]}>
                        {t("totalPrice")}:{" "}
                        {(productTotal + deliveryFee).toFixed(2)}€
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className={styles["summary-footer"]}>
                        <span>
                          {t("sum")}: {formatPrice(productTotal)}€
                        </span>
                      </div>
                      <div className={styles["summary-footer"]}>
                        <span>
                          {t("deliveryPrice")}: {formatPrice(deliveryFee)}€
                        </span>
                      </div>
                      <div className={styles["summary-footer"]}>
                        <span className={styles["total"]}>
                          {t("totalPrice")}: {totalAmount.toFixed(2)}€
                        </span>
                      </div>
                    </>
                  )}
                  <button
                    className={styles["submit-button"]}
                    onClick={handleSubmit}
                  >
                    {t("paymentButton")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderModal;
