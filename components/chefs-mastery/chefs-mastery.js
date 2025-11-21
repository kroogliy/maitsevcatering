"use client";
import React, { useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./chefs-mastery.css";

gsap.registerPlugin(ScrollTrigger);

export default function ChefsMastery() {
  const params = useParams();
  const locale = params.locale || "et";
  const sectionRef = useRef(null);

  // Localized content for chefs - Only Georgian chefs
  const getContent = () => {
    switch (locale) {
      case "ru":
        return {
          titleFirstLine: "Мастера",
          titleSecondLine: "грузинской кухни",
          chefs: [
            {
              id: 0,
              name: "Наши шеф-повара",
              role: "Команда профессионалов с многолетним опытом",
              image: "/images/bgone.jpg",
              cookingImage: "/images/slideten.jpg",
              skills:
                "Наши шеф-повара отличаются точностью и уважением к традициям. Они создают блюда, которые раскрывают настоящий характер грузинской кухни, сочетая мастерство и любовь к каждой детали",
              sectionTitle: "Хранители грузинского наследия",
            },
          ],
        };
      case "en":
        return {
          titleFirstLine: "Masters of",
          titleSecondLine: "Georgian cuisine",
          chefs: [
            {
              id: 0,
              name: "Our chefs",
              role: "A team of professionals with many years of experience",
              image: "/images/bgtwo.jpg",
              cookingImage: "/images/slideten.jpg",
              skills:
                "Our chefs are known for their precision and respect for tradition. They create dishes that reveal the true character of Georgian cuisine, combining skill and attention to detail",
              sectionTitle: "Guardians of Georgian heritage",
            },
          ],
        };
      default: // 'et'
        return {
          titleFirstLine: "Gruusia köögi",
          titleSecondLine: "meistrid",
          chefs: [
            {
              id: 0,
              name: "Meie kokad",
              role: "Mitmeaastase kogemusega professionaalide meeskond",
              image: "/images/bgone.jpg",
              cookingImage: "/images/slideten.jpg",
              skills:
                "Meie kokad on tuntud oma täpsuse ja traditsioonide austamise poolest. Nad loovad roogasid, mis peegeldavad Gruusia köögi tõelist olemust, ühendades oskused ja tähelepanu detailidele",
              sectionTitle: "Gruusia kultuuripärandi kaitsjad",
            },
          ],
        };
    }
  };

  const content = getContent();

  // Animations setup
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Configure ScrollTrigger for better performance
    ScrollTrigger.config({
      autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize",
      syncInterval: 40,
    });

    // Don't use normalizeScroll - it conflicts with Lenis
    // ScrollTrigger.normalizeScroll(true);

    // Set initial states only for number and titles
    gsap.set(".mastery-number", { opacity: 0, y: 100 });
    gsap.set(".mastery-title-first", { opacity: 0, y: 100 });
    gsap.set(".mastery-title-second", { opacity: 0, y: 100 });

    // Helper function to detect mobile/tablet
    const isMobile = () => window.innerWidth <= 992;
    const isTablet = () => window.innerWidth > 768 && window.innerWidth <= 992;

    // Wait for fonts and images
    const setupAnimations = () => {
      // Ensure all images are loaded before calculating positions
      const images = section.querySelectorAll("img");
      const imagePromises = Array.from(images).map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener("load", resolve);
          img.addEventListener("error", resolve);
        });
      });

      Promise.all(imagePromises).then(() => {
        // Refresh ScrollTrigger after images are loaded
        ScrollTrigger.refresh();

        // Adjust scroll trigger positions based on viewport
        const getScrollStart = () => {
          if (window.innerWidth <= 768) return "top 85%";
          if (window.innerWidth <= 992) return "top 82%";
          return "top 80%";
        };

        // Main title animation
        const titleTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: getScrollStart(),
            end: "top 20%",
            toggleActions: "play none none reverse",
            refreshPriority: 1, // Higher priority than menu-section
          },
        });

        // Animate number
        titleTl.fromTo(
          ".mastery-number",
          { opacity: 0, y: 100 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        );

        titleTl.fromTo(
          ".mastery-title-first",
          { opacity: 0, y: 100 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          "-=0.5",
        );

        titleTl.fromTo(
          ".mastery-title-second",
          { opacity: 0, y: 100 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          "-=0.7",
        );

        // Chef blocks - only parallax effects, no entry animations
        const chefBlocks = section.querySelectorAll(".chef-block");

        chefBlocks.forEach((block, index) => {
          const image = block.querySelector(".chef-main-image");
          const name = block.querySelector(".chef-name-large");
          const role = block.querySelector(".chef-role-large");
          const card = block.querySelector(".parallax-card");

          // Parallax effect for the white card - adjusted for different viewports
          if (card) {
            const getCardMovement = () => {
              if (window.innerWidth <= 480) return -50;
              if (window.innerWidth <= 768) return -80;
              if (window.innerWidth <= 992) return -120;
              return -200;
            };

            gsap.fromTo(
              card,
              {
                y: 0,
              },
              {
                y: getCardMovement(),
                ease: "none",
                force3D: true,
                scrollTrigger: {
                  trigger: block,
                  start: isMobile() ? "top 95%" : "top bottom",
                  end: isMobile() ? "bottom 5%" : "bottom top",
                  scrub: isMobile() ? 1 : 1.5,
                  invalidateOnRefresh: true,
                  markers: false,
                  refreshPriority: 0, // Normal priority for parallax
                  onRefresh: (self) => {
                    // Update animation values on resize
                    self.animation.vars.y = getCardMovement();
                  },
                },
              },
            );
          }

          // Image parallax effect - adjusted for mobile/tablet
          if (image && !isMobile()) {
            gsap.fromTo(
              image,
              {
                scale: 1.05,
                y: 0,
              },
              {
                scale: 1.08,
                y: -30,
                force3D: true,
                will: "transform",
                scrollTrigger: {
                  trigger: block,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 2,
                  invalidateOnRefresh: true,
                  refreshPriority: 0, // Normal priority for parallax
                },
              },
            );
          } else if (image) {
            // Simpler effect for mobile
            gsap.set(image, { scale: 1.05 });
          }

          // Subtle parallax for text elements - only on desktop
          if (name && role && !isMobile()) {
            gsap.to([name, role], {
              y: -20,
              force3D: true,
              scrollTrigger: {
                trigger: block,
                start: "top bottom",
                end: "bottom top",
                scrub: 3,
                invalidateOnRefresh: true,
                refreshPriority: 0, // Normal priority for parallax
              },
            });
          }
        });

        // Sort ScrollTriggers by priority and refresh
        ScrollTrigger.sort();

        // Refresh after setup with delay for Lenis
        setTimeout(() => {
          ScrollTrigger.refresh();

          // Dispatch event to notify that this section is ready
          window.dispatchEvent(
            new CustomEvent("chefsMasteryReady", {
              detail: {
                sectionHeight: section.offsetHeight,
                initialized: true,
              },
            }),
          );
        }, 100);
      }); // End of Promise.all for images
    };

    // Check if loading wrapper is active
    const checkLoadingWrapper = () => {
      // Check if the content is hidden by GlobalLoadingWrapper
      const contentWrapper = section.closest('[style*="opacity"]');
      const isHidden =
        contentWrapper &&
        (window.getComputedStyle(contentWrapper).opacity === "0" ||
          window.getComputedStyle(contentWrapper).visibility === "hidden");

      if (isHidden) {
        // Wait for loading wrapper to close
        const handleLoadingWrapperClosed = (event) => {
          window.removeEventListener(
            "loadingWrapperClosed",
            handleLoadingWrapperClosed,
          );

          // Small delay to ensure DOM is fully visible
          setTimeout(() => {
            setupAnimations();
          }, 100);
        };

        window.addEventListener(
          "loadingWrapperClosed",
          handleLoadingWrapperClosed,
        );
      } else {
        // No loading wrapper or already visible
        setupAnimations();
      }
    };

    // Check if document is already loaded
    if (
      document.readyState === "complete" ||
      document.readyState === "interactive"
    ) {
      checkLoadingWrapper();
    } else {
      window.addEventListener("DOMContentLoaded", checkLoadingWrapper);
    }

    // Handle resize events
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 250);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      // Clean up loading wrapper listener if it exists
      window.removeEventListener("loadingWrapperClosed", () => {});
      window.removeEventListener("resize", handleResize);

      clearTimeout(resizeTimer);
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.killTweensOf(".chef-main-image");
      gsap.killTweensOf(".parallax-card");
      gsap.killTweensOf(".chef-name-large");
      gsap.killTweensOf(".chef-role-large");
    };
  }, []);

  return (
    <section ref={sectionRef} className="chefs-mastery-section">
      <div className="mastery-container">
        {/* Header Section with Number (like intro.js) */}
        <div className="mastery-header">
          {/* Number Typography */}
          <div className="mastery-number">03</div>

          {/* Content Group */}
          <div className="mastery-content-group">
            {/* Main Title */}
            <h2 className="mastery-main-title">
              <span className="mastery-title-first">
                {content.titleFirstLine}
              </span>
              <span className="mastery-title-second">
                {content.titleSecondLine}
              </span>
            </h2>
          </div>
        </div>

        {/* Chef Blocks */}
        {content.chefs.map((chef, index) => (
          <div key={chef.id} className="chef-block">
            {/* Section Title Overlay */}
            <div className="section-title-overlay">
              <h3 className="section-title-text">{chef.sectionTitle}</h3>
            </div>

            {/* Chef Image Side */}
            <div className="chef-image-side">
              <img
                src={chef.image}
                alt={chef.name}
                className="chef-main-image"
                loading="eager"
                width="960"
                height="1080"
              />
            </div>

            {/* Chef Content Side */}
            <div className="chef-content-side">
              {/* Chef Name */}
              <h3 className="chef-name-large">{chef.name}</h3>

              {/* Parallax White Card */}
              <div className="parallax-card">
                <p className="card-skills-text">{chef.skills}</p>
                <div className="card-cooking-image">
                  <img
                    src={chef.cookingImage}
                    alt={`${chef.name} cooking`}
                    loading="eager"
                    width="500"
                    height="350"
                  />
                </div>
              </div>

              {/* Chef Role */}
              <p className="chef-role-large">{chef.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
