"use client";

import { useEffect } from "react";
import { useRef } from "react";
import useSlideNav from "./useSlideNav";

export default function useOutFocus(ref, callback) {
    const outFocusRef = useRef(null);
    const { isOpen, setIsOpen } = useSlideNav();

    useEffect(() => {
        function handleClickOutside(event) {
            if (isOpen && outFocusRef.current && !outFocusRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen, setIsOpen]);

    return (
        outFocusRef
    )
}