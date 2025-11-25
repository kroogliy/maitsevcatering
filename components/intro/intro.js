"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { HiExternalLink } from "react-icons/hi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./intro.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Intro() {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const params = useParams();
  const locale = params.locale || "en";

  const cateringServices = [
    {
      id: 1,
      title: "Corporate Catering",
      description:
        "Elevate your business events with exceptional culinary experiences",
      image: "/images/catering/corporateCatering.jpg",
      link: "corporate-catering",
    },
    {
      id: 2,
      title: "Contract Catering",
      description: "Long-term culinary partnerships tailored to your needs",
      image: "/images/catering/contractCatering.jpg",
      link: "contract-catering",
    },
    {
      id: 3,
      title: "Event Catering",
      description: "Unforgettable celebrations with premium catering services",
      image: "/images/catering/eventCatering.jpg",
      link: "event-catering",
    },
    {
      id: 4,
      title: "Wedding Catering",
      description: "Your special day perfected with exquisite cuisine",
      image: "/images/catering/weddingCatering.jpg",
      link: "wedding-catering",
    },
    {
      id: 5,
      title: "Pop-up Catering",
      description: "Unique culinary experiences anywhere, anytime",
      image: "/images/catering/popupCatering.jpg",
      link: "popup-catering",
    },
  ];

  useEffect(() => {
    const items = itemsRef.current;

    items.forEach((item, index) => {
      if (!item) return;

      const shape = item.querySelector(`.${styles.serviceShape}`);
      const content = item.querySelector(`.${styles.serviceContent}`);

      // Анимация расправления круга в квадрат + расширение 90vw → 100vw
      gsap.to(shape, {
        borderRadius: "12px",
        width: "90vw",
        x: 0,
        ease: "power3.inOut",
        duration: 1.2,
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "top 60%",
          scrub: 1,
        },
      });

      // Анимация поднятия вверх
      gsap.to(shape, {
        y: -50,
        ease: "power3.out",
        duration: 1.2,
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "top 30%",
          scrub: 1,
        },
      });

      // Анимация появления контента
      const contentElements = content.querySelectorAll(`.${styles.fadeIn}`);
      gsap.fromTo(
        contentElements,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 60%",
            toggleActions: "play none none none",
          },
        },
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const addToRefs = (el) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el);
    }
  };

  return (
    <section ref={containerRef} className={styles.container}>
      <div className={styles.servicesGrid}>
        {cateringServices.map((service) => (
          <div key={service.id} ref={addToRefs} className={styles.serviceItem}>
            <div className={styles.serviceShape}>
              <div
                className={styles.serviceImage}
                style={{ backgroundImage: `url(${service.image})` }}
              />
              <div className={styles.serviceOverlay} />
            </div>

            <div className={styles.serviceContent}>
              <Link
                href={`/${locale}/services/${service.link}`}
                className={styles.serviceLink}
              >
                <div className={styles.contentLeft}>
                  <span className={`${styles.serviceNumber} ${styles.fadeIn}`}>
                    0{service.id}
                  </span>
                  <h3 className={`${styles.serviceTitle} ${styles.fadeIn}`}>
                    {service.title}
                  </h3>
                  <HiExternalLink
                    className={`${styles.serviceIcon} ${styles.fadeIn}`}
                  />
                </div>

                <div className={styles.contentRight}>
                  <p
                    className={`${styles.serviceDescription} ${styles.fadeIn}`}
                  >
                    {service.description}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
