'use client'

import Link from "next/link";

/**
 * ScrollButton component for smooth scrolling to target sections
 * @param {Object} props - Component properties
 * @param {string} props.targetId - ID of the target element to scroll to
 */
export default function ScrollButton({ targetId , content}) {
  return (
    <Link
      href="#"
      onClick={(e) => {
        e.preventDefault();
        document
          .getElementById(targetId)
          .scrollIntoView({ behavior: "smooth" });
      }}
      className="scroll-button bg-blue-500 text-white py-2 px-5 rounded-lg hover:bg-blue-600 transition-colors duration-300"
    >
      {content}
    </Link>
  );
}
