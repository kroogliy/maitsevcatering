"use client";

import { useEffect, useState } from "react";
import { useProducts } from "../../contexts/ProductsContext";
import useAllProductsStore from "../../store/useAllProductsStore";

export default function HomePageClient() {
  // Инициализируем all-products стор на главной странице
  const { loadAllProducts, loading, loaded, stats } = useProducts();
  const { isInitialized, allProductsData } = useAllProductsStore();
  const [hasCheckedPersist, setHasCheckedPersist] = useState(false);

  useEffect(() => {
    // Проверяем есть ли данные в Zustand persist или уже загружены
    const timer = setTimeout(() => {
      setHasCheckedPersist(true);

      // Если данные уже есть в persist или загружены - не запускаем загрузку
      if (isInitialized && allProductsData) {
        return;
      }

      if (!loaded && !loading) {
        loadAllProducts();
      }
    }, 200); // Увеличиваем задержку для полной инициализации persist

    return () => clearTimeout(timer);
  }, [isInitialized, allProductsData, loaded, loading, loadAllProducts]);

  return null;
}
