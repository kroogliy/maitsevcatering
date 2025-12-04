"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./faq.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function FAQ() {
  const sectionRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(null);

  const faqData = [
    {
      category: "General",
      questions: [
        {
          q: "How far in advance should I book catering for my event?",
          a: "We recommend booking at least 2-4 weeks in advance for smaller events (up to 50 guests) and 4-8 weeks for larger gatherings. For weddings and major corporate events, we suggest reaching out 2-3 months ahead to ensure availability and allow time for menu tastings and detailed planning.",
        },
        {
          q: "What is the minimum number of guests you cater for?",
          a: "Our minimum varies by service type. For corporate events and private parties, we cater for groups of 15 or more. Wedding catering starts at 30 guests. For intimate gatherings under 15 people, we offer our exclusive private chef experience with customized pricing.",
        },
        {
          q: "Do you provide tastings before booking?",
          a: "Yes, we offer complimentary menu tastings for events of 75+ guests. For smaller events, we provide tastings at a nominal fee that is credited toward your final booking. Tastings typically include 5-7 dishes from your proposed menu and allow us to fine-tune selections to your preferences.",
        },
        {
          q: "What areas do you serve?",
          a: "We primarily serve Tallinn and the greater Harju County region. For events outside this area, we accommodate requests within Estonia and neighboring countries for an additional travel fee. Contact us for specific location inquiries.",
        },
      ],
    },
    {
      category: "Menus & Cuisine",
      questions: [
        {
          q: "What cuisine styles do you offer?",
          a: "Our culinary team specializes in a diverse range of cuisines including Georgian, Italian, French, Mediterranean, Asian Fusion, and Japanese (including sushi). We also excel at modern European cuisine, street food concepts, and custom fusion menus. Each menu is crafted to match your event's theme and preferences.",
        },
        {
          q: "Do you take dietary restrictions and allergies into account?",
          a: "Absolutely. We have extensive experience working with vegetarians, vegans, people with gluten and lactose intolerance, as well as halal, kosher, and nut-free requirements. Our kitchen follows strict protocols to prevent cross-contamination. Please let us know about any dietary requirements when booking so that we can create safe and delicious alternatives. For example, we provide gluten-free and lactose-free options for: pasta, pizza, sushi.",
        },
        {
          q: "Can I customize the menu for my event?",
          a: "Menu customization is at the heart of what we do. We work closely with you to create a personalized menu that reflects your vision, preferences, and budget. Whether you want a specific signature dish, themed cuisine, or fusion of multiple styles, our chefs will bring your ideas to life.",
        },
        {
          q: "Do you source local and seasonal ingredients?",
          a: "Yes, sustainability and freshness are core to our philosophy. We partner with local Estonian farms, fisheries, and artisan producers. Our menus change seasonally to showcase the best available ingredients, ensuring superior taste while supporting local communities.",
        },
      ],
    },
    {
      category: "Beverages & Bar",
      questions: [
        {
          q: "What beverage services do you offer?",
          a: "We provide comprehensive beverage services including full bar setup, wine pairing, craft cocktails, champagne service, and non-alcoholic options. Our collection includes 6,000+ selections across 17+ categories — from everyday favorites to rare collectibles sourced directly without intermediaries.",
        },
        {
          q: "Can you provide sommelier services for wine selection?",
          a: "Yes, our certified sommeliers offer expert consultation for wine selection, food pairing recommendations, and on-site service. They can curate wine lists tailored to your menu and budget, from accessible everyday wines to prestigious vintages for special occasions.",
        },
        {
          q: "Do you offer non-alcoholic and mocktail options?",
          a: "We create sophisticated non-alcoholic experiences including craft mocktails, premium juices, specialty coffees, and curated tea selections. Our mixologists design alcohol-free cocktails that are just as complex and elegant as their traditional counterparts.",
        },
        {
          q: "Can you accommodate specific alcohol brands or requests?",
          a: "Certainly. If you have preferred brands, specific vintages, or rare spirits in mind, we can source them for your event. Our direct supplier relationships give us access to an extensive selection, and we're happy to accommodate special requests with advance notice.",
        },
      ],
    },
    {
      category: "Event Types",
      questions: [
        {
          q: "What types of corporate events do you cater?",
          a: "We handle all corporate catering needs: board meetings, conferences, product launches, team buildings, gala dinners, holiday parties, and daily office catering. We understand corporate requirements including timing precision, dietary diversity, and professional presentation that reflects your company's image.",
        },
        {
          q: "Do you offer wedding catering packages?",
          a: "Yes, we offer comprehensive wedding packages that include menu planning, tastings, full service staff, bar services, and coordination with your venue and planners. From intimate ceremonies to grand celebrations, we create memorable culinary experiences for your special day.",
        },
        {
          q: "What is contract catering and how does it work?",
          a: "Contract catering is our long-term partnership solution for businesses, institutions, and organizations needing regular food services. We manage everything from daily employee meals to executive dining, with customized menus, dedicated staff, and flexible arrangements tailored to your organization's culture and needs.",
        },
        {
          q: "Can you do pop-up events and food festivals?",
          a: "Pop-up events are our specialty. We bring fully equipped mobile kitchens, creative street food concepts, and festival-ready setups to any location. Whether it's a brand activation, outdoor festival, or unique venue, we deliver exceptional food experiences anywhere.",
        },
      ],
    },
    {
      category: "Service & Logistics",
      questions: [
        {
          q: "What is included in your catering service?",
          a: "Our full-service catering includes menu planning, food preparation, delivery, professional setup, service staff, tableware (upon request), and complete cleanup (upon request). We handle every detail so you can focus on your guests. Equipment rental, decoration, and bar services are available as add-ons.",
        },
        {
          q: "Do you provide staff for events?",
          a: "Yes, we provide professionally trained service staff including servers, bartenders, chefs for live cooking stations, and event coordinators. Our team is experienced in formal service, casual events, and everything in between. Staff-to-guest ratios are optimized based on your event style.",
        },
        {
          q: "Can you work with our venue's restrictions?",
          a: "We regularly work within venue-specific requirements including kitchen limitations, approved vendor lists, noise restrictions, and timing constraints. Our team coordinates directly with venue management to ensure seamless execution while respecting all guidelines.",
        },
        {
          q: "What happens if guest count changes before the event?",
          a: "We understand events are dynamic. Final guest counts are typically confirmed 5-7 days before your event. Minor adjustments (±10%) can often be accommodated closer to the date. For significant changes, we work with you to adjust the menu and pricing accordingly.",
        },
      ],
    },
    {
      category: "Pricing & Booking",
      questions: [
        {
          q: "How is catering pricing calculated?",
          a: "Pricing is customized based on guest count, menu complexity, service style, staffing needs, and event duration. We offer transparent per-person pricing for most events. After our initial consultation, you'll receive a detailed proposal with itemized costs and no hidden fees.",
        },
        {
          q: "What is your payment and cancellation policy?",
          a: "We require a 30% deposit to secure your date, with the remaining balance due 7 days before the event. Cancellations made 14+ days in advance receive a full deposit refund. Cancellations within 14 days are subject to our cancellation fee schedule, detailed in your contract.",
        },
        {
          q: "Do you offer packages for different budgets?",
          a: "Yes, we create proposals across various budget ranges without compromising quality. From elegant yet economical buffets to premium plated dinners with wine pairing, we work within your budget to deliver the best possible experience. Transparency about your budget helps us tailor the perfect solution.",
        },
        {
          q: "How do I get started with booking?",
          a: "Simply fill out our inquiry form or contact us directly. We'll schedule a consultation to discuss your event vision, preferences, and requirements. From there, we'll provide a customized proposal, arrange tastings if desired, and guide you through every step until your successful event.",
        },
      ],
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const header = section.querySelector(`.${styles.header}`);
    const categories = section.querySelectorAll(`.${styles.category}`);

    gsap.fromTo(
      header,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          once: true,
        },
      },
    );

    categories.forEach((cat, index) => {
      gsap.fromTo(
        cat,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          delay: index * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cat,
            start: "top 85%",
            once: true,
          },
        },
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <section ref={sectionRef} className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.label}>FAQ</span>
          <h2 className={styles.title}>Frequently Asked Questions</h2>
          <p className={styles.subtitle}>
            Everything you need to know about our catering services. Can`t find
            the answer you`re looking for? Feel free to contact our team.
          </p>
        </div>

        <div className={styles.faqGrid}>
          {faqData.map((category, catIndex) => (
            <div key={catIndex} className={styles.category}>
              <h3 className={styles.categoryTitle}>{category.category}</h3>
              <div className={styles.questions}>
                {category.questions.map((item, qIndex) => {
                  const isOpen = openIndex === `${catIndex}-${qIndex}`;
                  return (
                    <div
                      key={qIndex}
                      className={`${styles.questionItem} ${isOpen ? styles.open : ""}`}
                    >
                      <button
                        className={styles.questionButton}
                        onClick={() => toggleQuestion(catIndex, qIndex)}
                        aria-expanded={isOpen}
                      >
                        <span className={styles.questionText}>{item.q}</span>
                        <span className={styles.questionIcon}>
                          <span className={styles.iconLine} />
                          <span
                            className={`${styles.iconLine} ${styles.iconLineVertical}`}
                          />
                        </span>
                      </button>
                      <div className={styles.answerWrapper}>
                        <div className={styles.answer}>
                          <p>{item.a}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
