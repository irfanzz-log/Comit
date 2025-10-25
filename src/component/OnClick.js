'use client'

import Link from "next/link";

export default function OnClick() {
  return (
    <>
      <Link
        href="#"
        onClick={(e) => {
          e.preventDefault();
          document
            .getElementById("kepengurusan")
            .scrollIntoView({ behavior: "smooth" });
        }}
        className="bg-blue-500 text-white py-2 px-5 rounded-lg"
      >
        Get started
      </Link>
    </>
  );
}
