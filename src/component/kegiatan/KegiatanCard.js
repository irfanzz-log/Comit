'use client'

import { kegiatan } from "@/lib/dataMentor";
import Card from "../Cards";
import { useEffect, useRef } from "react";

export default function KegiatanCard() {
  const els = useRef([]); // array ref

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    els.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex section-content flex-wrap w-full">
      {kegiatan.map((k, index) => (
        <div
          key={index}
          ref={(el) => (els.current[index] = el)} // set ref per card
          className="transform opacity-0 transition-all duration-1000 ease-out w-full md:w-1/3 p-3"
        >
          <Card
            throw="#"
            url={k.img}
            namaStyle="strip"
            imgStyle="w-full h-full object-cover transform transition duration-300 ease-in-out rounded-xl hover:scale-110"
            cardStyle="cardx flex justify-center w-full p-3 overflow-hidden rounded-xl items-center flex-col cursor-pointer shadow-lg"
          />
        </div>
      ))}
    </div>
  );
}
