"use client";
import React, { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./about.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const heroRef = useRef(null);
  const introRef = useRef(null);
  const teamRef = useRef(null);
  const processRef = useRef(null);
  const capabilitiesRef = useRef(null);
  const whyUsRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const sections = [
      heroRef,
      introRef,
      teamRef,
      processRef,
      capabilitiesRef,
      whyUsRef,
    ];

    sections.forEach((ref) => {
      if (!ref.current) return;

      const section = ref.current;
      const fadeElements = section.querySelectorAll(".fade-in");

      if (fadeElements.length > 0) {
        gsap.fromTo(
          fadeElements,
          { opacity: 0, y: 60 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
            },
          },
        );
      }

      const slideElements = section.querySelectorAll(".slide-in");
      if (slideElements.length > 0) {
        gsap.fromTo(
          slideElements,
          { opacity: 0, x: -80 },
          {
            opacity: 1,
            x: 0,
            duration: 1,
            stagger: 0.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
            },
          },
        );
      }
    });

    // Hero animation
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current.querySelector(".hero-title"),
        { opacity: 0, y: 80 },
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
      );

      gsap.fromTo(
        heroRef.current.querySelector(".hero-subtitle"),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" },
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, [pathname]);

  const teamMembers = [
    {
      title: "Executive Chef",
      name: "International Culinary Experience",
      description:
        "Our head chef brings 15+ years of experience from Michelin-starred restaurants across Europe. Specializing in fusion cuisine that combines Estonian traditions with modern techniques.",
    },
    {
      title: "Master Sommelier",
      name: "Wine & Beverage Director",
      description:
        "Certified sommelier with extensive knowledge of European and New World wines. Creates perfect pairings for every menu and manages our premium beverage selection of 6000+ options.",
    },
    {
      title: "Pastry Chef",
      name: "Confectionery Artist",
      description:
        "Award-winning pastry chef specializing in custom desserts and wedding cakes. Every creation is a work of edible art designed to wow your guests.",
    },
    {
      title: "Event Coordinator",
      name: "Logistics & Planning",
      description:
        "Orchestrates every detail from initial consultation to final cleanup. With 10+ years in event management, ensures flawless execution of your vision.",
    },
    {
      title: "Sous Chefs Team",
      name: "Culinary Excellence",
      description:
        "Our brigade of skilled sous chefs specializes in different world cuisines - Georgian, Italian, Asian, Nordic, and more. Each brings authentic expertise to their specialty.",
    },
    {
      title: "Service Staff",
      name: "Professional Hospitality",
      description:
        "Trained hospitality professionals who understand that service is an art. Friendly, attentive, and always ensuring your guests feel valued.",
    },
  ];

  const process = [
    {
      number: "01",
      title: "Initial Consultation",
      description:
        "We meet to understand your vision, guest count, dietary requirements, and budget. This is where we get to know you and your event's unique needs.",
    },
    {
      number: "02",
      title: "Custom Menu Design",
      description:
        "Our chefs create a tailored menu proposal with tasting options. We consider seasonality, dietary restrictions, and your personal preferences.",
    },
    {
      number: "03",
      title: "Venue Coordination",
      description:
        "We work with your chosen venue or help you find the perfect location from our network of partner spaces across Estonia.",
    },
    {
      number: "04",
      title: "Preparation & Setup",
      description:
        "Our team arrives early to set up kitchen, dining areas, and décor. Every detail is checked and double-checked before guests arrive.",
    },
    {
      number: "05",
      title: "Flawless Execution",
      description:
        "On event day, our full team delivers impeccable service while you enjoy your celebration worry-free.",
    },
    {
      number: "06",
      title: "Post-Event Care",
      description:
        "We handle all cleanup and follow up to ensure you're completely satisfied. Your feedback helps us continuously improve.",
    },
  ];

  const capabilities = [
    {
      title: "Full-Service Kitchen",
      description:
        "Mobile kitchen equipment for on-site cooking, ensuring restaurant-quality freshness wherever your event takes place.",
    },
    {
      title: "Partner Venues",
      description:
        "Exclusive partnerships with premium venues in Tallinn and across Estonia - from historic manors to modern event spaces.",
    },
    {
      title: "Equipment & Décor",
      description:
        "Complete rental inventory including tables, chairs, linens, tableware, glassware, and decorative elements.",
    },
    {
      title: "Bar Services",
      description:
        "Professional bartenders, premium spirits, craft cocktails, and an extensive wine cellar featuring 6000+ selections.",
    },
    {
      title: "Dietary Accommodations",
      description:
        "Expert handling of all dietary needs - vegan, vegetarian, gluten-free, kosher, halal, and specific allergies.",
    },
    {
      title: "Multi-Cuisine Expertise",
      description:
        "Authentic dishes from 7+ world cuisines: Estonian, Georgian, Italian, Asian, Nordic, French, and Middle Eastern.",
    },
  ];

  const whyChooseUs = [
    {
      title: "Local & Sustainable",
      description:
        "We partner with Estonian farms and suppliers, supporting local economy while ensuring the freshest seasonal ingredients.",
    },
    {
      title: "Transparent Pricing",
      description:
        "No hidden fees. Detailed quotes that break down every cost, so you know exactly what you're paying for.",
    },
    {
      title: "Flexible & Adaptive",
      description:
        "Last-minute guest changes? Dietary restrictions? Weather concerns? We adapt quickly to ensure success.",
    },
    {
      title: "Proven Track Record",
      description:
        "500+ successful events, from intimate dinners for 10 to grand celebrations for 500+ guests.",
    },
  ];

  return (
    <div className={styles.container}>
      {/* Hero */}
      <section ref={heroRef} className={styles.hero}>
        <div className={styles.logo}>
          <img src="/images/logo1white.png"></img>
        </div>
        <div className={styles.heroContent}>
          <h1 className="hero-title" className={styles.heroTitle}>
            Your Event, Our Passion
          </h1>
          <p className="hero-subtitle" className={styles.heroSubtitle}>
            Professional catering services in Estonia, delivering exceptional
            culinary experiences since our founding. From corporate events to
            dream weddings, we bring expertise, creativity, and flawless
            execution to every occasion.
          </p>
        </div>
      </section>

      {/* Intro */}
      <section ref={introRef} className={styles.intro}>
        <div className={styles.container1200}>
          <h2 className={`fade-in ${styles.sectionTitle}`}>Who We Are</h2>
          <p className={`fade-in ${styles.introParagraph}`}>
            Maitsev Catering is Estonia's premier full-service catering company,
            built on a foundation of culinary excellence and impeccable service.
            We're not just caterers – we're event partners who take pride in
            turning your vision into reality.
          </p>
          <p className={`fade-in ${styles.introParagraph}`}>
            Based in Tallinn, we serve clients throughout Estonia with a team of
            dedicated professionals who bring decades of combined experience in
            hospitality, culinary arts, and event management. Whether you're
            planning an intimate gathering or a large-scale celebration, we have
            the expertise, resources, and passion to exceed your expectations.
          </p>
        </div>
      </section>

      {/* Team Section */}
      <section ref={teamRef} className={styles.team}>
        <div className={styles.container1200}>
          <h2 className={`fade-in ${styles.sectionTitleLight}`}>
            Our Professional Team
          </h2>
          <p className={`fade-in ${styles.teamIntro}`}>
            Behind every successful event is a team of passionate professionals.
            Meet the people who will make your celebration unforgettable.
          </p>
          <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <div key={index} className={`fade-in ${styles.teamCard}`}>
                <div className={styles.teamRole}>{member.title}</div>
                <h3 className={styles.teamName}>{member.name}</h3>
                <p className={styles.teamDescription}>{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section ref={processRef} className={styles.process}>
        <div className={styles.container1200}>
          <h2 className={`fade-in ${styles.sectionTitle}`}>How We Work</h2>
          <p className={`fade-in ${styles.processIntro}`}>
            Our proven process ensures nothing is left to chance. From first
            contact to final cleanup, we handle every detail with precision and
            care.
          </p>
          <div className={styles.processGrid}>
            {process.map((step, index) => (
              <div key={index} className={`slide-in ${styles.processCard}`}>
                <div className={styles.processNumber}>{step.number}</div>
                <h3 className={styles.processTitle}>{step.title}</h3>
                <p className={styles.processDescription}>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section ref={capabilitiesRef} className={styles.capabilities}>
        <div className={styles.container1200}>
          <h2 className={`fade-in ${styles.sectionTitleLight}`}>
            What We Bring to Your Event
          </h2>
          <div className={styles.capabilitiesGrid}>
            {capabilities.map((item, index) => (
              <div key={index} className={`fade-in ${styles.capabilityCard}`}>
                <h3 className={styles.capabilityTitle}>{item.title}</h3>
                <p className={styles.capabilityDescription}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section ref={whyUsRef} className={styles.whyUs}>
        <div className={styles.container1200}>
          <h2 className={`fade-in ${styles.sectionTitle}`}>
            Why Choose Maitsev Catering
          </h2>
          <div className={styles.whyUsGrid}>
            {whyChooseUs.map((reason, index) => (
              <div key={index} className={`fade-in ${styles.whyUsCard}`}>
                <h3 className={styles.whyUsTitle}>{reason.title}</h3>
                <p className={styles.whyUsDescription}>{reason.description}</p>
              </div>
            ))}
          </div>
          <div className={`fade-in ${styles.cta}`}>
            <h3 className={styles.ctaTitle}>Ready to Start Planning?</h3>
            <p className={styles.ctaText}>
              Let's create something extraordinary together. Contact us today
              for a consultation and detailed proposal tailored to your event.
            </p>
            <button className={styles.ctaButton}>Get in Touch</button>
          </div>
        </div>
      </section>
    </div>
  );
}
