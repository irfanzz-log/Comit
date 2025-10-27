'use client'

import { useEffect, useState, useRef } from "react";

/**
 * DivisiSection component displays division categories and member count
 * with animation on scroll
 */
export default function DivisiSection() {
  // State for animated member count
  const [memberCount, setMemberCount] = useState(0);
  const counterRef = useRef(null);
  const hasAnimated = useRef(false);

  // Intersection observer for counter animation
  useEffect(() => {
    const element = counterRef.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          
          // Animate member count from 0 to 267
          let count = 0;
          const interval = setInterval(() => {
            count++;
            setMemberCount(count);
            if (count >= 267) {
              clearInterval(interval);
            }
          }, 1);
        }
      },
      { threshold: 0.2 }
    );

    if (element) observer.observe(element);
    return () => element && observer.unobserve(element);
  }, []);

  return (
    <div className="divisi relative md:h-80 my-2">
      {/* Division Categories */}
      <ul className="divisi__categories grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 text-center mt-5">
        {['Programming', 'Microsoft Office', 'Comp & Network', 'Design Grafis'].map((division) => (
          <li 
            key={division}
            className="divisi__category bg-white p-5 text-lg font-bold w-full rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            {division}
          </li>
        ))}
      </ul>

      {/* Call to Action Section */}
      <div className="divisi__cta md:absolute md:bottom-0 w-full md:my-0 my-5 flex md:flex-row flex-col">
        {/* CTA Text */}
        <div className="divisi__cta-text md:w-1/2 w-full text-white md:text-left text-center">
          <h4 className="text-2xl font-bold">Mari bergabung bersama Kami!</h4>
          <p className="mt-2">Temukan rekan, mentor dan teman baru disini.</p>
        </div>

        {/* Member Counter */}
        <div
          ref={counterRef}
          className="divisi__counter md:w-1/2 w-full text-white md:text-right text-center flex justify-center"
        >
          <p className="font-bold md:text-5xl text-4xl text-center md:w-full w-1/2">
            {memberCount}+ Anggota
          </p>
        </div>
      </div>
    </div>
  );
}
