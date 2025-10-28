"use client"

import { useEffect, useState } from 'react'
import useMenuOpen from './useMenuOpen';

export default function useDesktopOpen() {
    const {isMenuOpen, toggleMenu} = useMenuOpen();
    const [isDesktop, setIsDesktop] = useState(false);

     useEffect(() => {
        const handleResize = () => {
          if (window.innerWidth >= 768 && isMenuOpen) {
            setIsDesktop(true);
          } else {
            setIsDesktop(false);
          }
        }
    
        handleResize(); // Initial check
    
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      })

    return (
       { isDesktop, isMenuOpen, toggleMenu }
    )
}