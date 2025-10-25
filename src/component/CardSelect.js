'use client'
import { useState } from "react";
import { pengurus } from "@/lib/dataMentor";
import Card from "./Cards";

export default function CardSelect() {

      // filter card function -------------------------------
      const [open, setOpen] = useState(false);
      const [select, selected] = useState("Pilih Posisi");
      const [posisi, setPoisis] = useState('Ketua & Wakil Ketua Umum');
    
      const filter = pengurus.filter(filtered => filtered.posisi == posisi)
    
      const opt = ["Ketua & Wakil Ketua Umum", "Sekretaris", "Bendahara", "SDM", "Humas Internal", "Humas Eksternal", "Kordinator", "Prasarana", "Kominfo", "Staff Programming", "Staff Design Grafis", "Staff Comp & Network", "Staff Microsoft Office"];
      //-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    

  return (
    <>
      <div className={`absolute md:w-1/3 w-3/4 ${open && "h-full"} z-10`}>
        <button
          className="flex justify-between relative cursor-pointer p-3 text-left bg-blue-500 text-white rounded-xl w-full z-100 shadow-lg"
          onClick={() => {
            setOpen(!open);
          }}
        >
          <span>{select}</span>
          <img
            src={
              !open ? `./logo/caret-up-fill.svg` : `./logo/caret-down-fill.svg`
            }
            alt=""
          />
        </button>
        {open && (
          <ul className="overflow-y-scroll scrollbar-hide h-full -mt-3">
            {opt.map((option, index) => {
              return (
                <li
                  key={index}
                  className="bg-blue-500 p-3 text-white hover:bg-blue-700 cursor-pointer "
                  onClick={() => {
                    selected(option);
                    setOpen(false);
                    setPoisis(option);
                  }}
                >
                  {option}
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="section-content mt-20 w-full flex flex-wrap justify-center">
        {filter.map((p, index) => {
          return (
            <Card
              key={index}
              throw="#"
              nama={p.nama}
              url={p.imgUrl}
              divisi={p.jabatan}
              imgStyle="w-3/4 rounded-full shadow-xl"
              cardStyle="flex justify-center items-center max-w-1/2 flex-col my-3 transform transition duration-300 hover:scale-125 cursor-pointer"
            />
          );
        })}
      </div>
    </>
  );
}
