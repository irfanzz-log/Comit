"use client";

import Link from "next/link";
import Image from "next/image";
import useDesktopOpen from "@/hooks/ui/useDesktopOpen";
import { useAuth } from "@/app/context/AuthContext";

export default function Navigation({ link1, link2, link3, textLink1, textLink2, textLink3 }) {
  const { isDesktop, isMenuOpen, toggleMenu } = useDesktopOpen();
  const { user, logout, loading } = useAuth(); // Tambahkan logout & loading

  const navLinks = [
    { href: link1, text: textLink1 },
    { href: link2, text: textLink2 },
    { href: link3, text: textLink3 }
  ].filter(link => link.href); // Filter agar tidak render link kosong

  const authLinks = [
    { href: '/internal', text: 'Login', isPrimary: true },
    { href: '/internal/sign', text: 'Daftar', isPrimary: false }
  ];

  // Cegah flickering saat loading auth
  if (loading) return null;

  return (
    <header className="navbar relative flex justify-center mx-2">
      <nav className="navbar__container flex md:absolute fixed z-30 justify-between items-center shadow-lg p-3 m-2 md:w-11/12 w-5/6 bg-blue-500 rounded-xl transition-all duration-300">
        
        {/* Logo */}
        <div className="navbar__logo flex items-center">
          <Image 
            className="max-w-12 h-auto" 
            src="/logo/commitLogo.png" 
            alt="COMIT Logo" 
            width={50} // Perkecil width agar build size lebih ringan
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
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      isPrimary ? 'bg-white text-blue-500 hover:bg-gray-100' : 'text-white hover:text-blue-100'
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
            className="navbar__menu-button bg-white p-2 rounded-xl text-blue-500 shadow-lg focus:outline-none"
            aria-label="Toggle menu"
          >
            <div className="navbar__menu-icon space-y-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-6 h-0.5 bg-blue-500 rounded-lg" />
              ))}
            </div>
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        <div 
          className={`navbar__mobile-menu absolute top-0 left-0 w-full pb-5 rounded-xl shadow-lg bg-blue-500 transition-all duration-300 transform -z-10 ${
            isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
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
                <span className="text-white">User: {user.name}</span>
                <button onClick={logout} className="text-red-200 font-bold">Logout</button>
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