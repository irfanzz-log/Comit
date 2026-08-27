"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";

/**
 * MentorCard component displays individual mentor information
 *
 * @param {Object} props
 * @param {string} props.href - Link destination
 * @param {string} props.url - Image URL of the mentor
 * @param {string} props.nama - Name of the mentor
 * @param {string} props.divisi - Division/specialty of the mentor
 * @param {string} props.cardStyle - Custom styles for the card container
 * @param {string} props.imgStyle - Custom styles for the mentor image
 * @param {string} props.nameStyle - Custom styles for the mentor name
 */
export default function MentorCard({
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
                y: 40,
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
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
                y: -8,
            }}
            className="relative z-0"
        >
            <Link
                href={href}
                className={`
                    mentor-card
                    group
                    relative
                    z-0
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
                {/* Decorative glow */}
                <div
                    className="
                        absolute
                        inset-0
                        rounded-2xl
                        bg-blue-500/0
                        group-hover:bg-blue-500/5
                        transition-all
                        duration-500
                        pointer-events-none
                    "
                />

                {/* Image Wrapper */}
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
                    {/* Animated Ring */}
                    <div
                        className="
                            absolute
                            -inset-1
                            rounded-full
                            border-2
                            border-transparent
                            group-hover:border-blue-400
                            group-hover:rotate-180
                            transition-all
                            duration-700
                        "
                    />

                    <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-200">
                        <Image
                            fill
                            sizes="(max-width: 768px) 160px, 200px"
                            className={`
                                mentor-card__image
                                object-cover
                                object-center
                                transition-transform
                                duration-700
                                ease-out
                                group-hover:scale-110
                                ${imgStyle || ""}
                            `}
                            src={url}
                            alt={`${nama} - ${divisi}`}
                            preload="true"
                        />
                    </div>
                </motion.div>

                {/* Content */}
                <motion.div
                    className="
                        mentor-card__content
                        relative
                        mt-4
                        text-center
                    "
                    initial={{ opacity: 0, y: 5 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.5,
                        delay: 0.15,
                    }}
                >
                    <h3
                        className={`
                            mentor-card__name
                            md:text-sm
                            text-lg
                            font-bold
                            w-full
                            text-gray-800
                            group-hover:text-blue-500
                            transition-colors
                            duration-300
                            ${nameStyle || ""}
                        `}
                    >
                        {nama}
                    </h3>

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
                                mentor-card__division
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
                </motion.div>

                {/* Bottom accent */}
                <motion.div
                    className="
                        absolute
                        bottom-1
                        left-1/2
                        -translate-x-1/2
                        h-1
                        rounded-full
                        bg-blue-400
                    "
                    initial={{ width: 0 }}
                    whileHover={{ width: "35%" }}
                    transition={{
                        duration: 0.3,
                    }}
                />
            </Link>
        </motion.div>
    );
}