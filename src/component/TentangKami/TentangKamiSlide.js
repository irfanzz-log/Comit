"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "motion/react";

export default function TentangKamiSlide() {
    const el = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add(
                        "!translate-x-0",
                        "!opacity-100"
                    );

                    observer.unobserve(entry.target);
                }
            },
            {
                threshold: 0.15,
            }
        );

        if (el.current) {
            observer.observe(el.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={el}
            className="
                tentang-kami__container
                relative
                z-10
                w-full
                flex
                flex-col
                items-center
                transition-all
                duration-1000
                ease-out
                md:translate-x-100
                translate-x-20
                opacity-0
                overflow-visible
                py-5
                md:py-10
            "
        >

            {/* =========================
                BACKGROUND DECORATION
            ========================== */}

            <div className="absolute inset-0 pointer-events-none overflow-hidden">

                <div
                    className="
                        absolute
                        -top-20
                        -right-20
                        w-64
                        h-64
                        rounded-full
                        bg-blue-500/5
                        blur-3xl
                    "
                />

                <div
                    className="
                        absolute
                        top-1/2
                        -left-32
                        w-72
                        h-72
                        rounded-full
                        bg-blue-500/5
                        blur-3xl
                    "
                />

            </div>


            {/* =========================
                HEADER
            ========================== */}

            <motion.header
                initial={{
                    opacity: 0,
                    y: 25,
                }}
                whileInView={{
                    opacity: 1,
                    y: 0,
                }}
                viewport={{
                    once: true,
                }}
                transition={{
                    duration: 0.6,
                }}
                className="
                    tentang-kami__header
                    relative
                    z-10
                    text-center
                    mb-6
                    md:mb-10
                "
            >

                <span
                    className="
                        inline-block
                        px-4
                        py-1
                        mb-2
                        rounded-full
                        bg-blue-100
                        text-blue-500
                        text-xs
                        md:text-sm
                        font-semibold
                    "
                >
                    Visi & Misi
                </span>

                <h2
                    className="
                        tentang-kami__title
                        text-3xl
                        md:text-4xl
                        lg:text-5xl
                        font-bold
                        text-zinc-800
                    "
                >
                    Tentang Kami
                </h2>

                <div className="flex items-center justify-center gap-2 mt-3">

                    <span
                        className="
                            w-8
                            h-1
                            rounded-full
                            bg-blue-500
                        "
                    />

                    <span
                        className="
                            w-2
                            h-2
                            rounded-full
                            bg-blue-300
                        "
                    />

                    <span
                        className="
                            w-8
                            h-1
                            rounded-full
                            bg-blue-500
                        "
                    />

                </div>

            </motion.header>


            {/* =========================
                MAIN CONTENT
            ========================== */}

            <div
                className="
                    tentang-kami__content
                    relative
                    z-10
                    w-full
                    max-w-6xl
                    px-5
                    md:px-10
                "
            >

                {/* =========================
                    DESCRIPTION
                ========================== */}

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
                        amount: 0.15,
                    }}
                    transition={{
                        duration: 0.7,
                        delay: 0.1,
                    }}
                    className="
                        tentang-kami__description
                        relative
                        bg-white
                        rounded-2xl
                        shadow-md
                        p-5
                        md:p-8
                        border
                        border-gray-100
                        overflow-hidden
                    "
                >

                    {/* Accent */}

                    <div
                        className="
                            absolute
                            left-0
                            top-0
                            bottom-0
                            w-1
                            bg-blue-500
                        "
                    />

                    <div className="flex gap-4">

                        {/* Number */}

                        <div
                            className="
                                hidden
                                md:flex
                                shrink-0
                                w-10
                                h-10
                                rounded-full
                                bg-blue-100
                                text-blue-500
                                items-center
                                justify-center
                                font-bold
                            "
                        >
                            01
                        </div>

                        <p
                            className="
                                text-justify
                                text-zinc-600
                                text-sm
                                md:text-base
                                leading-7
                            "
                        >
                            {`Sebagai mahasiswa yang sadar akan panggilan ilmu pengetahuan dan perkembangan teknologi serta
                            mengupayakan penerapan etika Ilmu Pengetahuan dan Tri Dharma Perguruan Tinggi.
                            Menyadari akan tanggung jawab itu maka kami mahasiswa Kampus Insan Pembangunan berkewajiban membina
                            diri agar menjadi bangsa yang memiliki kemampuan akademik dan profesi, sehingga dapat menerapkan ilmu
                            pengetahuan dan mengembangkan teknologi. Oleh karena itu kami menghimpun diri dalam suatu wadah Organisasi
                            dibidang Teknologi, dengan nama " Community of Information Technology " pada tanggal 14 Februari 2010.`}
                        </p>

                    </div>

                </motion.div>


                {/* =========================
                    VISION & MISSION
                ========================== */}

                <div
                    className="
                        tentang-kami__vision-mission
                        flex
                        flex-col
                        lg:flex-row
                        items-stretch
                        gap-6
                        mt-8
                    "
                >

                    {/* =========================
                        IMAGE
                    ========================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: -40,
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
                            duration: 0.7,
                            ease: "easeOut",
                        }}
                        className="
                            tentang-kami__image
                            relative
                            hidden
                            md:block
                            lg:w-1/2
                            w-full
                            group
                        "
                    >

                        <div
                            className="
                                relative
                                overflow-hidden
                                rounded-2xl
                                shadow-lg
                                w-full
                                aspect-[4/3]
                            "
                        >

                            <Image
                                width={1000}
                                height={750}
                                className="
                                    w-full
                                    h-full
                                    object-cover
                                    object-center
                                    transition-transform
                                    duration-700
                                    ease-out
                                    group-hover:scale-105
                                "
                                src="/background/imgHero5.png"
                                alt="Ketua Umum COMIT 2025/2026"
                            />

                            {/* Overlay */}

                            <div
                                className="
                                    absolute
                                    inset-0
                                    bg-gradient-to-t
                                    from-black/60
                                    via-transparent
                                    to-transparent
                                "
                            />

                            {/* Caption */}

                            <div
                                className="
                                    absolute
                                    bottom-0
                                    left-0
                                    right-0
                                    p-5
                                    md:p-6
                                    text-white
                                "
                            >

                                <p
                                    className="
                                        text-xs
                                        md:text-sm
                                        text-white/70
                                    "
                                >
                                    Community of Information Technology
                                </p>

                                <h3
                                    className="
                                        text-lg
                                        md:text-xl
                                        font-bold
                                    "
                                >
                                    COMIT
                                </h3>

                            </div>

                        </div>

                    </motion.div>


                    {/* =========================
                        VISION & MISSION CARD
                    ========================== */}

                    <motion.div
                        initial={{
                            opacity: 0,
                            x: 40,
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
                            duration: 0.7,
                            ease: "easeOut",
                        }}
                        className="
                            tentang-kami__info
                            lg:w-1/2
                            w-full
                            bg-blue-100
                            rounded-2xl
                            shadow-md
                            p-6
                            md:p-8
                            relative
                            overflow-hidden

                            lg:max-h-[500px]
                            lg:overflow-y-auto
                            scrollbar-hide
                        "
                    >

                        {/* Decorative Circle */}

                        <div
                            className="
                                absolute
                                -right-16
                                -top-16
                                w-40
                                h-40
                                rounded-full
                                bg-blue-500/10
                                pointer-events-none
                            "
                        />


                        {/* =========================
                            VISI
                        ========================== */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20,
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
                                delay: 0.2,
                            }}
                            className="
                                vision-section
                                relative
                                z-10
                            "
                        >

                            <div className="flex items-center gap-3 mb-4">

                                <div
                                    className="
                                        w-10
                                        h-10
                                        shrink-0
                                        rounded-xl
                                        bg-blue-500
                                        text-white
                                        flex
                                        items-center
                                        justify-center
                                        font-bold
                                        shadow-sm
                                    "
                                >
                                    V
                                </div>

                                <div>

                                    <p
                                        className="
                                            text-xs
                                            text-blue-500
                                            font-semibold
                                        "
                                    >
                                        OUR VISION
                                    </p>

                                    <h3
                                        className="
                                            font-bold
                                            text-xl
                                            md:text-2xl
                                            text-zinc-800
                                        "
                                    >
                                        VISI
                                    </h3>

                                </div>

                            </div>


                            <ul className="space-y-3">

                                <li
                                    className="
                                        flex
                                        gap-3
                                        text-zinc-600
                                        text-sm
                                        md:text-base
                                        leading-6
                                    "
                                >

                                    <span
                                        className="
                                            text-blue-500
                                            font-bold
                                            shrink-0
                                        "
                                    >
                                        •
                                    </span>

                                    <p>
                                        Melaksanakan berbagai kegiatan yang
                                        bermanfaat dan yang bernilai positif.
                                    </p>

                                </li>

                                <li
                                    className="
                                        flex
                                        gap-3
                                        text-zinc-600
                                        text-sm
                                        md:text-base
                                        leading-6
                                    "
                                >

                                    <span
                                        className="
                                            text-blue-500
                                            font-bold
                                            shrink-0
                                        "
                                    >
                                        •
                                    </span>

                                    <p>
                                        Menjalin kerjasama dengan berbagai pihak
                                        dalam bidang teknologi informasi.
                                    </p>

                                </li>

                            </ul>

                        </motion.div>


                        {/* Divider */}

                        <div
                            className="
                                h-px
                                bg-blue-500/10
                                my-7
                            "
                        />


                        {/* =========================
                            MISI
                        ========================== */}

                        <motion.div
                            initial={{
                                opacity: 0,
                                y: 20,
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
                                delay: 0.35,
                            }}
                            className="
                                mission-section
                                relative
                                z-10
                            "
                        >

                            <div className="flex items-center gap-3 mb-4">

                                <div
                                    className="
                                        w-10
                                        h-10
                                        shrink-0
                                        rounded-xl
                                        bg-blue-500
                                        text-white
                                        flex
                                        items-center
                                        justify-center
                                        font-bold
                                        shadow-sm
                                    "
                                >
                                    M
                                </div>

                                <div>

                                    <p
                                        className="
                                            text-xs
                                            text-blue-500
                                            font-semibold
                                        "
                                    >
                                        OUR MISSION
                                    </p>

                                    <h3
                                        className="
                                            font-bold
                                            text-xl
                                            md:text-2xl
                                            text-zinc-800
                                        "
                                    >
                                        MISI
                                    </h3>

                                </div>

                            </div>


                            <ul className="space-y-3">

                                <li
                                    className="
                                        flex
                                        gap-3
                                        text-zinc-600
                                        text-sm
                                        md:text-base
                                        leading-6
                                    "
                                >

                                    <span
                                        className="
                                            text-blue-500
                                            font-bold
                                            shrink-0
                                        "
                                    >
                                        •
                                    </span>

                                    <p>
                                        Menghasilkan anggota COMIT yang handal
                                        dalam dunia informasi.
                                    </p>

                                </li>


                                <li
                                    className="
                                        flex
                                        gap-3
                                        text-zinc-600
                                        text-sm
                                        md:text-base
                                        leading-6
                                    "
                                >

                                    <span
                                        className="
                                            text-blue-500
                                            font-bold
                                            shrink-0
                                        "
                                    >
                                        •
                                    </span>

                                    <p>
                                        Memajukan dan mengembangkan almamater.
                                    </p>

                                </li>


                                <li
                                    className="
                                        flex
                                        gap-3
                                        text-zinc-600
                                        text-sm
                                        md:text-base
                                        leading-6
                                    "
                                >

                                    <span
                                        className="
                                            text-blue-500
                                            font-bold
                                            shrink-0
                                        "
                                    >
                                        •
                                    </span>

                                    <p>
                                        Menjadikan organisasi COMIT sebagai
                                        organisasi yang unggul baik secara
                                        akademis maupun non akademis.
                                    </p>

                                </li>

                            </ul>

                        </motion.div>

                    </motion.div>

                </div>

            </div>


            {/* =========================
                BOTTOM ACCENT
            ========================== */}

            <motion.div
                initial={{
                    width: 0,
                }}
                whileInView={{
                    width: "120px",
                }}
                viewport={{
                    once: true,
                }}
                transition={{
                    duration: 0.8,
                    delay: 0.4,
                }}
                className="
                    mt-10
                    h-1
                    rounded-full
                    bg-blue-500
                "
            />

        </div>
    );
}