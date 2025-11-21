"use client";
import React, { useRef, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import GeorgiaMap from "../georgia-map/georgia-map";
import "./parallax-section.css";

gsap.registerPlugin(ScrollTrigger);

export default function ParallaxSection() {
  const params = useParams();
  const locale = params.locale || "et";

  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 430);
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Entrance animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Set initial states
      gsap.set(".parallax-background-wrapper", { opacity: 0 });
      gsap.set(".parallax-content", { opacity: 0, y: 60 });

      // Animate background wrapper (includes image and overlay)
      gsap.to(".parallax-background-wrapper", {
        opacity: 1,
        duration: 2,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".parallax-section",
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      });

      // Animate content
      gsap.to(".parallax-content", {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 0.4,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".parallax-content",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Smooth parallax scroll effect - only for desktop/tablet
  useEffect(() => {
    // Skip parallax on mobile for better performance
    if (window.innerWidth <= 768) {
      return;
    }

    let ticking = false;
    let currentScrollY = 0;

    const lerp = (start, end, factor) => {
      return start + (end - start) * factor;
    };

    const updateParallax = () => {
      if (!sectionRef.current || !imageRef.current || !textRef.current) {
        ticking = false;
        return;
      }

      const targetScrollY =
        window.pageYOffset || document.documentElement.scrollTop;
      currentScrollY = lerp(currentScrollY, targetScrollY, 0.1);

      const rect = sectionRef.current.getBoundingClientRect();
      const isInView = rect.bottom >= 0 && rect.top <= window.innerHeight + 100;

      if (isInView) {
        const sectionTop = rect.top + currentScrollY;

        // Image moves slower (parallax background effect)
        const imageSpeed = 0.3;
        const imageOffset = Math.round(
          (currentScrollY - sectionTop) * imageSpeed,
        );

        // Content moves slightly in opposite direction
        const contentSpeed = -0.02;
        const contentOffset = Math.round(
          (currentScrollY - sectionTop) * contentSpeed,
        );

        imageRef.current.style.transform = `translate3d(0, ${imageOffset}px, 0)`;
        textRef.current.style.transform = `translate3d(0, ${contentOffset}px, 0)`;
      }

      if (Math.abs(currentScrollY - targetScrollY) > 0.1) {
        requestAnimationFrame(updateParallax);
      } else {
        ticking = false;
      }
    };

    const handleScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(updateParallax);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`parallax-section ${isMobile ? "parallax-section--mobile" : ""}`}
    >
      {/* Background wrapper for proper coverage */}
      <div className="parallax-background-wrapper">
        {/* Parallax Background Image */}
        <div ref={imageRef} className="parallax-image-wrapper">
          <div
            className="parallax-image"
            style={{
              backgroundImage: `url('/images/parallax.jpg')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
        </div>

        {/* Dark Overlay */}
        <div className="parallax-overlay" />
      </div>

      {/* Georgia Map Content */}
      <div ref={textRef} className="parallax-content">
        <GeorgiaMap />
      </div>
    </section>
  );
}
