"use client";

import React, { useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./service.module.css";
import { useProducts } from "../../contexts/ProductsContext";

import { TfiEmail } from "react-icons/tfi";
import { CiPhone } from "react-icons/ci";

gsap.registerPlugin(ScrollTrigger);

// Создаем изолированный контекст для service.js
const SERVICE_CONTEXT = "services-page";

export default function AboutUs() {
  const params = useParams();
  const t = useTranslations("AboutUs");

  // Рефы для объединенной секции
  const mainWrapperRef = useRef(null);
  const firstImageContainerRef = useRef(null);
  const secondImageContainerRef = useRef(null);
  const firstTextBlockRef = useRef(null);
  const secondTextBlockRef = useRef(null);
  const serviceTriggersRef = useRef([]);

  useEffect(() => {
    // Получаем элементы
    const mainWrapper = mainWrapperRef.current;
    const firstImageContainer = firstImageContainerRef.current;
    const secondImageContainer = secondImageContainerRef.current;
    const firstTextBlock = firstTextBlockRef.current;
    const secondTextBlock = secondTextBlockRef.current;

    // Проверка всех элементов
    if (
      !mainWrapper ||
      !firstImageContainer ||
      !secondImageContainer ||
      !firstTextBlock ||
      !secondTextBlock
    ) {
      return;
    }

    // Очищаем предыдущие триггеры если они есть
    serviceTriggersRef.current.forEach((trigger) => {
      if (trigger) {
        trigger.kill();
      }
    });
    serviceTriggersRef.current = [];

    // ===== АДАПТИВНАЯ АНИМАЦИЯ =====
    const createAdaptiveAnimation = () => {
      const isMobile = window.innerWidth < 1024;

      if (isMobile) {
        createMobileAnimation();
      } else {
        createDesktopAnimation();
      }
    };

    // ===== ДЕСКТОПНАЯ АНИМАЦИЯ =====
    const createDesktopAnimation = () => {
      // НАЧАЛЬНЫЕ ПОЛОЖЕНИЯ - учитываем порядок в HTML: img1, img2, text1, text2
      // Первое изображение: полная ширина, видимо
      gsap.set(firstImageContainer, {
        width: "100vw",
        height: "700px",
        x: 0,
        scale: 1,
        force3D: true,
        clearProps: "none",
      });

      // Второе изображение: скрыто (стоит сразу после первого в HTML)
      gsap.set(secondImageContainer, {
        width: "0vw", // Начально невидимо
        height: "700px",
        x: 0,
        scale: 1,
        force3D: true,
        clearProps: "none",
      });

      // Первый текстовый блок: скрыт справа (стоит третьим в HTML)
      gsap.set(firstTextBlock, {
        width: "50vw", // Начально невидимо
        height: "700px",
        opacity: 1,
        x: 0,
        scale: 1,
        force3D: true,
        clearProps: "none",
      });

      // Второй текстовый блок: скрыт (стоит четвертым в HTML)
      gsap.set(secondTextBlock, {
        width: "50vw", // Начально невидимо
        height: "700px",
        opacity: 1,
        x: 0,
        scale: 1,
        force3D: true,
        clearProps: "none",
        zIndex: -25,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: `${SERVICE_CONTEXT}-combined-slide`,
          trigger: mainWrapper,
          start: "center center",
          end: "+=600%", // Увеличенная длина для трех фаз
          scrub: 1,
          pin: true,
          pinSpacing: true,
          markers: false,
          onStart: () => {},
          onUpdate: (self) => {},
          onComplete: () => {},
        },
      });

      // ФАЗА 1: Первое изображение сжимается до 50vw, первый текст появляется справа
      tl.to(
        firstImageContainer,
        {
          width: "50vw",
          scale: 1,
          force3D: true,
          ease: "power2.inOut",
          duration: 1,
        },
        0,
      );

      tl.to(
        firstTextBlock,
        {
          width: "50vw", // Первый текст появляется
          scale: 1,
          force3D: true,
          ease: "power2.inOut",
          duration: 1,
        },
        0.1,
      );

      // ФАЗА 2: Первое изображение исчезает, первый текст сдвигается влево, второе изображение появляется
      // Первое изображение исчезает
      tl.to(
        firstImageContainer,
        {
          width: "0vw", // Исчезает
          scale: 1,
          force3D: true,
          ease: "power2.inOut",
          duration: 1,
        },
        1.5,
      );

      // Второе изображение появляется на место первого
      tl.to(
        secondImageContainer,
        {
          width: "50vw", // Появляется
          scale: 1,
          force3D: true,
          ease: "power2.inOut",
          duration: 1,
        },
        1.5,
      );

      // ФАЗА 3: Первый текст исчезает, второй текст появляется
      // Первый текст исчезает
      tl.to(
        firstTextBlock,
        {
          width: "50vw", // Первый текст исчезает
          x: "-50vw",
          scale: 1,
          force3D: true,
          ease: "power2.inOut",
          duration: 1,
        },
        2.5,
      );

      tl.to(
        secondImageContainer,
        {
          width: "50vw", // Появляется
          x: "0vw",
          scale: 1,
          force3D: true,
          ease: "power2.inOut",
          duration: 1,
        },
        2.5,
      );

      // Второй текст появляется на место первого текста
      tl.to(
        secondTextBlock,
        {
          width: "50vw", // Второй текст появляется
          x: "-100vw",
          scale: 1,
          force3D: true,
          ease: "power2.inOut",
          duration: 1,
        },
        2.5,
      );

      tl.to(
        secondImageContainer,
        {
          width: "50vw",
          x: "100vw",
          scale: 1,
          force3D: true,
          ease: "power2.inOut",
          duration: 1,
          // delay: 1,
        },
        4,
      );

      tl.to(
        secondTextBlock,
        {
          width: "50vw", // Второй текст появляется
          x: "-150vw",
          scale: 1,
          force3D: true,
          ease: "power2.inOut",
          duration: 0.5,
          zIndex: -25,
          // delay: 2,
        },
        4,
      );

      // Добавляем в массив для очистки
      serviceTriggersRef.current.push(tl.scrollTrigger);
    };

    // ===== МОБИЛЬНАЯ АНИМАЦИЯ =====
    const createMobileAnimation = () => {
      // СРАЗУ скрываем все элементы при загрузке (без задержки)
      gsap.set(firstImageContainer, {
        opacity: 0,
        y: -30,
        scale: 1.02,
        force3D: true,
      });
      gsap.set(firstTextBlock, {
        opacity: 0,
        y: 40,
        force3D: true,
      });
      gsap.set(secondImageContainer, {
        opacity: 0,
        y: -50,
        force3D: true,
      });
      gsap.set(secondTextBlock, {
        opacity: 0,
        y: 40,
        force3D: true,
      });

      // Скрываем текстовые элементы внутри блоков
      const hideTextElements = (textBlock) => {
        const title = textBlock.querySelector(`.${styles.title}`);
        const subtitle = textBlock.querySelector(`.${styles.subtitle}`);
        const descriptions = textBlock.querySelectorAll(
          `.${styles.description}`,
        );
        const features = textBlock.querySelectorAll(`.${styles.feature}`);

        gsap.set([title, subtitle, ...descriptions, ...features], {
          opacity: 0,
          y: 20,
          force3D: true,
        });
      };

      hideTextElements(firstTextBlock);
      hideTextElements(secondTextBlock);

      // Анимация первого изображения - плавно сверху
      gsap.to(firstImageContainer, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        force3D: true,
        scrollTrigger: {
          id: `${SERVICE_CONTEXT}-mobile-img1`,
          trigger: firstImageContainer,
          start: "top 85%",
          once: true,
          markers: false,
        },
      });

      // Анимация первого текстового блока целиком
      gsap.to(firstTextBlock, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        force3D: true,
        scrollTrigger: {
          id: `${SERVICE_CONTEXT}-mobile-text1`,
          trigger: firstTextBlock,
          start: "top 85%",
          once: true,
          markers: false,
        },
      });

      // Анимация второго текстового блока целиком
      gsap.to(secondTextBlock, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        force3D: true,
        scrollTrigger: {
          id: `${SERVICE_CONTEXT}-mobile-text2`,
          trigger: secondTextBlock,
          start: "top 85%",
          once: true,
          markers: false,
        },
      });

      // Анимация элементов внутри текстов с задержкой
      setTimeout(() => {
        const animateTextElements = (textBlock, delay = 0) => {
          const title = textBlock.querySelector(`.${styles.title}`);
          const subtitle = textBlock.querySelector(`.${styles.subtitle}`);
          const descriptions = textBlock.querySelectorAll(
            `.${styles.description}`,
          );
          const features = textBlock.querySelectorAll(`.${styles.feature}`);

          if (title) {
            gsap.to(title, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "back.out(1.7)",
              delay: delay,
              scrollTrigger: {
                trigger: textBlock,
                start: "top 85%",
                once: true,
              },
            });
          }

          if (subtitle) {
            gsap.to(subtitle, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              delay: delay + 0.2,
              scrollTrigger: {
                trigger: textBlock,
                start: "top 85%",
                once: true,
              },
            });
          }

          descriptions.forEach((desc, index) => {
            gsap.to(desc, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power2.out",
              delay: delay + 0.4 + index * 0.1,
              scrollTrigger: {
                trigger: textBlock,
                start: "top 85%",
                once: true,
              },
            });
          });

          features.forEach((feature, index) => {
            gsap.to(feature, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.5,
              ease: "back.out(2)",
              delay: delay + 0.8 + index * 0.05,
              scrollTrigger: {
                trigger: textBlock,
                start: "top 80%",
                once: true,
              },
            });
          });
        };

        // Анимация текстов
        animateTextElements(firstTextBlock, 0.3);
        animateTextElements(secondTextBlock, 0.3);
      }, 200);

      // Анимация второго изображения
      gsap.to(secondImageContainer, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        force3D: true,
        scrollTrigger: {
          id: `${SERVICE_CONTEXT}-mobile-img2`,
          trigger: secondImageContainer,
          start: "top 70%",
          once: true,
          markers: false,
        },
      });
    };

    // Создаем наблюдатель для первого запуска
    let animationCreated = false;
    let resizeHandler = null;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animationCreated) {
            createAdaptiveAnimation();

            // Обработчик изменения размера окна
            resizeHandler = () => {
              // Очищаем существующие триггеры
              const allTriggers = ScrollTrigger.getAll();
              allTriggers.forEach((trigger) => {
                if (trigger.id && trigger.id.includes(SERVICE_CONTEXT)) {
                  trigger.kill();
                }
              });

              // Создаем новую анимацию
              setTimeout(() => {
                createAdaptiveAnimation();
              }, 100);
            };

            window.addEventListener("resize", resizeHandler);
            animationCreated = true;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    if (mainWrapper) {
      observer.observe(mainWrapper);
    }

    // Cleanup функция
    return () => {
      // Убираем обработчик resize
      if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
        resizeHandler = null;
      }

      // Простая очистка триггеров
      const allTriggers = ScrollTrigger.getAll();
      allTriggers.forEach((trigger) => {
        if (trigger.id && trigger.id.includes(SERVICE_CONTEXT)) {
          trigger.kill();
        }
      });

      // Сброс GSAP стилей
      gsap.set(
        [
          firstImageContainer,
          firstTextBlock,
          secondImageContainer,
          secondTextBlock,
        ],
        {
          clearProps: "all",
        },
      );

      if (observer && mainWrapper) {
        observer.unobserve(mainWrapper);
      }
    };
  }, []);

  return (
    <div className={styles.serviceContainer}>
      <section className={styles.section}>
        <div className={styles.container}>
          {/* ===== ОБЪЕДИНЕННАЯ СЕКЦИЯ ===== */}
          <div
            ref={mainWrapperRef}
            className={`${styles.serviceContentWrapper} ${styles.cateringSection}`}
          >
            {/* Первое изображение (CATERING) */}
            <div
              ref={firstImageContainerRef}
              className={styles.serviceImageContainer}
            >
              <Image
                src="/images/catering2.jpg"
                alt="Catering Service"
                width={1920}
                height={1275}
                className={styles.japaneseImage}
                priority
              />
            </div>

            {/* Первый текстовый блок (Catering) */}
            <div ref={firstTextBlockRef} className={styles.serviceTextBlock}>
              <div className={styles.textContent}>
                <div className={styles.topContent}>
                  <h1 className={styles.title}>{t("catering")}</h1>
                  <h2 className={styles.subtitle}>{t("cateringTitle")}</h2>
                  <p className={styles.description}>
                    {t("cateringDescriptionOne")}
                  </p>
                  <p className={styles.description}>
                    {t("cateringDescriptionTwo")}
                  </p>
                </div>

                <div className={styles.features}>
                  <div className={styles.feature}>
                    <Image
                      src="/images/icons/party.png"
                      alt="Banquets"
                      width={32}
                      height={32}
                      className={styles.icon}
                    />
                    <span>{t("banquets")}</span>
                  </div>
                  <div className={styles.feature}>
                    <Image
                      src="/images/icons/red-carpet.png"
                      alt="Events"
                      width={32}
                      height={32}
                      className={styles.icon}
                    />
                    <span>{t("privateEvents")}</span>
                  </div>
                  <div className={styles.feature}>
                    <Image
                      src="/images/icons/bar.png"
                      alt="Cocktails"
                      width={32}
                      height={32}
                      className={styles.icon}
                    />
                    <span>{t("cocktailParties")}</span>
                  </div>
                  <div className={styles.feature}>
                    <Image
                      src="/images/icons/chef.png"
                      alt="Chef & Staff"
                      width={32}
                      height={32}
                      className={styles.icon}
                    />
                    <span>{t("chefStaff")}</span>
                  </div>
                  <div className={styles.feature}>
                    <Image
                      src="/images/icons/delivery-truck.png"
                      alt="Delivery"
                      width={32}
                      height={32}
                      className={styles.icon}
                    />
                    <span>{t("deliverySetup")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Второе изображение (TEAM LUNCH) */}
            <div
              ref={secondImageContainerRef}
              className={styles.serviceImageContainer}
            >
              <Image
                src="/images/teamlunch.jpg"
                alt="Team Lunch Service"
                width={1920}
                height={1280}
                className={styles.japaneseImage}
                priority
              />
            </div>

            {/* Второй текстовый блок (Team Lunch) */}
            <div ref={secondTextBlockRef} className={styles.serviceTextBlock}>
              <div className={styles.textContent}>
                <div className={styles.topContent}>
                  <h1 className={styles.title}>{t("teamLunch")}</h1>
                  <h2 className={styles.subtitle}>{t("teamLunchTitle")}</h2>
                  <p className={styles.description}>
                    {t("teamLunchDescriptionOne")}
                  </p>
                  <p className={styles.description}>
                    {t("teamLunchDescriptionTwo")}
                  </p>
                </div>

                <div className={styles.features}>
                  <div className={styles.feature}>
                    <Image
                      src="/images/icons/food-tray.png"
                      alt="Daily Office Meals"
                      width={32}
                      height={32}
                      className={styles.icon}
                    />
                    <span>{t("officeMeals")}</span>
                  </div>
                  <div className={styles.feature}>
                    <Image
                      src="/images/icons/lunchbox.png"
                      alt="Custom Lunch Boxes"
                      width={32}
                      height={32}
                      className={styles.icon}
                    />
                    <span>{t("lunchBoxes")}</span>
                  </div>
                  <div className={styles.feature}>
                    <Image
                      src="/images/icons/cheers.png"
                      alt="Meal Subscriptions"
                      width={32}
                      height={32}
                      className={styles.icon}
                    />
                    <span>{t("mealSubscription")}</span>
                  </div>
                  <div className={styles.feature}>
                    <Image
                      src="/images/icons/gluten-free.png"
                      alt="GF / DF / Vegan"
                      width={32}
                      height={32}
                      className={styles.icon}
                    />
                    <span>{t("gfdfvegan")}</span>
                  </div>
                  <div className={styles.feature}>
                    <Image
                      src="/images/icons/delivery-man.png"
                      alt="Flexible Delivery"
                      width={32}
                      height={32}
                      className={styles.icon}
                    />
                    <span>{t("flexibleDelivery")}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
