"use client";

import Loading from "@/component/Loading";
import Nav from "@/component/Nav";
import OnClick from "@/component/OnClick";
import Footer from "@/component/Footer";
import { useState, useEffect } from "react";
import { motion } from "motion/react";

export default function Announcement() {
    const [dataAcara, setDataAcara] = useState([]);

    useEffect(() => {
        fetch("/api/events")
            .then((res) => res.json())
            .then((data) => setDataAcara(data))
            .catch((err) => console.log(err));
    }, []);

    // Filter acara eksternal
    const events = dataAcara?.filter(
        (data) => data.tipe_acara !== "internal"
    ) || [];

    return (
        <>
            {/* =====================================================
                MAIN CONTAINER
            ====================================================== */}
            <main
                className="
                    announcement__container
                    relative
                    w-screen
                    min-h-screen
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
                        fixed
                        inset-0
                        bg-black/70
                        backdrop-blur-md
                        pointer-events-none
                    "
                />

                <Loading />

                {/* =====================================================
                    CONTENT WRAPPER
                ====================================================== */}
                <section
                    className="
                        announcement__content
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
                            bg-[url(/background/imgHero4.png)]
                            bg-center
                            bg-cover
                        "
                    >
                        {/* Overlay */}
                        <div
                            className="
                                absolute
                                inset-0
                                bg-gradient-to-r
                                from-gray-900/85
                                via-gray-800/70
                                to-gray-700/50
                            "
                        />

                        {/* Decorative circles */}
                        <div
                            className="
                                absolute
                                -top-32
                                -right-32
                                w-96
                                h-96
                                rounded-full
                                bg-blue-400/10
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
                                bg-blue-500/10
                                blur-3xl
                                pointer-events-none
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
                                max-w-5xl
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
                                    mb-5
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
                                Announcement COMIT
                            </motion.span>

                            {/* Title */}
                            <motion.h1
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
                            </motion.h1>

                            {/* Subtitle */}
                            <motion.p
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
                                    delay: 0.25,
                                }}
                                className="
                                    mt-5
                                    mb-8
                                    text-white/80
                                    text-sm
                                    md:text-lg
                                    text-center
                                    max-w-2xl
                                    leading-7
                                "
                            >
                                Temukan informasi terbaru mengenai kegiatan,
                                acara, dan berbagai aktivitas COMIT.
                            </motion.p>

                            {/* Explore */}
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
                                    duration: 0.6,
                                    delay: 0.35,
                                }}
                            >
                                <OnClick
                                    targetId="events"
                                    content="Lihat Pengumuman"
                                />
                            </motion.div>
                        </motion.div>

                        {/* Bottom indicator */}
                        <motion.div
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                            transition={{
                                delay: 1,
                                duration: 0.8,
                            }}
                            className="
                                absolute
                                bottom-8
                                left-1/2
                                -translate-x-1/2
                                flex
                                flex-col
                                items-center
                                gap-2
                                text-white/50
                            "
                        >
                            <span className="text-[10px] uppercase tracking-[0.3em]">
                                Scroll
                            </span>

                            <motion.div
                                animate={{
                                    y: [0, 7, 0],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                                className="
                                    w-5
                                    h-8
                                    rounded-full
                                    border
                                    border-white/40
                                    flex
                                    justify-center
                                    pt-1
                                "
                            >
                                <div
                                    className="
                                        w-1
                                        h-2
                                        rounded-full
                                        bg-white/70
                                    "
                                />
                            </motion.div>
                        </motion.div>
                    </section>

                    {/* =====================================================
                        EVENTS SECTION
                    ====================================================== */}
                    <section
                        id="events"
                        className="
                            events
                            relative
                            snap-start
                            flex
                            w-full
                            min-h-fit
                            items-center
                            bg-gray-50
                            flex-col
                            overflow-hidden
                        "
                    >
                        {/* Decorative Background */}
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
                                pointer-events-none
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
                                pointer-events-none
                            "
                        />

                        <div
                            className="
                                relative
                                z-10
                                w-full
                                max-w-7xl
                                px-5
                                py-14
                                md:px-10
                                md:py-20
                            "
                        >
                            {/* =================================================
                                HEADER
                            ================================================== */}
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
                                    ease: "easeOut",
                                }}
                                className="
                                    w-full
                                    max-w-3xl
                                    mx-auto
                                    text-center
                                    mb-12
                                    md:mb-16
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
                                    Informasi Terbaru
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
                                    Pengumuman & Acara
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
                                    Ikuti berbagai informasi mengenai kegiatan
                                    dan acara yang diselenggarakan oleh COMIT.
                                </p>
                            </motion.header>

                            {/* =================================================
                                EVENT LIST
                            ================================================== */}
                            <div className="w-full flex flex-col gap-8">
                                {events.length > 0 ? (
                                    events.map((data, index) => (
                                        <motion.article
                                            key={index}
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
                                                delay: index * 0.08,
                                                ease: [0.22, 1, 0.36, 1],
                                            }}
                                            whileHover={{
                                                y: -5,
                                            }}
                                            className="
                                                group
                                                relative
                                                w-full
                                                overflow-hidden
                                                rounded-2xl
                                                bg-white
                                                border
                                                border-gray-100
                                                shadow-md
                                                hover:shadow-xl
                                                transition-shadow
                                                duration-500
                                            "
                                        >
                                            <div
                                                className="
                                                    flex
                                                    flex-col
                                                    lg:flex-row
                                                    w-full
                                                "
                                            >
                                                {/* Image */}
                                                <div
                                                    className="
                                                        relative
                                                        lg:w-[45%]
                                                        w-full
                                                        h-64
                                                        md:h-80
                                                        lg:h-96
                                                        overflow-hidden
                                                        bg-blue-500
                                                    "
                                                >
                                                    <img
                                                        src={
                                                            data.file_url ||
                                                            "/background/imgHero3.png"
                                                        }
                                                        onError={(e) => {
                                                            e.currentTarget.src =
                                                                "/background/imgHero3.png";
                                                        }}
                                                        alt={data.nama_acara}
                                                        className="
                                                            w-full
                                                            h-full
                                                            object-cover
                                                            transition-transform
                                                            duration-700
                                                            ease-out
                                                            group-hover:scale-105
                                                        "
                                                    />

                                                    {/* Image Overlay */}
                                                    <div
                                                        className="
                                                            absolute
                                                            inset-0
                                                            bg-gradient-to-t
                                                            from-black/50
                                                            via-transparent
                                                            to-transparent
                                                            opacity-70
                                                        "
                                                    />

                                                    {/* Event Number */}
                                                    <div
                                                        className="
                                                            absolute
                                                            top-5
                                                            left-5
                                                            w-10
                                                            h-10
                                                            rounded-xl
                                                            bg-white/90
                                                            backdrop-blur
                                                            flex
                                                            items-center
                                                            justify-center
                                                            text-blue-500
                                                            font-bold
                                                            shadow-lg
                                                        "
                                                    >
                                                        {String(index + 1).padStart(
                                                            2,
                                                            "0"
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Content */}
                                                <div
                                                    className="
                                                        relative
                                                        flex
                                                        flex-col
                                                        justify-between
                                                        lg:w-[55%]
                                                        w-full
                                                        p-6
                                                        md:p-8
                                                        lg:p-10
                                                    "
                                                >
                                                    {/* Top */}
                                                    <div>
                                                        <span
                                                            className="
                                                                inline-block
                                                                px-3
                                                                py-1
                                                                rounded-full
                                                                bg-blue-100
                                                                text-blue-500
                                                                text-xs
                                                                font-semibold
                                                                mb-4
                                                            "
                                                        >
                                                            EVENT COMIT
                                                        </span>

                                                        <h3
                                                            className="
                                                                text-2xl
                                                                md:text-3xl
                                                                font-bold
                                                                text-zinc-800
                                                                leading-tight
                                                                group-hover:text-blue-500
                                                                transition-colors
                                                                duration-300
                                                            "
                                                        >
                                                            {data.nama_acara}
                                                        </h3>

                                                        <p
                                                            className="
                                                                mt-4
                                                                text-sm
                                                                md:text-base
                                                                text-zinc-600
                                                                leading-7
                                                            "
                                                        >
                                                            {data.komentar}
                                                        </p>
                                                    </div>

                                                    {/* Date */}
                                                    <div
                                                        className="
                                                            mt-8
                                                            pt-5
                                                            border-t
                                                            border-gray-100
                                                            flex
                                                            items-center
                                                            gap-4
                                                        "
                                                    >
                                                        <div
                                                            className="
                                                                w-11
                                                                h-11
                                                                shrink-0
                                                                rounded-xl
                                                                bg-blue-100
                                                                text-blue-500
                                                                flex
                                                                items-center
                                                                justify-center
                                                                font-bold
                                                            "
                                                        >
                                                            📅
                                                        </div>

                                                        <div>
                                                            <p
                                                                className="
                                                                    text-xs
                                                                    text-gray-400
                                                                    uppercase
                                                                    tracking-wider
                                                                    font-semibold
                                                                "
                                                            >
                                                                Tanggal Acara
                                                            </p>

                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-sm
                                                                    md:text-base
                                                                    font-semibold
                                                                    text-zinc-700
                                                                "
                                                            >
                                                                {new Date(
                                                                    data.tanggal_acara
                                                                ).toLocaleDateString(
                                                                    "id-ID",
                                                                    {
                                                                        year: "numeric",
                                                                        month: "long",
                                                                        day: "numeric",
                                                                    }
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {/* Bottom accent */}
                                                    <div
                                                        className="
                                                            absolute
                                                            bottom-0
                                                            left-0
                                                            w-0
                                                            h-1
                                                            bg-blue-500
                                                            group-hover:w-full
                                                            transition-all
                                                            duration-700
                                                        "
                                                    />
                                                </div>
                                            </div>
                                        </motion.article>
                                    ))
                                ) : (
                                    /* =================================================
                                        EMPTY STATE
                                    ================================================== */
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
                                        }}
                                        className="
                                            flex
                                            flex-col
                                            items-center
                                            justify-center
                                            py-20
                                            text-center
                                        "
                                    >
                                        <div
                                            className="
                                                w-20
                                                h-20
                                                rounded-2xl
                                                bg-blue-100
                                                flex
                                                items-center
                                                justify-center
                                                text-3xl
                                                mb-5
                                            "
                                        >
                                            📢
                                        </div>

                                        <h3
                                            className="
                                                text-xl
                                                md:text-2xl
                                                font-bold
                                                text-zinc-800
                                            "
                                        >
                                            Belum Ada Pengumuman
                                        </h3>

                                        <p
                                            className="
                                                mt-2
                                                text-sm
                                                md:text-base
                                                text-zinc-500
                                            "
                                        >
                                            Saat ini belum ada acara yang
                                            tersedia untuk ditampilkan.
                                        </p>
                                    </motion.div>
                                )}
                            </div>
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