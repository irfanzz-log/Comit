'use client'

import { data } from "@/lib/dataMentor";
import Card from "../Cards";
import { useState, useEffect, useRef } from "react";

export default function CardParent(props) {

  const el = useRef(null);

useEffect(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('translate-x-0', 'opacity-100');
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
      <div ref={el} className="section-content -translate-x-100 opacity-0 transition-all duration-2000 ease-out w-full flex flex-wrap justify-center">
        {data.map((mentor, index) => {
          return (
            <Card
              key={index}
              throw="#"
              nama={mentor.nama}
              url={mentor.imgurl}
              divisi={mentor.divisi}
              imgStyle={props.imgStyle}
              cardStyle={props.cardStyle}
            />
          );
        })}
      </div>
    </>
  );
}
