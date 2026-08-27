"use client";

import { useState, useRef, useEffect } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  const formRef = useRef(null);

  // ============================================
  // Animation on scroll
  // ============================================
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.remove(
            "translate-y-10",
            "opacity-0"
          );

          entry.target.classList.add(
            "translate-y-0",
            "opacity-100"
          );

          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.15,
      }
    );

    if (formRef.current) {
      observer.observe(formRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // ============================================
  // Submit
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: e.target.name.value,
          email: e.target.email.value,
          message: e.target.message.value,
        }),
      });

      const data = await res.json();

      setStatus(data.success ? "Terkirim!" : "Gagal");
      setShowStatus(true);

      if (data.success) {
        e.target.reset();

        setTimeout(() => {
          setShowStatus(false);
        }, 3000);
      }
    } catch (error) {
      console.error(error);

      setStatus("Gagal mengirim pesan");
      setShowStatus(true);
    }
  };

  return (
    <div className="contact-form w-full flex flex-col items-center">

      {/* ============================================
          FORM
      ============================================ */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="
          contact-form__container

          w-full

          flex
          flex-col

          bg-blue-500

          rounded-2xl

          shadow-xl

          border
          border-blue-400/30

          p-5
          sm:p-6
          md:p-8
          lg:p-10

          my-5

          transform
          transition-all
          duration-1000

          translate-y-10
          opacity-0
        "
      >

        {/* ============================================
            FORM HEADER
        ============================================ */}
        <div className="mb-6 md:mb-8">

          <h3
            className="
              text-xl
              md:text-2xl
              font-bold
              text-white
            "
          >
            Kirim Pesan
          </h3>

          <p
            className="
              mt-1
              text-sm
              text-white/70
            "
          >
            Sampaikan pertanyaan, ide, atau pesan kepada
            tim COMIT.
          </p>

        </div>


        {/* ============================================
            NAMA
        ============================================ */}
        <div className="contact-form__field mb-5">

          <label
            htmlFor="name"
            className="
              contact-form__label
              block
              mb-2
              text-sm
              font-medium
              text-white
            "
          >
            Nama
          </label>

          <input
            id="name"
            name="name"
            type="text"
            placeholder="Masukkan nama Anda"
            className="
              contact-form__input

              w-full

              bg-white

              border-2
              border-transparent

              p-3

              rounded-xl

              text-gray-800

              placeholder:text-gray-400

              outline-none

              transition-all
              duration-300

              focus:border-blue-300
              focus:ring-4
              focus:ring-white/20

              hover:border-blue-200
            "
            required
          />

        </div>


        {/* ============================================
            EMAIL
        ============================================ */}
        <div className="contact-form__field mb-5">

          <label
            htmlFor="email"
            className="
              contact-form__label
              block
              mb-2
              text-sm
              font-medium
              text-white
            "
          >
            Email
          </label>

          <input
            id="email"
            name="email"
            type="email"
            placeholder="Masukkan email Anda"
            className="
              contact-form__input

              w-full

              bg-white

              border-2
              border-transparent

              p-3

              rounded-xl

              text-gray-800

              placeholder:text-gray-400

              outline-none

              transition-all
              duration-300

              focus:border-blue-300
              focus:ring-4
              focus:ring-white/20

              hover:border-blue-200
            "
            required
          />

        </div>


        {/* ============================================
            PESAN
        ============================================ */}
        <div className="contact-form__field mb-5">

          <label
            htmlFor="message"
            className="
              contact-form__label
              block
              mb-2
              text-sm
              font-medium
              text-white
            "
          >
            Pesan
          </label>

          <textarea
            id="message"
            name="message"
            placeholder="Tulis pesan Anda..."
            rows={7}
            className="
              contact-form__input

              w-full

              bg-white

              border-2
              border-transparent

              p-3

              rounded-xl

              text-gray-800

              placeholder:text-gray-400

              outline-none

              resize-none

              transition-all
              duration-300

              focus:border-blue-300
              focus:ring-4
              focus:ring-white/20

              hover:border-blue-200
            "
            required
          />

        </div>


        {/* ============================================
            SUBMIT BUTTON
        ============================================ */}
        <button
          type="submit"
          className="
            contact-form__submit

            w-full

            mt-2

            bg-white
            text-blue-500

            py-3
            px-6

            rounded-xl

            font-semibold

            shadow-md

            hover:bg-blue-50
            hover:shadow-lg
            hover:-translate-y-0.5

            active:translate-y-0

            transition-all
            duration-300
          "
        >
          Kirim Pesan
        </button>

      </form>


      {/* ============================================
          STATUS
      ============================================ */}
      {showStatus && (
        <div
          className={`
            contact-form__status

            w-full

            text-center

            p-3

            rounded-xl

            mt-2

            font-medium

            shadow-md

            transition-all
            duration-300

            ${
              status === "Terkirim!"
                ? "bg-green-500"
                : "bg-red-500"
            }

            text-white
          `}
        >
          {status}
        </div>
      )}

    </div>
  );
}