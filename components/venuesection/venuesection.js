"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./venuesection.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function VenuesSection() {
  const sectionRef = useRef(null);
  const [activeVenue, setActiveVenue] = useState(null);

  const venues = [
    {
      id: 1,
      name: "Grand Ballroom Hall",
      location: "Tallinn Old Town",
      capacity: "200-500 guests",
      type: "Luxury Venue",
      image: "/images/catering/eventCatering.jpg",
      website: "https://example.com",
      size: "large", // для разных размеров пузырей
    },
    {
      id: 2,
      name: "Skyline Rooftop",
      location: "City Center",
      capacity: "50-150 guests",
      type: "Modern Space",
      image: "/images/venues/venue2.jpg",
      website: "https://example.com",
      size: "medium",
    },
    {
      id: 3,
      name: "Garden Estate",
      location: "Pirita",
      capacity: "100-300 guests",
      type: "Outdoor Venue",
      image: "/images/venues/venue3.jpg",
      website: "https://example.com",
      size: "large",
    },
    {
      id: 4,
      name: "Industrial Loft",
      location: "Telliskivi",
      capacity: "80-200 guests",
      type: "Creative Space",
      image: "/images/venues/venue4.jpg",
      website: "https://example.com",
      size: "medium",
    },
    {
      id: 5,
      name: "Seaside Villa",
      location: "Viimsi",
      capacity: "30-100 guests",
      type: "Intimate Setting",
      image: "/images/venues/venue5.jpg",
      website: "https://example.com",
      size: "small",
    },
    {
      id: 6,
      name: "Historic Manor",
      location: "Kadriorg",
      capacity: "150-400 guests",
      type: "Heritage Venue",
      image: "/images/venues/venue6.jpg",
      website: "https://example.com",
      size: "large",
    },
    {
      id: 7,
      name: "Art Gallery Space",
      location: "Kalamaja",
      capacity: "60-120 guests",
      type: "Cultural Venue",
      image: "/images/venues/venue7.jpg",
      website: "https://example.com",
      size: "small",
    },
    {
      id: 8,
      name: "Waterfront Pavilion",
      location: "Noblessner",
      capacity: "100-250 guests",
      type: "Contemporary",
      image: "/images/venues/venue8.jpg",
      website: "https://example.com",
      size: "medium",
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Анимация заголовка
    gsap.fromTo(
      `.${styles.header}`,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
        },
      },
    );

    // Анимация каждого venue bubble
    const venueCards = section.querySelectorAll(`.${styles.venueCard}`);

    venueCards.forEach((card, index) => {
      // Трансформация из круга в квадрат
      gsap.fromTo(
        card,
        {
          borderRadius: "50%",
          scale: 0.8,
          opacity: 0,
        },
        {
          borderRadius: "20px",
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            end: "top 50%",
            scrub: 1,
          },
        },
      );

      // Появление контента
      const cardContent = card.querySelector(`.${styles.venueInfo}`);
      gsap.fromTo(
        cardContent,
        { opacity: 0, y: 0 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 70%",
            once: true,
          },
        },
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <span className={styles.label}>Partner Venues</span>
          <h2 className={styles.title}>
            Exceptional Spaces for Unforgettable Events
          </h2>
          <p className={styles.subtitle}>
            Collaborate with Estonia's most prestigious venues. Each location is
            carefully selected to provide the perfect backdrop for your
            celebration.
          </p>
        </div>

        {/* Venues Grid */}
        <div className={styles.venuesGrid}>
          {venues.map((venue) => (
            <a
              key={venue.id}
              href={venue.website}
              target="_blank"
              rel="noopener noreferrer"
              className={`${styles.venueCard} ${styles[`size-${venue.size}`]}`}
              onMouseEnter={() => setActiveVenue(venue.id)}
              onMouseLeave={() => setActiveVenue(null)}
            >
              {/* Background Image */}
              <div
                className={styles.venueImage}
                style={{ backgroundImage: `url(${venue.image})` }}
              />
              <div className={styles.venueOverlay} />

              {/* Badge */}
              <div className={styles.venueBadge}>{venue.type}</div>

              {/* Info */}
              <div className={styles.venueInfo}>
                <h3 className={styles.venueName}>{venue.name}</h3>
                <div className={styles.venueDetails}>
                  <span className={styles.venueLocation}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {venue.location}
                  </span>
                  <span className={styles.venueCapacity}>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                    {venue.capacity}
                  </span>
                </div>

                <div className={styles.venueLink}>
                  <span>Visit Website</span>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </div>
              </div>

              {/* Hover Effect */}
              <div
                className={`${styles.venueHover} ${activeVenue === venue.id ? styles.venueHoverActive : ""}`}
              />
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.cta}>
          <p className={styles.ctaText}>
            Don't see your preferred venue? We work with additional partners
            across Estonia.
          </p>
          <a href="/contact" className={styles.ctaButton}>
            <span>Discuss Your Venue</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
