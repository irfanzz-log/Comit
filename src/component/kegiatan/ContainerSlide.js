'use client';

import { kegiatan } from "@/lib/dataMentor";
import Card from "../Cards";
import {useEffect, useRef} from "react";

export default function ContainerSlide(props) {

    const el = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('opacity-100');
                    observer.unobserve(entry.target);
                }
            } , {threshold: 0.4}
        )

        if(el.current) observer.observe(el.current);

        return () => observer.disconnect();

      }, []);
    
  return (
    <>
      <article ref={el} className="relative z-10 w-full transition-all duration-1000 ease-out flex , opacity-0 flex-col items-center md:p-10">
        <header className="md:w-1/2 w-full text-center">
          <h2 className="text-5xl font-bold my-2">Kegiatan Kami</h2>
          <p className="text-lg my-2 md:px-0 px-5">
            Kami dengan bangga mempersembahkan berbagai kegiatan dan acara yang
            telah kami selenggarakan. Setiap acara dirancang untuk memberikan
            pengalaman yang berkesan dan penuh makna.
          </p>
        </header>
        <div className="flex section-content flex-wrap w-full">
          {kegiatan.map((k, index) => {
            return (
              <Card
                key={index}
                throw="#"
                nama={k.namaKegiatan}
                url={k.img}
                divisi={k.content}
                imgStyle="w-full rounded-xl"
                cardStyle="flex justify-center md:w-1/3 w-full p-7 rounded-xl items-center flex-col my-3 transform transition duration-300 hover:bg-blue-200 hover:scale-105 cursor-pointer"
              />
            );
          })}
        </div>
      </article>
    </>
  );
}
