"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  Globe,
  Truck,
  CreditCard,
  ArrowRight,
  CheckCircle,
  Star,
  Gift,
  Shield,
  Clock,
  MapPin,
  MessageCircle,
  ShoppingCart,
  Heart,
  Zap,
  Award,
  Users,
  Calendar,
  Package,
  Smartphone,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import gsap from "gsap";
import HomePageLoadingWrapper from "../HomePageLoadingWrapper";
import styles from "./order.module.css";

export default function HowToOrder() {
  const [activeStep, setActiveStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const typewriterRef = useRef(null);
  const t = useTranslations("OrderPage");
  const params = useParams();
  const locale = params.locale;

  // Функция для обработки внутренней навигации
  const handleInternalNavigation = () => {
    sessionStorage.setItem("internalNavigation", "true");
  };

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 8000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Typewriter Effect
  useEffect(() => {
    const words = [
      t("typewriterWord1"),
      t("typewriterWord2"),
      t("typewriterWord3"),
      t("typewriterWord4"),
      t("typewriterWord5"),
    ];

    // Проверяем, что все переводы загружены
    if (
      !words.every(
        (word) =>
          word && word.trim() !== "" && !word.startsWith("typewriterWord"),
      )
    ) {
      return;
    }

    let currentIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let timeoutId = null;

    const typeSpeed = 150; // Скорость печатания
    const deleteSpeed = 100; // Скорость удаления
    const pauseTime = 2000; // Пауза между словами

    const typeWriter = () => {
      const word = words[currentIndex];

      if (isDeleting) {
        // Удаляем символы
        currentCharIndex--;
        const currentWord = word.substring(0, currentCharIndex + 1);

        if (currentCharIndex < 0) {
          isDeleting = false;
          currentIndex = (currentIndex + 1) % words.length;
          currentCharIndex = 0;
          setDisplayText(""); // Очищаем текст перед следующим словом
          timeoutId = setTimeout(typeWriter, 500); // Пауза перед следующим словом
          return;
        }

        setDisplayText(currentWord);
        timeoutId = setTimeout(typeWriter, deleteSpeed);
      } else {
        // Добавляем символы
        const currentWord = word.substring(0, currentCharIndex + 1);
        currentCharIndex++;

        if (currentCharIndex >= word.length) {
          // Слово напечатано, ждем и начинаем удалять
          setDisplayText(currentWord);
          timeoutId = setTimeout(() => {
            isDeleting = true;
            typeWriter();
          }, pauseTime);
          return;
        }

        setDisplayText(currentWord);
        timeoutId = setTimeout(typeWriter, typeSpeed);
      }
    };

    // Запускаем анимацию
    typeWriter();

    // Cleanup
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [t]);

  const steps = [
    {
      id: 1,
      icon: Smartphone,
      title: t("step1Title"),
      description: t("step1Description"),
      features: [
        { icon: Phone, text: t("step1Detail1") },
        { icon: Globe, text: t("step1Detail2") },
        { icon: MessageCircle, text: t("step1Detail3") },
      ],
      benefits: [t("step1Benefit1"), t("step1Benefit2"), t("step1Benefit3")],
      time: t("step1Time"),
    },
    {
      id: 2,
      icon: Package,
      title: t("step2Title"),
      description: t("step2Description"),
      features: [
        { icon: Truck, text: t("step2Detail1") },
        { icon: Clock, text: t("step2Detail2") },
        { icon: MapPin, text: t("step2Detail3") },
      ],
      benefits: [t("step2Benefit1"), t("step2Benefit2"), t("step2Benefit3")],
      time: t("step2Time"),
    },
    {
      id: 3,
      icon: CreditCard,
      title: t("step3Title"),
      description: t("step3Description"),
      features: [
        { icon: CreditCard, text: t("step3Detail1") },
        { icon: Shield, text: t("step3Detail2") },
        { icon: CheckCircle, text: t("step3Detail3") },
      ],
      benefits: [t("step3Benefit1"), t("step3Benefit2"), t("step3Benefit3")],
      time: t("step3Time"),
    },
  ];

  const stats = [
    { icon: Users, value: t("statsClientsValue"), label: t("statsClients") },
    { icon: Clock, value: t("statsDeliveryValue"), label: t("statsDelivery") },
    { icon: Star, value: t("statsRatingValue"), label: t("statsRating") },
    {
      icon: Award,
      value: t("statsExperienceValue"),
      label: t("statsExperience"),
    },
  ];

  return (
    <HomePageLoadingWrapper pageName="order">
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              {t("heroTitle")}
              <span className={styles.heroTitleHighlight}>
                <span className={styles.typewriterText}>
                  {displayText}
                  <span className={styles.cursor}>|</span>
                </span>
              </span>
            </h1>

            <p className={styles.heroSubtitle}>{t("subtitle")}</p>

            {/* Stats */}
            <div className={styles.statsGrid}>
              {stats.map((stat, index) => {
                const StatIcon = stat.icon;
                return (
                  <div key={index} className={styles.statItem}>
                    <div className={styles.statIcon}>
                      <StatIcon />
                    </div>
                    <div className={styles.statContent}>
                      <div className={styles.statValue}>{stat.value}</div>
                      <div className={styles.statLabel}>{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className={styles.stepsSection}>
          <div className={styles.stepsContainer}>
            {/* Steps Navigation */}
            <div className={styles.stepsNav}>
              {steps.map((step, index) => (
                <button
                  key={step.id}
                  className={`${styles.navButton} ${activeStep === index ? styles.navButtonActive : ""}`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className={styles.navButtonContent}>
                    <span className={styles.navButtonNumber}>0{step.id}</span>
                    <span className={styles.navButtonText}>{step.title}</span>
                  </div>
                  <div className={styles.navButtonLine}></div>
                </button>
              ))}
            </div>

            {/* Active Step Content */}
            <div className={styles.stepContent}>
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeStep === index;

                return (
                  <div
                    key={step.id}
                    className={`${styles.stepCard} ${isActive ? styles.stepCardActive : ""}`}
                  >
                    <div className={styles.stepHeader}>
                      <div className={styles.stepIconContainer}>
                        <Icon className={styles.stepIcon} />
                      </div>
                      <div className={styles.stepInfo}>
                        <h2 className={styles.stepTitle}>{step.title}</h2>
                        <p className={styles.stepDescription}>
                          {step.description}
                        </p>
                        <div className={styles.stepTime}>
                          <Clock className={styles.stepTimeIcon} />
                          <span>{step.time}</span>
                        </div>
                      </div>
                    </div>

                    <div className={styles.stepBody}>
                      {/* Features */}
                      <div className={styles.stepFeatures}>
                        <div className={styles.featuresGrid}>
                          {step.features.map((feature, featureIndex) => {
                            const FeatureIcon = feature.icon;
                            return (
                              <div
                                key={featureIndex}
                                className={styles.featureItem}
                              >
                                <FeatureIcon className={styles.featureIcon} />
                                <span className={styles.featureText}>
                                  {feature.text}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Benefits */}
                      <div className={styles.stepBenefits}>
                        <ul className={styles.benefitsList}>
                          {step.benefits.map((benefit, benefitIndex) => (
                            <li
                              key={benefitIndex}
                              className={styles.benefitItem}
                            >
                              <CheckCircle className={styles.benefitIcon} />
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContainer}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>{t("ctaTitle")}</h2>
              <p className={styles.ctaText}>{t("ctaText")}</p>

              <div className={styles.ctaButtons}>
                <Link
                  href={`/${locale}/menu/menu/sushi`}
                  className={styles.ctaButtonPrimary}
                  prefetch={false}
                  onClick={handleInternalNavigation}
                >
                  <span className={styles.ctaButtonText}>
                    {t("ctaButtonMenu")}
                  </span>
                  <ArrowRight className={styles.ctaButtonIcon} />
                </Link>

                <a href="tel:+3725023599" className={styles.ctaButtonSecondary}>
                  <Phone className={styles.ctaButtonIcon} />
                  <span className={styles.ctaButtonText}>
                    {t("ctaButtonPhone")}
                  </span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </HomePageLoadingWrapper>
  );
}
