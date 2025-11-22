"use client";
import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./contractCatering.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function ContractCatering() {
  const heroRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);
  const [activePartnership, setActivePartnership] = useState(0);

  const partnershipTypes = [
    {
      title: "Office & Workplace",
      description:
        "Daily meals that fuel productivity. From executive dining rooms to employee cafeterias, we create food programs that become a valued part of your company culture and employee benefits package.",
      features: [
        "Daily lunch service",
        "Executive dining",
        "Cafeteria management",
        "Pantry stocking",
      ],
      image: "/images/catering/office-workplace.jpg",
    },
    {
      title: "Educational Institutions",
      description:
        "Nutritious, appealing meals for schools, universities, and training centers. We understand the unique challenges of feeding students while meeting nutritional guidelines and budget constraints.",
      features: [
        "School meal programs",
        "University dining halls",
        "Healthy menu design",
        "Allergen management",
      ],
      image: "/images/catering/education.jpg",
    },
    {
      title: "Healthcare Facilities",
      description:
        "Specialized catering for hospitals, clinics, and care homes. Patient nutrition, staff dining, and visitor cafeterias — all managed with strict hygiene standards and dietary expertise.",
      features: [
        "Patient meal service",
        "Therapeutic diets",
        "Staff restaurants",
        "Visitor cafés",
      ],
      image: "/images/catering/healthcare.jpg",
    },
    {
      title: "Industrial & Manufacturing",
      description:
        "High-volume catering for factories, warehouses, and industrial sites. Efficient service that accommodates shift patterns, remote locations, and large workforce requirements.",
      features: [
        "Shift-based service",
        "High-volume capacity",
        "Remote site catering",
        "Vending solutions",
      ],
      image: "/images/catering/industrial.jpg",
    },
    {
      title: "Government & Public Sector",
      description:
        "Reliable catering partnerships for government offices, military facilities, and public institutions. Compliance with procurement standards and accountability requirements.",
      features: [
        "Procurement compliant",
        "Security clearance",
        "Transparent reporting",
        "Budget optimization",
      ],
      image: "/images/catering/government.jpg",
    },
  ];

  const benefits = [
    {
      number: "01",
      title: "Cost Predictability",
      description:
        "Fixed monthly rates eliminate budget surprises. We handle procurement, staffing, and operations while you enjoy transparent, predictable costs.",
    },
    {
      number: "02",
      title: "Dedicated Team",
      description:
        "Your own on-site team learns your culture, preferences, and requirements. Familiar faces that become part of your organization.",
    },
    {
      number: "03",
      title: "Quality Consistency",
      description:
        "Same high standards every day. Our quality assurance processes ensure reliable excellence across every meal, every service.",
    },
    {
      number: "04",
      title: "Flexible Scaling",
      description:
        "Easily adjust service levels as your needs change. Scale up for growth periods, accommodate seasonal fluctuations seamlessly.",
    },
    {
      number: "05",
      title: "Compliance & Safety",
      description:
        "We handle all food safety certifications, health inspections, and regulatory compliance. Peace of mind included.",
    },
    {
      number: "06",
      title: "Sustainability Focus",
      description:
        "Reduce food waste, source locally, minimize packaging. Our sustainable practices align with your corporate responsibility goals.",
    },
  ];

  const stats = [
    { value: "25+", label: "Active Contracts" },
    { value: "15K", label: "Meals Daily" },
    { value: "99.2%", label: "Service Uptime" },
    { value: "12", label: "Avg. Years Partnership" },
  ];

  const serviceModels = [
    {
      name: "Full Management",
      description:
        "We take complete responsibility for your food service operation",
      includes: [
        "Staff recruitment & training",
        "Menu planning & procurement",
        "Kitchen management",
        "Quality assurance",
        "Financial reporting",
      ],
    },
    {
      name: "Staff & Supplies",
      description: "We provide trained personnel and source all ingredients",
      includes: [
        "Trained culinary team",
        "Ingredient procurement",
        "Menu execution",
        "Daily operations",
        "Hygiene compliance",
      ],
    },
    {
      name: "Consulting & Support",
      description: "Expert guidance to optimize your existing operation",
      includes: [
        "Menu development",
        "Staff training programs",
        "Process optimization",
        "Cost analysis",
        "Quality audits",
      ],
    },
  ];

  const faqs = [
    {
      q: "What is the minimum contract duration?",
      a: "Our standard contracts start at 12 months, allowing time to implement systems and demonstrate value. Shorter pilot programs of 3-6 months are available for organizations wanting to evaluate our services before committing long-term.",
    },
    {
      q: "How is contract catering priced?",
      a: "Pricing models vary based on your needs: per-meal rates, fixed monthly fees, or cost-plus arrangements. We conduct a thorough assessment of your requirements and provide transparent pricing with no hidden costs.",
    },
    {
      q: "Can you work with our existing kitchen facilities?",
      a: "Absolutely. We assess your current facilities and either optimize existing resources or recommend improvements. We can work with full commercial kitchens, satellite prep areas, or even kitchenless solutions.",
    },
    {
      q: "How do you handle staff transitions?",
      a: "We can retain your existing catering staff through TUPE-style transfers where applicable, or recruit fresh talent. Our HR team manages all employment matters, training, and ongoing development.",
    },
    {
      q: "What reporting and oversight do we receive?",
      a: "Monthly reports cover service metrics, satisfaction scores, financial performance, and compliance status. We also conduct quarterly business reviews and provide real-time dashboards for daily monitoring.",
    },
    {
      q: "How quickly can you implement a new contract?",
      a: "Typical implementation takes 4-8 weeks depending on complexity. This includes assessment, staff transition, menu development, supplier setup, and system integration. Rush implementations possible when needed.",
    },
  ];

  const processSteps = [
    {
      number: "01",
      title: "Discovery",
      description: "Site visits, needs analysis, stakeholder interviews",
    },
    {
      number: "02",
      title: "Proposal",
      description: "Customized solution design and commercial terms",
    },
    {
      number: "03",
      title: "Transition",
      description: "Staff onboarding, systems setup, supplier integration",
    },
    {
      number: "04",
      title: "Launch",
      description: "Service commencement with enhanced support",
    },
    {
      number: "05",
      title: "Optimize",
      description: "Continuous improvement based on feedback and data",
    },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero
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

      // Stats
      const statItems = document.querySelectorAll(`.${styles.statValue}`);
      statItems.forEach((stat) => {
        const target = stat.textContent;
        const num = parseFloat(target);
        if (!isNaN(num)) {
          gsap.fromTo(
            stat,
            { innerText: 0 },
            {
              innerText: num,
              duration: 2,
              ease: "power2.out",
              snap: { innerText: num % 1 === 0 ? 1 : 0.1 },
              scrollTrigger: { trigger: stat, start: "top 85%" },
              onUpdate: function () {
                const suffix = target.replace(/[\d.]+/, "");
                const currentValue =
                  parseFloat(this.targets()[0].innerText) || 0;
                const val =
                  num % 1 === 0
                    ? Math.floor(currentValue)
                    : currentValue.toFixed(1);
                stat.textContent = val + suffix;
              },
            },
          );
        }
      });

      // Benefits
      gsap.fromTo(
        `.${styles.benefitCard}`,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
          scrollTrigger: { trigger: `.${styles.benefits}`, start: "top 70%" },
        },
      );

      // Service models
      gsap.fromTo(
        `.${styles.modelCard}`,
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: `.${styles.models}`, start: "top 70%" },
        },
      );

      // Process
      gsap.fromTo(
        `.${styles.processStep}`,
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: { trigger: `.${styles.process}`, start: "top 70%" },
        },
      );

      // FAQ
      gsap.fromTo(
        `.${styles.faqItem}`,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: `.${styles.faq}`, start: "top 70%" },
        },
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <main ref={heroRef} className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div
            className={styles.heroImage}
            style={{
              backgroundImage: "url(/images/catering/contractCatering.jpg)",
            }}
          />
          <div className={styles.heroOverlay} />
        </div>
        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>Contract Catering</span>
          <h1 className={styles.heroTitle}>
            Long-Term
            <br />
            Culinary Partnerships
          </h1>
          <div className={styles.heroLine} />
          <p className={styles.heroSubtitle}>
            More than a supplier — a dedicated partner invested in your success.
            <br />
            Comprehensive food service management tailored to your organization.
          </p>
          <div className={styles.heroActions}>
            <Link href="/contact" className={styles.btnPrimary}>
              <span>Start Partnership</span>
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
            <Link href="#partnerships" className={styles.btnGhost}>
              Partnership Types
            </Link>
          </div>
        </div>
        <div className={styles.heroScroll}>
          <span>Scroll</span>
          <div className={styles.heroScrollLine} />
        </div>
      </section>

      {/* Stats */}
      <section className={styles.stats}>
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
            <span>About</span>
          </div>
          <div className={styles.introContent}>
            <h2 className={styles.introTitle}>
              Your food service,
              <br />
              our expertise
            </h2>
            <div className={styles.introText}>
              <p>
                Contract catering transforms food service from a daily challenge
                into a strategic advantage. We become an extension of your
                organization — managing everything from menu planning to staff
                training, procurement to compliance, leaving you free to focus
                on your core business.
              </p>
              <p>
                Unlike one-off event catering, contract partnerships allow us to
                deeply understand your organization`s culture, preferences, and
                goals. We invest in your success because our success depends on
                it. The result? Consistently excellent food service that
                improves employee satisfaction, supports recruitment, and
                enhances your organizational image.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section id="partnerships" className={styles.partnerships}>
        <div className={styles.partnershipsContainer}>
          <div className={styles.partnershipsList}>
            <div className={styles.partnershipsHeader}>
              <span className={styles.partnershipsLabel}>Sectors</span>
              <h2 className={styles.partnershipsTitle}>Partnership Types</h2>
            </div>
            {partnershipTypes.map((type, i) => (
              <div
                key={i}
                className={`${styles.partnershipItem} ${activePartnership === i ? styles.partnershipItemActive : ""}`}
                onMouseEnter={() => setActivePartnership(i)}
              >
                <span className={styles.partnershipNumber}>0{i + 1}</span>
                <div className={styles.partnershipInfo}>
                  <h3 className={styles.partnershipTitle}>{type.title}</h3>
                  <p className={styles.partnershipDesc}>{type.description}</p>
                  <ul className={styles.partnershipFeatures}>
                    {type.features.map((f, j) => (
                      <li key={j}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.partnershipsVisual}>
            <div className={styles.partnershipsImageWrapper}>
              {partnershipTypes.map((type, i) => (
                <div
                  key={i}
                  className={`${styles.partnershipsImage} ${activePartnership === i ? styles.partnershipsImageActive : ""}`}
                  style={{ backgroundImage: `url(${type.image})` }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className={styles.benefits}>
        <div className={styles.benefitsHeader}>
          <span className={styles.benefitsLabel}>Advantages</span>
          <h2 className={styles.benefitsTitle}>Why Contract Catering?</h2>
          <p className={styles.benefitsSubtitle}>
            Strategic benefits that extend beyond the plate
          </p>
        </div>
        <div className={styles.benefitsGrid}>
          {benefits.map((benefit, i) => (
            <div key={i} className={styles.benefitCard}>
              <span className={styles.benefitNumber}>{benefit.number}</span>
              <h3 className={styles.benefitTitle}>{benefit.title}</h3>
              <p className={styles.benefitDesc}>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Service Models */}
      <section className={styles.models}>
        <div className={styles.modelsHeader}>
          <span className={styles.modelsLabel}>Flexibility</span>
          <h2 className={styles.modelsTitle}>Service Models</h2>
          <p className={styles.modelsSubtitle}>
            Choose the level of partnership that suits your needs
          </p>
        </div>
        <div className={styles.modelsGrid}>
          {serviceModels.map((model, i) => (
            <div key={i} className={styles.modelCard}>
              <h3 className={styles.modelName}>{model.name}</h3>
              <p className={styles.modelDesc}>{model.description}</p>
              <ul className={styles.modelIncludes}>
                {model.includes.map((item, j) => (
                  <li key={j}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Process */}
      <section className={styles.process}>
        <div className={styles.processHeader}>
          <span className={styles.processLabel}>Journey</span>
          <h2 className={styles.processTitle}>Implementation Process</h2>
        </div>
        <div className={styles.processTimeline}>
          {processSteps.map((step, i) => (
            <div key={i} className={styles.processStep}>
              <div className={styles.processStepMarker}>
                <span>{step.number}</span>
              </div>
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
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
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
          <span className={styles.ctaLabel}>Let`s Talk</span>
          <h2 className={styles.ctaTitle}>Ready for a lasting partnership?</h2>
          <p className={styles.ctaText}>
            Schedule a consultation to explore how contract catering can
            transform your organization
          </p>
          <div className={styles.ctaActions}>
            <Link href="/contact" className={styles.btnPrimaryLarge}>
              <span>Schedule Consultation</span>
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
            <a href="tel:+37255555555" className={styles.ctaPhone}>
              +372 5555 5555
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
