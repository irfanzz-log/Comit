'use client'

import { data } from "@/lib/dataMentor";
import Card from "../Cards";
import { useEffect, useRef } from "react";

/**
 * MentorGrid component displays a grid of mentor cards with animation
 * @param {Object} props - Component properties
 * @param {string} props.imgStyle - Style classes for mentor images
 * @param {string} props.cardStyle - Style classes for mentor cards
 */
export default function MentorGrid({ imgStyle, cardStyle }) {
  // Ref for intersection observer
  const gridRef = useRef(null);

  // Setup intersection observer for slide-in animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('md:translate-x-0', 'translate-x-0', 'opacity-100');
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.4 }
    );

    if (gridRef.current) {
      observer.observe(gridRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={gridRef} 
      className="mentor-grid w-full flex flex-wrap justify-center md:-translate-x-100 -translate-x-20 opacity-0 transition-all duration-2000 ease-out"
    >
      {data.map((mentor, index) => (
        <Card
          key={index}
          href="#"
          nama={mentor.nama}
          url={mentor.imgurl}
          divisi={mentor.divisi}
          imgStyle={imgStyle}
          cardStyle={cardStyle}
        />
      ))}
    </div>
  );
}
