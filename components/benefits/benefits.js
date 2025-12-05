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
          "Gourmet creations that delight every palate — from classic comfort foods to exotic specialties.",
        image: "/images/culinary.JPG",
      },
      back: {
        title: "Global Flavors, Perfected",
        subtitle:
          "Italian, Georgian, Sushi, Grill, Desserts — expertly crafted and beautifully presented for your event.",
        image: "/images/catering/corporate.jpeg",
      },
    },
    {
      id: 2,
      front: {
        title: "6,000+ Beverages",
        subtitle:
          "A world of drinks at your fingertips — from everyday favorites to rare and collectible spirits.",
        image: "/images/alcohol.JPG",
      },
      back: {
        title: "Direct & Exclusive",
        subtitle:
          "Alcohol, cocktails, wines — delivered directly from producers for unmatched selection and quality.",
        image: "/images/alcohol2.JPG",
      },
    },
    {
      id: 3,
      front: {
        title: "Fully Tailored Experience",
        subtitle:
          "Events designed around your vision — menus, formats, and styles flexibly adapted to your needs.",
        image: "/images/catering/chefCatering.jpg",
      },
      back: {
        title: "Your Event, Your Way",
        subtitle:
          "Corporate meetings, weddings, private parties — we ensure every detail aligns with your concept.",
        image: "/images/catering/wedding.jpg",
      },
    },
    {
      id: 4,
      front: {
        title: "End-to-End Service",
        subtitle:
          "A professional team handles every aspect — chefs, bartenders, waitstaff, and full logistics.",
        image: "/images/catering/sommelier.jpg",
      },
      back: {
        title: "Seamless Execution",
        subtitle:
          "From setup to cleanup, every element is taken care of. You focus on your guests, we handle the rest.",
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
          <span className={styles.label}>Perks & Benefits</span>
          <h2 className={styles.sectionTitle}>The Maitsev Difference</h2>
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
