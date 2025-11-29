"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import styles from "./footer.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef(null);
  const shapeRef = useRef(null);
  const contentRef = useRef(null);
  const pathname = usePathname();
  const animationsRef = useRef({ shape: null, content: null });

  useEffect(() => {
    const shape = shapeRef.current;
    const footer = footerRef.current;
    const content = contentRef.current;

    if (!shape || !footer || !content) return;

    // Убиваем старые анимации если есть
    if (animationsRef.current.shape) {
      animationsRef.current.shape.kill();
    }
    if (animationsRef.current.content) {
      animationsRef.current.content.kill();
    }
    ScrollTrigger.getAll().forEach((st) => {
      if (st.vars.trigger === footer) st.kill();
    });

    // ЖЁСТКО устанавливаем начальные значения через setAttribute
    shape.setAttribute("style", "border-radius: 0 0 0 0 !important");

    const fadeElements = content.querySelectorAll(`.${styles.fadeIn}`);
    fadeElements.forEach((el) => {
      el.setAttribute(
        "style",
        "opacity: 0 !important; transform: translateY(30px) !important",
      );
    });

    // Небольшая задержка чтобы стили применились
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        // Создаём ScrollTrigger для shape
        animationsRef.current.shape = ScrollTrigger.create({
          trigger: footer,
          start: "top bottom",
          end: "top 10%",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;
            const radius = 500 * (1 - progress);
            shape.style.borderRadius = `${radius}px ${radius}px 0 0`;
          },
        });

        // Создаём ScrollTrigger для контента
        animationsRef.current.content = ScrollTrigger.create({
          trigger: footer,
          start: "top 30%",
          onEnter: () => {
            gsap.to(fadeElements, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
              overwrite: true,
            });
          },
        });

        ScrollTrigger.refresh();
      });
    });

    return () => {
      if (animationsRef.current.shape) {
        animationsRef.current.shape.kill();
        animationsRef.current.shape = null;
      }
      if (animationsRef.current.content) {
        animationsRef.current.content.kill();
        animationsRef.current.content = null;
      }
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === footer) st.kill();
      });
    };
  }, [pathname]);

  const footerLinks = {
    services: [
      { name: "Corporate Catering", href: "/services/corporate-catering" },
      { name: "Contract Catering", href: "/services/contract-catering" },
      { name: "Event Catering", href: "/services/event-catering" },
      { name: "Wedding Catering", href: "/services/wedding-catering" },
      { name: "Pop-up Catering", href: "/services/popup-catering" },
    ],
    company: [
      { name: "Home", href: "/" },
      { name: "Menu", href: "/menu/menu/georgian" },
      { name: "Drinks", href: "/menu/drinks/soft-drinks" },
      { name: "About us", href: "/about" },
      { name: "Contact", href: "/contact" },
    ],
    resources: [
      { name: "Help Center", href: "/faq" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
  };

  const socialLinks = [
    {
      name: "Instagram",
      href: "https://instagram.com",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      name: "Facebook",
      href: "https://facebook.com",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      ),
    },
  ];

  return (
    <footer ref={footerRef} className={styles.footer}>
      <div ref={shapeRef} className={styles.footerShape} />

      <div ref={contentRef} className={styles.footerContent}>
        {/* Top Section */}
        <div className={`${styles.footerTop} ${styles.fadeIn}`}>
          <div className={styles.footerBrand}>
            <div className={styles.logo}>
              <div className={styles.logoIcon}>
                <Image
                  src="/images/logo1white.png"
                  alt="Maitsev Catering Logo"
                  width={300}
                  height={300}
                  className={styles.teamLunchImage}
                />
              </div>
            </div>
            <p className={styles.brandDescription}>
              Elevating events through exceptional culinary experiences. From
              intimate gatherings to grand celebrations, we bring passion,
              precision, and creativity to every plate.
            </p>
            <div className={styles.brandStats}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>6000+</span>
                <span className={styles.statLabel}>Drinks</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>7+</span>
                <span className={styles.statLabel}>World Cuisines</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>1</span>
                <span className={styles.statLabel}>Professional Team</span>
              </div>
            </div>
          </div>

          <div className={styles.footerContact}>
            <h3 className={styles.contactTitle}>Get in Touch</h3>
            <div className={styles.contactList}>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Email</span>
                <a
                  href="mailto:info@maitsevcatering.ee"
                  className={styles.contactValue}
                >
                  info@maitsevcatering.ee
                </a>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Phone</span>
                <a href="tel:+3725023599" className={styles.contactValue}>
                  +372 502 3599
                </a>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Office</span>
                <span className={styles.contactValue}>
                  Tallinn, Estonia
                  <br />
                  Mon-Sun, 10:00-22:00
                </span>
              </div>
              <div className={styles.bottomRight}>
                <div className={styles.socialLinks}>
                  {socialLinks.map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className={`${styles.footerLinks} ${styles.fadeIn}`}>
          <div className={styles.linkColumn}>
            <h3 className={styles.linkTitle}>Services</h3>
            <ul className={styles.linkList}>
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linkColumn}>
            <h3 className={styles.linkTitle}>Company</h3>
            <ul className={styles.linkList}>
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linkColumn}>
            <h3 className={styles.linkTitle}>Resources</h3>
            <ul className={styles.linkList}>
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href}>{link.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.linkColumn}>
            <h3 className={styles.linkTitle}>Newsletter</h3>
            <p className={styles.newsletterText}>
              Get updates on new menus, special offers, and catering insights.
            </p>
            <form className={styles.newsletterForm}>
              <input
                type="email"
                placeholder="Your email"
                className={styles.newsletterInput}
              />
              <button type="submit" className={styles.newsletterButton}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={`${styles.footerBottom} ${styles.fadeIn}`}>
          <div className={styles.bottomLeft}>
            <p className={styles.copyright}>
              © 2025 Maitsev Catering. All rights reserved.
            </p>
          </div>
          <div className={styles.developedBy}>
            <p className={styles.bronicLabs}>
              Developed & Designed by{" "}
              <a
                href="https://www.broniclabs.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.bronicLabsLink}
              >
                Bronic Labs
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
