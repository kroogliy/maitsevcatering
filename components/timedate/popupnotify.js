"use client";

import React from 'react';

import styles from './popupnotify.module.css';

const PopupModal = ({ message, onClose, showRefreshButton, refreshButtonText }) => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <p>{message}</p>
        <div className={styles.buttonContainer}>
          {showRefreshButton ? (
            <button onClick={handleRefresh} className={styles.refreshButton}>
              {refreshButtonText || 'Refresh Page'}
            </button>
          ) : (
            <button onClick={onClose} className={styles.okButton}>
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PopupModal;
