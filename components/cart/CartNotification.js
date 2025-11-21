"use client";

import React, { useEffect, useState, useRef } from "react";
import styles from "./CartNotification.module.css";

const CartNotification = ({ message, isVisible, type = "success" }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayMessage, setDisplayMessage] = useState(message);
  const [animationKey, setAnimationKey] = useState(0);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      // If notification is already showing and message changes, restart animation
      if (isAnimating && message !== displayMessage) {
        // Briefly hide and show to restart animation
        setIsAnimating(false);
        setAnimationKey((prev) => prev + 1);

        // Use requestAnimationFrame to ensure DOM updates
        requestAnimationFrame(() => {
          setIsAnimating(true);
          setDisplayMessage(message);
        });
      } else {
        // Normal show
        setIsAnimating(true);
        setDisplayMessage(message);
        setAnimationKey((prev) => prev + 1);
      }
    } else {
      // Delay hiding to allow fade out animation
      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [isVisible, message]);

  if (!isAnimating && !isVisible) return null;

  // Icons without emoji
  const getIcon = () => {
    switch (type) {
      case "success":
        return "✓";
      case "error":
        return "✕";
      case "warning":
        return "!";
      case "info":
        return "i";
      default:
        return "✓";
    }
  };

  return (
    <div
      key={animationKey}
      ref={notificationRef}
      className={`${styles.notification} ${styles[type]} ${!isVisible ? styles.fadeOut : ""}`}
    >
      <div className={styles.iconWrapper}>
        <span className={styles.icon}>{getIcon()}</span>
        <div className={styles.iconGlow}></div>
      </div>
      <div className={styles.content}>
        <div className={styles.message}>{displayMessage}</div>
      </div>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          key={`progress-${animationKey}`}
        ></div>
      </div>
    </div>
  );
};

export default CartNotification;
