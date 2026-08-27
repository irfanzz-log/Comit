"use client";

import Nav from "@/component/Nav";
import Footer from "@/component/Footer";
import Loading from "@/component/Loading";
import Form from "@/component/Form";
import OnClick from "@/component/OnClick";
import Galeri from "@/component/Galeri/Galeri";
import { motion } from "motion/react";
import CardSelect from "@/component/CardSelect";

export default function AboutClient() {
  return (
    <>
      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}
      <main
        className="
          about__container
          relative
          w-screen
          h-screen
          bg-gray-200
          flex
          justify-center
          md:p-10
          bg-[url(/background/imgHero4.png)]
          bg-center
          bg-cover
          overflow-hidden
        "
      >
        {/* Background Overlay */}
        <div
          className="
            about__overlay
            fixed
            inset-0
            bg-black/70
            backdrop-blur-md
            pointer-events-none
            z-0
          "
        />

        <Loading />

        {/* =====================================================
            CONTENT WRAPPER
        ====================================================== */}
        <section
          className="
            about__content
            relative
            z-10
            w-full
            md:rounded-xl
            overflow-x-hidden
            overflow-y-auto
            md:snap-y
            md:snap-mandatory
            scrollbar-hide
            bg-white
          "
        >
          {/* =====================================================
              NAVIGATION
          ====================================================== */}
          <Nav
            link1="/"
            textLink1="Home"
            link2="/about"
            textLink2="About Us"
            link3="/announcement"
            textLink3="Announcement"
          />

          {/* =====================================================
              HERO
          ====================================================== */}
          <section
            className="
              hero
              relative
              snap-start
              flex
              w-full
              min-h-screen
              items-center
              justify-center
              p-5
              flex-col
              bg-[url(/background/imgHero3.png)]
              bg-center
              bg-cover
              overflow-hidden
            "
          >
            {/* Overlay */}
            <div
              className="
                hero__overlay
                absolute
                inset-0
                bg-gradient-to-r
                from-gray-800/80
                to-gray-700/50
              "
            />

            {/* Hero Content */}
            <motion.div
              initial={{
                opacity: 0,
                y: 40,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
              className="
                hero__content
                relative
                z-10
                w-full
                flex
                flex-col
                items-center
                justify-center
              "
            >
              {/* Badge */}
              <motion.span
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.1,
                }}
                className="
                  mb-4
                  px-4
                  py-1.5
                  rounded-full
                  bg-white/10
                  border
                  border-white/20
                  backdrop-blur-md
                  text-white
                  text-xs
                  md:text-sm
                  font-medium
                "
              >
                About COMIT
              </motion.span>

              {/* Title */}
              <motion.h2
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.15,
                }}
                className="
                  hero__title
                  text-3xl
                  sm:text-4xl
                  md:text-6xl
                  lg:text-7xl
                  font-bold
                  text-center
                  text-white
                  max-w-4xl
                  leading-tight
                "
              >
                Community of Information Technology
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.3,
                }}
                className="
                  hero__subtitle
                  mt-5
                  mb-7
                  text-white/85
                  text-center
                  text-sm
                  md:text-lg
                "
              >
                Semangat COMIT, salam teknologi!
              </motion.p>

              {/* Button */}
              <motion.div
                initial={{
                  opacity: 0,
                  scale: 0.9,
                }}
                animate={{
                  opacity: 1,
                  scale: 1,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.4,
                }}
              >
                <OnClick
                  targetId="kepengurusan"
                  content="Eksplorasi"
                />
              </motion.div>
            </motion.div>
          </section>

          {/* =====================================================
              MANAGEMENT SECTION
          ====================================================== */}
          <section
            id="kepengurusan"
            className="
              management
              relative
              snap-start
              flex
              w-full
              min-h-fit
              items-center
              bg-white
              flex-col
              overflow-visible
            "
          >
            {/* Decorative Background */}
            <div
              className="
                absolute
                -top-32
                -right-32
                w-96
                h-96
                rounded-full
                bg-blue-500/5
                blur-3xl
                pointer-events-none
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
                bg-blue-500/5
                blur-3xl
                pointer-events-none
              "
            />

            <motion.div
              initial={{
                opacity: 0,
                y: 50,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.1,
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
              className="
                relative
                z-10
                w-full
                max-w-7xl
                flex
                flex-col
                items-center
                px-5
                py-14
                md:px-10
                md:py-20
              "
            >
              {/* Header */}
              <header
                className="
                  w-full
                  max-w-3xl
                  text-center
                  mb-10
                  md:mb-14
                "
              >
                <motion.span
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="
                    inline-block
                    px-4
                    py-1.5
                    rounded-full
                    bg-blue-100
                    text-blue-500
                    text-xs
                    md:text-sm
                    font-semibold
                    mb-3
                  "
                >
                  Struktur Organisasi
                </motion.span>

                <h2
                  className="
                    text-3xl
                    md:text-5xl
                    font-bold
                    text-zinc-800
                    my-2
                  "
                >
                  Kepengurusan
                </h2>

                {/* Accent */}
                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    my-4
                  "
                >
                  <span className="w-8 h-1 rounded-full bg-blue-500" />
                  <span className="w-2 h-2 rounded-full bg-blue-300" />
                  <span className="w-8 h-1 rounded-full bg-blue-500" />
                </div>

                <p
                  className="
                    text-sm
                    md:text-lg
                    text-zinc-600
                    leading-7
                  "
                >
                  Kepengurusan COMIT 2025-2026 (Avantera).
                  Kepengurusan COMIT merupakan wadah utama yang
                  berperan dalam menggerakkan seluruh kegiatan
                  organisasi, mulai dari perencanaan program kerja,
                  pelaksanaan kegiatan, hingga pengembangan anggota.
                </p>
              </header>

              {/* Card Select */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.1,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.15,
                }}
                className="
                  relative
                  z-10
                  w-full
                  flex
                  flex-wrap
                  justify-center
                "
              >
                <CardSelect />
              </motion.div>
            </motion.div>
          </section>

          {/* =====================================================
              GALLERY SECTION
          ====================================================== */}
          <section
            id="kegiatan"
            className="
              gallery
              relative
              snap-start
              flex
              w-full
              min-h-fit
              items-center
              bg-gray-50
              flex-col
              overflow-visible
            "
          >
            {/* Decorative Background */}
            <div
              className="
                absolute
                -top-32
                -left-32
                w-80
                h-80
                rounded-full
                bg-blue-500/5
                blur-3xl
                pointer-events-none
                z-0
              "
            />

            <motion.article
              initial={{
                opacity: 0,
                y: 40,
              }}
              whileInView={{
                opacity: 1,
                y: 0,
              }}
              viewport={{
                once: true,
                amount: 0.1,
              }}
              transition={{
                duration: 0.7,
                ease: "easeOut",
              }}
              className="
                gallery__content
                relative
                z-10
                w-full
                max-w-7xl
                flex
                flex-col
                items-center
                px-5
                py-14
                md:px-10
                md:py-20
                overflow-visible
              "
            >
              {/* Gallery Header */}
              <header
                className="
                  w-full
                  max-w-3xl
                  text-center
                  mb-10
                  relative
                  z-30
                "
              >
                <motion.span
                  initial={{
                    opacity: 0,
                    y: 15,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                  className="
                    inline-block
                    px-4
                    py-1.5
                    rounded-full
                    bg-blue-100
                    text-blue-500
                    text-xs
                    md:text-sm
                    font-semibold
                    mb-3
                  "
                >
                  Dokumentasi
                </motion.span>

                <h2
                  className="
                    text-3xl
                    md:text-5xl
                    font-bold
                    text-zinc-800
                  "
                >
                  Kegiatan COMIT
                </h2>

                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    mt-4
                  "
                >
                  <span className="w-8 h-1 rounded-full bg-blue-500" />
                  <span className="w-2 h-2 rounded-full bg-blue-300" />
                  <span className="w-8 h-1 rounded-full bg-blue-500" />
                </div>
              </header>

              {/* Galeri */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 30,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.05,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.1,
                }}
                className="
                  relative
                  z-20
                  w-full
                  overflow-visible
                "
              >
                <Galeri />
              </motion.div>
            </motion.article>
          </section>

          {/* =====================================================
              CONTACT SECTION
          ====================================================== */}
          <section
            className="
              contact
              relative
              snap-start
              flex
              w-full
              min-h-fit
              items-center
              bg-white
              flex-col
              overflow-hidden
            "
          >
            {/* Background Decoration */}
            <div
              className="
                absolute
                inset-0
                pointer-events-none
                overflow-hidden
              "
            >
              <div
                className="
                  absolute
                  -top-40
                  -right-40
                  w-96
                  h-96
                  rounded-full
                  bg-blue-500/5
                  blur-3xl
                "
              />

              <div
                className="
                  absolute
                  -bottom-40
                  -left-40
                  w-96
                  h-96
                  rounded-full
                  bg-blue-500/5
                  blur-3xl
                "
              />
            </div>

            {/* Contact Content */}
            <div
              className="
                contact__content
                relative
                z-10
                w-full
                max-w-7xl
                flex
                flex-col
                items-center
                px-5
                py-14
                md:px-10
                md:py-20
              "
            >
              {/* Contact Header */}
              <motion.header
                initial={{
                  opacity: 0,
                  y: 35,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.1,
                }}
                transition={{
                  duration: 0.7,
                }}
                className="
                  contact__header
                  w-full
                  max-w-4xl
                  text-center
                  mb-10
                "
              >
                <span
                  className="
                    inline-block
                    px-4
                    py-1.5
                    rounded-full
                    bg-blue-100
                    text-blue-500
                    text-xs
                    md:text-sm
                    font-semibold
                    mb-3
                  "
                >
                  Contact
                </span>

                <h2
                  className="
                    text-3xl
                    md:text-5xl
                    font-bold
                    text-zinc-800
                    my-2
                  "
                >
                  Hubungi Kami
                </h2>

                {/* Accent */}
                <div
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    my-4
                  "
                >
                  <span className="w-8 h-1 rounded-full bg-blue-500" />
                  <span className="w-2 h-2 rounded-full bg-blue-300" />
                  <span className="w-8 h-1 rounded-full bg-blue-500" />
                </div>

                <p
                  className="
                    text-sm
                    md:text-lg
                    text-zinc-600
                    leading-7
                  "
                >
                  Punya pertanyaan, ide, atau ingin berkolaborasi?
                  Tim COMIT (Community of Information Technology)
                  selalu terbuka untuk berdiskusi dan berbagi
                  inspirasi di dunia teknologi informasi.
                </p>
              </motion.header>

              {/* =================================================
                  CONTACT FORM
                  Diperlebar dari max-w-2xl menjadi max-w-4xl
              ================================================== */}
              <motion.div
                initial={{
                  opacity: 0,
                  y: 40,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                  amount: 0.1,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.15,
                }}
                className="
                  contact__form
                  relative
                  w-full
                  max-w-4xl
                  flex
                  flex-col
                  items-center
                  justify-center
                  bg-white
                  rounded-2xl
                  shadow-lg
                  border
                  border-gray-100
                  p-5
                  md:p-8
                  lg:p-10
                "
              >
                <Form />
              </motion.div>
            </div>
          </section>

          {/* =====================================================
              FOOTER
          ====================================================== */}
          <Footer />
        </section>
      </main>
    </>
  );
}