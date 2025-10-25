'use client'

import { useEffect, useState, useRef } from "react";

export default function Divisi() {
  const [num, setNum] = useState(0);
  const ref = useRef(null);
  const hasPlay = useRef(false);

  useEffect(() => {
    const element = ref.current;
    const observer = new IntersectionObserver(
      ([enrty]) => {
        if (enrty.isIntersecting && !hasPlay.current) {
          hasPlay.current = true;

          let i = 0;
          const interval = setInterval(() => {
            i++;
            setNum(i);
            if (i >= 267) {
              clearInterval(interval);
            }
          }, 1);
        }
      },
      { threshold: 0.2 }
    );

    if (element) observer.observe(element);
    return () => observer.unobserve(element);
  }, []);

  return (
    <>
      <div className="relative md:h-80 section-content my-2">
        <ul className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-4 text-center mt-5">
          <li className="inline-block bg-white p-5 text-lg font-bold w-full rounded-lg shadow-lg">
            Programming
          </li>
          <li className="inline-block bg-white p-5 text-lg font-bold w-full rounded-lg shadow-lg">
            Microsoft Office
          </li>
          <li className="inline-block bg-white p-5 text-lg font-bold w-full rounded-lg shadow-lg">
            Comp & Network
          </li>
          <li className="inline-block bg-white p-5 text-lg font-bold w-full rounded-lg shadow-lg">
            Design Grafis
          </li>
        </ul>
        <div className="md:absolute md:bottom-0 w-full md:my-0 my-5 flex md:flex-row flex-col ">
          <div className="md:w-1/2 w-full text-white md:text-left text-center">
            <h4 className="font-bold text-2xl">Mari bergabung bersama Kami!</h4>
            <p>Temukan rekan, mentor dan teman baru disini.</p>
          </div>
          <div
            ref={ref}
            className="md:static flex justify-center md:w-1/2 w-full text-white md:text-right text-center"
          >
            <p className="font-bold md:text-5xl text-4xl text-center md:w-full w-1/2">
              {num}+ Anggota
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
