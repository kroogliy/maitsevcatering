"use client";
import React from "react";

import "../../app/not-found.css";

export default function NotFoundBackButton({ label }) {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <button className="button" onClick={handleGoBack}>
      {label}
    </button>
  );
}
