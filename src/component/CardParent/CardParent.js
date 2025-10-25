'use client'

import { data } from "@/lib/dataMentor";
import Card from "../Cards";
import { useState, useEffect, useRef } from "react";

export default function CardParent() {

  const el = useRef(null);

  useEffect(()=> {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry)=> {
          if(entry.isIntersecting) {
            entry.target.dataset.show = "true";
            observer.unobserve(entry.target);
          }
        })
      }
    );

    const cards = el.current.querySelectorAll('.observe-item');
    cards.forEach((card)=> observer.observe(card));

    return ()=> observer.disconnect();

  },[])


  return (
    <>
      <div ref={el} className="section-content opacity-0 -translate-x-[200px] transition-all duration-700 data-[show=true]:opacity-100 data-[show=true]:translate-x-0 ease-out w-full flex flex-wrap justify-center">
        {data.map((mentor, index) => {
          return (
            <Card
              key={index}
              throw="#"
              nama={mentor.nama}
              url={mentor.imgurl}
              divisi={mentor.divisi}
              imgStyle="w-3/4 rounded-full shadow-xl"
              cardStyle="observe-item flex justify-center items-center max-w-1/2 flex-col my-3 transform transition duration-300 hover:scale-125 cursor-pointer"
            />
          );
        })}
      </div>
    </>
  );
}
