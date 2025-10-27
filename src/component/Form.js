'use client'

import { useState, useRef, useEffect } from "react";

/**
 * ContactForm component with animation and form submission handling
 */
export default function ContactForm() {
  // Form state management
  const [status, setStatus] = useState('');
  const [showStatus, setShowStatus] = useState(false);
  const formRef = useRef(null);

  // Animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('translate-y-0', 'opacity-100');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => observer.disconnect();
  }, []);

  /**
   * Handle form submission
   * @param {Event} e - Form submission event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: e.target.name.value,
          email: e.target.email.value,
          message: e.target.message.value // Fixed: was using email.value
        }),
      });

      const data = await res.json();
      setStatus(data.success ? "Terkirim!" : "Gagal");
      setShowStatus(true);

      // Reset form if successful
      if (data.success) {
        e.target.reset();
        setTimeout(() => setShowStatus(false), 3000); // Hide status after 3s
      }
    } catch (error) {
      setStatus("Gagal mengirim pesan");
      setShowStatus(true);
    }
  };

  return (
    <div className="contact-form w-full flex flex-col items-center">
      {/* Contact Form */}
      <form 
        ref={formRef}
        onSubmit={handleSubmit}
        className="contact-form__container flex flex-col bg-blue-500 p-5 rounded-lg shadow-lg my-5 md:w-1/3 w-5/6 transform transition-all duration-1000 translate-y-10 opacity-0"
      >
        {/* Name Field */}
        <div className="contact-form__field mb-4">
          <label htmlFor="name" className="contact-form__label text-white block mb-2">
            Nama
          </label>
          <input
            id="name"
            name="name"
            placeholder="Masukkan nama Anda"
            className="contact-form__input w-full bg-white border-2 border-blue-400 p-2 rounded-md focus:outline-none focus:border-blue-600 transition-colors"
            required
          />
        </div>

        {/* Email Field */}
        <div className="contact-form__field mb-4">
          <label htmlFor="email" className="contact-form__label text-white block mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Masukkan email Anda"
            className="contact-form__input w-full bg-white border-2 border-blue-400 p-2 rounded-md focus:outline-none focus:border-blue-600 transition-colors"
            required
          />
        </div>

        {/* Message Field */}
        <div className="contact-form__field mb-4">
          <label htmlFor="message" className="contact-form__label text-white block mb-2">
            Pesan
          </label>
          <textarea
            id="message"
            name="message"
            placeholder="Tulis pesan Anda"
            rows="4"
            className="contact-form__input w-full bg-white border-2 border-blue-400 p-2 rounded-md resize-none focus:outline-none focus:border-blue-600 transition-colors"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="contact-form__submit mt-4 bg-white text-blue-500 py-2 px-6 rounded-md font-medium hover:bg-blue-50 transform hover:scale-105 transition-all duration-300"
        >
          Kirim Pesan
        </button>
      </form>

      {/* Status Message */}
      {showStatus && (
        <div 
          className={`contact-form__status w-full md:w-1/3 text-center p-3 rounded-md mt-4 transition-all duration-300 ${
            status === "Terkirim!" ? "bg-green-500" : "bg-red-500"
          } text-white`}
        >
          {status}
        </div>
      )}
    </div>
  );
}
