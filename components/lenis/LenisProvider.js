"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export default function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const rafRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    // Check if we're in browser
    if (typeof window === "undefined") return;

    // Detect device type and capabilities
    const isMobile = window.innerWidth < 768;
    const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
    const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isIOS =
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    let lenis;

    if (isTouch || isMobile || isTablet) {
      // MOBILE/TOUCH CONFIGURATION - Near-native scroll
      lenis = new Lenis({
        // Very fast duration for native-like feel
        duration: 0.5, // Much faster animation
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,

        // Touch settings optimized for native feel
        smoothTouch: true, // Disable smooth for more native feel on touch
        touchMultiplier: 1.5, // Slightly higher for responsive feel
        wheelMultiplier: 1.5,

        // Minimal lerp for almost instant response
        lerp: 0.7, // Higher lerp = faster response, closer to native

        // iOS specific settings
        syncTouch: true,
        syncTouchLerp: 0.1,
        touchInertiaMultiplier: 35, // Higher for more native iOS momentum

        // Basic settings
        infinite: false,
        autoResize: true,
        prevent: false,
        normalizeWheel: false,
      });

      lenisRef.current = lenis;
      window.lenis = lenis;

      // Simple RAF for mobile
      function raf(time) {
        lenis.raf(time);
        rafRef.current = requestAnimationFrame(raf);
      }

      rafRef.current = requestAnimationFrame(raf);

      // Prevent iOS bounce but keep native feel
      if (isIOS) {
        let startY = 0;

        const handleTouchStart = (e) => {
          startY = e.touches[0].pageY;
        };

        const handleTouchMove = (e) => {
          const y = e.touches[0].pageY;
          // Only prevent bounce at edges
          if (
            (lenis.scroll <= 0 && y > startY) ||
            (lenis.scroll >= lenis.limit && y < startY)
          ) {
            e.preventDefault();
          }
        };

        document.addEventListener("touchstart", handleTouchStart, {
          passive: true,
        });
        document.addEventListener("touchmove", handleTouchMove, {
          passive: false,
        });

        // Cleanup for iOS
        return () => {
          document.removeEventListener("touchstart", handleTouchStart);
          document.removeEventListener("touchmove", handleTouchMove);
          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          if (lenis) lenis.destroy();
        };
      }

      // Handle resize
      const handleResize = () => {
        if (lenis) lenis.resize();
      };

      window.addEventListener("resize", handleResize, { passive: true });

      // Cleanup
      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        window.removeEventListener("resize", handleResize);
        if (lenis) lenis.destroy();
        if (window.lenis) window.lenis = null;
      };
    } else {
      // DESKTOP CONFIGURATION - Keep smooth
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 1,
        wheelMultiplier: 1,
        normalizeWheel: true,
        infinite: false,
        autoResize: true,
        lerp: 0.08,
      });

      lenisRef.current = lenis;
      window.lenis = lenis;

      // ScrollTrigger integration for desktop
      if (window.ScrollTrigger) {
        lenis.on("scroll", () => {
          window.ScrollTrigger.update();
        });

        window.ScrollTrigger.scrollerProxy(document.body, {
          scrollTop(value) {
            if (arguments.length) {
              lenis.scrollTo(value, { immediate: true });
            }
            return lenis.scroll;
          },
          getBoundingClientRect() {
            return {
              top: 0,
              left: 0,
              width: window.innerWidth,
              height: window.innerHeight,
            };
          },
        });

        window.ScrollTrigger.addEventListener("refresh", () => {
          lenis.resize();
        });
      }

      // Modal state management
      let isModalOpen = false;

      function checkModalState() {
        if (document.body.classList.contains("modal-page-scroll")) {
          return false;
        }

        return (
          document.body.classList.contains("modal-open") ||
          document.documentElement.classList.contains("modal-open") ||
          document.body.classList.contains("ReactModal__Body--open") ||
          document.body.classList.contains("hamburger-open") ||
          document.body.style.overflow === "hidden"
        );
      }

      // Animation loop for desktop
      function raf(time) {
        const modalOpen = checkModalState();

        if (modalOpen && !isModalOpen) {
          lenis.stop();
          isModalOpen = true;
        } else if (!modalOpen && isModalOpen) {
          lenis.start();
          isModalOpen = false;
        }

        if (!modalOpen) {
          lenis.raf(time);
        }

        rafRef.current = requestAnimationFrame(raf);
      }

      // Handle resize
      let resizeTimeout;
      const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
          if (lenis) {
            lenis.resize();
            if (window.ScrollTrigger) {
              window.ScrollTrigger.refresh();
            }
          }
        }, 150);
      };

      // DOM observer for modals
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (
            mutation.attributeName === "class" ||
            mutation.attributeName === "style"
          ) {
            const modalOpen = checkModalState();

            if (modalOpen && !isModalOpen) {
              lenis.stop();
              isModalOpen = true;
            } else if (!modalOpen && isModalOpen) {
              lenis.start();
              isModalOpen = false;
            }
          }
        });
      });

      // Add event listeners
      window.addEventListener("resize", handleResize, { passive: true });

      observer.observe(document.body, {
        attributes: true,
        attributeFilter: ["class", "style"],
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "style"],
      });

      // Start animation loop
      rafRef.current = requestAnimationFrame(raf);

      // Global functions
      window.lenisControl = {
        stop: () => {
          if (lenis) lenis.stop();
        },
        start: () => {
          if (lenis) lenis.start();
        },
        scrollTo: (target, options = {}) => {
          if (lenis) {
            const isMobile = window.innerWidth < 1024;
            lenis.scrollTo(target, {
              duration: isMobile ? 0.4 : 1.2,
              ...options,
            });
          }
        },
      };

      window.scrollToTop = () => {
        if (lenis) {
          const isMobile = window.innerWidth < 1024;
          lenis.scrollTo(0, { duration: isMobile ? 0.4 : 1.2 });
        }
      };

      // Cleanup for desktop
      return () => {
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
        }

        clearTimeout(resizeTimeout);
        window.removeEventListener("resize", handleResize);
        observer.disconnect();

        if (lenisRef.current) {
          lenisRef.current.destroy();
          lenisRef.current = null;
        }

        if (window.lenis) window.lenis = null;
        if (window.scrollToTop) window.scrollToTop = null;
        if (window.lenisControl) window.lenisControl = null;
      };
    }
  }, []);

  // Update on route change
  useEffect(() => {
    const refreshTimer = setTimeout(() => {
      if (lenisRef.current) {
        lenisRef.current.resize();
        lenisRef.current.start();

        // Reset scroll position on route change for mobile
        if (window.innerWidth < 1024) {
          lenisRef.current.scrollTo(0, { immediate: true });
        }
      }

      if (window.ScrollTrigger) {
        window.ScrollTrigger.refresh();
      }
    }, 100);

    return () => clearTimeout(refreshTimer);
  }, [pathname]);

  return <>{children}</>;
}
