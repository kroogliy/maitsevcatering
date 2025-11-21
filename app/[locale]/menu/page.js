"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  useRouter,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { useTranslations } from "next-intl";
import gsap from "gsap";

import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

import { GoSearch } from "react-icons/go";
import { IoMdArrowDropdown } from "react-icons/io";

// import { roboto, oswald } from "../../../lib/fonts";
import ProductList from "../../../components/products/productlist";
import useDebouncedSearch from "../../hooks/useDebouncedSearch";
import { useCart } from "../../../contexts/CartContext";
import { useProducts } from "../../../contexts/ProductsContext";
import {
  searchItems,
  sortItems,
  paginateItems,
} from "../../../utils/dataExtractors";
import HomePageLoadingWrapper from "../HomePageLoadingWrapper";
import styles from "./menu.module.css";

const OrderModal = dynamic(
  () => import("../../../components/orderwindow/modalwindow"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  },
);

export default function MenuPage({
  categorySlug,
  subcategorySlug,
  productSlug,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const t = useTranslations("Menu");
  const { locale } = useParams();

  const [hasAnimated, setHasAnimated] = useState(false);
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const productsAnchorRef = useRef(null);

  // Elegant greetings rotation
  const [currentGreeting, setCurrentGreeting] = useState(0);
  const greetingRef = useRef(null);
  const greetingTextRef = useRef(null);

  const greetings = [
    { text: "მოგესალმებით", lang: "Georgian" },
    { text: "Welcome", lang: "English" },
    { text: "Добро пожаловать", lang: "Russian" },
    { text: "Tere tulemast", lang: "Estonian" },
  ];

  // Simple mask reveal animation left to right for all greetings
  useEffect(() => {
    if (!greetingRef.current) return;

    const animateGreeting = () => {
      const tl = gsap.timeline();

      // Simple left to right mask reveal
      tl.to(greetingRef.current, {
        clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
        duration: 0.5,
        ease: "power2.in",
      })
        .call(() => setCurrentGreeting((prev) => (prev + 1) % greetings.length))
        .set(greetingRef.current, {
          clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)",
        })
        .to(greetingRef.current, {
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
          duration: 0.6,
          ease: "power2.out",
        });
    };

    // Start animation cycle
    const interval = setInterval(animateGreeting, 4000);

    // Cleanup
    return () => {
      clearInterval(interval);
      gsap.killTweensOf(greetingRef.current);
    };
  }, []);

  // Elegant entrance animation with mask reveal on page load
  useEffect(() => {
    if (!greetingRef.current) return;

    // Initial state - hidden with mask
    gsap.set(greetingRef.current, {
      opacity: 0,
      clipPath: "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)",
      scale: 0.95,
    });

    // Elegant mask reveal animation
    const tl = gsap.timeline({ delay: 0.5 });

    tl.to(greetingRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "power3.out",
    }).to(
      greetingRef.current,
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        duration: 1,
        ease: "power3.inOut",
      },
      "-=0.6",
    );
  }, []);

  const {
    selectedQuantities,
    addToCart,
    decreaseSelectedQuantity,
    increaseSelectedQuantity,
    localize,
  } = useCart();
  const [isVisible, setIsVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);
  const [itemsPerPageMenuVisible, setItemsPerPageMenuVisible] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, debouncedSearchTerm, setSearchTerm] = useDebouncedSearch(
    "",
    500,
  );

  const [sortConfig, setSortConfig] = useState({
    field: "name",
    direction: "asc",
  });

  // Получаем данные из нового стора
  const {
    loading,
    loaded,
    getAllCategories,
    getAllSubcategories,
    getItemsBySubcategorySlug,
    searchInSubcategorySlug,
    getAllProducts,
    getAllAlkohols,
    stats,
  } = useProducts();

  // Универсальный обработчик сортировки
  const handleSort = (field, direction) => {
    setSortConfig({ field, direction });
    setSortMenuVisible(false);
    setCurrentPage(1); // Сбрасываем на первую страницу
  };

  // Получаем категории и подкатегории из кэша
  const categories = loaded ? getAllCategories() : [];
  const subcategories = loaded ? getAllSubcategories() : [];

  // Функция скролла вверх
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Плавный скролл к началу списка товаров с точным учетом хедера
  const scrollToProducts = () => {
    const anchor = productsAnchorRef.current;
    if (!anchor) return;
    const headerEl = document.querySelector('[class*="header"]');
    const headerOffset = (headerEl && headerEl.offsetHeight) || 80;
    const anchorTop = anchor.getBoundingClientRect().top + window.pageYOffset;
    const targetTop = Math.max(0, anchorTop - headerOffset - 16);
    window.scrollTo({ top: targetTop, behavior: "smooth" });
  };

  // Планировщик повторного скролла, чтобы учесть ререндер и анимацию
  const scheduleScrollToProducts = () => {
    // после следующего кадра (обновления layout)
    requestAnimationFrame(() => {
      scrollToProducts();
      // после короткой задержки (перерисовка контента)
      setTimeout(scrollToProducts, 50);
      // после завершения framer-motion анимации (0.2s)
      setTimeout(scrollToProducts, 220);
    });
  };

  // Fallback функция для API запроса (используется только при необходимости)
  // Эффект для сброса страницы при изменении поиска
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  // Обновление состояния
  const [state, setState] = useState({
    activeCategory: null,
    activeSubCategory: null,
    activeVirtualSubCategory: null,
  });

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Получаем товары для активной подкатегории
  const getSubcategoryItems = () => {
    if (!loaded || !state.activeSubCategory) return [];

    // Получаем все товары в подкатегории
    const allSubcategoryItems = [
      ...getAllProducts(),
      ...getAllAlkohols(),
    ].filter((item) => item.subcategoryId === state.activeSubCategory._id);

    // Применяем поиск если есть
    let filteredItems = allSubcategoryItems;
    if (debouncedSearchTerm) {
      filteredItems = searchItems(
        allSubcategoryItems,
        debouncedSearchTerm,
        locale,
      );
    }

    // Применяем сортировку
    const sortedItems = sortItems(
      filteredItems,
      sortConfig.field,
      sortConfig.direction,
      locale,
    );

    return sortedItems;
  };

  // Определяем является ли текущая категория напитками (перемещено после state)
  const isDrinksCategory =
    state.activeCategory?.slug === "joogid" ||
    state.activeCategory?.slug === "drinks";

  // Получаем отображаемые товары (с пагинацией только для напитков)
  const getDisplayItems = () => {
    const allItems = getSubcategoryItems();

    // Для напитков используем пагинацию, для продуктов показываем все
    if (isDrinksCategory) {
      return paginateItems(allItems, currentPage, itemsPerPage);
    } else {
      // Для продуктов возвращаем все товары без пагинации
      return {
        items: allItems,
        pagination: {
          currentPage: 1,
          perPage: allItems.length,
          totalItems: allItems.length,
          totalPages: 1,
        },
      };
    }
  };

  const displayData = getDisplayItems();
  const displayItems = displayData.items;
  const pagination = displayData.pagination;

  const initialState = {
    categories: [],
    subCategories: [],
    products: [],
  };

  function dataReducer(state, action) {
    switch (action.type) {
      case "SET_DATA":
        return {
          ...state,
          categories: action.payload.categories,
          subCategories: action.payload.subCategories,
          products: action.payload.products,
        };
      default:
        return state;
    }
  }

  const sortMenuRef = useRef(null);
  const itemsPerPageMenuRef = useRef(null);

  const handleSortOptionClick = (option, direction) => {
    // Сохраняем настройки сортировки
    setSortConfig({
      field: option, // 'name' или 'price'
      direction, // 'asc' или 'desc'
    });

    // Закрываем меню
    setSortMenuVisible(false);

    // Сортировка теперь обрабатывается автоматически в getSubcategoryItems()
  };

  const toggleSortMenu = () => {
    setSortMenuVisible((prev) => !prev);
  };

  // sortProducts больше не нужен - сортировка обрабатывается в getSubcategoryItems()

  const handleItemsPerPageClick = (value) => {
    setItemsPerPage(value);
    setItemsPerPageMenuVisible(false);
    setCurrentPage(1); // Сбрасываем на первую страницу
  };

  const handlePageChange = (page) => {
    if (page === currentPage) return;
    setCurrentPage(page);
    scheduleScrollToProducts();
  };

  const toggleItemsPerPageMenu = () => {
    setItemsPerPageMenuVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(event.target)) {
        setSortMenuVisible(false);
      }
      if (
        itemsPerPageMenuRef.current &&
        !itemsPerPageMenuRef.current.contains(event.target)
      ) {
        setItemsPerPageMenuVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!isVisible && (state.activeCategory || state.activeSubCategory)) {
      setIsVisible(true);
    }
  }, [isVisible, state.activeCategory, state.activeSubCategory]);

  // Wrapper functions to pass locale and t to cart functions
  const handleAddToCart = (product) => {
    addToCart(product, locale, t);
  };

  const hasFetched = useRef(false);

  useEffect(() => {
    if (isMounted && !hasFetched.current) {
      hasFetched.current = true;

      // Данные уже загружаются через ProductsContext, никаких дополнительных запросов не нужно
    }
  }, [isMounted]);

  // Front-end Virtual Subcategories
  const virtualSubCategories = useMemo(
    () => [
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
    ],
    [],
  );

  useEffect(() => {
    const handleUrl = () => {
      const pathSegments = pathname.split("/");
      const categorySlug = pathSegments[3];
      const subcategorySlug = pathSegments[4];
      const productSlug = pathSegments[5];

      if (categories.length > 0 && subcategories.length > 0 && loaded) {
        let newCategory = null;
        let newSubCategory = null;
        let newVirtualSubCategory = null;
        let selectedProduct = null;

        // Находим категорию по slug
        newCategory = categories.find((cat) => cat.slug === categorySlug);

        if (newCategory) {
          // Если это категория "Напитки"
          if (newCategory._id === "67c8fc6cf92f156ba138466f") {
            // Находим подкатегорию по slug
            newSubCategory = subcategories.find(
              (subCat) => subCat.slug === subcategorySlug,
            );

            if (newSubCategory) {
              // Определяем, является ли подкатегория алкогольной
              const allItems = [...getAllProducts(), ...getAllAlkohols()];
              const isAlcoholic = allItems.some(
                (product) =>
                  product.subcategoryId === newSubCategory._id &&
                  product.isAlcoholic,
              );

              // Устанавливаем виртуальную подкатегорию
              newVirtualSubCategory = isAlcoholic
                ? virtualSubCategories.find(
                    (subCat) => subCat._id === "alcoholic",
                  )
                : virtualSubCategories.find(
                    (subCat) => subCat._id === "non-alcoholic",
                  );
            }
          } else {
            // Для других категорий
            newSubCategory = subcategories.find(
              (subCat) => subCat.slug === subcategorySlug,
            );
          }

          // Если есть productSlug, то находим продукт
          if (productSlug) {
            const allItems = [...getAllProducts(), ...getAllAlkohols()];
            selectedProduct = allItems.find(
              (product) => product.slug === productSlug,
            );
          }
        }

        // Обновляем состояние только если есть реальные изменения
        const hasChanges =
          (newCategory && newCategory._id !== state.activeCategory?._id) ||
          (newSubCategory &&
            newSubCategory._id !== state.activeSubCategory?._id) ||
          (newVirtualSubCategory &&
            newVirtualSubCategory._id !==
              state.activeVirtualSubCategory?._id) ||
          (selectedProduct &&
            selectedProduct._id !== state.selectedProduct?._id);

        if (hasChanges) {
          setState((prev) => ({
            ...prev,
            activeCategory: newCategory || prev.activeCategory,
            activeSubCategory: newSubCategory || prev.activeSubCategory,
            activeVirtualSubCategory:
              newVirtualSubCategory || prev.activeVirtualSubCategory,
            selectedProduct: selectedProduct || prev.selectedProduct,
          }));
        }
      }
    };

    handleUrl();
    const handlePopState = () => {
      handleUrl();
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [
    pathname,
    categories,
    subcategories,
    loaded,
    state.activeCategory?._id,
    state.activeSubCategory?._id,
    state.activeVirtualSubCategory?._id,
    getAllAlkohols,
    getAllProducts,
    state.selectedProduct?._id,
    virtualSubCategories,
  ]);

  // Функция обработки клика по категории
  const handleCategoryClick = (category) => {
    if (state.activeCategory?._id === category._id) {
      return;
    }

    setIsVisible(false);

    setState((prevState) => ({
      ...prevState,
      activeCategory: category,
    }));

    if (category._id === "67c8fc6cf92f156ba138466f") {
      const nonAlcoholicSubCategory = virtualSubCategories.find(
        (subCat) => subCat._id === "non-alcoholic",
      );
      setState((prevState) => ({
        ...prevState,
        activeVirtualSubCategory: nonAlcoholicSubCategory,
      }));

      const filteredSubCategories = getFilteredSubCategories(
        subcategories,
        [...getAllProducts(), ...getAllAlkohols()],
        false,
      );

      if (filteredSubCategories.length > 0) {
        const firstSubCategory = filteredSubCategories[0];
        setState((prevState) => ({
          ...prevState,
          activeSubCategory: firstSubCategory,
        }));
        window.history.pushState(
          {},
          "",
          `/${locale}/menu/drinks/${firstSubCategory.slug}`,
        );
      } else {
        setState((prevState) => ({
          ...prevState,
          activeSubCategory: null,
        }));
        window.history.pushState({}, "", `/${locale}/menu/drinks`);
      }
    } else {
      const firstSubCategory = subcategories.find(
        (subCategory) => subCategory.parentCategory === category._id,
      );

      setState((prevState) => ({
        ...prevState,
        activeSubCategory: firstSubCategory || null,
        activeVirtualSubCategory: null,
      }));

      if (firstSubCategory) {
        window.history.pushState(
          {},
          "",
          `/${locale}/menu/${category.slug}/${firstSubCategory.slug}`,
        );
      } else {
        window.history.pushState({}, "", `/${locale}/menu/${category.slug}`);
      }
    }
  };

  const handleSubCategoryClick = (subCategory) => {
    // Проверка, если подкатегория уже активна, то не делать ничего
    if (state.activeSubCategory?._id === subCategory._id) {
      return;
    }

    // Сбрасываем пагинацию при смене подкатегории
    setCurrentPage(1);

    // Закрываем меню или выполняем другие действия
    setIsVisible(false);

    // Обновляем активную подкатегорию
    setState((prevState) => ({
      ...prevState,
      activeSubCategory: subCategory,
    }));

    // Обновляем URL с учетом выбранной подкатегории
    window.history.pushState(
      {},
      "",
      `/${locale}/menu/${state.activeCategory.slug}/${subCategory.slug}`,
    );
  };

  const localizeTitle = (product, locale) => {
    if (!product.title || typeof product.title !== "object") {
      return product.name || "";
    }
    return product.title[locale] || product.title.en || product.name || "";
  };

  // Обработчик поиска больше не нужен - поиск работает через клиентский кэш
  // Поиск обрабатывается автоматически в getSubcategoryItems()

  const getFilteredSubCategories = (subCategories, products, isAlcoholic) => {
    return subCategories.filter((subCategory) => {
      // CategoryId = 'Drinks'
      if (subCategory.parentCategory !== "67c8fc6cf92f156ba138466f") {
        return false;
      }

      const productsInSubCategory = products.filter(
        (product) => product.subcategoryId === subCategory._id,
      );
      if (isAlcoholic) {
        return productsInSubCategory.some(
          (product) => product.isAlcoholic === true,
        );
      } else {
        return productsInSubCategory.every(
          (product) => product.isAlcoholic === false,
        );
      }
    });
  };

  // filteredProducts удален - используется getSubcategoryItems()

  useEffect(() => {
    const updateMetaTags = () => {
      const { activeCategory, activeSubCategory } = state;

      if (activeCategory && activeSubCategory) {
        // Формируем мета-теги в зависимости от текущей локали
        let metaTitle = "";
        let metaDescription = "";

        const isDrinksCategory =
          activeCategory?.slug === "joogid" ||
          activeCategory?.slug === "drinks";

        // Получаем имя подкатегории с fallback
        const getSubcategoryName = (subcategory, locale) => {
          if (typeof subcategory.name === "string") {
            return subcategory.name;
          }
          return (
            subcategory.name?.[locale] ||
            subcategory.name?.en ||
            subcategory.name?.et ||
            subcategory.name?.ru ||
            subcategory.slug ||
            "Menu"
          );
        };

        const subcategoryName = getSubcategoryName(activeSubCategory, locale);

        if (locale === "ru") {
          if (isDrinksCategory) {
            metaTitle = `${subcategoryName} | Алкоголь и Вина | Maitsev Gruusia`;
            metaDescription = `🍷 ${subcategoryName} - алкогольные напитки в Maitsev Gruusia. Грузинский ресторан с коллекцией из 6000+ напитков, грузинские вина, саперави, киндзмараули в Таллинне.`;
          } else {
            metaTitle = `${subcategoryName} | Грузинская Кухня | Maitsev Gruusia`;
            metaDescription = `🍴 ${subcategoryName} - грузинская кухня в Maitsev Gruusia. Хачапури, хинкали, мцвади, сациви. Традиционные рецепты, доставка в Таллинне.`;
          }
        } else if (locale === "en") {
          if (isDrinksCategory) {
            metaTitle = `${subcategoryName} | Alcohol & Wine | Maitsev Gruusia`;
            metaDescription = `🍷 ${subcategoryName} - alcoholic drinks at Maitsev Gruusia. Georgian restaurant with 6000+ drinks collection, Georgian wines, saperavi, kindzmarauli in Tallinn.`;
          } else {
            metaTitle = `${subcategoryName} | Georgian Cuisine | Maitsev Gruusia`;
            metaDescription = `🍴 ${subcategoryName} - Georgian cuisine at Maitsev Gruusia. Khachapuri, khinkali, mtsvadi, satsivi. Traditional recipes, delivery in Tallinn.`;
          }
        } else {
          if (isDrinksCategory) {
            metaTitle = `${subcategoryName} | Alkohol & Veinid | Maitsev Gruusia`;
            metaDescription = `🍷 ${subcategoryName} - alkohoolsed joogid Maitsev Gruusia restoranis. Gruusia restoran 6000+ jookide kollektsiooniga, gruusia veinid, saperavi, kindzmarauli Tallinnas.`;
          } else {
            metaTitle = `${subcategoryName} | Gruusia Köök | Maitsev Gruusia`;
            metaDescription = `🍴 ${subcategoryName} - gruusia köök Maitsev Gruusia restoranis. Khachapuri, khinkali, mtsvadi, satsivi. Traditsioonilised retseptid, kohaletoimetamine Tallinnas.`;
          }
        }

        // Обновляем заголовок страницы
        document.title = metaTitle;

        // Обновляем meta-тег description
        const metaDescriptionTag = document.querySelector(
          'meta[name="description"]',
        );
        if (metaDescriptionTag) {
          metaDescriptionTag.setAttribute("content", metaDescription);
        }

        // Обновляем OpenGraph теги
        const ogTitleTag = document.querySelector('meta[property="og:title"]');
        if (ogTitleTag) {
          ogTitleTag.setAttribute("content", metaTitle);
        }

        const ogDescriptionTag = document.querySelector(
          'meta[property="og:description"]',
        );
        if (ogDescriptionTag) {
          ogDescriptionTag.setAttribute("content", metaDescription);
        }

        const ogUrlTag = document.querySelector('meta[property="og:url"]');
        if (ogUrlTag) {
          ogUrlTag.setAttribute("content", window.location.href);
        }

        // Добавляем или обновляем keywords мета-тег
        let keywordsTag = document.querySelector('meta[name="keywords"]');
        if (!keywordsTag) {
          keywordsTag = document.createElement("meta");
          keywordsTag.setAttribute("name", "keywords");
          document.head.appendChild(keywordsTag);
        }

        const keywords = isDrinksCategory
          ? locale === "ru"
            ? "алкоголь таллинн, грузинские вина, саперави, киндзмараули, редкие напитки, коллекционные спиртные, грузинский ресторан"
            : locale === "et"
              ? "alkohol tallinn, gruusia veinid, saperavi, kindzmarauli, haruldased joogid, kollektsiooni alkohol, gruusia restoran"
              : "alcohol tallinn, georgian wines, saperavi, kindzmarauli, rare drinks, collectible spirits, georgian restaurant"
          : locale === "ru"
            ? "грузинский ресторан таллинн, грузинская кухня, хачапури, хинкали, мцвади, сациви, грузинские вина, саперави"
            : locale === "et"
              ? "gruusia restoran tallinn, gruusia köök, khachapuri, khinkali, mtsvadi, satsivi, gruusia veinid, saperavi"
              : "georgian restaurant tallinn, georgian cuisine, khachapuri, khinkali, mtsvadi, satsivi, georgian wines, saperavi";

        keywordsTag.setAttribute("content", keywords);

        // Обновляем дополнительные OpenGraph теги
        let ogTypeTag = document.querySelector('meta[property="og:type"]');
        if (!ogTypeTag) {
          ogTypeTag = document.createElement("meta");
          ogTypeTag.setAttribute("property", "og:type");
          document.head.appendChild(ogTypeTag);
        }
        ogTypeTag.setAttribute("content", "website");

        let ogSiteNameTag = document.querySelector(
          'meta[property="og:site_name"]',
        );
        if (!ogSiteNameTag) {
          ogSiteNameTag = document.createElement("meta");
          ogSiteNameTag.setAttribute("property", "og:site_name");
          document.head.appendChild(ogSiteNameTag);
        }
        ogSiteNameTag.setAttribute("content", "MAITSEV GRUUSIA");

        let ogLocaleTag = document.querySelector('meta[property="og:locale"]');
        if (!ogLocaleTag) {
          ogLocaleTag = document.createElement("meta");
          ogLocaleTag.setAttribute("property", "og:locale");
          document.head.appendChild(ogLocaleTag);
        }
        ogLocaleTag.setAttribute(
          "content",
          locale === "ru" ? "ru_RU" : locale === "et" ? "et_EE" : "en_US",
        );

        // Добавляем Twitter Card мета-теги
        let twitterCardTag = document.querySelector(
          'meta[name="twitter:card"]',
        );
        if (!twitterCardTag) {
          twitterCardTag = document.createElement("meta");
          twitterCardTag.setAttribute("name", "twitter:card");
          document.head.appendChild(twitterCardTag);
        }
        twitterCardTag.setAttribute("content", "summary_large_image");

        let twitterTitleTag = document.querySelector(
          'meta[name="twitter:title"]',
        );
        if (!twitterTitleTag) {
          twitterTitleTag = document.createElement("meta");
          twitterTitleTag.setAttribute("name", "twitter:title");
          document.head.appendChild(twitterTitleTag);
        }
        twitterTitleTag.setAttribute("content", metaTitle);

        let twitterDescriptionTag = document.querySelector(
          'meta[name="twitter:description"]',
        );
        if (!twitterDescriptionTag) {
          twitterDescriptionTag = document.createElement("meta");
          twitterDescriptionTag.setAttribute("name", "twitter:description");
          document.head.appendChild(twitterDescriptionTag);
        }
        twitterDescriptionTag.setAttribute("content", metaDescription);

        let twitterSiteTag = document.querySelector(
          'meta[name="twitter:site"]',
        );
        if (!twitterSiteTag) {
          twitterSiteTag = document.createElement("meta");
          twitterSiteTag.setAttribute("name", "twitter:site");
          document.head.appendChild(twitterSiteTag);
        }
        twitterSiteTag.setAttribute("content", "@maitsevgruusia");

        // Удаляем старую схему, если она существует
        const oldSchemaScript = document.querySelector(
          'script[type="application/ld+json"]',
        );
        if (oldSchemaScript) {
          oldSchemaScript.remove();
        }

        // Создаем новую схему
        const schemaData = {
          "@context": "https://schema.org",
          "@type": "MenuSection",
          name: subcategoryName,
          description: metaDescription,
          image:
            activeSubCategory.image ||
            activeCategory.image ||
            "/images/cateringpage1.jpg",
          mainEntityOfPage: {
            "@type": "WebPage",
            "@id": window.location.href,
          },
          partOf: {
            "@type": "Restaurant",
            name: "MAITSEV GRUUSIA",
            servesCuisine: ["Georgian", "Caucasian", "European"],
            priceRange: "€€",
            speciality: isDrinksCategory
              ? [
                  "6000+ alcoholic drinks",
                  "Georgian wine collection",
                  "Saperavi wines",
                  "Kindzmarauli wines",
                ]
              : [
                  "Georgian khachapuri",
                  "Traditional khinkali",
                  "Mtsvadi grilled meat",
                  "Satsivi walnut sauce",
                  "Georgian culinary culture",
                ],
            address: {
              "@type": "PostalAddress",
              addressCountry: "EE",
              addressLocality: "Tallinn",
            },
          },
          cuisine: isDrinksCategory ? "Alcoholic beverages" : "Georgian",
          keywords: isDrinksCategory
            ? locale === "ru"
              ? "алкоголь, грузинские вина, саперави, киндзмараули, редкие напитки, коллекционные спиртные"
              : locale === "et"
                ? "alkohol, gruusia veinid, saperavi, kindzmarauli, haruldased joogid, kollektsiooni alkohol"
                : "alcohol, georgian wines, saperavi, kindzmarauli, rare drinks, collectible spirits"
            : locale === "ru"
              ? "грузинский ресторан таллинн, грузинская кухня, хачапури, хинкали, мцвади, сациви"
              : locale === "et"
                ? "gruusia restoran tallinn, gruusia köök, khachapuri, khinkali, gruusia veinid, roosikrantsi"
                : "georgian restaurant tallinn, georgian cuisine, khachapuri, khinkali, georgian wines, roosikrantsi",
        };

        const schemaScript = document.createElement("script");
        schemaScript.type = "application/ld+json";
        schemaScript.textContent = JSON.stringify(schemaData);
        document.head.appendChild(schemaScript);
      }
    };

    updateMetaTags();
  }, [state.activeCategory, state.activeSubCategory, locale, state]);

  // totalPages и currentProducts удалены - используется новая логика пагинации

  // renderPagination удален - используется новая пагинация выше

  // Проверяем sessionStorage для однократной анимации
  useEffect(() => {
    const sessionKey = "menu-page-animated";
    const hasAnimatedInSession = sessionStorage.getItem(sessionKey);

    if (!hasAnimatedInSession) {
      setHasAnimated(false);
    } else {
      setHasAnimated(true);
      // Убираем анимации через CSS класс
      if (heroRef.current) {
        heroRef.current.classList.add(styles.noAnimation);
      }
    }
  }, []);

  // Добавляем плавную анимацию видео с параллакс эффектом
  useEffect(() => {
    const video = videoRef.current;
    const hero = heroRef.current;
    const videoContainer = videoContainerRef.current;

    if (!video || !hero || !videoContainer) return;

    // Устанавливаем начальное состояние для плавного появления
    gsap.set(hero, {
      opacity: 0,
    });

    gsap.set(video, {
      opacity: 0,
      scale: 1.2, // Увеличиваем масштаб для параллакса
      filter: "blur(3px)",
    });

    // Плавное появление контейнера
    gsap.to(hero, {
      opacity: 1,
      duration: 0.6,
      ease: "power2.out",
      delay: 0.1,
    });

    // Плавное появление видео
    gsap.to(video, {
      opacity: 1,
      scale: 1.15, // Оставляем немного больше для параллакса
      filter: "blur(0px)",
      duration: 1.0,
      ease: "power2.out",
      delay: 0.3,
    });

    // Параллакс эффект при скролле
    let ticking = false;
    let currentScrollY = 0;

    const lerp = (start, end, factor) => {
      return start + (end - start) * factor;
    };

    const updateParallax = () => {
      if (!hero || !video) {
        ticking = false;
        return;
      }

      const targetScrollY =
        window.pageYOffset || document.documentElement.scrollTop;
      currentScrollY = lerp(currentScrollY, targetScrollY, 0.1);

      const rect = hero.getBoundingClientRect();
      const isInView = rect.bottom >= 0 && rect.top <= window.innerHeight;

      if (isInView) {
        // Видео движется медленнее (параллакс эффект)
        const videoSpeed = 0.5;
        const videoOffset = Math.round(currentScrollY * videoSpeed);

        video.style.transform = `translate3d(0, ${videoOffset}px, 0) scale(1.15)`;
      }

      if (Math.abs(currentScrollY - targetScrollY) > 0.1) {
        requestAnimationFrame(updateParallax);
      } else {
        ticking = false;
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Отмечаем что анимация проиграна
  useEffect(() => {
    if (!hasAnimated) {
      const timer = setTimeout(() => {
        sessionStorage.setItem("menu-page-animated", "true");
        setHasAnimated(true);
      }, 3000); // Время полной анимации

      return () => clearTimeout(timer);
    }
  }, [hasAnimated]);

  // Важно: НЕ скроллим на первый рендер. Скроллим ТОЛЬКО из handlePageChange.

  useEffect(() => {
    if (isMounted) {
      const categoryParam = searchParams.get("category");
      const subCategoryParam = searchParams.get("subCategory");

      if (categoryParam === "drinks" && categories.length > 0) {
        const drinksCategory = categories.find(
          (cat) => cat._id === "67c8fc6cf92f156ba138466f",
        );
        if (
          drinksCategory &&
          drinksCategory._id !== state.activeCategory?._id
        ) {
          setState((prev) => ({
            ...prev,
            activeCategory: drinksCategory,
          }));

          if (subCategoryParam === "alcoholic") {
            const alcoholicSubCategory = virtualSubCategories.find(
              (subCat) => subCat._id === "alcoholic",
            );
            if (
              alcoholicSubCategory &&
              alcoholicSubCategory._id !== state.activeVirtualSubCategory?._id
            ) {
              setState((prev) => ({
                ...prev,
                activeVirtualSubCategory: alcoholicSubCategory,
              }));
            }
          } else {
            const nonAlcoholicSubCategory = virtualSubCategories.find(
              (subCat) => subCat._id === "non-alcoholic",
            );
            if (
              nonAlcoholicSubCategory &&
              nonAlcoholicSubCategory._id !==
                state.activeVirtualSubCategory?._id
            ) {
              setState((prev) => ({
                ...prev,
                activeVirtualSubCategory: nonAlcoholicSubCategory,
              }));
            }
          }
        }
      }
    }
  }, [
    isMounted,
    searchParams,
    categories.length,
    categories,
    virtualSubCategories,
    state.activeCategory?._id,
    state.activeVirtualSubCategory?._id,
  ]);

  const handleVirtualSubCategoryClick = (subCategory) => {
    const filteredSubCategories = getFilteredSubCategories(
      subcategories,
      [...getAllProducts(), ...getAllAlkohols()],
      subCategory._id === "alcoholic",
    );

    const firstSubCategory =
      filteredSubCategories.length > 0 ? filteredSubCategories[0] : null;

    // Сбрасываем пагинацию
    setCurrentPage(1);

    // Обновляем состояние одним вызовом
    setState((prevState) => ({
      ...prevState,
      activeVirtualSubCategory: subCategory,
      activeSubCategory: firstSubCategory,
    }));

    // Обновляем URL
    if (firstSubCategory) {
      window.history.pushState(
        {},
        "",
        `/${locale}/menu/drinks/${firstSubCategory.slug}`,
      );
    }
  };

  const renderSubCategories = () => {
    if (!state.activeCategory) return null;

    const isDrinksCategory =
      state.activeCategory._id === "67c8fc6cf92f156ba138466f";

    if (isDrinksCategory) {
      // Virtual Subcategories for 'Drinks'
      return (
        <div className={styles.virtualSubButtonContainer}>
          {virtualSubCategories.map((subCategory) => (
            <button
              className={`${styles.virtualSubButton} ${state.activeVirtualSubCategory?._id === subCategory._id ? styles.active : ""}`}
              key={subCategory._id}
              onClick={() => handleVirtualSubCategoryClick(subCategory)}
            >
              {localize(subCategory?.name, locale)}
            </button>
          ))}
        </div>
      );
    }
    // Other categories without virtual subcategories
    return (
      <div className={styles.subButtonContainer}>
        {subcategories
          .filter(
            (subCategory) =>
              subCategory.parentCategory === state.activeCategory._id,
          )
          .map((subCategory) => (
            <button
              className={`${styles.virtualSubButton} ${state.activeSubCategory?._id === subCategory._id ? styles.active : ""}`}
              key={subCategory._id}
              onClick={() => handleSubCategoryClick(subCategory)}
            >
              {localize(subCategory?.name, locale)}
            </button>
          ))}
      </div>
    );
  };

  const renderFilteredSubCategories = () => {
    if (!state.activeCategory || !state.activeVirtualSubCategory) return null;

    const isDrinksCategory =
      state.activeCategory._id === "67c8fc6cf92f156ba138466f";

    if (isDrinksCategory) {
      const filteredSubCategories = getFilteredSubCategories(
        subcategories,
        [...getAllProducts(), ...getAllAlkohols()],
        state.activeVirtualSubCategory._id === "alcoholic",
      );

      return (
        <div className={styles.subButtonContainer}>
          {filteredSubCategories.map((subCategory) => (
            <button
              className={`${styles.subButton} ${state.activeSubCategory?._id === subCategory._id ? styles.active : ""}`}
              key={subCategory._id}
              onClick={() => handleSubCategoryClick(subCategory)}
            >
              {localize(subCategory?.name, locale)}
            </button>
          ))}
        </div>
      );
    }
    return null; // Nothing for 'Menu'
  };

  return (
    <div className={styles.wrapper}>
      {/* Hero Section with Video Background */}
      <section className={styles.heroSection} ref={heroRef}>
        <div className={styles.heroVideoContainer} ref={videoContainerRef}>
          <video
            ref={videoRef}
            src="/images/hero.mp4"
            autoPlay
            loop
            muted
            playsInline
            className={styles.heroVideo}
            style={{ opacity: 0, willChange: "transform" }}
          />
          <div className={styles.heroOverlay}></div>
        </div>

        <div className={styles.heroContentWrapper}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              <div className={styles.greetingContainer}>
                <span className={styles.heroTitleLine1} ref={greetingRef}>
                  <span ref={greetingTextRef} className={styles.greetingText}>
                    {greetings[currentGreeting]?.text || "მოგესალმებით"}
                  </span>
                </span>
              </div>
              <span className={styles.heroTitleLine2}>Maitsev Gruusia</span>
            </h1>
            <p className={styles.heroSubtitle}>{t("heroSubtitle")}</p>
            <div
              className={styles.heroButton}
              onClick={() => {
                const menuContainer = document.querySelector(
                  `.${styles.menuContainer}`,
                );
                if (menuContainer) {
                  menuContainer.scrollIntoView({ behavior: "smooth" });
                }
              }}
            >
              <span>{t("heroButtonText")}</span>
              {/* <div className={styles.heroButtonArrow}>↓</div>*/}
            </div>
          </div>
        </div>
      </section>

      {/* Menu Navigation Container */}
      <section className={styles.menuContainer}>
        <div className={styles.menuWrapper}>
          <div className={styles.menuHeader}>
            <h2 className={styles.menuSectionTitle}>{t("celebratingTitle")}</h2>
            <p className={styles.menuSectionSubtitle}>
              {t("celebratingSubtitle")}
            </p>
          </div>

          <div className={styles.navigationContainer}>
            <div className={styles.buttonContainer}>
              {categories.map((category) => (
                <button
                  className={`${styles.mainButton} ${state.activeCategory?._id === category._id ? styles.active : ""}`}
                  key={category._id}
                  onClick={(e) => {
                    e.preventDefault();
                    handleCategoryClick(category);
                  }}
                >
                  {localize(category?.name, locale)}
                </button>
              ))}
            </div>

            {state.activeCategory && renderSubCategories()}

            {state.activeCategory &&
              state.activeVirtualSubCategory &&
              renderFilteredSubCategories()}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className={styles.productsSection}>
        <div className={styles.productsWrapper}>
          <div className={styles.navigationDivider}></div>

          {!loading && isDrinksCategory && (
            <div className={styles.filterRow}>
              <div className={styles.searchContainer}>
                <div className={styles.searchCardWrapper}>
                  <GoSearch className={styles.loupe} />
                  <input
                    type="text"
                    placeholder={t("search")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                </div>
              </div>

              <div className={styles.sortButtonContainer}>
                <button
                  onClick={toggleItemsPerPageMenu}
                  className={styles.sortButton}
                >
                  {itemsPerPage}
                  <IoMdArrowDropdown size={24} className={styles.arrowIcon} />
                </button>
                {itemsPerPageMenuVisible && (
                  <div ref={itemsPerPageMenuRef} className={styles.sortMenu}>
                    {[12, 24, 48, 96].map((value) => (
                      <button
                        key={value}
                        onClick={() => handleItemsPerPageClick(value)}
                        className={styles.sortMenuItem}
                      >
                        {value} {t("goods")}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.sortButtonContainer}>
                <button onClick={toggleSortMenu} className={styles.sortButton}>
                  {t("sorting")}
                  <IoMdArrowDropdown size={24} className={styles.arrowIcon} />
                </button>
                {sortMenuVisible && (
                  <div ref={sortMenuRef} className={styles.sortMenu}>
                    <button
                      onClick={() => handleSortOptionClick("name", "asc")}
                      className={styles.sortMenuItem}
                    >
                      {t("abc")}
                    </button>
                    <button
                      onClick={() => handleSortOptionClick("name", "desc")}
                      className={styles.sortMenuItem}
                    >
                      {t("cba")}
                    </button>
                    <button
                      onClick={() => handleSortOptionClick("price", "asc")}
                      className={styles.sortMenuItem}
                    >
                      {t("123")}
                    </button>
                    <button
                      onClick={() => handleSortOptionClick("price", "desc")}
                      className={styles.sortMenuItem}
                    >
                      {t("321")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Якорь начала списка товаров */}
        <div ref={productsAnchorRef} />

        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        ) : displayItems.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${state.activeCategory?._id}-${state.activeSubCategory?._id || state.activeVirtualSubCategory?._id}`} // Уникальный ключ для анимации
              initial={{ opacity: 0, y: 20 }} // Начальное состояние анимации
              animate={{ opacity: 1, y: 0 }} // Анимация появления
              exit={{ opacity: 0, y: -20 }} // Анимация исчезновения
              transition={{ duration: 0.2 }} // Длительность анимации
            >
              <ProductList
                products={displayItems}
                categories={categories}
                subcategories={subcategories}
                addToCart={handleAddToCart}
                selectedQuantities={selectedQuantities}
                locale={locale}
                t={t}
                isDrinksCategory={isDrinksCategory}
                activeSubCategory={state.activeSubCategory}
                isVisible={isVisible}
                decreaseSelectedQuantity={decreaseSelectedQuantity}
                increaseSelectedQuantity={increaseSelectedQuantity}
                localize={localize}
                productSlug={productSlug}
                categorySlug={state.activeCategory?.slug}
                subcategorySlug={state.activeSubCategory?.slug}
              />
            </motion.div>
          </AnimatePresence>
        ) : (
          <p className={styles.noProductsMessage}>{t("emptyMenu")}</p>
        )}

        {/* Новая пагинация - только для напитков */}
        {isDrinksCategory && pagination && pagination.totalPages > 1 && (
          <div className={styles.pagination}>
            {/* Кнопка "Предыдущая" */}
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className={`${styles.paginationButton} ${pagination.currentPage === 1 ? styles.disabled : ""}`}
            >
              Previous
            </button>

            {/* Номера страниц с умной логикой */}
            {(() => {
              const { currentPage, totalPages } = pagination;
              const maxVisiblePages = 7;
              let pages = [];

              if (totalPages <= maxVisiblePages + 2) {
                // Показываем все страницы если их мало
                pages = Array.from({ length: totalPages }, (_, i) => i + 1);
              } else {
                // Умная пагинация для большого количества страниц
                let startPage = Math.max(2, currentPage - 3);
                let endPage = Math.min(totalPages - 1, currentPage + 3);

                if (currentPage <= 4) {
                  endPage = maxVisiblePages;
                } else if (currentPage >= totalPages - 3) {
                  startPage = totalPages - maxVisiblePages + 1;
                }

                pages = [1];
                if (startPage > 2) pages.push("...");
                for (let i = startPage; i <= endPage; i++) pages.push(i);
                if (endPage < totalPages - 1) pages.push("...");
                if (totalPages > 1) pages.push(totalPages);
              }

              return pages.map((page, index) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${index}`}
                    className={styles.paginationEllipsis}
                  >
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`${styles.paginationButton} ${
                      page === currentPage ? styles.active : ""
                    }`}
                  >
                    {page}
                  </button>
                ),
              );
            })()}

            {/* Кнопка "Следующая" */}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className={`${styles.paginationButton} ${pagination.currentPage === pagination.totalPages ? styles.disabled : ""}`}
            >
              Next
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
