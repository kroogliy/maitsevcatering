"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import styles from "./languageswitcher.module.css";

const locales = [
  {
    code: "et",
    label: "EST",
  },
  {
    code: "ru",
    label: "RUS",
  },
  {
    code: "en",
    label: "ENG",
  },
];

const LanguageSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentLocale = useLocale();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(`.${styles.languageSwitcher}`)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("click", handleClickOutside, { passive: true });
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  const changeLocale = (locale) => {
    setIsOpen(false);
    const pathWithoutLocale = pathname.replace(/^\/(et|ru|en)/, "");
    const queryString = searchParams.toString();
    const newUrl = `/${locale}${pathWithoutLocale}${queryString ? `?${queryString}` : ""}`;

    // Force hard navigation to properly reset all animations and states
    window.location.href = newUrl;
  };

  const currentLabel =
    locales.find((l) => l.code === currentLocale)?.label || "Language";

  return (
    <div className={styles.languageSwitcher} data-lang-switcher>
      <button
        className={styles.dropdownButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        type="button"
      >
        <span className={styles.currentLanguage}>{currentLabel}</span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ""}`}
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <ul
        className={`${styles.dropdownMenu} ${isOpen ? styles.open : ""}`}
        role="menu"
      >
        {locales.map(({ code, label }) => (
          <li key={code} role="menuitem">
            <button
              onClick={() => changeLocale(code)}
              className={`${styles.dropdownItem} ${code === currentLocale ? styles.active : ""}`}
              type="button"
            >
              {label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LanguageSwitcher;
