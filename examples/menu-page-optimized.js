"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import styles from "./MenuPage.module.css";
import { useCart } from "../../../context/CartContext";
import { useDebouncedSearch } from "../../../hooks/useDebouncedSearch";
import {
  useSubcategoryProducts,
  useProductSearch,
  useCategoriesAndSubcategories,
  useAllProducts
} from "../../../hooks/useAllProducts";
import { sortItems } from "../../../utils/dataExtractors";

export default function MenuPageOptimized({
  categorySlug,
  subcategorySlug,
  productSlug,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Menu");
  const { locale } = useParams();

  const {
    selectedQuantities,
    addToCart,
    decreaseSelectedQuantity,
    increaseSelectedQuantity,
    localize,
  } = useCart();

  // Инициализация all-products данных
  const { isReady: isAllProductsReady, isLoading: isAllProductsLoading } = useAllProducts();

  // Состояние UI
  const [isVisible, setIsVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [itemsPerPageMenuVisible, setItemsPerPageMenuVisible] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [currentPage, setCurrentPage] = useState(1);

  // Поиск и сортировка
  const [searchTerm, debouncedSearchTerm, setSearchTerm] = useDebouncedSearch("", 500);
  const [sortConfig, setSortConfig] = useState({
    field: "name",
    direction: "asc",
  });

  // Состояние выбранных категорий
  const [state, setState] = useState({
    activeCategory: null,
    activeSubCategory: null,
    activeVirtualSubCategory: null,
  });

  // Получаем категории и подкатегории из all-products
  const {
    categories,
    subcategories,
    isReady: isCategoriesReady
  } = useCategoriesAndSubcategories();

  // Получаем товары для активной подкатегории
  const {
    items: subcategoryItems,
    pagination,
    isReady: isSubcategoryDataReady,
    totalItems
  } = useSubcategoryProducts(
    state.activeSubCategory?._id,
    {
      searchTerm: debouncedSearchTerm,
      sortField: sortConfig.field,
      sortDirection: sortConfig.direction,
      page: currentPage,
      limit: itemsPerPage,
      locale,
    }
  );

  // Поиск в активной подкатегории
  const {
    results: searchResults,
    isReady: isSearchReady,
    hasResults
  } = useProductSearch(
    debouncedSearchTerm,
    {
      subcategoryId: state.activeSubCategory?._id,
      locale,
      sortField: sortConfig.field,
      sortDirection: sortConfig.direction,
      limit: 100, // Больший лимит для поиска
    }
  );

  // Определяем отображаемые товары
  const displayItems = useMemo(() => {
    if (debouncedSearchTerm && hasResults) {
      // Для поиска - показываем результаты поиска с пагинацией
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      return searchResults.slice(startIndex, endIndex);
    }

    // Обычный режим - показываем товары подкатегории
    return subcategoryItems;
  }, [debouncedSearchTerm, hasResults, searchResults, subcategoryItems, currentPage, itemsPerPage]);

  // Пагинация для поиска
  const searchPagination = useMemo(() => {
    if (!debouncedSearchTerm || !hasResults) return null;

    const totalSearchItems = searchResults.length;
    const totalPages = Math.ceil(totalSearchItems / itemsPerPage);

    return {
      currentPage,
      perPage: itemsPerPage,
      totalItems: totalSearchItems,
      totalPages,
    };
  }, [searchResults, debouncedSearchTerm, hasResults, currentPage, itemsPerPage]);

  // Определяем активную пагинацию
  const activePagination = debouncedSearchTerm && hasResults ? searchPagination : pagination;

  // Refs для закрытия меню при клике вне
  const sortMenuRef = useRef(null);
  const itemsPerPageMenuRef = useRef(null);

  // Front-end Virtual Subcategories для напитков
  const virtualSubCategories = useMemo(() => [
    {
      _id: "alcoholic",
      name: {
        et: "Alkohoolsed joogid",
        en: "Alcoholic Drinks",
        ru: "Алкогольные напитки",
      },
    },
    {
      _id: "non-alcoholic",
      name: {
        et: "Alkoholivabad joogid",
        en: "Non-Alcoholic Drinks",
        ru: "Безалкогольные напитки",
      },
    },
  ], []);

  // Определяем является ли текущая категория напитками
  const isDrinksCategory = useMemo(() => {
    return state.activeCategory?.slug === "joogid" || state.activeCategory?.slug === "drinks";
  }, [state.activeCategory]);

  // Обработчики событий
  const handleSort = (field, direction) => {
    setSortConfig({ field, direction });
    setSortMenuVisible(false);
    setCurrentPage(1); // Сбрасываем на первую страницу
  };

  const handleSortOptionClick = (option, direction) => {
    handleSort(option, direction);
  };

  const toggleSortMenu = () => {
    setSortMenuVisible((prev) => !prev);
  };

  const toggleItemsPerPageMenu = () => {
    setItemsPerPageMenuVisible((prev) => !prev);
  };

  const handleItemsPerPageClick = (value) => {
    setItemsPerPage(value);
    setItemsPerPageMenuVisible(false);
    setCurrentPage(1); // Сбрасываем на первую страницу
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    scrollToProducts();
  };

  // Функции скролла
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToProducts = () => {
    const productContainer = document.querySelector(`.${styles.productContainer}`);
    if (productContainer) {
      productContainer.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Wrapper functions для корзины
  const handleAddToCart = (product) => {
    addToCart(product, locale, t);
  };

  const handleIncreaseQuantity = (productId) => {
    increaseSelectedQuantity(productId);
  };

  const handleDecreaseQuantity = (productId) => {
    decreaseSelectedQuantity(productId);
  };

  // Инициализация состояния из URL или данных
  useEffect(() => {
    if (!isCategoriesReady) return;

    // Логика определения активной категории и подкатегории
    // на основе categorySlug, subcategorySlug или других параметров

    // Пример инициализации (адаптируй под свою логику)
    if (categorySlug && !state.activeCategory) {
      const category = categories.find(cat => cat.slug === categorySlug);
      if (category) {
        setState(prev => ({ ...prev, activeCategory: category }));
      }
    }

    if (subcategorySlug && !state.activeSubCategory && state.activeCategory) {
      const subcategory = subcategories.find(sub => sub.slug === subcategorySlug);
      if (subcategory) {
        setState(prev => ({ ...prev, activeSubCategory: subcategory }));
      }
    }
  }, [categorySlug, subcategorySlug, categories, subcategories, isCategoriesReady, state]);

  // Обработка изменения поиска
  useEffect(() => {
    setCurrentPage(1); // Сбрасываем страницу при новом поиске
  }, [debouncedSearchTerm]);

  // Показываем видимость UI
  useEffect(() => {
    if (!isVisible && (state.activeCategory || state.activeSubCategory)) {
      setIsVisible(true);
    }
  }, [state.activeCategory, state.activeSubCategory, isVisible]);

  // Закрытие меню при клике вне
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setSortMenuVisible(false);
      }
      if (itemsPerPageMenuRef.current && !itemsPerPageMenuRef.current.contains(event.target)) {
        setItemsPerPageMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Показываем лоадер пока данные загружаются
  if (isAllProductsLoading || !isAllProductsReady) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}>
          {t("loading")}...
        </div>
      </div>
    );
  }

  // Основной рендер
  return (
    <div className={styles.menuContainer}>
      {/* Навигация по категориям */}
      <div className={styles.categoriesContainer}>
        {categories.map((category) => (
          <button
            key={category._id}
            className={`${styles.categoryButton} ${
              state.activeCategory?._id === category._id ? styles.active : ""
            }`}
            onClick={() => {
              setState(prev => ({
                ...prev,
                activeCategory: category,
                activeSubCategory: null,
                activeVirtualSubCategory: null,
              }));
              setCurrentPage(1);
            }}
          >
            {localize(category.name, locale)}
          </button>
        ))}
      </div>

      {/* Подкатегории */}
      {state.activeCategory && (
        <div className={styles.subcategoriesContainer}>
          {isDrinksCategory ? (
            // Виртуальные подкатегории для напитков
            virtualSubCategories.map((virtualSub) => (
              <button
                key={virtualSub._id}
                className={`${styles.subcategoryButton} ${
                  state.activeVirtualSubCategory?._id === virtualSub._id ? styles.active : ""
                }`}
                onClick={() => {
                  setState(prev => ({
                    ...prev,
                    activeVirtualSubCategory: virtualSub,
                    activeSubCategory: null,
                  }));
                  setCurrentPage(1);
                }}
              >
                {localize(virtualSub.name, locale)}
              </button>
            ))
          ) : (
            // Обычные подкатегории
            subcategories
              .filter(sub => sub.parentCategory === state.activeCategory._id)
              .map((subcategory) => (
                <button
                  key={subcategory._id}
                  className={`${styles.subcategoryButton} ${
                    state.activeSubCategory?._id === subcategory._id ? styles.active : ""
                  }`}
                  onClick={() => {
                    setState(prev => ({
                      ...prev,
                      activeSubCategory: subcategory,
                      activeVirtualSubCategory: null,
                    }));
                    setCurrentPage(1);
                  }}
                >
                  {localize(subcategory.name, locale)}
                </button>
              ))
          )}
        </div>
      )}

      {/* Поиск и фильтры */}
      {state.activeSubCategory && (
        <div className={styles.filtersContainer}>
          {/* Поиск */}
          <div className={styles.searchContainer}>
            <input
              type="text"
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Сортировка */}
          <div className={styles.sortContainer} ref={sortMenuRef}>
            <button
              onClick={toggleSortMenu}
              className={styles.sortButton}
            >
              {t("sort")}: {t(sortConfig.field)} ({sortConfig.direction === "asc" ? "↑" : "↓"})
            </button>

            {sortMenuVisible && (
              <div className={styles.sortDropdown}>
                <button onClick={() => handleSortOptionClick("name", "asc")}>
                  {t("name")} (A-Z)
                </button>
                <button onClick={() => handleSortOptionClick("name", "desc")}>
                  {t("name")} (Z-A)
                </button>
                <button onClick={() => handleSortOptionClick("price", "asc")}>
                  {t("price")} (↑)
                </button>
                <button onClick={() => handleSortOptionClick("price", "desc")}>
                  {t("price")} (↓)
                </button>
              </div>
            )}
          </div>

          {/* Количество на странице */}
          <div className={styles.itemsPerPageContainer} ref={itemsPerPageMenuRef}>
            <button
              onClick={toggleItemsPerPageMenu}
              className={styles.itemsPerPageButton}
            >
              {t("itemsPerPage")}: {itemsPerPage}
            </button>

            {itemsPerPageMenuVisible && (
              <div className={styles.itemsPerPageDropdown}>
                {[12, 24, 48, 96].map((value) => (
                  <button
                    key={value}
                    onClick={() => handleItemsPerPageClick(value)}
                    className={itemsPerPage === value ? styles.active : ""}
                  >
                    {value}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Товары */}
      {state.activeSubCategory && (
        <div className={styles.productContainer}>
          {/* Информация о результатах */}
          <div className={styles.resultsInfo}>
            {debouncedSearchTerm ? (
              <p>
                {t("searchResults", {
                  term: debouncedSearchTerm,
                  count: searchResults.length
                })}
              </p>
            ) : (
              <p>
                {t("totalItems", { count: totalItems })}
              </p>
            )}
          </div>

          {/* Сетка товаров */}
          <div className={styles.productsGrid}>
            {displayItems.map((item) => (
              <div key={item._id} className={styles.productCard}>
                {/* Изображение */}
                {item.images && item.images.length > 0 && (
                  <img
                    src={item.images[0]}
                    alt={item.isDrink ? item.name : localize(item.title, locale)}
                    className={styles.productImage}
                  />
                )}

                {/* Информация о товаре */}
                <div className={styles.productInfo}>
                  <h3 className={styles.productName}>
                    {item.isDrink ? item.name : localize(item.title, locale)}
                  </h3>

                  {item.description && (
                    <p className={styles.productDescription}>
                      {item.description}
                    </p>
                  )}

                  <div className={styles.productPrice}>
                    {item.price}€
                  </div>

                  {/* Дополнительная информация для напитков */}
                  {item.isDrink && (
                    <div className={styles.drinkInfo}>
                      {item.volume && <span>{item.volume}л</span>}
                      {item.degree && <span>{item.degree}%</span>}
                      {item.region && <span>{item.region}</span>}
                    </div>
                  )}
                </div>

                {/* Кнопки корзины */}
                <div className={styles.cartControls}>
                  {selectedQuantities[item._id] ? (
                    <div className={styles.quantityControls}>
                      <button
                        onClick={() => handleDecreaseQuantity(item._id)}
                        className={styles.quantityButton}
                      >
                        -
                      </button>
                      <span className={styles.quantity}>
                        {selectedQuantities[item._id]}
                      </span>
                      <button
                        onClick={() => handleIncreaseQuantity(item._id)}
                        className={styles.quantityButton}
                      >
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(item)}
                      className={styles.addToCartButton}
                    >
                      {t("addToCart")}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Пагинация */}
          {activePagination && activePagination.totalPages > 1 && (
            <div className={styles.paginationContainer}>
              {/* Кнопка "Предыдущая" */}
              <button
                onClick={() => handlePageChange(activePagination.currentPage - 1)}
                disabled={activePagination.currentPage === 1}
                className={styles.paginationButton}
              >
                {t("previous")}
              </button>

              {/* Номера страниц */}
              {Array.from({ length: activePagination.totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`${styles.paginationButton} ${
                    page === activePagination.currentPage ? styles.active : ""
                  }`}
                >
                  {page}
                </button>
              ))}

              {/* Кнопка "Следующая" */}
              <button
                onClick={() => handlePageChange(activePagination.currentPage + 1)}
                disabled={activePagination.currentPage === activePagination.totalPages}
                className={styles.paginationButton}
              >
                {t("next")}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Кнопка "Наверх" */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={styles.scrollToTopButton}
        >
          ↑ {t("toTop")}
        </button>
      )}
    </div>
  );
}
