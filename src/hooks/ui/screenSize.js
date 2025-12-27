'use client'

import { useEffect, useState } from "react";

export default function screenSize() {
  const [width, setWidth] = useState();

  useEffect(() => {
    const handleSize = () => setWidth(window.innerWidth);
    handleSize();

    window.addEventListener("resize", handleSize);

    return () => removeEventListener("resize", handleSize);
  }, []);

  return width;
}
