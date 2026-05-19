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

  return (
    <div 
      className="mentor-grid w-full flex flex-wrap justify-center "
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
