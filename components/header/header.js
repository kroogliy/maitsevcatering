"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCart } from "../../contexts/CartContext";
import gsap from "gsap";
import styles from "./header.module.css";
import LanguageSwitcher from "../languageswitcher/languageswitcher";

export default function Header({ locale }) {
  const [openDropdown, setOpenDropdown] = useState(null);
  const t = useTranslations("Header");
  const { totalCount, handleCartClick } = useCart();
  const closeTimeoutRef = useRef(null);
  const menuDropdownRef = useRef(null);
  const servicesDropdownRef = useRef(null);

  const handleMouseEnter = (menu) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setOpenDropdown(menu);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  // GSAP анимация для menu dropdown
  useEffect(() => {
    if (!menuDropdownRef.current) return;

    if (openDropdown === "menu") {
      gsap.fromTo(
        menuDropdownRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" },
      );
    } else {
      gsap.to(menuDropdownRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [openDropdown]);

  // GSAP анимация для services dropdown
  useEffect(() => {
    if (!servicesDropdownRef.current) return;

    if (openDropdown === "services") {
      gsap.fromTo(
        servicesDropdownRef.current,
        { height: 0, opacity: 0 },
        { height: "auto", opacity: 1, duration: 0.4, ease: "power2.out" },
      );
    } else {
      gsap.to(servicesDropdownRef.current, {
        height: 0,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      });
    }
  }, [openDropdown]);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* Логотип */}
        <Link href={`/${locale}`} className={styles.logo}>
          <img
            src="/images/logo1.png"
            alt="MAITSEV CATERING"
            className={styles.logoImage}
          />
        </Link>

        <nav className={styles.nav}>
          {/* Ссылка 2 - Dropdown Меню */}
          <div
            className={styles.dropdown}
            onMouseEnter={() => handleMouseEnter("menu")}
            onMouseLeave={handleMouseLeave}
          >
            <button className={styles.dropdownButton}>
              {t("menu")}
              <svg
                className={`${styles.arrow} ${openDropdown === "menu" ? styles.arrowOpen : ""}`}
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>

          {/* Ссылка 4 - Dropdown Меню */}
          <div
            className={styles.dropdown}
            onMouseEnter={() => handleMouseEnter("services")}
            onMouseLeave={handleMouseLeave}
          >
            <button className={styles.dropdownButton}>
              {t("catering")}
              <svg
                className={`${styles.arrow} ${openDropdown === "services" ? styles.arrowOpen : ""}`}
                width="12"
                height="8"
                viewBox="0 0 12 8"
                fill="none"
              >
                <path
                  d="M1 1L6 6L11 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </button>
          </div>

          {/* Ссылка 3 - Обычная */}
          <Link href={`/${locale}/about`} className={styles.navLink}>
            {t("aboutUs")}
          </Link>

          <Link href={`/${locale}/contact`} className={styles.navLink}>
            {t("contact")}
          </Link>
        </nav>

        <LanguageSwitcher />

        {/* Корзина */}
        <button
          className={styles.cart}
          onClick={handleCartClick}
          aria-label="Shopping cart"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 2L7.17 4H3C1.9 4 1 4.9 1 6V20C1 21.1 1.9 22 3 22H21C22.1 22 23 21.1 23 20V6C23 4.9 22.1 4 21 4H16.83L15 2H9ZM12 7C15.31 7 18 9.69 18 13C18 16.31 15.31 19 12 19C8.69 19 6 16.31 6 13C6 9.69 8.69 7 12 7Z"
              fill="currentColor"
            />
          </svg>
          {totalCount > 0 && <span className={styles.count}>{totalCount}</span>}
        </button>
      </div>

      {/* Menu Dropdown - выносим из nav для fixed позиционирования */}
      <div
        ref={menuDropdownRef}
        className={styles.menu}
        style={{
          height: 0,
          opacity: 0,
          overflow: "hidden",
          pointerEvents: openDropdown === "menu" ? "auto" : "none",
        }}
        onMouseEnter={() => handleMouseEnter("menu")}
        onMouseLeave={handleMouseLeave}
      >
        <div>
          <Link href={`/${locale}/menu/menu/sushi`} className={styles.menuItem}>
            <div className={styles.menuImage}>
              <img src="/images/menu/menuSushi.webp" alt="Sushi" />
            </div>
            <span className={styles.menuTitle}>{t("menuSushi")}</span>
          </Link>
          <Link
            href={`/${locale}/menu/menu/pok-bowl`}
            className={styles.menuItem}
          >
            <div className={styles.menuImage}>
              <img src="/images/menu/menuPokeBowl.webp" alt="Poke Bowl" />
            </div>
            <span className={styles.menuTitle}>{t("menuPokeBowl")}</span>
          </Link>
          <Link href={`/${locale}/menu/menu/pizza`} className={styles.menuItem}>
            <div className={styles.menuImage}>
              <img src="/images/menu/menuPizza.webp" alt="Pizza" />
            </div>
            <span className={styles.menuTitle}>{t("menuPizza")}</span>
          </Link>
          <Link
            href={`/${locale}/menu/menu/burgers`}
            className={styles.menuItem}
          >
            <div className={styles.menuImage}>
              <img src="/images/menu/menuBurgers.webp" alt="Burgers" />
            </div>
            <span className={styles.menuTitle}>{t("menuBurgers")}</span>
          </Link>
          <Link
            href={`/${locale}/menu/menu/hot-dogs`}
            className={styles.menuItem}
          >
            <div className={styles.menuImage}>
              <img src="/images/menu/menuHotDogs.webp" alt="Hot Dogs" />
            </div>
            <span className={styles.menuTitle}>{t("menuHotDogs")}</span>
          </Link>
          <Link
            href={`/${locale}/menu/menu/italian`}
            className={styles.menuItem}
          >
            <div className={styles.menuImage}>
              <img src="/images/menu/menuItalian.webp" alt="Italian" />
            </div>
            <span className={styles.menuTitle}>{t("menuItalian")}</span>
          </Link>
          <Link
            href={`/${locale}/menu/menu/georgian`}
            className={styles.menuItem}
          >
            <div className={styles.menuImage}>
              <img src="/images/menu/menuGeorgian.webp" alt="Georgian" />
            </div>
            <span className={styles.menuTitle}>{t("menuGeorgian")}</span>
          </Link>
          <Link
            href={`/${locale}/menu/menu/snacks`}
            className={styles.menuItem}
          >
            <div className={styles.menuImage}>
              <img src="/images/menu/menuSnacks.webp" alt="Snacks" />
            </div>
            <span className={styles.menuTitle}>{t("menuSnacks")}</span>
          </Link>
          <Link
            href={`/${locale}/menu/menu/desserts`}
            className={styles.menuItem}
          >
            <div className={styles.menuImage}>
              <img src="/images/menu/menuDesserts.webp" alt="Desserts" />
            </div>
            <span className={styles.menuTitle}>{t("menuDesserts")}</span>
          </Link>
        </div>
      </div>

      {/* Services Dropdown - выносим из nav для fixed позиционирования */}
      <div
        ref={servicesDropdownRef}
        className={styles.menu}
        style={{
          height: 0,
          opacity: 0,
          overflow: "hidden",
          pointerEvents: openDropdown === "services" ? "auto" : "none",
        }}
        onMouseEnter={() => handleMouseEnter("services")}
        onMouseLeave={handleMouseLeave}
      >
        <div>
          <Link
            href={`/${locale}/services/corporate-catering`}
            className={styles.menuItem}
          >
            <div className={styles.menuImage}>
              <img
                src="/images/catering/corporateCatering.jpg"
                alt="Corporate Catering"
              />
            </div>
            <span className={styles.menuTitle}>{t("corporateCatering")}</span>
          </Link>
          <Link
            href={`/${locale}/services/contract-catering`}
            className={styles.menuItem}
          >
            <div className={styles.menuImage}>
              <img
                src="/images/catering/contractCatering.jpg"
                alt="Contract Catering"
              />
            </div>
            <span className={styles.menuTitle}>{t("contractCatering")}</span>
          </Link>
          <Link
            href={`/${locale}/services/event-catering`}
            className={styles.menuItem}
          >
            <div className={styles.menuImage}>
              <img
                src="/images/catering/eventCatering.jpg"
                alt="Event Catering"
              />
            </div>
            <span className={styles.menuTitle}>{t("eventCatering")}</span>
          </Link>
          <Link
            href={`/${locale}/services/wedding-catering`}
            className={styles.menuItem}
          >
            <div className={styles.menuImage}>
              <img
                src="/images/catering/weddingCatering.jpg"
                alt="Wedding Catering"
              />
            </div>
            <span className={styles.menuTitle}>{t("weddingCatering")}</span>
          </Link>
          <Link
            href={`/${locale}/catering/popup-catering`}
            className={styles.menuItem}
          >
            <div className={styles.menuImage}>
              <img
                src="/images/catering/popupCatering.jpg"
                alt="Pop-up Catering"
              />
            </div>
            <span className={styles.menuTitle}>{t("popUpCatering")}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
