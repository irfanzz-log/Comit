"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

export default function Card({
    href = "#",
    url,
    nama,
    divisi,
    cardStyle,
    imgStyle,
    nameStyle,
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                y: 35,
                scale: 0.95,
            }}
            whileInView={{
                opacity: 1,
                y: 0,
                scale: 1,
            }}
            viewport={{
                once: true,
                amount: 0.2,
            }}
            transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
                y: -8,
            }}
            className="relative"
        >
            <Link
                href={href}
                className={`
                    group
                    relative
                    flex
                    flex-col
                    items-center
                    justify-center
                    rounded-2xl
                    p-4
                    transition-all
                    duration-300
                    ${cardStyle || ""}
                `}
            >
                {/* Background hover */}
                <div
                    className="
                        absolute
                        inset-0
                        rounded-2xl
                        bg-blue-400/0
                        group-hover:bg-blue-400/5
                        transition-all
                        duration-500
                        pointer-events-none
                    "
                />

                {/* FOTO */}
                <motion.div
                    className="
                        relative
                        w-40
                        h-40
                        md:w-50
                        md:h-50
                        rounded-full
                        p-1
                        bg-white
                        shadow-lg
                        group-hover:shadow-xl
                        transition-shadow
                        duration-500
                    "
                    whileHover={{
                        scale: 1.05,
                    }}
                    transition={{
                        duration: 0.3,
                        ease: "easeOut",
                    }}
                >
                    {/* Ring biru */}
                    <div
                        className="
                            absolute
                            -inset-1
                            rounded-full
                            border-2
                            border-transparent
                            group-hover:border-blue-400
                            transition-all
                            duration-500
                        "
                    />

                    <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-200">
                        <Image
                            fill
                            sizes="(max-width: 768px) 160px, 200px"
                            src={url}
                            alt={`${nama} - ${divisi}`}
                            className={`
                                object-cover
                                object-center
                                transition-transform
                                duration-700
                                ease-out
                                group-hover:scale-110
                                ${imgStyle || ""}
                            `}
                            preload
                        />
                    </div>
                </motion.div>

                {/* INFORMASI */}
                <div
                    className="
                        relative
                        z-10
                        mt-4
                        text-center
                    "
                >
                    <h3
                        className={`
                            text-lg
                            md:text-sm
                            font-bold
                            text-gray-800
                            group-hover:text-blue-500
                            transition-colors
                            duration-300
                            ${nameStyle || ""}
                        `}
                    >
                        {nama}
                    </h3>

                    {/* Divisi */}
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <span
                            className="
                                w-0
                                group-hover:w-5
                                h-px
                                bg-blue-400
                                transition-all
                                duration-300
                            "
                        />

                        <p
                            className="
                                text-xs
                                text-gray-500
                                group-hover:text-gray-700
                                transition-colors
                                duration-300
                            "
                        >
                            {divisi}
                        </p>

                        <span
                            className="
                                w-0
                                group-hover:w-5
                                h-px
                                bg-blue-400
                                transition-all
                                duration-300
                            "
                        />
                    </div>
                </div>

                {/* Accent bawah */}
                <div
                    className="
                        absolute
                        bottom-1
                        left-1/2
                        -translate-x-1/2
                        w-0
                        h-1
                        rounded-full
                        bg-blue-400
                        group-hover:w-1/3
                        transition-all
                        duration-300
                    "
                />
            </Link>
        </motion.div>
    );
}