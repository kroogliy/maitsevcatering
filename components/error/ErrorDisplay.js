"use client";

import React from "react";
import { useTranslations } from "next-intl";
import styles from "./ErrorDisplay.module.css";

const ErrorDisplay = ({
  // error = "Something went wrong",
  onRetry = null,
  showRetry = true,
  title = null,
  description = null
}) => {
  const tLoading = useTranslations("Loading");
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <div className={styles.errorIcon}>
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="#ff6b35" strokeWidth="2"/>
            <line x1="15" y1="9" x2="9" y2="15" stroke="#ff6b35" strokeWidth="2"/>
            <line x1="9" y1="9" x2="15" y2="15" stroke="#ff6b35" strokeWidth="2"/>
          </svg>
        </div>

        <h2 className={styles.errorTitle}>{title || tLoading("errorTitle")}</h2>
        <p className={styles.errorDescription}>{description || tLoading("errorDescription")}</p>


        {showRetry && onRetry && (
          <button className={styles.retryButton} onClick={onRetry}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 3v5h-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 21v-5h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {tLoading("tryAgain")}
          </button>
        )}

        <div className={styles.helpText}>
          <p>{tLoading("helpText")}</p>
          <a className={styles.supportEmail} href={`mailto:${tLoading("supportEmail")}`}>{tLoading("supportEmail")}</a>
        </div>
      </div>
    </div>
  );
};

export default ErrorDisplay;
