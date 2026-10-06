"use client";

import { useCallback, useEffect, useState } from "react";

const DESKTOP_BREAKPOINT = 768;

/**
 * Menu state for the public navbar: tracks whether the mobile menu is open
 * and whether the viewport is in desktop range (menu auto-collapses on resize).
 */
export default function useDesktopOpen() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen((prev) => !prev);
    }, []);

    return { isDesktop, isMenuOpen, toggleMenu };
}
