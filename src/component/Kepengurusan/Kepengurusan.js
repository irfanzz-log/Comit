"use client";

import CardSelect from "../CardSelect";
import { useEffect, useRef } from "react";

export default function Kepengurusan() {
  const el = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("!translate-x-0", "!opacity-100");
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.4 }
    );
    if (el.current) observer.observe(el.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div
        ref={el}
        className="relative z-10 w-full flex flex-col items-center md:p-10 transition-all duration-2000 ease-out translate-x-100 opacity-0"
      >
        <header className=" md:w-1/2 2-full text-center">
          <h2 className="text-5xl font-bold my-2">Kepengurusan</h2>
          <p className="text-lg my-2">
            Kepengurusan COMIT 2024-2025 (Sahitya Arsa). Kepengurusan COMIT
            merupakan wadah utama yang berperan dalam menggerakkan seluruh
            kegiatan organisasi, mulai dari perencanaan program kerja,
            pelaksanaan kegiatan, hingga pengembangan anggota.
          </p>
        </header>
        <div className="relative section-content w-full flex flex-wrap justify-center">
          <CardSelect></CardSelect>
        </div>
      </div>
    </>
  );
}
