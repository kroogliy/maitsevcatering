"use client";

import { useEffect } from "react";
import Modal from "react-modal";

export default function ModalInit() {
  useEffect(() => {
    // Устанавливаем корневой элемент для react-modal
    // Это предотвращает предупреждения и улучшает производительность
    const appElement = document.getElementById("__next") || document.body;
    Modal.setAppElement(appElement);
  }, []);

  return null;
}