"use client";
import React, { useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./menu-section.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function MenuSection() {
  const params = useParams();
  const locale = params.locale || "et";
  const sectionRef = useRef(null);
  const centerImageRef = useRef(null);
  const mosaicRef = useRef(null);

  // Button handlers
  const handleMenuClick = () => {
    window.location.href = `/${locale}/menu/menu/georgian`;
  };

  const handleAlcoholClick = () => {
    window.location.href = `/${locale}/menu/drinks/wine`;
  };

  // Localized content
  const getContent = () => {
    switch (locale) {
      case "ru":
        return {
          text: "Наш ресторан — это место, где вино хранит душу грузинской земли, а кухня раскрывает её богатство и щедрость. Мы собрали лучшие блюда, создали коллекцию вин, чтобы каждый гость почувствовал: Грузия — это праздник, который начинается за столом.",
          buttonText: "Смотреть меню",
        };
      case "en":
        return {
          text: "Our restaurant is a place where wine preserves the soul of Georgia, and cuisine reveals its richness and generosity. We have gathered the best dishes and created a wine collection so that every guest can feel that Georgia is a celebration that begins at the table.",
          buttonText: "View menu",
        };
      default: // 'et'
        return {
          text: "Meie restoran on koht, kus vein hoiab Gruusia maa hinge ja köök avab selle rikkuse ja helduse. Oleme kogunud parimad roogad ja loonud veinikollektsiooni, et iga külaline tunneks: Gruusia on pidu, mis algab laua taga.",
          buttonText: "Vaata menüüd",
        };
    }
  };

  const content = getContent();

  // Images for grid layout - exactly as specified
  const gridImages = {
    // LEFT SIDE
    col1: { id: 1, src: "/images/slideone.jpg", alt: "Dish 1", type: "tall" }, // 2 rows
    col2Top: {
      id: 2,
      src: "/images/slideseven.jpg",
      alt: "Dish 2",
      type: "top60",
    }, // 60%
    col2Bottom: {
      id: 3,
      src: "/images/slideten.jpg",
      alt: "Dish 3",
      type: "bottom40",
    }, // 40%
    // RIGHT SIDE
    col3Top: {
      id: 4,
      src: "/images/slidetwo.jpg",
      alt: "Dish 4",
      type: "top40",
    }, // 40%
    col3Bottom: {
      id: 5,
      src: "/images/bgtwo.jpg",
      alt: "Dish 5",
      type: "bottom60",
    }, // 60%
    col4: { id: 6, src: "/images/bgfour.jpg", alt: "Dish 6", type: "tall" }, // 2 rows
  };

  // Center image
  const centerImage = { src: "/images/bgone.jpg", alt: "Main Dish" };

  // Function to add wave effect to buttons
  const addWaveEffect = (button) => {
    const originalText = button.textContent;

    // Create wrapper structure
    button.innerHTML = `
      <span style="position: relative; display: block; overflow: hidden; height: 1.2em;">
        <span class="text-original" style="display: block; position: relative;">${originalText}</span>
        <span class="text-hover" style="display: block; position: absolute; top: 0; left: 0; width: 100%; text-align: center;">${originalText}</span>
      </span>
    `;

    const textOriginal = button.querySelector(".text-original");
    const textHover = button.querySelector(".text-hover");

    // Set initial position
    gsap.set(textHover, { yPercent: 100 });

    // Add hover animation
    button.addEventListener("mouseenter", () => {
      gsap.to(textOriginal, {
        yPercent: -100,
        duration: 0.3,
        ease: "power2.inOut",
      });
      gsap.to(textHover, {
        yPercent: 0,
        duration: 0.3,
        ease: "power2.inOut",
      });
    });
  };

  useEffect(() => {
    if (!sectionRef.current || !mosaicRef.current || !centerImageRef.current) {
      return;
    }

    // Kill all existing ScrollTriggers on unmount
    const killScrollTriggers = () => {
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars && trigger.vars.id === "menu-mosaic") {
          trigger.kill();
        }
      });
    };

    // Kill existing before creating new
    killScrollTriggers();

    // Check if chefs mastery section is ready
    let chefsMasteryReady = false;

    const handleChefsMasteryReady = (event) => {
      chefsMasteryReady = true;
      window.removeEventListener("chefsMasteryReady", handleChefsMasteryReady);
    };

    window.addEventListener("chefsMasteryReady", handleChefsMasteryReady);

    // Wait for Lenis to initialize
    const waitForLenis = () => {
      if (window.lenis && window.lenis.scroll !== undefined) {
        // Wait for ChefsMastery to be ready or timeout
        const checkReadyAndInit = () => {
          if (chefsMasteryReady || document.readyState === "complete") {
            // Force a refresh to ensure all positions are calculated correctly
            ScrollTrigger.refresh();

            // Use IntersectionObserver to detect when section is actually approaching viewport
            const observer = new IntersectionObserver(
              (entries) => {
                entries.forEach((entry) => {
                  if (entry.isIntersecting) {
                    observer.disconnect();
                    window.menuSectionObserver = null;

                    // Small delay to ensure everything is settled
                    setTimeout(() => {
                      initAnimation();
                    }, 100);
                  }
                });
              },
              {
                rootMargin: "200px 0px", // Start observing 200px before element enters viewport
                threshold: 0,
              },
            );

            // Store observer reference for cleanup
            window.menuSectionObserver = observer;
            observer.observe(sectionRef.current);
          } else {
            setTimeout(checkReadyAndInit, 100);
          }
        };

        checkReadyAndInit();
      } else {
        setTimeout(waitForLenis, 50);
      }
    };

    const initAnimation = () => {
      // Force ScrollTrigger refresh before starting
      ScrollTrigger.refresh();

      const ctx = gsap.context(() => {
        // Animate text
        const textElement = sectionRef.current.querySelector(`.${styles.text}`);
        if (textElement) {
          const originalText =
            textElement.textContent || textElement.innerText || "";
          const cleanText = originalText.trim();

          // Clear and recreate word spans
          const words = cleanText
            .split(" ")
            .filter((word) => word.length > 0)
            .map(
              (word) =>
                `<span style="display: inline-block; overflow: hidden;"><span style="display: inline-block;">${word}</span></span>`,
            );
          textElement.innerHTML = words.join(" ");

          const wordSpans = textElement.querySelectorAll("span > span");

          // Create timeline with scroll trigger
          const textTl = gsap.timeline({
            scrollTrigger: {
              trigger: sectionRef.current.querySelector(
                `.${styles.textSection}`,
              ),
              start: "top 80%",
              once: true,
            },
          });

          // Animate words
          textTl.fromTo(
            wordSpans,
            {
              y: 30,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.5,
              stagger: 0.02,
              ease: "power2.out",
            },
          );
        }

        // Check if mobile/tablet
        const isMobile = window.matchMedia("(max-width: 1024px)").matches;

        // Get the actual position of the trigger element
        const triggerRect = mosaicRef.current.getBoundingClientRect();
        const triggerTop = triggerRect.top + window.pageYOffset;

        // Create mosaic animation with conditional pin
        const tl = gsap.timeline({
          scrollTrigger: {
            id: "menu-mosaic",
            trigger: mosaicRef.current,
            start: isMobile ? "top 80%" : "top 15%",
            end: isMobile ? "bottom 20%" : "+=100%",
            scrub: isMobile ? false : 0,
            pin: !isMobile,
            anticipatePin: isMobile ? 0 : 1,
            pinSpacing: !isMobile,
            invalidateOnRefresh: true,
            markers: false, // Установите true для отладки
            refreshPriority: -10, // Very low priority to ensure it runs after all other sections
            onEnter: isMobile ? () => tl.play() : undefined,
            onLeaveBack: isMobile ? () => tl.reverse() : undefined,
            onRefresh: (self) => {
              // Double-check the trigger position after refresh
              const newRect = self.trigger.getBoundingClientRect();
              const newTop = newRect.top + window.pageYOffset;
            },
            onUpdate: (self) => {
              // Log only significant updates to debug early triggering
              if (self.progress > 0 && self.progress < 0.1) {
              }
            },
          },
        });

        // Set higher z-index for center image before animations
        tl.set(centerImageRef.current, {
          zIndex: 100,
        });

        // Animate all side images simultaneously (skip on mobile)
        if (!isMobile) {
          tl.to("[data-left-image]", {
            x: "-40vw",
            duration: 0.2,
            ease: "power2.inOut",
            zIndex: 10,
          });

          tl.to(
            "[data-right-image]",
            {
              x: "40vw",
              duration: 0.2,
              ease: "power2.inOut",
              zIndex: 10,
            },
            "<",
          );
        }

        // Expand center image (different for mobile)
        if (isMobile) {
          // Simple scale animation for mobile
          tl.to(centerImageRef.current, {
            scale: 1.05,
            duration: 1,
            ease: "power2.out",
          });
        } else {
          // Set initial state explicitly before animation
          gsap.set(centerImageRef.current, {
            position: "absolute",
            left: "50%",
            top: "50%",
            xPercent: -50,
            yPercent: -50,
            width: "100%",
            height: "100%",
          });

          // Full expansion for desktop
          tl.to(
            centerImageRef.current,
            {
              width: "calc(100vw - 0.8rem)",
              borderRadius: 0,
              duration: 1,
              delay: 0.6,
              ease: "power2.inOut",
            },
            "-=0.8",
          );
        }

        // Fade in overlay content
        tl.fromTo(
          "[data-overlay-content]",
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
          },
          "-=0.5",
        );

        // Add wave effect to overlay buttons after they appear
        setTimeout(() => {
          const overlayButtons = document.querySelectorAll(
            `.${styles.overlayButton}`,
          );
          overlayButtons.forEach((button) => {
            if (!button.querySelector(".text-original")) {
              const originalText = button.textContent.trim();

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
              const hoverLetters = button.querySelectorAll(
                ".text-hover .letter",
              );

              // Set initial positions
              gsap.set(hoverLetters, { yPercent: 100 });

              button.addEventListener("mouseenter", () => {
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
              });

              button.addEventListener("mouseleave", () => {
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
              });
            }
          });
        }, 2000); // Wait for animation to complete
      }, sectionRef);

      // Safely refresh ScrollTrigger after context is created
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (typeof ScrollTrigger !== "undefined" && ScrollTrigger.refresh) {
            ScrollTrigger.refresh();
          }
        }, 300);
      });

      // Additional refresh after animation is fully initialized
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 500);
    };

    // Start initialization
    waitForLenis();

    return () => {
      killScrollTriggers();
      window.removeEventListener("chefsMasteryReady", handleChefsMasteryReady);

      // Clean up any observers if they exist
      if (window.menuSectionObserver) {
        window.menuSectionObserver.disconnect();
        window.menuSectionObserver = null;
      }
    };
  }, [locale]);

  // Additional effect to handle page load and refresh ScrollTrigger
  useEffect(() => {
    // Check if this is initial page load
    const handleLoad = () => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (typeof ScrollTrigger !== "undefined" && ScrollTrigger.refresh) {
            ScrollTrigger.refresh();
          }
        }, 400);
      });
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    // Also refresh on window resize
    const handleResize = () => {
      // Дополнительный refresh после полной загрузки
      requestAnimationFrame(() => {
        if (typeof ScrollTrigger !== "undefined" && ScrollTrigger.refresh) {
          ScrollTrigger.refresh();
        }
      });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Separate effect for delayed refresh
  useEffect(() => {
    const refreshTimer = setTimeout(() => {
      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.refresh();
        ScrollTrigger.sort();
      }
    }, 2000);

    return () => clearTimeout(refreshTimer);
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      {/* Text Section */}
      <div className={styles.textSection}>
        <div className={styles.content} data-content>
          <p className={styles.text}>{content.text}</p>
          {/* <button className={styles.button}>
            {content.buttonText}
          </button>*/}
        </div>
      </div>

      {/* Mosaic Section */}
      <div ref={mosaicRef} className={styles.mosaicSection}>
        <div className={styles.mosaicWrapper}>
          {/* Grid Layout */}
          <div className={styles.gridContainer}>
            {/* Column 1 - Single tall image */}
            <div
              className={`${styles.gridImage} ${styles.col1}`}
              data-left-image
            >
              <img
                src={gridImages.col1.src}
                alt={gridImages.col1.alt}
                loading="lazy"
                onError={(e) => {
                  e.target.src = "/images/placeholder.jpg";
                }}
              />
            </div>

            {/* Column 2 - Two images 60/40 */}
            <div className={styles.col2}>
              <div
                className={`${styles.gridImage} ${styles.top60}`}
                data-left-image
              >
                <img
                  src={gridImages.col2Top.src}
                  alt={gridImages.col2Top.alt}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "/images/placeholder.jpg";
                  }}
                />
              </div>
              <div
                className={`${styles.gridImage} ${styles.bottom40}`}
                data-left-image
              >
                <img
                  src={gridImages.col2Bottom.src}
                  alt={gridImages.col2Bottom.alt}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "/images/placeholder.jpg";
                  }}
                />
              </div>
            </div>

            {/* Center Image Container */}
            <div className={styles.centerImageWrapper}>
              <div
                ref={centerImageRef}
                className={styles.centerImage}
                data-center-image
              >
                <img
                  src={centerImage.src}
                  alt={centerImage.alt}
                  loading="eager"
                  onError={(e) => {
                    e.target.src = "/images/placeholder.jpg";
                  }}
                />

                {/* Overlay Content - Initially Hidden */}
                <div className={styles.overlayContent} data-overlay-content>
                  <h2 className={styles.overlayTitle}>მოგესალმებით</h2>
                  <div className={styles.overlayButtons}>
                    <button
                      className={styles.overlayButton}
                      onClick={handleMenuClick}
                    >
                      {locale === "ru"
                        ? "Меню"
                        : locale === "en"
                          ? "Menu"
                          : "Menüü"}
                    </button>
                    <button
                      className={styles.overlayButton}
                      onClick={handleAlcoholClick}
                    >
                      {locale === "ru"
                        ? "Вино"
                        : locale === "en"
                          ? "Wine"
                          : "Vein"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3 - Two images 40/60 */}
            <div className={styles.col3}>
              <div
                className={`${styles.gridImage} ${styles.top40}`}
                data-right-image
              >
                <img
                  src={gridImages.col3Top.src}
                  alt={gridImages.col3Top.alt}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "/images/placeholder.jpg";
                  }}
                />
              </div>
              <div
                className={`${styles.gridImage} ${styles.bottom60}`}
                data-right-image
              >
                <img
                  src={gridImages.col3Bottom.src}
                  alt={gridImages.col3Bottom.alt}
                  loading="lazy"
                  onError={(e) => {
                    e.target.src = "/images/placeholder.jpg";
                  }}
                />
              </div>
            </div>

            {/* Column 4 - Single tall image */}
            <div
              className={`${styles.gridImage} ${styles.col4}`}
              data-right-image
            >
              <img
                src={gridImages.col4.src}
                alt={gridImages.col4.alt}
                loading="lazy"
                onError={(e) => {
                  e.target.src = "/images/placeholder.jpg";
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
