"use client";
import { createContext, useContext, useState } from "react";

const SlideNavContext = createContext();

export function SlideNavProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <SlideNavContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SlideNavContext.Provider>
  );
}

export default function useSlideNav() {
  const context = useContext(SlideNavContext);
  if (!context) {
    throw new Error("useSlideNav must be used within a SlideNavProvider");
  }
  return context;
}
