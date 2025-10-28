"use client"

import { useEffect, useState } from 'react'

export default function useMenuOpen() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
    return (
        { isMenuOpen, toggleMenu }
    )
}