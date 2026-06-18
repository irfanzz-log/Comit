'use client';

import { kegiatan } from "@/lib/dataMentor";
import Card from "../Cards";
import { useEffect, useRef } from "react";

export default function ActivitySection() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    cardRefs.current.forEach(el => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <article className="activities relative z-10 w-full md:pt-0 pt-5">
      <div 
        ref={sectionRef}
        className="activities__content w-full opacity-0 transition-all duration-1000 ease-out flex flex-col items-center md:p-10"
      >
        <header className="activities__header md:w-1/2 w-full text-center">
          <h2 className="activities__title text-5xl font-bold my-2">
            Kegiatan Kami
          </h2>
          <p className="activities__description text-lg my-2 md:px-0 px-5">
            Kami dengan bangga mempersembahkan berbagai kegiatan dan acara yang
            telah kami selenggarakan. Setiap acara dirancang untuk memberikan
            pengalaman yang berkesan dan penuh makna.
          </p>
        </header>

        {/* Activities Grid with Card Animations */}
        <div className="activities__grid w-full flex flex-wrap">
          {kegiatan.map((activity, index) => (
            <div
              key={index}
              ref={el => cardRefs.current[index] = el}
              className="activities__item w-full md:w-1/3 p-3 opacity-0 transition-all duration-1000 ease-out"
            >
              <Card
                href="#"
                nama={activity.namaKegiatan}
                url={activity.img}
                divisi={activity.content}
                imgStyle="activities__image w-full h-full object-cover rounded-xl transition-transform duration-300 hover:scale-110"
                cardStyle="activities__card w-full p-3 flex flex-col items-center text-center justify-center rounded-xl overflow-hidden cursor-pointer shadow-lg hover:bg-blue-50"
                nameStyle=""
              />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

