'use client'

import Link from "next/link"
import Image from "next/image"

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
        <Link 
            href={href} 
            className={`mentor-card flex ${cardStyle || ''}`}
        >
            <Image
                width={400}
                height={400} 
                className={`mentor-card__image ${imgStyle || ''}`} 
                src={url} 
                alt={`${nama} - ${divisi}`} 

            />
            <div className="mentor-card__content my-2 text-center">
                <h3 className={`mentor-card__name text-sm font-bold w-full ${nameStyle || ''}`}>
                    {nama}
                </h3>
                <p className="mentor-card__division text-xs">
                    {divisi}
                </p>
            </div>
        </Link>
    )
}