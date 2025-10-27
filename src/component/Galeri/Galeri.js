"use client";

import { useEffect, useRef } from "react";
import { gallery } from "@/data/gallery";
import Link from "next/link";
import Image from "next/image";

export default function Galeri() {
    const galleryRef = useRef([]);
    const gallerySectionRef = useRef(null);

    useEffect(()=> {
        const observer = new IntersectionObserver(
            (entry) => {
                entry.forEach((entries) => {
                    if (entries.isIntersecting) {
                        entries.target.classList.add('opacity-100', 'translate-x-0');
                        observer.unobserve(entries.target);
                    }
                }), { threshold: 0.2}
            }
        )

        if (gallerySectionRef.current) {
            observer.observe(gallerySectionRef.current);
        }

        galleryRef.current.forEach(item => {
            if (item) observer.observe(item);
        });

        return () => observer.disconnect();
    },[]);

    return (
        <div className="flex justify-center items-center flex-col w-full overflow-x-hidden">
            <header ref={gallerySectionRef} className="gallery__header mt-10 w-full text-center opcacity-0 -translate-y-10 transition-all duration-1000 ease-out">
                <h2 className="text-5xl font-bold my-2">Galeri</h2>
                <p className="text-lg my-2">Dokumentasi perjalanan dan momen berharga bersama Community of Information Technology (COMIT).</p>
            </header>
            <div className="gallery_container relative flex w-full flex-wrap justify-center">
                {/* Gallery images can be added here */}
                {gallery.map((item, index) => {
                    return (
                        <div ref={item => galleryRef.current[index] = item } key={index} className="gallery_content md:max-w-1/4 w-full p-2 text-center bg-white shadow-lg m-2 hover:scale-105 transition duration-500 cursor-pointer rounded-lg opacity-0 -translate-x-10">
                            <Image src={item.imgUrl} alt="" width={800} height={600} />
                            <div className="line p-3"></div>
                        </div>
                    )
                })}
            </div>
            <Link href="#" className="gallery__link md:p-5 p-3 text-white md:text-xl text-lg bg-blue-500 rounded-lg my-7 hover:scale-110 transition duration-300 shadow-lg">
                Lihat Lainnya
            </Link>
        </div>
    )
}