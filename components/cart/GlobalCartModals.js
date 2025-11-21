"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCart } from "../../contexts/CartContext";
import CartNotification from "./CartNotification";
import { formatPrice } from "../../utils/priceUtils";

import styles from "./GlobalCartModals.module.css";

const OrderModal = dynamic(() => import("../orderwindow/modalwindow"), {
  loading: () => <p>Loading...</p>,
  ssr: false,
});

const GlobalCartModals = () => {
  const {
    cart,
    setCart,
    showModal,
    showNotification,
    notificationMessage,
    notificationType,
    handleCloseModal,
    handleDeleteProduct,
    clearCartWithPriceReset,
  } = useCart();

  // Add global function for development
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.clearCartPrices = clearCartWithPriceReset;
    }
  }, [clearCartWithPriceReset]);

  return (
    <>
      {/* Notification */}
      <CartNotification
        message={notificationMessage}
        isVisible={showNotification}
        type={notificationType}
      />

      {/* Cart Icon - убрано, используется только иконка в header */}

      {/* Order Modal */}
      {showModal && (
        <OrderModal
          cart={cart}
          setCart={setCart}
          onClose={handleCloseModal}
          onDeleteProduct={handleDeleteProduct}
        />
      )}
    </>
  );
};

export default GlobalCartModals;
