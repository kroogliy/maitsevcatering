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
    const container = containerRef.current;
    if (!container) return;

    const items = container.querySelectorAll(`.${styles.serviceItem}`);

    items.forEach((item) => {
      const curtainLeft = item.querySelector(`.${styles.curtainLeft}`);
      const curtainRight = item.querySelector(`.${styles.curtainRight}`);
      const content = item.querySelector(`.${styles.content}`);

      const tl = gsap.timeline({ paused: true });

      // Шторки разъезжаются от центра
      tl.to(curtainLeft, {
        xPercent: -100,
        duration: 2,
        ease: "power3.inOut",
      })
        .to(
          curtainRight,
          {
            xPercent: 100,
            duration: 2,
            ease: "power3.inOut",
          },
          0,
        )
        .to(
          content,
          {
            opacity: 1,
            duration: 1,
            ease: "power3.inOut",
          },
          0.4,
        );

      ScrollTrigger.create({
        trigger: item,
        start: "top 75%",
        onEnter: () => tl.play(),
        once: true,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <section ref={containerRef} className={styles.container}>
      <div className={styles.servicesGrid}>
        {cateringServices.map((service) => (
          <Link
            key={service.id}
            href={`/${locale}/services/${service.link}`}
            className={styles.serviceItem}
          >
            {/* Background Image - под шторками */}
            <div
              className={styles.imageBackground}
              style={{ backgroundImage: `url(${service.image})` }}
            />
            <div className={styles.imageOverlay} />

            {/* Curtains - закрывают изображение изначально */}
            <div className={styles.curtainLeft} />
            <div className={styles.curtainRight} />

            {/* Content - поверх всего */}
            <div className={styles.content}>
              <div className={styles.contentLeft}>
                <span className={styles.serviceNumber}>0{service.id}</span>
                <h3 className={styles.serviceTitle}>{service.title}</h3>
                <HiExternalLink className={styles.serviceIcon} />
              </div>

              <div className={styles.contentRight}>
                <p className={styles.serviceDescription}>
                  {service.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
