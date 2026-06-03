"use client";

import Link from "next/link";
import Image from "next/image";
import useDesktopOpen from "@/hooks/ui/useDesktopOpen";
import { useAuth } from "@/app/context/AuthContext";

export default function Navigation({ link1, link2, link3, textLink1, textLink2, textLink3 }) {
  const { isDesktop, isMenuOpen, toggleMenu } = useDesktopOpen();
  const { user, logout, loading } = useAuth();

  const navLinks = [
    { href: link1, text: textLink1 },
    { href: link2, text: textLink2 },
    { href: link3, text: textLink3 }
  ].filter(link => link.href);

  const authLinks = [
    { href: '/internal', text: 'Login', isPrimary: true },
    { href: '/internal/sign', text: 'Daftar', isPrimary: false }
  ];

  return (
    <header className="navbar relative flex justify-center mx-2 w-full">
      <nav className="navbar__container flex fixed z-30 justify-between w-4/5 items-center shadow-lg p-3 m-2 bg-blue-500 rounded-xl">

        {/* Logo */}
        <div className="navbar__logo flex items-center">
          <Image
            className="max-w-12 h-auto"
            src="/logo/commitLogo.png"
            alt="COMIT Logo"
            width={50} //
            height={50}
          />
        </div>

        {/* Desktop Navigation Links */}
        <ul className="navbar__links md:flex flex-row hidden space-x-4">
          {navLinks.map(({ href, text }, idx) => (
            <li key={idx} className="navbar__link">
              <Link href={href} className="text-white hover:text-blue-100 transition-colors">
                {text}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Auth Section */}
        <div className="hidden md:block">
          {user ? (
            <div className="flex items-center space-x-4 text-white">
              <span className="font-medium">Halo, <span className="font-bold">{user.nama}</span></span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-500  px-4 py-2 rounded-lg transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <ul className="navbar__auth flex flex-row space-x-4">
              {authLinks.map(({ href, text, isPrimary }, idx) => (
                <li key={idx}>
                  <Link
                    href={href}
                    className={`px-4 py-2 rounded-lg transition-colors ${isPrimary ? 'bg-white text-blue-500 hover:bg-gray-100' : 'text-white hover:text-blue-100'
                      }`}
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            className={`navbar__menu-button relative text-white focus:outline-none`}
            aria-label="Toggle menu"
          >
            
              <div className={`navbar__menu-icon absolute right-2 -top-4 space-y-1 transition-all duration-700 ease-out ${isMenuOpen ? 'opacity-100 rotate-180' : 'opacity-0 rotate-0'}`}>
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-x-lg"
                viewBox="0 0 16 16"
              >
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
              </svg>
              </div>
            
              <div className={`navbar__menu-icon absolute right-2 -top-4 space-y-1 transition-all duration-700 ease-out ${isMenuOpen ? 'opacity-0 rotate-0' : 'opacity-100 rotate-180'}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="35"
                  height="35"
                  fill="currentColor"
                  className="bi bi-list"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                  />
                </svg>
              </div>
            
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div
          className={`navbar__mobile-menu absolute top-0 left-0 w-full pb-5 rounded-xl shadow-lg bg-blue-500 transition-all duration-300 transform -z-10 ${isMenuOpen ? 'translate-y-10 opacity-100' : '-translate-y-0 opacity-0 hidden'
            } ${isDesktop ? 'hidden' : 'block'}`}
        >
          <div className="flex flex-col items-center mt-20 space-y-5 px-6">
            {navLinks.map(({ href, text }) => (
              <Link key={text} href={href} className="text-white text-lg w-full text-center">
                {text}
              </Link>
            ))}

            <span className="w-full border-b border-white/20" />

            {/* Mobile Auth Links */}
            {user ? (
              <div className="flex flex-col items-center space-y-3 w-full">
                <span className="text-white">{user.nama}</span>
                <button onClick={logout} className="text-white bg-red-500 p-2 px-5 rounded-lg">Logout</button>
              </div>
            ) : (
              <div className="w-full flex flex-col space-y-3">
                {authLinks.map(({ href, text, isPrimary }) => (
                  <Link
                    key={text}
                    href={href}
                    className={`text-center py-2 rounded-lg ${isPrimary ? 'bg-white text-blue-500' : 'text-white border border-white'}`}
                  >
                    {text}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}