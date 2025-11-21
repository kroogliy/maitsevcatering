"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import "./menunavigation.css";

const MenuNavigation = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const params = useParams();
  const locale = params.locale;
  const validLocale = locale || "et";
  const t = useTranslations("MenuNavigation");

  const menuItems = [
    {
      slug: "pizza",
      title: { et: "Pizza", en: "Pizza", ru: "Пицца" },
      icon: "🍕",
    },
    {
      slug: "burgers",
      title: { et: "Burgerid", en: "Burgers", ru: "Бургеры" },
      icon: "🍔",
    },
    {
      slug: "hot-dogs",
      title: { et: "Hot-dogid", en: "Hot Dogs", ru: "Хот-доги" },
      icon: "🌭",
    },
    {
      slug: "sushi",
      title: { et: "Sushi", en: "Sushi", ru: "Суши" },
      icon: "🍣",
    },
    {
      slug: "pok-bowl",
      title: { et: "Poke Bowl", en: "Poke Bowl", ru: "Поке Боул" },
      icon: "🥗",
    },
    {
      slug: "italian",
      title: { et: "Itaalia köök", en: "Italian", ru: "Итальянская" },
      icon: "🍝",
    },
    {
      slug: "georgian",
      title: { et: "Gruusia köök", en: "Georgian", ru: "Грузинская" },
      icon: "🥟",
    },
    {
      slug: "grill",
      title: { et: "Grill", en: "Grill", ru: "Гриль" },
      icon: "🔥",
    },
    {
      slug: "snacks",
      title: { et: "Suupisted", en: "Snacks", ru: "Закуски" },
      icon: "🥨",
    },
    {
      slug: "desserts",
      title: { et: "Magustoidud", en: "Desserts", ru: "Десерты" },
      icon: "🍰",
    },
  ];

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 120; // Account for header height
      const elementPosition = element.offsetTop - headerHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > 200);

      // Find active section
      const sections = menuItems.map((item) => item.slug);
      let currentSection = "";

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            currentSection = section;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [menuItems]);

  if (!isVisible) return null;

  return (
    <div className="menu-navigation">
      <div className="menu-nav-container">
        {menuItems.map((item) => (
          <button
            key={item.slug}
            className={`menu-nav-item ${activeSection === item.slug ? "active" : ""}`}
            onClick={() => scrollToSection(item.slug)}
            title={item.title[validLocale]}
          >
            <span className="menu-nav-icon">{item.icon}</span>
            <span className="menu-nav-text">{item.title[validLocale]}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MenuNavigation;
