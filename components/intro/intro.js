"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./intro.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Intro() {
  const containerRef = useRef(null);
  const itemsRef = useRef([]);
  const params = useParams();
  const pathname = usePathname();
  const locale = params.locale || "en";

  const cateringServices = [
    {
      id: 1,
      title: "Corporate Catering",
      description:
        "Perfectly planned catering for business events. We create a gastronomic experience that highlights the prestige of your company and sets the tone for productive communication. Delicious breaks throughout the day, elegant presentation, and attentive service help to maintain attention, inspire ideas, and leave the right impression on clients and partners.",
      image: "/images/catering/corporateCatering.jpg",
      link: "corporate-catering",
    },
    {
      id: 2,
      title: "Contract Catering",
      description:
        "We take care of your team's daily meals — consistently, reliably, and without fail. Customized menus, freshness control, flexible schedules, and precise logistics. You run your business, we take care of the kitchen. Every day.",
      image: "/images/catering/contractCatering.jpg",
      link: "contract-catering",
    },
    {
      id: 3,
      title: "Event Catering",
      description:
        "We create events that you will want to relive in your memory. You provide the occasion—we transform it into an atmosphere: signature menus, impeccable service, precise timing, and visual presentation, where every detail works to evoke emotion. Whether it's a private celebration, a business meeting, or a large-scale event, we take care of all the catering and provide guests with a feeling of care, comfort, and taste at a level that is difficult to forget.",
      image: "/images/catering/eventCatering.jpg",
      link: "event-catering",
    },
    {
      id: 4,
      title: "Wedding Catering",
      description:
        "Your day should be a feast for all the senses. We create weddings where the cuisine is all about emotion, atmosphere, and style. Signature menus, delicate presentation, sophisticated combinations, perfect service, and no fuss. We will take care of you: from morning champagne to the last dessert at night. You just enjoy your celebration — we make it delicious.",
      image: "/images/catering/weddingCatering.jpg",
      link: "wedding-catering",
    },
    {
      id: 5,
      title: "Pop-up Catering",
      description:
        "We bring the gastronomic experience right to you! We instantly transform any space into a unique venue for tastings, parties, or corporate events. Flexible, creative, and with a full range of services—from food to drinks and staff. Your guests will enjoy an unforgettable pop-up experience, and you will enjoy perfect organization without any unnecessary hassle.",
      image: "/images/catering/popupCatering.jpg",
      link: "popup-catering",
    },
  ];

  useEffect(() => {
    const items = itemsRef.current.filter(Boolean);

    items.forEach((item, index) => {
      const imageWrapper = item.querySelector(`.${styles.imageWrapper}`);
      const image = item.querySelector(`.${styles.image}`);
      const contentWrapper = item.querySelector(`.${styles.contentWrapper}`);
      const title = item.querySelector(`.${styles.title}`);
      const description = item.querySelector(`.${styles.description}`);
      const number = item.querySelector(`.${styles.number}`);
      const cta = item.querySelector(`.${styles.cta}`);

      // Image reveal animation
      gsap.fromTo(
        imageWrapper,
        {
          clipPath: "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
        },
        {
          clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
          duration: 1.5,
          ease: "power4.inOut",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      // Image scale animation
      gsap.fromTo(
        image,
        { scale: 1.4 },
        {
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );

      // Number animation
      gsap.fromTo(
        number,
        { opacity: 0, scale: 0.5, rotation: -45 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: item,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        },
      );

      // Title animation - split by characters
      const titleText = title.textContent;
      title.innerHTML = titleText
        .split("")
        .map(
          (char) =>
            `<span class="${styles.char}">${char === " " ? "&nbsp;" : char}</span>`,
        )
        .join("");

      gsap.fromTo(
        title.querySelectorAll(`.${styles.char}`),
        { opacity: 0, y: 100, rotationX: -90 },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          duration: 0.8,
          stagger: 0.03,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        },
      );

      // Description animation
      gsap.fromTo(
        description,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 65%",
            toggleActions: "play none none none",
          },
        },
      );

      // CTA animation
      gsap.fromTo(
        cta,
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: item,
            start: "top 60%",
            toggleActions: "play none none none",
          },
        },
      );

      // Parallax effect
      gsap.to(image, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      // Content parallax
      gsap.to(contentWrapper, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: item,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, [pathname]);

  return (
    <section ref={containerRef} className={styles.container}>
      <div className={styles.header}>
        <span className={styles.label}>What We Offer</span>
        <h2 className={styles.headerTitle}>Beyond Catering</h2>
      </div>

      <div className={styles.grid}>
        {cateringServices.map((service, index) => (
          <div
            key={service.id}
            ref={(el) => (itemsRef.current[index] = el)}
            className={`${styles.item} ${index % 2 === 0 ? styles.itemLeft : styles.itemRight}`}
          >
            <div className={styles.imageWrapper}>
              <div
                className={styles.image}
                style={{ backgroundImage: `url(${service.image})` }}
              >
                <div className={styles.overlay}></div>
              </div>
            </div>

            <div className={styles.contentWrapper}>
              <div className={styles.number}>0{service.id}</div>
              <h3 className={styles.title}>{service.title}</h3>
              <p className={styles.description}>{service.description}</p>
              <div className={styles.ctaSection}>
                <Link
                  href={`/${locale}/services/${service.link}`}
                  className={styles.cta}
                >
                  <span>Explore Service</span>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
