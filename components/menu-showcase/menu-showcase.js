"use client";
import React, { useRef, useEffect, useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useProducts } from "../../contexts/ProductsContext";
import "./menu-showcase.css";

gsap.registerPlugin(ScrollTrigger);

export default function MenuShowcase() {
  const params = useParams();
  const locale = params.locale || "et";
  const router = useRouter();

  const sectionRef = useRef(null);
  const menuSectionRef = useRef(null);
  const foodSectionRef = useRef(null);
  const wineSectionRef = useRef(null);
  const numberRef = useRef(null);
  const buttonEventHandlersRef = useRef([]);
  const originalButtonTextsRef = useRef({});

  // Use ProductsContext
  const {
    getProductsBySlug,
    getAlkoholsBySlug,
    getAllAlkohols,
    loading,
    loaded,
    getLocalizedText,
  } = useProducts();

  // Featured dishes slugs
  const featuredDishSlugs = useMemo(
    () => [
      "chkmeruli",
      "khachapuri",
      "ojakhuri",
      "kubdari",
      "khinkali",
      "chakhokhbili",
    ],
    [],
  );

  // Featured wines slugs
  const featuredWineSlugs = useMemo(
    () => [
      "teliani-valley-glekhuri-rkatsiteli-qvevri-75cl",
      "marani-tvishi-11-0-75l",
      "marani-kindzmarauli-11-5-0-75l",
      "nanati-kindzmarauli-red-medium-sweet-2023-75-null",
      "nanati-khvanchkara-2021-75-null",
      "georgian-valleys-kindzmarauli-red-75-cl",
    ],
    [],
  );

  // Localized content
  const getContent = () => {
    switch (locale) {
      case "ru":
        return {
          number: "02",
          foodTitle: "Грузинская",
          foodSubtitle: "кухня",
          wineTitle: "Грузинские",
          wineSubtitle: "вина",
          foodButton: "Открыть меню",
          wineButton: "Выбрать вино",
        };
      case "en":
        return {
          number: "02",
          foodTitle: "Georgian",
          foodSubtitle: "cuisine",
          wineTitle: "Georgian",
          wineSubtitle: "wines",
          foodButton: "Open menu",
          wineButton: "Select wine",
        };
      default: // 'et'
        return {
          number: "02",
          foodTitle: "Gruusia",
          foodSubtitle: "köök",
          wineTitle: "Gruusia",
          wineSubtitle: "veinid",
          foodButton: "Ava menüü",
          wineButton: "Vali vein",
        };
    }
  };

  const content = getContent();

  // Get products using context
  const georgianDishes = useMemo(() => {
    if (!loaded) return [];
    const dishes = getProductsBySlug(featuredDishSlugs);
    return dishes.slice(0, 6);
  }, [loaded, getProductsBySlug, featuredDishSlugs]);

  const wines = useMemo(() => {
    if (!loaded) return [];
    const wineProducts = getAlkoholsBySlug(featuredWineSlugs);
    return wineProducts.slice(0, 6);
  }, [loaded, getAlkoholsBySlug, featuredWineSlugs]);

  // GSAP Animations
  useEffect(() => {
    if (!loaded) return;

    const ctx = gsap.context(() => {
      // Number animation for food section
      gsap.fromTo(
        numberRef.current,
        {
          opacity: 0,
          scale: 0.5,
          x: -50,
        },
        {
          opacity: 1,
          scale: 1,
          x: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: foodSectionRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        },
      );

      // Title animations
      const animateTitles = (trigger, selector) => {
        const titleElements = gsap.utils.toArray(
          `${selector} .title-first-line, ${selector} .title-second-line`,
        );

        titleElements.forEach((el, index) => {
          // Check if already split into characters
          if (!el.querySelector("span")) {
            const text = el.textContent;
            el.innerHTML = text
              .split("")
              .map(
                (char) =>
                  `<span style="display: inline-block;">${char === " " ? "&nbsp;" : char}</span>`,
              )
              .join("");
          }

          const chars = el.querySelectorAll("span");

          gsap.fromTo(
            chars,
            {
              opacity: 0,
              y: 100,
              rotationX: -90,
              transformOrigin: "center bottom",
            },
            {
              opacity: 1,
              y: 0,
              rotationX: 0,
              duration: 1,
              stagger: 0.02,
              ease: "power3.out",
              scrollTrigger: {
                trigger: trigger,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            },
          );
        });
      };

      animateTitles(foodSectionRef.current, ".food-section");

      // Food items animation - only once
      gsap.fromTo(
        ".food-item",
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: foodSectionRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );

      // Создание анимированного фона с волновым эффектом
      const backgroundOverlay = document.createElement("div");
      backgroundOverlay.className = "animated-bg-overlay";
      backgroundOverlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #780116;
        z-index: 0;
        clip-path: circle(0% at 50% 0%);
        will-change: clip-path;
        pointer-events: none;
      `;
      menuSectionRef.current.insertBefore(
        backgroundOverlay,
        menuSectionRef.current.firstChild,
      );

      // Установка начальных стилей
      gsap.set(menuSectionRef.current, {
        position: "relative",
        background: "#f9edda",
        overflow: "hidden",
      });

      // Убеждаемся что контент выше overlay
      gsap.set([foodSectionRef.current, wineSectionRef.current], {
        position: "relative",
        zIndex: 10,
      });

      // Установка начальных цветов текста (светлая тема)
      gsap.set(
        ".menu-showcase-section .item-name, .menu-showcase-section .showcase-title span",
        {
          color: "#1a1a1a",
        },
      );

      gsap.set(".menu-showcase-section .showcase-button", {
        backgroundColor: "#C9A66B",
        borderColor: "#1a1a1a",
        color: "#1a1a1a",
      });

      // Создание master timeline для анимированной смены
      const masterTimeline = gsap.timeline({ paused: true });

      masterTimeline
        // Анимация фона - волна от верха к низу
        .to(backgroundOverlay, {
          clipPath: "circle(150% at 50% 0%)",
          duration: 1.5,
          ease: "power2.inOut",
        })
        // Смена цветов текста
        .to(
          ".menu-showcase-section .item-name, .menu-showcase-section .showcase-title span",
          {
            color: "#ffffff",
            duration: 1,
            ease: "power2.out",
          },
          0.3,
        )
        // Смена цветов кнопки
        .to(
          ".menu-showcase-section .showcase-button",
          {
            backgroundColor: "#fff",
            borderColor: "#1a1a1a",
            color: "#1a1a1a",
            duration: 1,
            ease: "power2.out",
          },
          0.5,
        );

      // Pre-process wine section titles immediately to prevent FOUC
      const preprocessTitles = (container) => {
        const titles = container.querySelectorAll(".showcase-title span");
        titles.forEach((el) => {
          // Check if already processed
          if (el.querySelector("span")) return;

          const text = el.textContent;
          el.innerHTML = text
            .split("")
            .map(
              (char) =>
                `<span style="display: inline-block;">${char === " " ? "&nbsp;" : char}</span>`,
            )
            .join("");

          // Hide the characters initially
          const chars = el.querySelectorAll("span");
          gsap.set(chars, {
            opacity: 0,
            y: 100,
            rotationX: -90,
            transformOrigin: "center bottom",
          });
        });
      };

      // Process wine titles immediately
      preprocessTitles(wineSectionRef.current);

      // Wine title animation - only once
      const wineTitleAnimated = { value: false };
      ScrollTrigger.create({
        trigger: wineSectionRef.current,
        start: "top 80%",
        once: true,
        onEnter: () => {
          if (!wineTitleAnimated.value) {
            wineTitleAnimated.value = true;
            // Animate the pre-processed wine titles
            const wineTitles = wineSectionRef.current.querySelectorAll(
              ".showcase-title span",
            );
            wineTitles.forEach((el) => {
              const chars = el.querySelectorAll("span");
              gsap.to(chars, {
                opacity: 1,
                y: 0,
                rotationX: 0,
                duration: 1,
                stagger: 0.02,
                ease: "power3.out",
              });
            });
          }
        },
      });

      // Контроллированная анимация для двух блоков
      ScrollTrigger.create({
        trigger: wineSectionRef.current, // Второй блок как триггер
        start: "top bottom", // Когда второй блок начинает появляться (скролл вниз)
        end: "top top", // Когда второй блок полностью виден
        scrub: 1.5,
        animation: masterTimeline,
        onUpdate: (self) => {
          // Дополнительный контроль для реверса
          const progress = self.progress;
          if (self.direction === -1 && progress < 0.1) {
            // При скролле вверх и возврате к первому блоку
            masterTimeline.progress(0);
          }
        },
      });

      // Wine items animation - only once
      gsap.fromTo(
        ".wine-item",
        {
          opacity: 0,
          y: 50,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: wineSectionRef.current,
            start: "top 80%",
            once: true,
          },
        },
      );

      // Clean up previous event handlers
      buttonEventHandlersRef.current.forEach(({ element, handlers }) => {
        handlers.forEach(({ event, handler }) => {
          element.removeEventListener(event, handler);
        });
      });
      buttonEventHandlersRef.current = [];

      // Add wave effect to showcase buttons after they render
      setTimeout(() => {
        const showcaseButtons = document.querySelectorAll(".showcase-button");
        showcaseButtons.forEach((button, index) => {
          // Store original text if not already stored
          const buttonKey = `button-${index}`;
          if (!originalButtonTextsRef.current[buttonKey]) {
            originalButtonTextsRef.current[buttonKey] =
              button.textContent.trim();
          }

          // Check if structure already exists by looking for text-original
          if (!button.querySelector(".text-original")) {
            const originalText = originalButtonTextsRef.current[buttonKey];

            // Create letter spans for both original and hover text
            const createLetterSpans = (text) => {
              return text
                .split("")
                .map(
                  (letter) =>
                    `<span class="letter" style="display: inline-block; transition: none;">${letter === " " ? "&nbsp;" : letter}</span>`,
                )
                .join("");
            };

            button.innerHTML = `
              <span style="position: relative; display: block; overflow: hidden; height: 1.2em;">
                <span class="text-original" style="display: block; position: relative;">
                  ${createLetterSpans(originalText)}
                </span>
                <span class="text-hover" style="display: block; position: absolute; top: 0; left: 0; width: 100%; text-align: center;">
                  ${createLetterSpans(originalText)}
                </span>
              </span>
            `;

            const originalLetters = button.querySelectorAll(
              ".text-original .letter",
            );
            const hoverLetters = button.querySelectorAll(".text-hover .letter");

            // Set initial positions
            gsap.set(hoverLetters, { yPercent: 100 });
          } else {
            // Structure exists, just get the elements and reset positions
            const originalLetters = button.querySelectorAll(
              ".text-original .letter",
            );
            const hoverLetters = button.querySelectorAll(".text-hover .letter");

            // Reset positions
            gsap.set(originalLetters, { yPercent: 0 });
            gsap.set(hoverLetters, { yPercent: 100 });
          }

          // Get elements for animation (whether newly created or existing)
          const originalLetters = button.querySelectorAll(
            ".text-original .letter",
          );
          const hoverLetters = button.querySelectorAll(".text-hover .letter");

          const handleMouseEnter = () => {
            // Lift button up
            gsap.to(button, {
              y: -10,
              duration: 0.1,
              ease: "power2.inOut",
            });

            // Animate original letters up with wave effect
            gsap.to(originalLetters, {
              yPercent: -100,
              duration: 0.4,
              stagger: {
                each: 0.03,
                from: "start",
              },
              ease: "power2.inOut",
            });

            // Animate hover letters in with wave effect
            gsap.to(hoverLetters, {
              yPercent: 0,
              duration: 0.4,
              stagger: {
                each: 0.03,
                from: "start",
              },
              ease: "power2.inOut",
            });
          };

          const handleMouseLeave = () => {
            // Return button to original position
            gsap.to(button, {
              y: 0,
              duration: 0.3,
              ease: "power2.out",
            });

            // Return original letters with wave effect
            gsap.to(originalLetters, {
              yPercent: 0,
              duration: 0.4,
              stagger: {
                each: 0.03,
                from: "end",
              },
              ease: "power2.inOut",
            });

            // Hide hover letters with wave effect
            gsap.to(hoverLetters, {
              yPercent: 100,
              duration: 0.4,
              stagger: {
                each: 0.03,
                from: "end",
              },
              ease: "power2.inOut",
            });
          };

          // Add event listeners
          button.addEventListener("mouseenter", handleMouseEnter);
          button.addEventListener("mouseleave", handleMouseLeave);

          // Store handlers for cleanup
          buttonEventHandlersRef.current.push({
            element: button,
            handlers: [
              { event: "mouseenter", handler: handleMouseEnter },
              { event: "mouseleave", handler: handleMouseLeave },
            ],
          });
        });
      }, 1000); // Wait for buttons to render
    }, sectionRef);

    return () => {
      ctx.revert();

      // Clean up event handlers
      buttonEventHandlersRef.current.forEach(({ element, handlers }) => {
        handlers.forEach(({ event, handler }) => {
          element.removeEventListener(event, handler);
        });
      });
      buttonEventHandlersRef.current = [];

      // Clean up button animations
      const showcaseButtons = document.querySelectorAll(".showcase-button");
      showcaseButtons.forEach((button) => {
        const letters = button.querySelectorAll(".letter");
        if (letters.length > 0) {
          gsap.killTweensOf(letters);
          gsap.killTweensOf(button);
        }
      });
    };
  }, [loaded]);

  const handleFoodClick = () => {
    router.push(`/${locale}/menu/menu/georgian`);
  };

  const handleWineClick = () => {
    router.push(`/${locale}/menu/drinks/wines`);
  };

  // Навигация к конкретному товару
  const handleProductClick = (product) => {
    if (!product) return;

    // Получаем slug'и из объектов категории и подкатегории
    const categorySlug = product.category?.slug || "menu";
    const subcategorySlug = product.subcategory?.slug || "georgian";
    const productSlug = product.slug;

    if (productSlug && categorySlug && subcategorySlug) {
      router.push(
        `/${locale}/menu/${categorySlug}/${subcategorySlug}/${productSlug}`,
      );
    }
  };

  if (!loaded) {
    return <div className="menu-showcase-loading">Loading...</div>;
  }

  return (
    <section ref={sectionRef} className="menu-showcase-section">
      <div ref={menuSectionRef} className="menu-showcase-wrapper">
        {/* Food Section */}
        <div ref={foodSectionRef} className="food-section showcase-subsection">
          <div className="showcase-container">
            <div className="showcase-content">
              <div ref={numberRef} className="showcase-number">
                {content.number}
              </div>
              <div className="showcase-content-group">
                <h2 className="showcase-title">
                  <span className="title-first-line">{content.foodTitle}</span>
                  <span className="title-second-line">
                    {content.foodSubtitle}
                  </span>
                </h2>

                <div className="food-grid">
                  {georgianDishes.length > 0 ? (
                    georgianDishes.map((dish, index) => {
                      // Handle dish images - can be array or string
                      let imageUrl = "/images/placeholder.jpg";
                      if (
                        Array.isArray(dish.images) &&
                        dish.images.length > 0
                      ) {
                        imageUrl = dish.images[0];
                      } else if (typeof dish.images === "string") {
                        imageUrl = dish.images;
                      } else if (dish.image) {
                        imageUrl = dish.image;
                      }

                      const dishTitle = getLocalizedText(dish.title, locale);

                      return (
                        <div
                          key={dish._id || dish.slug || index}
                          className="food-item"
                          onClick={() => handleProductClick(dish)}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="item-image-wrapper">
                            <img
                              src={imageUrl}
                              alt={dishTitle}
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = "/images/placeholder.jpg";
                              }}
                            />
                          </div>
                          <h3 className="item-name">{dishTitle}</h3>
                        </div>
                      );
                    })
                  ) : (
                    <p>No dishes available</p>
                  )}
                </div>

                <button className="showcase-button" onClick={handleFoodClick}>
                  {content.foodButton}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Wine Section */}
        <div ref={wineSectionRef} className="wine-section showcase-subsection">
          <div className="showcase-container">
            <div className="showcase-content">
              <div className="showcase-number" style={{ visibility: "hidden" }}>
                02
              </div>
              <div className="showcase-content-group">
                <h2 className="showcase-title">
                  <span className="title-first-line">{content.wineTitle}</span>
                  <span className="title-second-line">
                    {content.wineSubtitle}
                  </span>
                </h2>

                <div className="wine-grid">
                  {wines.length > 0 ? (
                    wines.map((wine, index) => {
                      // Handle wine images - it's a string, not array
                      const wineImageUrl =
                        wine.images ||
                        wine.image ||
                        "/images/placeholder-wine.jpg";

                      const wineName = getLocalizedText(
                        wine.name || wine.title,
                        locale,
                      );

                      return (
                        <div
                          key={wine._id || wine.slug || index}
                          className="wine-item"
                          onClick={() => handleProductClick(wine)}
                          style={{ cursor: "pointer" }}
                        >
                          <div className="item-image-wrapper">
                            <img
                              src={wineImageUrl}
                              alt={wineName}
                              loading="lazy"
                              onError={(e) => {
                                e.target.src = "/images/placeholder-wine.jpg";
                              }}
                            />
                          </div>
                          <h3 className="item-name">{wineName}</h3>
                        </div>
                      );
                    })
                  ) : (
                    <p className="no-wines-message">Loading wines...</p>
                  )}
                </div>

                <button className="showcase-button" onClick={handleWineClick}>
                  {content.wineButton}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
