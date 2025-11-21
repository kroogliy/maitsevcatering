"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Phone,
  Calendar,
  Users,
  Star,
  CheckCircle,
  ArrowRight,
  Clock,
  MapPin,
  Utensils,
  Coffee,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import HomePageLoadingWrapper from "../HomePageLoadingWrapper";
import styles from "./catering.module.css";

export default function CateringPage() {
  const [activeService, setActiveService] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);

  const typewriterRef = useRef(null);
  const t = useTranslations("CateringPage");
  const params = useParams();
  const locale = params.locale;

  // Internal navigation handler
  const handleInternalNavigation = () => {
    sessionStorage.setItem("internalNavigation", "true");
  };

  useEffect(() => {
    setIsVisible(true);

    const interval = setInterval(() => {
      setActiveService((prev) => (prev + 1) % 3);
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
    ];

    let currentIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let timeoutId = null;

    const typeSpeed = 150;
    const deleteSpeed = 100;
    const pauseTime = 2000;

    const typeWriter = () => {
      const word = words[currentIndex];

      if (isDeleting) {
        currentCharIndex--;
        const currentWord = word.substring(0, currentCharIndex + 1);

        if (currentCharIndex < 0) {
          isDeleting = false;
          currentIndex = (currentIndex + 1) % words.length;
          currentCharIndex = 0;
          setDisplayText("");
          timeoutId = setTimeout(typeWriter, 500);
          return;
        }

        setDisplayText(currentWord);
        timeoutId = setTimeout(typeWriter, deleteSpeed);
      } else {
        const currentWord = word.substring(0, currentCharIndex + 1);
        currentCharIndex++;

        if (currentCharIndex >= word.length) {
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

    typeWriter();

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [t]);

  const services = [
    {
      id: 1,
      icon: Users,
      title: t("corporateTitle"),
      description: t("corporateDescription"),
      features: [
        { icon: "/images/icons/party.png", text: t("fullServiceBanquets") },
        { icon: "/images/icons/bar.png", text: t("cocktailParties") },
        { icon: "/images/icons/chef.png", text: t("chefWaitstaff") },
      ],
      image: "/images/cateringpage1.jpg",
    },
    {
      id: 2,
      icon: Star,
      title: t("privateTitle"),
      description: t("privateDescription"),
      features: [
        { icon: "/images/icons/red-carpet.png", text: t("privateEvents") },
        { icon: "/images/icons/food.png", text: t("customizedMenus") },
        {
          icon: "/images/icons/professional-success.png",
          text: t("exquisitePresentation"),
        },
      ],
      image: "/images/cateringpage2.png",
    },
    {
      id: 3,
      icon: Calendar,
      title: t("specialTitle"),
      description: t("specialDescription"),
      features: [
        { icon: "/images/icons/food.png", text: t("signatureDishes") },
        { icon: "/images/icons/delivery-truck.png", text: t("deliverySetup") },
        {
          icon: "/images/icons/professional-success.png",
          text: t("professionalService"),
        },
      ],
      image: "/images/cateringpage.jpg",
    },
  ];

  const stats = [
    { icon: Users, value: t("statsEventsValue"), label: t("statsEvents") },
    { icon: Star, value: t("statsRatingValue"), label: t("statsRating") },
    { icon: Clock, value: t("statsNoticeValue"), label: t("statsNotice") },
    {
      icon: Star,
      value: t("statsIngredientsValue"),
      label: t("statsIngredients"),
    },
  ];

  const faqs = [
    {
      question: t("faq1Question"),
      answer: t("faq1Answer"),
    },
    {
      question: t("faq2Question"),
      answer: t("faq2Answer"),
    },
    {
      question: t("faq3Question"),
      answer: t("faq3Answer"),
    },
    {
      question: t("faq4Question"),
      answer: t("faq4Answer"),
    },
    {
      question: t("faq5Question"),
      answer: t("faq5Answer"),
    },
  ];

  return (
    <HomePageLoadingWrapper pageName="catering">
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              {t("heroTitle")}{" "}
              <span className={styles.heroTitleHighlight}>
                <span className={styles.typewriterText}>
                  {displayText}
                  <span className={styles.cursor}>|</span>
                </span>
              </span>
            </h1>

            <p className={styles.heroSubtitle}>{t("heroSubtitle")}</p>

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

        <section className={styles.servicesSection}>
          <div className={styles.servicesContainer}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t("sectionTitle")}</h2>
              <p className={styles.sectionSubtitle}>{t("sectionSubtitle")}</p>
            </div>

            <div className={styles.servicesNav}>
              {services.map((service, index) => (
                <button
                  key={service.id}
                  className={`${styles.navButton} ${activeService === index ? styles.navButtonActive : ""}`}
                  onClick={() => setActiveService(index)}
                >
                  <div className={styles.navButtonContent}>
                    <service.icon className={styles.navButtonIcon} />
                    <span className={styles.navButtonText}>
                      {service.title}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            <div className={styles.serviceContent}>
              {services.map((service, index) => {
                const isActive = activeService === index;

                return (
                  <div
                    key={service.id}
                    className={`${styles.serviceCard} ${isActive ? styles.serviceCardActive : ""}`}
                  >
                    <div className={styles.serviceGrid}>
                      <div className={styles.serviceInfo}>
                        <h3 className={styles.serviceTitle}>{service.title}</h3>
                        <p className={styles.serviceDescription}>
                          {service.description}
                        </p>

                        <div className={styles.serviceFeatures}>
                          {service.features.map((feature, featureIndex) => {
                            return (
                              <div
                                key={featureIndex}
                                className={styles.featureItem}
                              >
                                <Image
                                  src={feature.icon}
                                  alt={feature.text}
                                  width={20}
                                  height={20}
                                  className={styles.featureIcon}
                                />
                                <span className={styles.featureText}>
                                  {feature.text}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className={styles.serviceImage}>
                        <Image
                          src={service.image}
                          alt={service.title}
                          width={600}
                          height={400}
                          className={styles.image}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className={styles.teamLunchSection}>
          <div className={styles.teamLunchContainer}>
            <div className={styles.teamLunchWrapper}>
              <div className={styles.teamLunchPattern}>
                <div className={styles.patternDot}></div>
                <div className={styles.patternDot}></div>
                <div className={styles.patternDot}></div>
                <div className={styles.patternDot}></div>
                <div className={styles.patternDot}></div>
                <div className={styles.patternDot}></div>
              </div>

              <div className={styles.teamLunchHero}>
                <div className={styles.teamLunchBadge}>
                  <Coffee className={styles.badgeIcon} />
                  <span>{t("teamLunchBadge")}</span>
                </div>

                <h3 className={styles.teamLunchMainTitle}>
                  {t("teamLunchTitle")}
                </h3>

                <p className={styles.teamLunchMainDescription}>
                  {t("teamLunchDescription")}
                </p>

                <div className={styles.teamLunchFeatures}>
                  <div className={styles.teamLunchFeatureCard}>
                    <div className={styles.featureCardIcon}>
                      <Image
                        src="/images/icons/food-tray.png"
                        alt="Daily Office Meals"
                        width={24}
                        height={24}
                      />
                    </div>
                    <div className={styles.featureCardContent}>
                      <h4>{t("teamLunchDaily")}</h4>
                      <p>{t("teamLunchConsistent")}</p>
                    </div>
                  </div>

                  <div className={styles.teamLunchFeatureCard}>
                    <div className={styles.featureCardIcon}>
                      <Image
                        src="/images/icons/lunchbox.png"
                        alt="Custom Lunch Boxes"
                        width={24}
                        height={24}
                      />
                    </div>
                    <div className={styles.featureCardContent}>
                      <h4>{t("teamLunchCustom")}</h4>
                      <p>{t("teamLunchTailored")}</p>
                    </div>
                  </div>

                  <div className={styles.teamLunchFeatureCard}>
                    <div className={styles.featureCardIcon}>
                      <Image
                        src="/images/icons/gluten-free.png"
                        alt="GF / DF / Vegan"
                        width={24}
                        height={24}
                      />
                    </div>
                    <div className={styles.featureCardContent}>
                      <h4>{t("gfDfVegan")}</h4>
                      <p>{t("teamLunchFlexible")}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.teamLunchCTA}>
                  <a href="tel:+3725023599" className={styles.teamLunchButton}>
                    <Phone className={styles.buttonIcon} />
                    <span>{t("teamLunchButton")}</span>
                  </a>
                  <Link
                    href={`/${locale}/menu/menu/khachapuri`}
                    className={styles.teamLunchButtonSecondary}
                    prefetch={false}
                    onClick={handleInternalNavigation}
                  >
                    <Utensils className={styles.buttonIcon} />
                    <span>{t("ctaButtonMenu")}</span>
                    <ArrowRight className={styles.buttonArrow} />
                  </Link>
                </div>
              </div>

              <div className={styles.teamLunchImageSection}>
                <div className={styles.imageWrapper}>
                  <div className={styles.imageGlow}></div>
                  <Image
                    src="/images/teamlunchpage2.jpg"
                    alt="Team Lunch Service"
                    width={500}
                    height={400}
                    className={styles.teamLunchImage}
                  />

                  <div className={styles.floatingStats}>
                    <div className={styles.statCard}>
                      <div className={styles.statNumber}>Meal</div>
                      <div className={styles.statLabel}>Subscription</div>
                    </div>
                    <div className={styles.statCard}>
                      <div className={styles.statNumber}>GF/DF/VG</div>
                      <div className={styles.statLabel}>Options</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.faqSection}>
          <div className={styles.faqContainer}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>{t("faqTitle")}</h2>
              <p className={styles.sectionSubtitle}>{t("faqSubtitle")}</p>
            </div>

            <div className={styles.faqList}>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={`${styles.faqItem} ${activeFaq === index ? styles.faqItemActive : ""}`}
                >
                  <button
                    className={styles.faqQuestion}
                    onClick={() =>
                      setActiveFaq(activeFaq === index ? null : index)
                    }
                  >
                    <span>{faq.question}</span>
                    <ArrowRight
                      className={`${styles.faqIcon} ${activeFaq === index ? styles.faqIconActive : ""}`}
                    />
                  </button>
                  <div className={styles.faqAnswer}>
                    <p>{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaContainer}>
            <div className={styles.ctaContent}>
              <h2 className={styles.ctaTitle}>{t("ctaTitle")}</h2>
              <p className={styles.ctaText}>{t("ctaText")}</p>

              <div className={styles.ctaButtons}>
                <a href="tel:+3725023599" className={styles.ctaButtonPrimary}>
                  <Phone className={styles.ctaButtonIcon} />
                  <span className={styles.ctaButtonText}>
                    {t("ctaButtonCall")}
                  </span>
                </a>

                <Link
                  href={`/${locale}/menu/menu/khachapuri`}
                  className={styles.teamLunchButtonSecondary}
                  prefetch={false}
                  onClick={handleInternalNavigation}
                >
                  <Utensils className={styles.buttonIcon} />
                  <span>{t("ctaButtonMenu")}</span>
                  <ArrowRight className={styles.buttonArrow} />
                </Link>
              </div>

              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <Phone className={styles.contactIcon} />
                  <span>{t("contactPhone")}</span>
                </div>
                <div className={styles.contactItem}>
                  <MapPin className={styles.contactIcon} />
                  <span>{t("contactLocation")}</span>
                </div>
                <div className={styles.contactItem}>
                  <Clock className={styles.contactIcon} />
                  <span>{t("contactAvailability")}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </HomePageLoadingWrapper>
  );
}
