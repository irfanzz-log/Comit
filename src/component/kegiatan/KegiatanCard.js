'use client'

import { kegiatan } from "@/lib/dataMentor";
import Card from "../Cards";

export default function KegiatanCard() {
  return (
    <>
      <div className="flex section-content flex-wrap w-full">
        {kegiatan.map((k, index) => (
          <Card
            key={index}
            throw="#"
            url={k.img}
            namaStyle="strip"
            imgStyle="w-full h-full object-cover transform transition duration-300 ease-in-out rounded-xl hover:scale-110"
            cardStyle="cardx flex justify-center md:w-1/3 w-full p-3 !m-0 overflow-hidden rounded-xl items-center flex-col my-3 cursor-pointer shadow-lg"
          />
        ))}
      </div>
    </>
  );
}
