'use client'

import { useState } from "react";
import { pengurus } from "@/lib/dataMentor";
import Card from "./Cards";
import Image from "next/image";

/**
 * StaffFilter component for filtering and displaying organization staff members
 */
export default function StaffFilter() {
  // State management for dropdown and selection
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState("Pilih Posisi");
  const [currentRole, setCurrentRole] = useState('Ketua & Wakil Ketua Umum');

  // Available positions in the organization
  const positions = [
    "Ketua & Wakil Ketua Umum",
    "Sekretaris",
    "Bendahara",
    "SDM",
    "Humas Internal",
    "Humas Eksternal",
    "Koordinator",
    "Prasarana",
    "Kominfo",
    "Staff Programming",
    "Staff Design Grafis",
    "Staff Comp & Network",
    "Staff Microsoft Office"
  ];

  // Filter staff members based on selected position
  const filteredStaff = pengurus.filter(member => member.posisi === currentRole);

  return (
    <>
      {/* Position Selector Dropdown */}
      <div className="relative staff-filter relative md:w-1/3 w-3/4 z-10">
        <button
          className="staff-filter__button flex justify-between items-center p-3 w-full bg-blue-500 text-white rounded-xl shadow-lg transition-colors hover:bg-blue-600"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          aria-expanded={isDropdownOpen}
          aria-haspopup="listbox"
        >
          <span>{selectedPosition}</span>
          <Image
            src={`/logo/caret-${isDropdownOpen ? 'down' : 'up'}-fill.svg`}
            alt={isDropdownOpen ? "Close dropdown" : "Open dropdown"}
            className="max-w-4 max-h-4"
            width={200}
            height={200}
          />
        </button>

        {/* Dropdown Options */}
        {isDropdownOpen && (
          <ul 
            className="absolute staff-filter__options overflow-y-scroll scrollbar-hide max-h-80 -mt-3 rounded-b-xl -z-1 w-full"
            role="listbox"
          >
            {positions.map((position, index) => (
              <li
                key={index}
                className="staff-filter__option bg-blue-500 p-3 text-white hover:bg-blue-700 cursor-pointer transition-colors"
                onClick={() => {
                  setSelectedPosition(position);
                  setIsDropdownOpen(false);
                  setCurrentRole(position);
                }}
                role="option"
                aria-selected={position === selectedPosition}
              >
                {position}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Staff Cards Grid */}
      <div className="staff-grid mt-20 w-full flex flex-wrap justify-center">
        {filteredStaff.map((staff, index) => (
          <Card
            key={index}
            href="#"
            nama={staff.nama}
            url={staff.imgUrl}
            divisi={staff.jabatan}
            imgStyle="staff-grid__image w-3/4 rounded-full shadow-xl"
            cardStyle="staff-grid__card flex justify-center items-center max-w-1/2 flex-col my-3 transform transition duration-300 hover:scale-125 cursor-pointer"
          />
        ))}
      </div>
    </>
  );
}
