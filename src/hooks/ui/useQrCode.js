"use client";

import { QRCodeSVG } from "qrcode.react";

export default function QRCodeGenerator({ value, size = 256 }) {
  return (
    <div className="flex flex-col items-center p-5 bg-white rounded-xl shadow-md border border-gray-200">
      <QRCodeSVG
        value={value}
        size={size}
        bgColor={"#ffffff"}
        fgColor={"#000000"}
        level={"L"} // Level koreksi kesalahan (L, M, Q, H)
        includeMargin={false}
        imageSettings={{
          src: "/logo/commitLogo.png", // Opsional: Tambahkan logo di tengah QR
          x: undefined,
          y: undefined,
          height: 40,
          width: 40,
          excavate: true, // Membuat lubang di QR agar logo tidak menumpuk
        }}
      />
      <p className="mt-4 text-sm text-gray-600 font-mono">{value}</p>
    </div>
  );
}