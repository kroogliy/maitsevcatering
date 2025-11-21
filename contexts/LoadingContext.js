"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

const LoadingContext = createContext({
  isLoading: false,
  showLoader: () => {},
  hideLoader: () => {},
  isInternalNavigation: false,
});

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isInternalNavigation, setIsInternalNavigation] = useState(false);

  useEffect(() => {
    // Check initial navigation state
    if (typeof window !== "undefined") {
      const internal = sessionStorage.getItem("internalNavigation") === "true";
      setIsInternalNavigation(internal);

      // Show loader only for external navigation (F5, direct URL, etc.)
      if (!internal) {
        setIsLoading(true);
      }
    }
  }, []);

  // Listen for navigation events
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleBeforeUnload = () => {
        // Clear internal navigation flag on page reload
        sessionStorage.removeItem("internalNavigation");
      };

      const handlePopState = () => {
        // Browser back/forward navigation
        const internal = sessionStorage.getItem("internalNavigation") === "true";
        if (!internal) {
          setIsLoading(true);
        }
      };

      // Custom event for internal navigation
      const handleInternalNav = () => {
        setIsInternalNavigation(true);
        setIsLoading(false);
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      window.addEventListener("popstate", handlePopState);
      window.addEventListener("internalNavigation", handleInternalNav);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        window.removeEventListener("popstate", handlePopState);
        window.removeEventListener("internalNavigation", handleInternalNav);
      };
    }
  }, []);

  const showLoader = () => {
    setIsLoading(true);
  };

  const hideLoader = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        showLoader,
        hideLoader,
        isInternalNavigation,
      }}
    >
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
}
