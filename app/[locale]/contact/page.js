"use client";
import React, { useRef, useEffect, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./contactPage.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function ContactPage() {
  const pageRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    budget: "",
    message: "",
  });
  const [activeMethod, setActiveMethod] = useState("email");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const contactMethods = [
    {
      id: "email",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      title: "Email Us",
      value: "events@catering.ee",
      description: "We respond within 24 hours",
      link: "mailto:events@catering.ee",
    },
    {
      id: "phone",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      title: "Call Us",
      value: "+372 5555 5555",
      description: "Mon-Fri, 9:00-18:00 EET",
      link: "tel:+37255555555",
    },
    {
      id: "office",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
      ),
      title: "Visit Us",
      value: "Tallinn, Estonia",
      description: "Schedule an appointment",
      link: "#map",
    },
    {
      id: "whatsapp",
      icon: (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
      title: "WhatsApp",
      value: "+372 5555 5555",
      description: "Quick responses",
      link: "https://wa.me/37255555555",
    },
  ];

  const eventTypes = [
    "Corporate Event",
    "Wedding",
    "Private Party",
    "Conference",
    "Product Launch",
    "Team Building",
    "Office Catering",
    "Other",
  ];

  const budgetRanges = [
    "Under €1,000",
    "€1,000 - €3,000",
    "€3,000 - €5,000",
    "€5,000 - €10,000",
    "€10,000+",
    "Flexible",
  ];

  const officeHours = [
    { day: "Monday - Friday", hours: "9:00 - 18:00" },
    { day: "Saturday", hours: "10:00 - 14:00" },
    { day: "Sunday", hours: "Closed" },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.fromTo(
        `.${styles.heroLabel}`,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.2 },
      );

      gsap.fromTo(
        `.${styles.heroTitle}`,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.4 },
      );

      gsap.fromTo(
        `.${styles.heroSubtitle}`,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", delay: 0.6 },
      );

      // Contact methods
      gsap.fromTo(
        `.${styles.methodCard}`,
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.8,
        },
      );

      // Form animation
      gsap.fromTo(
        `.${styles.formSection}`,
        { opacity: 0, x: 50 },
        {
          opacity: 1,
          x: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: `.${styles.formSection}`,
            start: "top 70%",
          },
        },
      );

      // Info cards
      gsap.fromTo(
        `.${styles.infoCard}`,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: `.${styles.infoGrid}`, start: "top 75%" },
        },
      );
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSubmitStatus("success");
    setIsSubmitting(false);

    // Reset form after 3 seconds
    setTimeout(() => {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        eventType: "",
        eventDate: "",
        guestCount: "",
        budget: "",
        message: "",
      });
      setSubmitStatus(null);
    }, 3000);
  };

  return (
    <main ref={pageRef} className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.heroPattern} />
        </div>
        <div className={styles.heroContent}>
          <span className={styles.heroLabel}>Get in Touch</span>
          <h1 className={styles.heroTitle}>
            Let's Create Something
            <br />
            Extraordinary Together
          </h1>
          <p className={styles.heroSubtitle}>
            Every exceptional event begins with a conversation. We're here to
            <br />
            listen, advise, and bring your culinary vision to life.
          </p>
        </div>
      </section>

      {/* Contact Methods */}
      <section className={styles.methods}>
        <div className={styles.methodsGrid}>
          {contactMethods.map((method) => (
            <a
              key={method.id}
              href={method.link}
              className={`${styles.methodCard} ${activeMethod === method.id ? styles.methodCardActive : ""}`}
              onMouseEnter={() => setActiveMethod(method.id)}
            >
              <div className={styles.methodIcon}>{method.icon}</div>
              <div className={styles.methodContent}>
                <span className={styles.methodTitle}>{method.title}</span>
                <span className={styles.methodValue}>{method.value}</span>
                <span className={styles.methodDesc}>{method.description}</span>
              </div>
              <div className={styles.methodArrow}>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M7 17L17 7M17 7H7M17 7v10" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <section className={styles.main}>
        <div className={styles.mainGrid}>
          {/* Form Section */}
          <div className={styles.formSection}>
            <div className={styles.formHeader}>
              <span className={styles.formLabel}>Request a Quote</span>
              <h2 className={styles.formTitle}>Tell Us About Your Event</h2>
              <p className={styles.formSubtitle}>
                Fill out the form below and we'll get back to you within 24
                hours with a personalized proposal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    placeholder="John"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    placeholder="Smith"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="john@company.com"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+372 5555 5555"
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Company (Optional)</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="Company Name"
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Event Type *</label>
                  <select
                    name="eventType"
                    value={formData.eventType}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select event type</option>
                    {eventTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>Event Date *</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={formData.eventDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Number of Guests *</label>
                  <input
                    type="number"
                    name="guestCount"
                    value={formData.guestCount}
                    onChange={handleInputChange}
                    required
                    min="1"
                    placeholder="50"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Budget Range *</label>
                  <select
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select budget</option>
                    {budgetRanges.map((range) => (
                      <option key={range} value={range}>
                        {range}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Additional Details</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Tell us about your vision, dietary requirements, or any special requests..."
                />
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className={styles.spinner} />
                    <span>Sending...</span>
                  </>
                ) : submitStatus === "success" ? (
                  <>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Sent Successfully!</span>
                  </>
                ) : (
                  <>
                    <span>Send Request</span>
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
                  </>
                )}
              </button>

              {submitStatus === "success" && (
                <div className={styles.successMessage}>
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <div>
                    <strong>Thank you for reaching out!</strong>
                    <p>
                      We've received your request and will respond within 24
                      hours.
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Sidebar */}
          <div className={styles.infoSidebar}>
            <div className={styles.infoCard}>
              <h3>Office Hours</h3>
              <div className={styles.hoursList}>
                {officeHours.map((item, i) => (
                  <div key={i} className={styles.hoursItem}>
                    <span>{item.day}</span>
                    <span>{item.hours}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3>What Happens Next?</h3>
              <div className={styles.stepsList}>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>1</span>
                  <div>
                    <strong>Confirmation</strong>
                    <p>
                      You'll receive an email confirming we got your request
                    </p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>2</span>
                  <div>
                    <strong>Consultation</strong>
                    <p>We'll call to discuss your event in detail</p>
                  </div>
                </div>
                <div className={styles.step}>
                  <span className={styles.stepNumber}>3</span>
                  <div>
                    <strong>Proposal</strong>
                    <p>Receive a customized quote within 48 hours</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.infoCard}>
              <h3>Why Choose Us?</h3>
              <ul className={styles.featuresList}>
                <li>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  15+ years of experience
                </li>
                <li>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  98% client satisfaction
                </li>
                <li>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  500+ events annually
                </li>
                <li>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  24-hour response time
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="map" className={styles.map}>
        <div className={styles.mapContainer}>
          <div className={styles.mapPlaceholder}>
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <h3>Our Location</h3>
            <p>Tallinn, Harjumaa, Estonia</p>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.mapLink}
            >
              Open in Google Maps
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
