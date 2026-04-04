"use client";

import { useState } from "react";

export default function DateFilter({ setDateInput }) {
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  // Fungsi saat tombol "Filter Tanggal" diklik
  function btnClick(e) {
    e.preventDefault();

    // Validasi agar kedua tanggal harus diisi
    if (!dateStart || !dateEnd) {
      return alert("Harap pilih tanggal mulai dan tanggal akhir.");
    }

    const start = new Date(dateStart);
    const end = new Date(dateEnd);

    // Proteksi jika tanggal akhir lebih kecil dari tanggal mulai
    if (end < start) {
      return alert("Tanggal akhir tidak boleh lebih kecil dari tanggal mulai.");
    }

    // Format ke YYYY-MM (dengan padStart agar bulan selalu 2 digit: 01, 02, dst)
    const keyStart = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`;
    const keyEnd = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, "0")}`;

    // Kirim data ke parent (Home.js)
    setDateInput({ keyStart, keyEnd });
  } 

  // Handler Tanggal Mulai
  function handleStartDate(e) {
    const newDate = e.target.value;
    setDateStart(newDate);
  }

  // Handler Tanggal Akhir
  function handleEndDate(e) {
    const newDate = e.target.value;
    setDateEnd(newDate);
  }

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-6">
      <div className="flex md:flex-row flex-col items-end gap-4">
        
        {/* Input Tanggal Mulai */}
        <div className="flex flex-col w-full">
          <label htmlFor="dateStart" className="text-sm font-medium text-gray-600 mb-1 ml-1">
            Tanggal Mulai
          </label>
          <input
            id="dateStart"
            type="date"
            value={dateStart}
            onChange={handleStartDate}
            max={dateEnd || undefined}
            className="p-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-700"
          />
        </div>

        {/* Input Tanggal Akhir */}
        <div className="flex flex-col w-full">
          <label htmlFor="dateEnd" className="text-sm font-medium text-gray-600 mb-1 ml-1">
            Tanggal Akhir
          </label>
          <input
            id="dateEnd"
            type="date"
            value={dateEnd || ""}
            onChange={handleEndDate}
            min={dateStart || undefined}
            className="p-2.5 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-700"
          />
        </div>

        {/* Tombol Submit */}
        <button
          onClick={btnClick}
          className="md:w-1/3 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-2.5 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
          </svg>
          Filter Data
        </button>

      </div>
    </div>
  );
} 