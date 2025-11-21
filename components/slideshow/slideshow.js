"use client";
import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./slideshow.css";

gsap.registerPlugin(ScrollTrigger);

export default function SlideShow() {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const contentGroupRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const contentGroup = contentGroupRef.current;
    const whiteText = container?.querySelector(".slideshow-title-white");

    if (!container || !video || !contentGroup || !whiteText) return;

    // Анимация контент-группы при загрузке
    gsap.fromTo(
      contentGroup,
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        delay: 0.3,
      },
    );

    // Создаем ScrollTrigger для расширения видео и смещения контента
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top top",
        end: "+=100%",
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
      },
    });

    // Функция для обновления маски белого текста
    const updateMask = () => {
      const videoRect = video.getBoundingClientRect();
      const textRect = whiteText.getBoundingClientRect();

      // Вычисляем верхнюю границу видео относительно текста
      const videoTop = videoRect.top - textRect.top;

      // Если видео выше текста, показываем белый текст
      if (videoTop < 0) {
        whiteText.style.clipPath = `inset(0 0 0 0)`;
      } else if (videoTop > textRect.height) {
        // Если видео ниже текста, скрываем белый текст
        whiteText.style.clipPath = `inset(100% 0 0 0)`;
      } else {
        // Видео пересекается с текстом - показываем только пересекающуюся часть
        const percentage = (videoTop / textRect.height) * 100;
        whiteText.style.clipPath = `inset(${percentage}% 0 0 0)`;
      }
    };

    // Анимация: контент-группа смещается вниз к центру, видео расширяется
    tl.to(contentGroup, {
      y: "25vh",
      duration: 0.5,
      ease: "power2.inOut",
      onUpdate: updateMask,
    }).to(
      video,
      {
        borderRadius: "10px",
        width: "90vw",
        height: "90vh",
        bottom: "5vh",
        left: "5vw",
        duration: 1,
        ease: "power2.inOut",
        onUpdate: updateMask,
      },
      0,
    );

    // Начальное обновление маски
    updateMask();

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="slideshow-container">
      <video
        ref={videoRef}
        className="slideshow-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/images/hero.mp4" type="video/mp4" />
      </video>

      <div className="slideshow-content">
        <div ref={contentGroupRef} className="slideshow-content-group">
          <h1 className="slideshow-title">
            <span className="slideshow-title-text slideshow-title-black">
              CHEF-COOKED MEALS DELIVERED TO YOUR OFFICE
            </span>
            <span
              className="slideshow-title-text slideshow-title-white"
              aria-hidden="true"
            >
              CHEF-COOKED MEALS DELIVERED TO YOUR OFFICE
            </span>
          </h1>
          <button className="slideshow-button">BOOK NOW</button>
        </div>
      </div>
    </div>
  );
}
