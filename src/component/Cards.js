'use client'

import Link from "next/link"
import Image from "next/image"
import { motion } from "motion/react"

/**
 * MentorCard component displays individual mentor information
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
    href = '#',
    url,
    nama,
    divisi,
    cardStyle,
    imgStyle,
    nameStyle
}) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ 
                duration: 0.5,
                ease: "easeOut",
             }}
        >
            <Link
                href={href}
                className={`mentor-card flex ${cardStyle || ''}`}
            >
                <div className="relative w-50 h-50 rounded-full overflow-hidden">
                    <Image
                    fill
                    className={`mentor-card__image object-cover object-center ${imgStyle || ''}`}
                    src={url}
                    alt={`${nama} - ${divisi}`}
                />
                </div>
                
                <div className="mentor-card__content my-2 text-center">
                    <h3 className={`mentor-card__name md:text-sm text-lg font-bold w-full ${nameStyle || ''}`}>
                        {nama}
                    </h3>
                    <p className="mentor-card__division text-xs">
                        {divisi}
                    </p>
                </div>
            </Link>
        </motion.div>
    )
}