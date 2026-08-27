"use client";

import Link from "next/link";
import Image from "next/image";

/**
 * SmoothScrollLink component for internal navigation
 */
const SmoothScrollLink = ({ targetId, children }) => (
  <Link
    href={`#${targetId}`}
    onClick={(e) => {
      e.preventDefault();

      const target = document.getElementById(targetId);

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
        });
      }
    }}
  >
    {children}
  </Link>
);

export default function Footer() {
  const navLinks = [
    { id: "tentangKami", text: "Tentang Kami" },
    { id: "divisi", text: "Divisi" },
    { id: "mentor", text: "Mentor" },
    { id: "kegiatan", text: "Kegiatan" },
  ];

  return (
    <footer
      id="footer"
      className="footer relative md:snap-start w-full bg-blue-500 overflow-hidden"
    >
      {/* Background Decoration */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="
            absolute
            -top-32
            -right-32
            w-96
            h-96
            rounded-full
            bg-white/5
            blur-3xl
          "
        />

        <div
          className="
            absolute
            -bottom-40
            -left-40
            w-[450px]
            h-[450px]
            rounded-full
            bg-white/5
            blur-3xl
          "
        />
      </div>

      {/* Main Container */}
      <div
        className="
          footer__container
          relative
          z-10
          w-full
          flex
          flex-col
          items-center
          px-5
          md:px-10
          py-12
          md:py-16
        "
      >
        <div className="footer__content text-white w-full max-w-7xl">

          {/* =========================
              TOP CONTENT
          ========================== */}
          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-4
              gap-10
              md:gap-8
              text-center
              md:text-left
            "
          >

            {/* =========================
                LOGO & DESCRIPTION
            ========================== */}
            <div
              className="
                md:col-span-2
                flex
                flex-col
                items-center
                md:items-start
              "
            >
              {/* Logos */}
              <div className="flex items-center justify-center gap-5 mb-6">

                {/* COMIT Logo */}
                <div className="flex items-center justify-center">
                  <Image
                    width={180}
                    height={130}
                    className="
                      w-24
                      md:w-28
                      h-auto
                      object-contain
                    "
                    src="/logo/commitLogo.png"
                    alt="COMIT Logo"
                  />
                </div>

                {/* Divider */}
                <div className="h-16 w-px bg-white/20" />

                {/* UNIPI Logo */}
                <div className="flex items-center justify-center">
                  <Image
                    width={180}
                    height={130}
                    className="
                      w-24
                      md:w-28
                      h-auto
                      object-contain
                    "
                    src="/logo/unipi.png"
                    alt="Universitas Insan Pembangunan Indonesia Logo"
                  />
                </div>

              </div>

              {/* Title */}
              <h3
                className="
                  text-2xl
                  md:text-3xl
                  font-bold
                  text-center
                  md:text-left
                "
              >
                Community of
                <span className="block">
                  Information Technology
                </span>
              </h3>

              {/* Description */}
              <p
                className="
                  mt-4
                  max-w-md
                  text-sm
                  md:text-base
                  text-white/70
                  leading-relaxed
                  text-center
                  md:text-left
                "
              >
                Wadah bagi mahasiswa untuk berkembang,
                berkolaborasi, dan mengeksplorasi dunia
                teknologi informasi.
              </p>
            </div>


            {/* =========================
                NAVIGATION
            ========================== */}
            <div
              className="
                flex
                flex-col
                items-center
                md:items-start
              "
            >
              <h4 className="text-lg font-bold mb-5">
                Navigasi
              </h4>

              <ul className="space-y-3 text-center md:text-left">
                {navLinks.map(({ id, text }) => (
                  <li key={id}>
                    <SmoothScrollLink targetId={id}>
                      <span
                        className="
                          group
                          flex
                          items-center
                          justify-center
                          md:justify-start
                          gap-2
                          text-sm
                          text-white/75
                          hover:text-white
                          transition-colors
                        "
                      >
                        <span
                          className="
                            w-0
                            h-px
                            bg-white
                            group-hover:w-4
                            transition-all
                            duration-300
                          "
                        />

                        {text}
                      </span>
                    </SmoothScrollLink>
                  </li>
                ))}
              </ul>
            </div>


            {/* =========================
                SOCIAL MEDIA
            ========================== */}
            <div
              className="
                flex
                flex-col
                items-center
                md:items-start
              "
            >
              <h4 className="text-lg font-bold mb-5">
                Ikuti Kami
              </h4>

              <p
                className="
                  text-sm
                  text-white/70
                  mb-5
                  text-center
                  md:text-left
                  max-w-xs
                "
              >
                Temukan informasi dan aktivitas terbaru
                dari COMIT.
              </p>

              {/* Instagram */}
              <div className="flex items-center justify-center">

                <Link
                  href="https://www.instagram.com/comit.ipem/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram COMIT"
                  className="
                    text-white
                    hover:text-white/70
                    hover:-translate-y-1
                    transition-all
                    duration-300
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-instagram"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.9 3.9 0 0 0-1.417.923A3.9 3.9 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.9 3.9 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.9 3.9 0 0 0-.923-1.417A3.9 3.9 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599s.453.546.598.92c.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.5 2.5 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.5 2.5 0 0 1-.92-.598 2.5 2.5 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-2.388-.046-3.231s.008-2.388.046-3.231c.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92s.546-.453.92-.598c.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92m-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217m0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334" />
                  </svg>
                </Link>

              </div>
            </div>

          </div>


          {/* =========================
              DIVIDER
          ========================== */}
          <div className="relative my-10">
            <div className="h-px bg-white/15" />

            <div
              className="
                absolute
                left-1/2
                -translate-x-1/2
                -top-2
                px-4
                bg-blue-500
              "
            >
              <div className="w-3 h-3 rounded-full bg-white/40" />
            </div>
          </div>


          {/* =========================
              FOOTER BOTTOM
          ========================== */}
          <div
            className="
              flex
              flex-col
              md:flex-row
              items-center
              justify-between
              gap-4
              text-sm
              text-center
            "
          >
            <p className="text-white/60">
              © {new Date().getFullYear()} Community of
              Information Technology
            </p>

            <p className="text-white/50">
              Semangat COMIT, salam teknologi!
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}