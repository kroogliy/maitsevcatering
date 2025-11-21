"use client";

import React, { useRef, useEffect } from "react";
import { useParams, usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./footer.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const params = useParams();
  const locale = params.locale || "et";
  const pathname = usePathname();
  const footerRef = useRef(null);
  const groupRefs = useRef([]);
  const scrollTriggerRef = useRef([]);

  // Localized content
  const getContent = () => {
    switch (locale) {
      case "ru":
        return {
          logoMain: "Maitsev",
          logoSub: "Gruusia",
          leftTitle:
            "Наш грузинский уголок по адресу Roosikrantsi 23 приветствует вас!",
          leftSubtitle:
            "Открыто ежедневно с 10:00 до 22:00 — зайдите, насладитесь вкусами и позвольте историям Грузии увлечь вас в путешествие",
          rightTitle: "Грузинская кухня с душой, теплом и сердцем",
          rightSubtitle:
            "Загляните в Maitsev Gruusia — попробуйте блюда, насладитесь ароматами и позвольте историям Грузии вести вас за собой",
          copyright: "© 2025 Maitsev Gruusia",
          developed: "Разработано Bronic Labs",
        };
      case "en":
        return {
          logoMain: "Maitsev",
          logoSub: "Gruusia",
          leftTitle: "Our Georgian corner at Roosikrantsi 23 welcomes you",
          leftSubtitle:
            "Open daily from 10:00 to 22:00 — step inside, savor the flavors, and let the stories of Georgia take you on a journey",
          rightTitle: "Georgian cuisine with heart, warmth, and soul",
          rightSubtitle:
            "Step into Maitsev Gruusia — taste the dishes, savor the flavors, and let the stories of Georgia guide you",
          copyright: "© 2025 Maitsev Gruusia",
          developed: "Developed by Bronic Labs",
        };
      default: // 'et'
        return {
          logoMain: "Maitsev",
          logoSub: "Gruusia",
          leftTitle: "Meie Gruusia nurgake Roosikrantsi 23 tervitab teid",
          leftSubtitle:
            "Avatud iga päev kell 10:00–23:00 – astu sisse, maitse maitseid ja lase Gruusia lugudel sind rännakule viia",
          rightTitle: "Gruusia köök südame, soojuse ja hingega",
          rightSubtitle:
            "Astuge sisse Maitsev Gruusia — maitske roogasid, nautige maitseid ja laske Gruusia lugudel end juhtida",
          copyright: "© 2025 Maitsev Gruusia",
          developed: "Arendatud Bronic Labs poolt",
        };
    }
  };

  const content = getContent();

  useEffect(() => {
    const footer = footerRef.current;
    if (!footer) {
      return;
    }

    // Убедимся, что футер видим
    gsap.set(footer, {
      opacity: 1,
      visibility: "visible",
      display: "block",
    });

    // Очищаем предыдущие ScrollTrigger'ы
    scrollTriggerRef.current.forEach((trigger) => {
      if (trigger) trigger.kill();
    });
    scrollTriggerRef.current = [];

    // Сбрасываем начальные стили, но сохраняем видимость
    gsap.set(footer, {
      clearProps: "transform,y,scale",
      opacity: 1,
      visibility: "visible",
    });
    gsap.set("[data-footer-group]", {
      clearProps: "transform,y,scale",
      opacity: 0, // Начальная невидимость для анимации
    });
    gsap.set("[data-logo]", {
      clearProps: "transform,scale",
      opacity: 0, // Начальная невидимость для анимации
    });

    // Fallback для отображения контента если анимации не сработают
    setTimeout(() => {
      const groups = footer.querySelectorAll("[data-footer-group]");
      const logo = footer.querySelector("[data-logo]");

      groups.forEach((group) => {
        if (window.getComputedStyle(group).opacity === "0") {
          gsap.set(group, { opacity: 1 });
        }
      });

      if (logo && window.getComputedStyle(logo).opacity === "0") {
        gsap.set(logo, { opacity: 1 });
      }
    }, 1500);

    // Проверяем, что футер действительно в DOM

    const ctx = gsap.context(() => {
      // Footer reveal - убираем opacity анимацию для самого футера
      gsap.fromTo(
        footer,
        { y: 80 },
        {
          y: 0,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            id: "footer-reveal",
            trigger: footer,
            start: "top 90%",
            once: true,
            onComplete: function () {
              this.kill();
              // Гарантируем видимость после анимации
              gsap.set("[data-footer-group]", { opacity: 1 });
            },
          },
        },
      );

      // Stagger animation for groups
      gsap.fromTo(
        "[data-footer-group]",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            id: "footer-groups",
            trigger: footer,
            start: "top 85%",
            once: true,
            onComplete: function () {
              this.kill();
              // Гарантируем видимость логотипа после анимации
              gsap.set("[data-logo]", { opacity: 1 });
            },
          },
        },
      );

      // Logo animation
      gsap.fromTo(
        "[data-logo]",
        {
          opacity: 0,
          scale: 0.9,
        },
        {
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            id: "footer-logo",
            trigger: footer,
            start: "top 80%",
            once: true,
            onComplete: function () {
              this.kill();
            },
          },
        },
      );

      // Hover effects for buttons
      const phoneBtn = footer.querySelector("[data-phone]");
      const mapBtn = footer.querySelector("[data-map]");

      [phoneBtn, mapBtn].forEach((btn) => {
        if (btn) {
          btn.addEventListener("mouseenter", () => {
            gsap.to(btn, { scale: 1.1, duration: 0.3, ease: "power2.out" });
          });
          btn.addEventListener("mouseleave", () => {
            gsap.to(btn, { scale: 1, duration: 0.3, ease: "power2.out" });
          });
        }
      });

      // Subtle parallax
      const parallaxTrigger = ScrollTrigger.create({
        id: "footer-parallax",
        trigger: footer,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.5,
        animation: gsap.to(footer, {
          y: -20,
          ease: "none",
        }),
      });

      // Сохраняем ссылку на триггер
      scrollTriggerRef.current.push(parallaxTrigger);

      // Форсируем обновление ScrollTrigger
      ScrollTrigger.refresh();
    }, footerRef);

    return () => {
      ctx.revert();
      // Очищаем все ScrollTrigger'ы
      scrollTriggerRef.current.forEach((trigger) => {
        if (trigger) trigger.kill();
      });
      scrollTriggerRef.current = [];
    };
  }, [pathname]); // Переинициализация при навигации

  // Дополнительный эффект для проверки видимости
  useEffect(() => {
    if (footerRef.current) {
      const checkVisibility = () => {
        const footer = footerRef.current;
        if (footer) {
          const styles = window.getComputedStyle(footer);
          if (
            styles.display === "none" ||
            styles.visibility === "hidden" ||
            styles.opacity === "0"
          ) {
            gsap.set(footer, {
              display: "block",
              visibility: "visible",
              opacity: 1,
            });
          }

          // Проверяем также все элементы с data атрибутами
          const footerGroups = footer.querySelectorAll("[data-footer-group]");
          const footerLogo = footer.querySelector("[data-logo]");

          footerGroups.forEach((group) => {
            const groupStyles = window.getComputedStyle(group);
            if (
              groupStyles.opacity === "0" ||
              groupStyles.visibility === "hidden"
            ) {
              gsap.set(group, {
                opacity: 1,
                visibility: "visible",
              });
            }
          });

          if (footerLogo) {
            const logoStyles = window.getComputedStyle(footerLogo);
            if (
              logoStyles.opacity === "0" ||
              logoStyles.visibility === "hidden"
            ) {
              gsap.set(footerLogo, {
                opacity: 1,
                visibility: "visible",
              });
            }
          }
        }
      };

      // Проверяем сразу и через небольшую задержку
      checkVisibility();
      const timer = setTimeout(checkVisibility, 500);
      const timer2 = setTimeout(checkVisibility, 1000);

      return () => {
        clearTimeout(timer);
        clearTimeout(timer2);
      };
    }
  }, [pathname]);

  const handlePhoneCall = () => {
    window.location.href = "tel:+3725023599";
  };

  const handleMapClick = () => {
    window.open(
      "https://maps.google.com/?q=Roosikrantsi+23,+Tallinn,+Estonia",
      "_blank",
    );
  };

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div className={styles.container}>
        {/* Top Section */}
        <div className={styles.topSection}>
          {/* Left Section */}
          <div className={styles.leftSection} data-footer-group>
            <h3 className={styles.sectionTitle}>{content.leftTitle}</h3>
            <div className={styles.middleRow}>
              {/* Empty space to match icons height */}
            </div>
            <p className={styles.sectionSubtitle}>{content.leftSubtitle}</p>
          </div>

          {/* Center Image */}
          <div className={styles.centerImageWrapper} data-center-image>
            <img
              src="/images/footer.jpg"
              alt="Georgian cuisine"
              className={styles.centerImage}
              data-center-img
            />
          </div>

          {/* Right Section */}
          <div className={styles.rightSection} data-footer-group>
            <h3 className={styles.sectionTitle}>{content.rightTitle}</h3>
            <div className={styles.middleRow}>
              <div className={styles.actionButtons}>
                <button
                  className={styles.actionBtn}
                  onClick={handlePhoneCall}
                  data-phone
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </button>

                <button
                  className={styles.actionBtn}
                  onClick={handleMapClick}
                  data-map
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </button>
              </div>
            </div>
            <p className={styles.sectionSubtitle}>{content.rightSubtitle}</p>
          </div>
        </div>

        {/* Logo Section */}
        <div className={styles.logoSection} data-logo>
          <h2 className={styles.logoText}>
            {content.logoMain} {content.logoSub}
          </h2>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          <div className={styles.copyright} data-footer-group>
            {content.copyright}
          </div>
          <div className={styles.developed} data-footer-group>
            <a
              href="https://www.broniclabs.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              {content.developed}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
