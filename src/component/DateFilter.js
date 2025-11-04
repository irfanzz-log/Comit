"use client";

import { useEffect, useState } from "react";

export default function DateFilter({ setDateInput }) {
  const [dateStart, setDateStart] = useState("");
  const [dateEnd, setDateEnd] = useState("");

  // Button function input date
  function btnClick(e) {
    e.preventDefault();

    if (!dateStart && !dateEnd) return alert("Pilih tanggal");

    const dateStartValue = new Date(dateStart);
    const dateEndValue = new Date(dateEnd);
    const keyStart = `${dateStartValue.getFullYear()}-${
      dateStartValue.getMonth() + 1
    }`;
    const keyEnd = `${dateEndValue.getFullYear()}-${
      dateEndValue.getMonth() + 1
    }`;

    setDateInput({ keyStart, keyEnd });
  }

  // Date start input
  function handleStartDate(e) {
    const newDate = e.target.value;
    setDateStart(newDate);

    if (dateEnd && newDate > dateEnd) {
      setDateEnd(newDate);
    }
  }

  // Date end input
  function handleEndDate(e) {
    const newDate = e.target.value;
    setDateEnd(newDate);

    if (dateStart && newDate < dateStart) {
      setDateStart(newDate);
    }
  }

  return (
    <>
      <div className="flex md:flex-row flex-col items-center">
        <div className="flex flex-row md:w-3/4 w-full my-2">
          <div className="md:mx-2 w-full my-2">
            <label htmlFor="" className="mx-1">
              Tanggal Mulai
            </label>
            <input
              onChange={handleStartDate}
              id="dateStart"
              type="date"
              max={dateEnd || undefined }
              className="p-2 rounded-md border-1 border-gray-200 hover:scale-105 transition transition-duration-200 ease-out shadow-sm"
            />
          </div>

          <div className="md:mx-2 w-full my-2">
            <label htmlFor="" className="mx-1">
              Tanggal akhir
            </label>
            <input
              onChange={handleEndDate}
              id="dateEnd"
              type="date"
              min={dateStart || undefined}
              className="p-2 rounded-md border-1 border-gray-200 hover:scale-105 transition transition-duration-200 ease-out shadow-sm"
            />
          </div>
        </div>

        <button
          onClick={btnClick}
          className="md:w-1/2 md:mb-0 mb-5 w-full bg-black p-2 rounded-lg shadow-sm hover:scale-105 cursor-pointer transition transition-duration-200 ease-out mx-4 text-white"
        >
          Filter Tanggal
        </button>
      </div>
    </>
  );
}
