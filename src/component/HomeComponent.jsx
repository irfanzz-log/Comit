'use client';

import Navigation from '@/component/Nav';
import Footer from '@/component/Footer';
import Loading from '@/component/Loading';
import Divisi from '@/component/divisi/Divisi';
import OnClick from '@/component/OnClick';
import TentangKamiSlide from '@/component/TentangKami/TentangKamiSlide';
import { motion } from 'motion/react';
import Image from 'next/image';
import { data } from '@/lib/dataMentor';
import useGetEvent from '@/hooks/useGetEvent';

export default function HomeComponent() {
  const event = useGetEvent(20);

  return (
    <>
      {/* =====================================
          MAIN CONTAINER
      ====================================== */}

      <main
        className="
          home__container
          w-screen
          h-screen
          bg-gray-200
          flex
          justify-center
          md:p-10
          bg-[url(/background/imgHero4.png)]
          overflow-hidden
        "
      >

        {/* Background Overlay */}
        <div
          className="
            home__overlay
            fixed
            inset-0
            bg-black/70
            backdrop-blur-md
            pointer-events-none
          "
        />

        <Loading />


        {/* =====================================
            CONTENT WRAPPER
        ====================================== */}

        <section
          className="
            home__content
            relative
            z-10
            w-full
            md:rounded-xl
            overflow-x-hidden
            overflow-y-auto
            md:snap-y
            md:snap-mandatory
            scrollbar-hide
          "
        >

          {/* =====================================
              NAVIGATION
          ====================================== */}

          <Navigation
            link1="/"
            textLink1="Home"
            link2="/about"
            textLink2="About Us"
            link3="/announcement"
            textLink3="Announcement"
          />


          {/* =====================================
              HERO SECTION
              STYLE SAMA DENGAN ABOUT
          ====================================== */}

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
              bg-[url(/background/imgHero2.png)]
              bg-center
              bg-cover
            "
          >

            {/* Hero Overlay */}
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
                y: 30,
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
                Community of Information Technology
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
                  max-w-5xl
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
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.6,
                  delay: 0.4,
                }}
              >
                <OnClick
                  targetId="tentangKami"
                  content="Eksplorasi"
                />
              </motion.div>

            </motion.div>

          </section>


          {/* =====================================
              ABOUT SECTION
          ====================================== */}

          <section
            id="tentangKami"
            className="
              about
              relative
              snap-start
              flex
              w-full
              min-h-screen
              items-center
              p-5
              bg-white
              flex-col
              overflow-visible
            "
          >

            <TentangKamiSlide />

          </section>


          {/* =====================================
              DIVISION SECTION
          ====================================== */}

          <section
            id="divisi"
            className="
              division
              relative
              md:snap-start
              flex
              w-full
              md:min-h-screen
              items-center
              p-5
              bg-blue-500
              flex-col
            "
          >

            <div
              className="
                division__content
                relative
                z-10
                w-full
                flex
                flex-col
                md:p-10
              "
            >

              <header
                className="
                  division__header
                  text-white
                  lg:w-full
                  md:w-1/2
                  w-full
                  text-center
                  md:text-left
                "
              >

                <h2
                  className="
                    text-5xl
                    font-bold
                    my-2
                  "
                >
                  Divisi yang kami miliki
                </h2>

                <p
                  className="
                    text-lg
                    my-2
                  "
                >
                  Kami Mempunyai Beberapa Akademik yang Bisa
                  Membantu Anda dalam Belajar tentang Teknologi
                </p>

              </header>

              <Divisi />

            </div>

          </section>


          {/* =====================================
              MENTOR SECTION
          ====================================== */}

          <section
            id="mentor"
            className="
              mentor
              relative
              md:snap-start
              flex
              w-full
              md:min-h-screen
              items-center
              bg-white
              flex-col
            "
          >

            <div
              className="
                mentor__content
                relative
                z-10
                w-full
                flex
                flex-col
                md:mt-0
                mt-10
                items-center
                md:p-10
              "
            >

              <header
                className="
                  mentor__header
                  md:w-1/2
                  w-full
                  text-center
                "
              >

                <h2
                  className="
                    text-5xl
                    font-bold
                    my-2
                  "
                >
                  Mentor Kami
                </h2>

                <p
                  className="
                    text-lg
                    my-2
                  "
                >
                  Kami mempunyai beberapa mentor yang sudah
                  berpengalaman di bidangnya masing-masing
                </p>

              </header>


              {/* Mentor Cards */}

              <div
                className="
                  relative
                  w-full
                  flex
                  flex-wrap
                  justify-center
                "
              >

                {data.map((mentor, idx) => (

                  <motion.div
                    key={idx}
                    initial={{
                      opacity: 0,
                      x: 20,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.15,
                    }}
                    transition={{
                      duration: 0.5,
                      delay: idx * 0.05,
                    }}
                    className="
                      relative
                      hover:scale-105
                      transition-transform
                      duration-600
                      ease-out
                      md:w-1/6
                      w-1/2
                      md:m-10
                      md:p-0
                      p-5
                    "
                  >

                    <div
                      className="
                        relative
                        w-full
                        overflow-hidden
                        rounded-full
                        shadow-xl
                      "
                    >

                      <Image
                        src={mentor.imgurl}
                        height={400}
                        width={400}
                        alt={`${mentor.nama} - ${mentor.divisi}`}
                        className="
                          w-full
                          h-auto
                          object-cover
                        "
                      />

                    </div>

                    <div
                      className="
                        text-center
                        pt-5
                      "
                    >

                      <h3
                        className="
                          text-md
                          font-bold
                        "
                      >
                        {mentor.nama}
                      </h3>

                      <p
                        className="
                          text-sm
                        "
                      >
                        {mentor.divisi}
                      </p>

                    </div>

                  </motion.div>

                ))}

              </div>

            </div>

          </section>


          {/* =====================================
              FOOTER
          ====================================== */}

          <Footer />

        </section>

      </main>
    </>
  );
}