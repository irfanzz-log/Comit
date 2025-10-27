"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Navigation component with responsive design and mobile menu
 * @param {Object} props - Component properties
 * @param {string} props.link1 - URL for first navigation link
 * @param {string} props.link2 - URL for second navigation link
 * @param {string} props.textLink1 - Text for first navigation link
 * @param {string} props.textLink2 - Text for second navigation link
 */
export default function Navigation({ link1, link2, textLink1, textLink2 }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Navigation links configuration
  const navLinks = [
    { href: link1, text: textLink1 },
    { href: link2, text: textLink2 }
  ];

  // Auth links configuration
  const authLinks = [
    { href: '#', text: 'Login', isPrimary: true },
    { href: '#', text: 'Daftar', isPrimary: false }
  ];

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
    <header className="navbar relative flex justify-center mx-2">
      <nav className="navbar__container flex md:absolute fixed z-30 justify-between items-center shadow-lg p-3 m-2 md:w-11/12 w-5/6 bg-blue-500 rounded-xl transition-all duration-300">
        {/* Logo */}
        <div className="navbar__logo flex items-center">
          <Image 
            className="max-w-12 h-auto" 
            src="/logo/commitLogo.png" 
            alt="COMIT Logo" 
            width={200}
            height={200}
          />
        </div>

        {/* Desktop Navigation Links */}
        <ul className="navbar__links md:flex flex-row hidden space-x-4">
          {navLinks.map(({ href, text }) => (
            <li key={text} className="navbar__link">
              <Link 
                href={href}
                className="text-white hover:text-blue-100 transition-colors"
              >
                {text}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Auth Buttons */}
        <ul className="navbar__auth flex flex-row space-x-2">
          {/* Desktop Only Auth Buttons */}
          {authLinks.map(({ href, text, isPrimary }) => (
            <li key={text} className="md:block hidden">
              <Link
                href={href}
                className={`py-2 px-5 rounded-xl transition-all duration-300 ${
                  isPrimary 
                    ? 'bg-white text-blue-500 hover:bg-blue-50 shadow-lg' 
                    : 'text-white hover:text-blue-100'
                }`}
              >
                {text}
              </Link>
            </li>
          ))}

          {/* Mobile Menu Button */}
          <li className="md:hidden block">
            <button
              onClick={toggleMenu}
              className="navbar__menu-button bg-white p-2 rounded-xl text-blue-500 shadow-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {/* Hamburger Icon */}
              <div className="navbar__menu-icon space-y-1">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i}
                    className="w-6 h-0.5 bg-blue-500 rounded-lg transition-all duration-300"
                  />
                ))}
              </div>
            </button>
          </li>
        </ul>

        {/* Mobile Menu */}
        <div 
          className={`navbar__mobile-menu absolute top-0 left-0 w-full pb-5 rounded-xl shadow-lg bg-blue-500 transition-all duration-300 transform -z-5 ${
            isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          } ${isDesktop ? 'hidden' : 'block'}`}
        >
          <div className="flex flex-col items-center mt-20 space-y-5">
            {/* Mobile Navigation Links */}
            {navLinks.map(({ href, text }) => (
              <Link 
                key={text}
                href={href} 
                className="text-white text-lg hover:text-blue-100 transition-colors"
              >
                {text}
              </Link>
            ))}

            {/* Mobile Menu Divider */}
            <span className="w-full border-b border-white/20" />

            {/* Mobile Auth Links */}
            <ul className="w-full flex justify-around">
              {authLinks.map(({ href, text }) => (
                <li key={text}>
                  <Link 
                    href={href}
                    className="text-white hover:text-blue-100 transition-colors"
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
