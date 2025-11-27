"use client";
import React, { useEffect, useRef, useState } from "react";
import styles from "./benefits.module.css";

export default function Benefits() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const benefits = [
    {
      id: 1,
      front: {
        title: "Culinary Excellence",
        subtitle:
          "Gourmet dishes for every lifestyle. Vegan, vegetarian, lactose-free, gluten-free options included.",
        image: "/images/culinary.JPG",
      },
      back: {
        title: "Global Flavors, Crafted Daily",
        subtitle:
          "Georgian, Italian, Street Food, Sushi, Pizza, Desserts — made with fresh, locally sourced ingredients.",
        image: "/images/catering/corporate.jpeg",
      },
    },
    {
      id: 2,
      front: {
        title: "6,000+ Beverages",
        subtitle:
          "One of the largest alcohol & non-alcohol selections. From everyday essentials to rare collectibles.",
        image: "/images/alcohol.JPG",
      },
      back: {
        title: "Direct Supply Advantage",
        subtitle:
          "17+ beverage categories. No intermediaries — just quality, authenticity, and fair pricing.",
        image: "/images/alcohol2.JPG",
      },
    },
    {
      id: 3,
      front: {
        title: "Fully Tailored Experience",
        subtitle:
          "Custom menus, flexible formats, curated to match your event's style and atmosphere.",
        image: "/images/catering/chefCatering.jpg",
      },
      back: {
        title: "Your Vision, Perfectly Executed",
        subtitle:
          "Corporate events, weddings, private parties — we adapt to any scale and concept.",
        image: "/images/catering/wedding.jpg",
      },
    },
    {
      id: 4,
      front: {
        title: "End-to-End Service",
        subtitle:
          "Professional chefs, sommeliers, bartenders, and event managers — we handle everything.",
        image: "/images/catering/sommelier.jpg",
      },
      back: {
        title: "Flawless Performance",
        subtitle:
          "Setup, service, logistics — always on time. 500+ successful events annually.",
        image: "/images/catering/eventCatering.jpg",
      },
    },
  ];

  return (
    <section className={styles.container} ref={sectionRef}>
      <div className={styles.content}>
        <div
          className={`${styles.header} ${isVisible ? styles.animateIn : ""}`}
        >
          <h2 className={styles.sectionTitle}>Why Choose Us</h2>
          <p className={styles.sectionSubtitle}>
            Excellence in every detail, tailored to your vision
          </p>
        </div>

        <div className={styles.grid}>
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id}
              className={`${styles.card} ${isVisible ? styles.animateIn : ""}`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className={styles.cardInner}>
                {/* Front Side */}
                <div className={`${styles.cardFace} ${styles.cardFront}`}>
                  <div
                    className={styles.cardImage}
                    style={{ backgroundImage: `url(${benefit.front.image})` }}
                  />
                  <div className={styles.cardOverlay} />
                  <div className={styles.cardContent}>
                    <span className={styles.cardNumber}>0{benefit.id}</span>
                    <h3 className={styles.cardTitle}>{benefit.front.title}</h3>
                    <p className={styles.cardSubtitle}>
                      {benefit.front.subtitle}
                    </p>
                  </div>
                  <div className={styles.cardGlow} />
                </div>

                {/* Back Side */}
                <div className={`${styles.cardFace} ${styles.cardBack}`}>
                  <div
                    className={styles.cardImage}
                    style={{ backgroundImage: `url(${benefit.back.image})` }}
                  />
                  <div className={styles.cardOverlayBack} />
                  <div className={styles.cardContent}>
                    <span className={styles.cardNumber}>0{benefit.id}</span>
                    <h3 className={styles.cardTitle}>{benefit.back.title}</h3>
                    <p className={styles.cardSubtitle}>
                      {benefit.back.subtitle}
                    </p>
                  </div>
                  <div className={styles.cardGlow} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
