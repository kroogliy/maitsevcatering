"use client";
import React, { useState, useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./contact.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const sectionRef = useRef(null);
  const formRef = useRef(null);
  const infoRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    eventType: "",
    eventDate: "",
    guestCount: "",
    venue: "",
    budget: "",
    dietaryRequirements: [],
    cuisinePreferences: [],
    beverageService: "",
    additionalServices: [],
    message: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const eventTypes = [
    "Corporate Event",
    "Wedding Reception",
    "Private Party",
    "Conference & Seminar",
    "Product Launch",
    "Gala Dinner",
    "Pop-up Event",
    "Office Catering",
    "Other",
  ];

  const dietaryOptions = [
    "Vegetarian",
    "Vegan",
    "Gluten-Free",
    "Lactose-Free",
    "Halal",
    "Kosher",
    "Nut-Free",
    "No Restrictions",
  ];

  const cuisineOptions = [
    "Georgian",
    "Italian",
    "French",
    "Asian Fusion",
    "Mediterranean",
    "Street Food",
    "Sushi & Japanese",
    "International Mix",
  ];

  const serviceOptions = [
    "Full Service Staff",
    "Bartender Service",
    "Sommelier Consultation",
    "Event Setup & Decoration",
    "Equipment Rental",
    "Live Cooking Station",
  ];

  const budgetRanges = [
    "Under €1,000",
    "€1,000 - €3,000",
    "€3,000 - €5,000",
    "€5,000 - €10,000",
    "€10,000 - €25,000",
    "€25,000+",
    "Flexible / Discuss",
  ];

  useEffect(() => {
    const section = sectionRef.current;
    const form = formRef.current;
    const info = infoRef.current;

    if (!section || !form || !info) return;

    gsap.fromTo(
      info.children,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true,
        },
      },
    );

    gsap.fromTo(
      form,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 60%",
          once: true,
        },
      },
    );

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Валидация email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Валидация телефона (международный формат)
  // Принимает: +, цифры, пробелы, дефисы, скобки
  // Минимум 7 цифр, максимум 15 (стандарт E.164)
  const validatePhone = (phone) => {
    const digitsOnly = phone.replace(/\D/g, "");
    return digitsOnly.length >= 7 && digitsOnly.length <= 15;
  };

  const validateField = (name, value) => {
    switch (name) {
      case "email":
        if (!value) return "Email is required";
        if (!validateEmail(value)) return "Please enter a valid email address";
        return "";
      case "phone":
        if (!value) return "Phone number is required";
        if (!validatePhone(value))
          return "Please enter a valid phone number (7-15 digits)";
        return "";
      case "firstName":
        if (!value || !value.trim()) return "First name is required";
        return "";
      case "lastName":
        if (!value || !value.trim()) return "Last name is required";
        return "";
      case "eventType":
        if (!value) return "Please select an event type";
        return "";
      case "eventDate":
        if (!value) return "Event date is required";
        return "";
      case "guestCount":
        if (!value) return "Number of guests is required";
        if (parseInt(value) < 1) return "At least 1 guest is required";
        return "";
      case "budget":
        if (!value) return "Please select a budget range";
        return "";
      case "dietaryRequirements":
        if (!value || value.length === 0)
          return "Please select at least one option";
        return "";
      case "cuisinePreferences":
        if (!value || value.length === 0)
          return "Please select at least one cuisine";
        return "";
      default:
        return "";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Валидация при изменении (если поле уже было тронуто)
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleCheckboxChange = (field, value) => {
    setFormData((prev) => {
      const arr = prev[field];
      if (arr.includes(value)) {
        return { ...prev, [field]: arr.filter((item) => item !== value) };
      } else {
        return { ...prev, [field]: [...arr, value] };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep(3)) {
      console.log("Form submitted:", formData);
      // Handle form submission
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    const fieldsToTouch = {};

    if (step === 1) {
      const fields = ["firstName", "lastName", "email", "phone"];
      fields.forEach((field) => {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
        fieldsToTouch[field] = true;
      });
    }

    if (step === 2) {
      const fields = ["eventType", "eventDate", "guestCount", "budget"];
      fields.forEach((field) => {
        const error = validateField(field, formData[field]);
        if (error) newErrors[field] = error;
        fieldsToTouch[field] = true;
      });
    }

    if (step === 3) {
      const dietaryError = validateField(
        "dietaryRequirements",
        formData.dietaryRequirements,
      );
      const cuisineError = validateField(
        "cuisinePreferences",
        formData.cuisinePreferences,
      );
      if (dietaryError) newErrors.dietaryRequirements = dietaryError;
      if (cuisineError) newErrors.cuisinePreferences = cuisineError;
      fieldsToTouch.dietaryRequirements = true;
      fieldsToTouch.cuisinePreferences = true;
    }

    setErrors((prev) => ({ ...prev, ...newErrors }));
    setTouched((prev) => ({ ...prev, ...fieldsToTouch }));

    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <section ref={sectionRef} className={styles.container}>
      <div className={styles.content}>
        {/* Left Side - Contact Info */}
        <div ref={infoRef} className={styles.infoSide}>
          <span className={styles.label}>Get in Touch</span>
          <h2 className={styles.title}>Let`s Create Something Extraordinary</h2>
          <p className={styles.subtitle}>
            Every exceptional event begins with a conversation. Share your
            vision with us, and we`ll craft a culinary experience tailored
            perfectly to your occasion.
          </p>

          <div className={styles.contactDetails}>
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
                Mon — Sun, 10:00 — 22:00
              </span>
            </div>

            <div className={styles.contactItem}>
              <span className={styles.contactLabel}>Response Time</span>
              <span className={styles.contactValue}>Within 24 hours</span>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div ref={formRef} className={styles.formSide}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Progress Indicator */}
            <div className={styles.progress}>
              <div className={styles.progressSteps}>
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`${styles.progressStep} ${
                      currentStep >= step ? styles.progressStepActive : ""
                    }`}
                  >
                    <span className={styles.stepNumber}>{step}</span>
                    <span className={styles.stepLabel}>
                      {step === 1 && "Your Details"}
                      {step === 2 && "Event Info"}
                      {step === 3 && "Preferences"}
                    </span>
                  </div>
                ))}
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Personal Details */}
            {currentStep === 1 && (
              <div className={styles.formStep}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`${styles.formInput} ${errors.firstName && touched.firstName ? styles.inputError : ""}`}
                      placeholder="John"
                    />
                    {errors.firstName && touched.firstName && (
                      <span className={styles.errorText}>
                        {errors.firstName}
                      </span>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`${styles.formInput} ${errors.lastName && touched.lastName ? styles.inputError : ""}`}
                      placeholder="Smith"
                    />
                    {errors.lastName && touched.lastName && (
                      <span className={styles.errorText}>
                        {errors.lastName}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    className={`${styles.formInput} ${errors.email && touched.email ? styles.inputError : ""}`}
                    placeholder="john@company.com"
                  />
                  {errors.email && touched.email && (
                    <span className={styles.errorText}>{errors.email}</span>
                  )}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`${styles.formInput} ${errors.phone && touched.phone ? styles.inputError : ""}`}
                      placeholder="+372 5555 5555"
                    />
                    {errors.phone && touched.phone && (
                      <span className={styles.errorText}>{errors.phone}</span>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      Company{" "}
                      <span className={styles.optional}>(optional)</span>
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className={styles.formInput}
                      placeholder="Company Name"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Event Details */}
            {currentStep === 2 && (
              <div className={styles.formStep}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Event Type</label>
                  <div className={styles.selectWrapper}>
                    <select
                      name="eventType"
                      value={formData.eventType}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`${styles.formSelect} ${errors.eventType && touched.eventType ? styles.inputError : ""}`}
                    >
                      <option value="">Select event type</option>
                      {eventTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.eventType && touched.eventType && (
                    <span className={styles.errorText}>{errors.eventType}</span>
                  )}
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Event Date</label>
                    <input
                      type="date"
                      name="eventDate"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`${styles.formInput} ${errors.eventDate && touched.eventDate ? styles.inputError : ""}`}
                    />
                    {errors.eventDate && touched.eventDate && (
                      <span className={styles.errorText}>
                        {errors.eventDate}
                      </span>
                    )}
                  </div>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>Number of Guests</label>
                    <input
                      type="number"
                      name="guestCount"
                      value={formData.guestCount}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`${styles.formInput} ${errors.guestCount && touched.guestCount ? styles.inputError : ""}`}
                      placeholder="50"
                      min="1"
                    />
                    {errors.guestCount && touched.guestCount && (
                      <span className={styles.errorText}>
                        {errors.guestCount}
                      </span>
                    )}
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Venue / Location{" "}
                    <span className={styles.optional}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    name="venue"
                    value={formData.venue}
                    onChange={handleInputChange}
                    className={styles.formInput}
                    placeholder="Venue name or address"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>Budget Range</label>
                  <div className={styles.selectWrapper}>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleInputChange}
                      onBlur={handleBlur}
                      className={`${styles.formSelect} ${errors.budget && touched.budget ? styles.inputError : ""}`}
                    >
                      <option value="">Select budget range</option>
                      {budgetRanges.map((range) => (
                        <option key={range} value={range}>
                          {range}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.budget && touched.budget && (
                    <span className={styles.errorText}>{errors.budget}</span>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Preferences */}
            {currentStep === 3 && (
              <div className={styles.formStep}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Dietary Requirements
                  </label>
                  <div
                    className={`${styles.checkboxGrid} ${errors.dietaryRequirements && touched.dietaryRequirements ? styles.checkboxGridError : ""}`}
                  >
                    {dietaryOptions.map((option) => (
                      <label key={option} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={formData.dietaryRequirements.includes(
                            option,
                          )}
                          onChange={() =>
                            handleCheckboxChange("dietaryRequirements", option)
                          }
                          className={styles.checkbox}
                        />
                        <span className={styles.checkboxText}>{option}</span>
                      </label>
                    ))}
                  </div>
                  {errors.dietaryRequirements &&
                    touched.dietaryRequirements && (
                      <span className={styles.errorText}>
                        {errors.dietaryRequirements}
                      </span>
                    )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Cuisine Preferences
                  </label>
                  <div
                    className={`${styles.checkboxGrid} ${errors.cuisinePreferences && touched.cuisinePreferences ? styles.checkboxGridError : ""}`}
                  >
                    {cuisineOptions.map((option) => (
                      <label key={option} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          checked={formData.cuisinePreferences.includes(option)}
                          onChange={() =>
                            handleCheckboxChange("cuisinePreferences", option)
                          }
                          className={styles.checkbox}
                        />
                        <span className={styles.checkboxText}>{option}</span>
                      </label>
                    ))}
                  </div>
                  {errors.cuisinePreferences && touched.cuisinePreferences && (
                    <span className={styles.errorText}>
                      {errors.cuisinePreferences}
                    </span>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    Additional Details{" "}
                    <span className={styles.optional}>(optional)</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    className={styles.formTextarea}
                    placeholder="Tell us about your vision, special requests, or any questions you have..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className={styles.formNav}>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className={styles.btnSecondary}
                >
                  Back
                </button>
              )}
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className={styles.btnPrimary}
                >
                  Continue
                </button>
              ) : (
                <button type="submit" className={styles.btnSubmit}>
                  Submit Request
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
