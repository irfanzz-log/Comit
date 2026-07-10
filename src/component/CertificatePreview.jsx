'use client';

import { useRef } from "react";
import { toJpeg } from "html-to-image";

export default function CertificatePreview({ certificate }) {
  const ref = useRef(null);

  const download = async () => {
    const dataUrl = await toJpeg(ref.current, {
      quality: 1,
      pixelRatio: 4,
      cacheBust: true,
    });

    const link = document.createElement("a");
    link.download = `${certificate.certificate_number}.jpg`;
    link.href = dataUrl;
    link.click();
  };

  return (
    <>
      <div
        ref={ref}
        className="relative overflow-hidden relative w-[300] aspect-[1123/794]"
      >
        <img
          src={certificate.background}
          alt="Background"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        <p
          className="absolute left-1/2 -translate-x-1/2 text-[#2A2C67] font-semibold"
          style={{
            top: 88,
            fontSize: 13,
          }}
        >
          {certificate.participant_name}
        </p>

        <p
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: 120,
            fontSize: 5,
          }}
        >
          {certificate.activity_name}
        </p>

        <p
          className="absolute left-11 -translate-x-1/2 font-bold opacity-75 text-center"
          style={{
            top: 25,
            fontSize: 5,
          }}
        >
          {certificate.certificate_number}
        </p>

        <p
          className="absolute left-[54px] -translate-x-1/2 font-bold opacity-75 text-center"
          style={{
            top: 31,
            fontSize: 3,
          }}
        >
          {certificate.id}
        </p>

        <p
          className="absolute left-1/2 -translate-x-1/2 text-center"
          style={{
            top: 150,
            fontSize: 2,
          }}
        >
          {certificate.activity_info}
        </p>
        
      </div>

      <div className="flex flex-col items-center text-center md:w-1/2 w-full mt-4 ">

          <p>Certificate number: {certificate.certificate_number}</p>
          <p>Participant: {certificate.participant_name}</p>
          <p>Activity: {certificate.activity_name}</p>
          <p>Issue Date: {certificate.issue_date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}</p>

        <button
        onClick={download}
        className="mt-5 text-sm rounded bg-green-600 p-2 px-3 text-white"
      >
        Download JPG
      </button>
      </div>
    </>
  );
}