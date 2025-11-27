"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./corporateCatering.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function CorporateCatering() {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const servicesRef = useRef(null);
  const processRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(-1);
  const [activeService, setActiveService] = useState(0);

  const services = [
    {
      title: "Business Meetings & Lunches",
      description:
        "Impress clients and partners with elegant lunch presentations. From executive boardroom dining to working lunch buffets, we ensure your meetings run smoothly with timely, professional service.",
      features: [
        "Hot & cold buffet options",
        "Individual boxed meals",
        "Dietary accommodations",
        "Silent service available",
      ],
      image: "/images/catering/corporateCatering.jpg",
    },
    {
      title: "Conferences & Seminars",
      description:
        "Keep attendees energized throughout full-day events. We provide seamless catering solutions including registration refreshments, coffee breaks, networking lunches, and gala dinners.",
      features: [
        "All-day beverage stations",
        "Scheduled break service",
        "Large-scale capacity",
        "Multi-day packages",
      ],
      image: "/images/catering/contractCatering.jpg",
    },
    {
      title: "Product Launches",
      description:
        "Make your brand launch memorable with culinary experiences that match your vision. Creative presentations, themed menus, and innovative serving styles that reinforce your brand message.",
      features: [
        "Branded presentations",
        "Custom menu design",
        "Interactive stations",
        "Photo-ready styling",
      ],
      image: "/images/catering/eventCatering.jpg",
    },
    {
      title: "Team Building Events",
      description:
        "Celebrate achievements and strengthen team bonds with exceptional catering. From casual summer barbecues to elegant annual galas, we create the perfect atmosphere.",
      features: [
        "Indoor & outdoor",
        "Themed party menus",
        "Entertainment coordination",
        "Flexible venues",
      ],
      image: "/images/catering/weddingCatering.jpg",
    },
    {
      title: "Executive Dining",
      description:
        "Elevate important occasions with fine dining experiences. Personal chef services, wine pairings, and white-glove service for board meetings and investor dinners.",
      features: [
        "Private chef service",
        "Sommelier consultation",
        "Premium ingredients",
        "Personalized menus",
      ],
      image: "/images/catering/popupCatering.jpg",
    },
    {
      title: "Daily Office Catering",
      description:
        "Boost employee satisfaction and productivity with regular office catering. Weekly rotating menus, healthy options, and reliable daily delivery your team can count on.",
      features: [
        "Subscription packages",
        "Weekly menu rotation",
        "Healthy & balanced",
        "Eco-friendly packaging",
      ],
      image: "/images/catering/wedding.jpg",
    },
  ];

  const stats = [
    { value: "6000+", label: "Drinks" },
    { value: "7+", label: "World Cuisines" },
    { value: "1", label: "Professional Team" },
    { value: "2025", label: "Founded" },
  ];

  const processSteps = [
    {
      number: "01",
      title: "Consultation",
      description: "We discuss your objectives, guest count, and vision",
    },
    {
      number: "02",
      title: "Proposal",
      description: "Receive a detailed proposal within 48 hours",
    },
    {
      number: "03",
      title: "Tasting",
      description: "Refine selections at a complimentary tasting",
    },
    {
      number: "04",
      title: "Planning",
      description: "Our team coordinates all logistics seamlessly",
    },
    {
      number: "05",
      title: "Execution",
      description: "Flawless delivery while you focus on guests",
    },
  ];

  const menuCategories = [
    {
      name: "Breakfast",
      items: [
        "Continental spreads",
        "Hot stations",
        "Healthy bowls",
        "Fresh pastries",
      ],
    },
    {
      name: "Lunch",
      items: [
        "Multi-cuisine buffets",
        "Plated service",
        "Live cooking",
        "Gourmet bars",
      ],
    },
    {
      name: "Breaks",
      items: [
        "Premium coffee",
        "Fresh pastries",
        "Energy snacks",
        "Fruit displays",
      ],
    },
    {
      name: "Beverages",
      items: [
        "Full bar service",
        "Wine pairing",
        "Craft mocktails",
        "Barista coffee",
      ],
    },
  ];

  const faqs = [
    {
      q: "What is the minimum order for corporate catering?",
      a: "Our corporate catering services start at a minimum of 15 guests. For smaller executive meetings (8-14 guests), we offer our premium Executive Dining package with personalized service.",
    },
    {
      q: "How far in advance should we book?",
      a: "We recommend booking 2-3 weeks in advance for standard events. For large conferences, 4-6 weeks ensures optimal selection. Last-minute requests may be accommodated based on availability.",
    },
    {
      q: "Can you accommodate dietary requirements?",
      a: "Absolutely. We handle vegetarian, vegan, gluten-free, halal, kosher, and allergy-specific needs. Each requirement is prepared separately with clear labeling.",
    },
    {
      q: "Do you provide service staff?",
      a: "Yes, full-service packages include professional staff. We optimize staff-to-guest ratios based on your event style. Self-service options are also available.",
    },
    {
      q: "What areas do you cover?",
      a: "We primarily serve Tallinn and Harju County. Events in Tartu, Pärnu, and other cities can be arranged with advance notice.",
    },
    {
      q: "Can you work within our budget?",
      a: "We create proposals across various budget ranges. Share your budget openly so we can recommend the best options without compromising quality.",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ==========================
         HERO ANIMATION
      ========================== */
      const heroTl = gsap.timeline();
      heroTl
        .fromTo(
          `.${styles.heroLabel}`,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        )
        .fromTo(
          `.${styles.heroTitle}`,
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          "-=0.5",
        )
        .fromTo(
          `.${styles.heroLine}`,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: "power2.out" },
          "-=0.5",
        )
        .fromTo(
          `.${styles.heroSubtitle}`,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
          "-=0.4",
        )
        .fromTo(
          `.${styles.heroActions}`,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" },
          "-=0.3",
        );

      /* ==========================
         STATS ANIMATION (FIXED)
      ========================== */

      const statItems = gsap.utils.toArray(`.${styles.statValue}`);

      statItems.forEach((el) => {
        const raw = el.textContent.trim(); // ex: "6000+"
        const digits = raw.match(/(\d+)/); // extract "6000"
        if (!digits) return;

        const number = parseInt(digits[1]); // 6000
        const suffix = raw.replace(digits[1], ""); // "+"

        // Store dynamic value on element
        el.dataset.final = number;
        el.dataset.suffix = suffix;

        gsap.fromTo(
          el,
          { innerText: 0 },
          {
            innerText: number,
            duration: 2,
            ease: "power2.out",
            snap: { innerText: 1 },
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
            },
            onUpdate: function () {
              el.textContent = Math.floor(el.innerText) + suffix;
            },
          },
        );
      });

      /* ==========================
         SERVICES REVEAL
      ========================== */
      gsap.fromTo(
        `.${styles.servicesVisual}`,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.2,
          ease: "power3.inOut",
          scrollTrigger: { trigger: `.${styles.services}`, start: "top 60%" },
        },
      );

      /* ==========================
         PROCESS STEPS
      ========================== */
      gsap.fromTo(
        `.${styles.processStep}`,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: `.${styles.process}`, start: "top 70%" },
        },
      );

      /* ==========================
         MENU CARDS
      ========================== */
      gsap.fromTo(
        `.${styles.menuCard}`,
        { opacity: 0, y: 40, rotateX: 15 },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: `.${styles.menu}`, start: "top 70%" },
        },
      );

      /* ==========================
         FAQ ITEMS
      ========================== */
      gsap.fromTo(
        `.${styles.faqItem}`,
        { opacity: 0, x: -30 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: `.${styles.faq}`, start: "top 70%" },
        },
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <main className={styles.page}>
      {/* Hero */}
      <section ref={heroRef} className={styles.hero}>
        <div className={styles.heroBackground}>
          <div
            className={styles.heroImage}
            style={{
              backgroundImage: "url(/images/catering/corporateCatering.jpg)",
            }}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>Corporate Catering</span>
          <h1 className={styles.heroTitle}>
            Elevate Your
            <br />
            Business Events
          </h1>

          <p className={styles.heroSubtitle}>
            Professional catering that reflects your company`s excellence.
            <br />
            From intimate meetings to large-scale conferences.
          </p>
          <div className={styles.heroActions}>
            <Link href="/contact" className={styles.btnPrimary}>
              <span>Request Quote</span>
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
            </Link>
            <Link href="#services" className={styles.btnGhost}>
              Explore Services
            </Link>
          </div>
        </div>
        <div className={styles.heroScroll}>
          <span>Scroll</span>
          <div className={styles.heroScrollLine} />
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className={styles.stats}>
        <div className={styles.statsGrid}>
          {stats.map((stat, i) => (
            <div key={i} className={styles.statItem}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Intro */}
      <section className={styles.intro}>
        <div className={styles.introGrid}>
          <div className={styles.introLabel}>
            <span>Why Us</span>
          </div>
          <div className={styles.introContent}>
            <h2 className={styles.introTitle}>
              Corporate catering
              <br />
              that means business
            </h2>
            <div className={styles.introText}>
              <p>
                In the corporate world, every detail matters. Your catering
                choice speaks volumes about your company`s standards. We
                understand that business events aren`t just about food—they`re
                opportunities to impress clients, motivate teams, and celebrate
                achievements.
              </p>
              <p>
                With 15+ years serving Estonia`s leading companies, we`ve
                perfected the art of corporate catering. Punctual delivery,
                discreet staff, dietary intelligence, and menus that accommodate
                diverse preferences while maintaining visual elegance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" ref={servicesRef} className={styles.services}>
        <div className={styles.servicesContainer}>
          <div className={styles.servicesList}>
            <div className={styles.servicesHeader}>
              <span className={styles.servicesLabel}>Services</span>
              <h2 className={styles.servicesTitle}>What We Offer</h2>
            </div>
            {services.map((service, i) => (
              <div
                key={i}
                className={`${styles.serviceItem} ${activeService === i ? styles.serviceItemActive : ""}`}
                onMouseEnter={() => setActiveService(i)}
              >
                <span className={styles.serviceNumber}>0{i + 1}</span>
                <div className={styles.serviceInfo}>
                  <h3 className={styles.serviceTitle}>{service.title}</h3>
                  <p className={styles.serviceDesc}>{service.description}</p>
                  <ul className={styles.serviceFeatures}>
                    {service.features.map((f, j) => (
                      <li key={j}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.servicesVisual}>
            <div className={styles.servicesImageWrapper}>
              {services.map((service, i) => (
                <div
                  key={i}
                  className={`${styles.servicesImage} ${activeService === i ? styles.servicesImageActive : ""}`}
                  style={{ backgroundImage: `url(${service.image})` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Menu */}
      <section className={styles.menu}>
        <div className={styles.menuHeader}>
          <span className={styles.menuLabel}>Menus</span>
          <h2 className={styles.menuTitle}>Culinary Excellence</h2>
          <p className={styles.menuSubtitle}>
            Fully customizable menus crafted with premium ingredients
          </p>
        </div>
        <div className={styles.menuGrid}>
          {menuCategories.map((cat, i) => (
            <div key={i} className={styles.menuCard}>
              <span className={styles.menuCardNumber}>0{i + 1}</span>
              <h3 className={styles.menuCardTitle}>{cat.name}</h3>
              <ul className={styles.menuCardList}>
                {cat.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section ref={processRef} className={styles.process}>
        <div className={styles.processHeader}>
          <span className={styles.processLabel}>Process</span>
          <h2 className={styles.processTitle}>How It Works</h2>
        </div>
        <div className={styles.processTimeline}>
          {processSteps.map((step, i) => (
            <div key={i} className={styles.processStep}>
              <div className={styles.processStepNumber}>{step.number}</div>
              <div className={styles.processStepContent}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className={styles.faq}>
        <div className={styles.faqContainer}>
          <div className={styles.faqHeader}>
            <span className={styles.faqLabel}>FAQ</span>
            <h2 className={styles.faqTitle}>Common Questions</h2>
          </div>
          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`${styles.faqItem} ${openFaq === i ? styles.faqItemOpen : ""}`}
              >
                <button
                  className={styles.faqQuestion}
                  onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                >
                  <span>{faq.q}</span>
                  <div className={styles.faqIcon}>
                    <span />
                    <span />
                  </div>
                </button>
                <div className={styles.faqAnswer}>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <span className={styles.ctaLabel}>Get Started</span>
          <h2 className={styles.ctaTitle}>Ready to elevate your next event?</h2>
          <p className={styles.ctaText}>
            Contact us for a complimentary consultation
          </p>
          <div className={styles.ctaActions}>
            <Link href="/contact" className={styles.btnPrimaryLarge}>
              <span>Get a Free Quote</span>
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
            </Link>
            <div className={styles.ctaDivider}>
              <span>or</span>
            </div>
            <a href="tel:+372502 3599" className={styles.ctaPhone}>
              +372 502 3599
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
