"use client";

import Link from "next/link";
import Image from "next/image";
import useDesktopOpen from "@/hooks/ui/useDesktopOpen";
import { useAuth } from "@/app/context/AuthContext";

export default function Navigation({
  link1,
  link2,
  link3,
  textLink1,
  textLink2,
  textLink3,
}) {
  const { isDesktop, isMenuOpen, toggleMenu } = useDesktopOpen();
  const { user, logout } = useAuth();

  const navLinks = [
    { href: link1, text: textLink1 },
    { href: link2, text: textLink2 },
    { href: link3, text: textLink3 },
  ].filter((link) => link.href);

  const authLinks = [
    {
      href: "/internal",
      text: "Login",
      isPrimary: true,
    },
    {
      href: "/internal/sign",
      text: "Daftar",
      isPrimary: false,
    },
  ];

  return (
    <header className="navbar absolute top-0 left-0 z-50 flex justify-center w-full">
      <nav
        className="
          navbar__container
          relative
          flex
          items-center
          justify-between
          w-[92%]
          md:w-4/5
          mt-3
          px-4
          md:px-5
          py-2.5
          bg-blue-500
          rounded-xl
          shadow-lg
        "
      >
        {/* =====================================================
            LOGO
        ====================================================== */}
        <Link
          href="/"
          className="
            navbar__logo
            flex
            items-center
            shrink-0
            outline-none
          "
        >
          <Image
            src="/logo/commitLogo.png"
            alt="Logo"
            width={45}
            height={45}
            priority
            className="
              w-10
              h-10
              md:w-11
              md:h-11
              object-contain
            "
          />
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
        ====================================================== */}
        <ul
          className="
            navbar__links
            hidden
            md:flex
            items-center
            gap-8
            ml-auto
            mr-8
          "
        >
          {navLinks.map(({ href, text }, idx) => (
            <li key={idx}>
              <Link
                href={href}
                className="
                  relative
                  text-white
                  font-medium
                  text-sm
                  transition-colors
                  duration-300
                  hover:text-blue-100
                  after:absolute
                  after:left-0
                  after:-bottom-1
                  after:w-0
                  after:h-0.5
                  after:bg-white
                  after:rounded-full
                  after:transition-all
                  after:duration-300
                  hover:after:w-full
                "
              >
                {text}
              </Link>
            </li>
          ))}
        </ul>

        {/* =====================================================
            DESKTOP AUTH
        ====================================================== */}
        <div className="hidden md:flex items-center">
          {user ? (
            <div className="flex items-center gap-4 text-white">
              {/* Nama user tanpa background */}
              <span className="text-sm font-medium">
                Halo,{" "}
                <span className="font-bold">
                  {user.nama}
                </span>
              </span>

              <button
                onClick={logout}
                className="
                  px-4
                  py-2
                  rounded-lg
                  bg-red-500
                  text-white
                  text-sm
                  font-medium
                  hover:bg-red-600
                  active:scale-95
                  transition-all
                  duration-200
                "
              >
                Logout
              </button>
            </div>
          ) : (
            <ul className="flex items-center gap-2">
              {authLinks.map(({ href, text, isPrimary }) => (
                <li key={text}>
                  <Link
                    href={href}
                    className={`
                      inline-flex
                      items-center
                      justify-center
                      px-4
                      py-2
                      rounded-lg
                      text-sm
                      font-medium
                      transition-all
                      duration-200
                      ${
                        isPrimary
                          ? `
                            bg-white
                            text-blue-500
                            hover:bg-blue-50
                            active:scale-95
                          `
                          : `
                            text-white
                            hover:bg-white/10
                          `
                      }
                    `}
                  >
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* =====================================================
            MOBILE HAMBURGER
        ====================================================== */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Tutup menu" : "Buka menu"}
            aria-expanded={isMenuOpen}
            className="
              relative
              z-50
              w-10
              h-10
              flex
              items-center
              justify-center
              text-white
              outline-none
              focus:outline-none
              active:scale-90
              transition-transform
              duration-200
            "
          >
            {/* Hamburger */}
            <div
              className={`
                absolute
                flex
                flex-col
                gap-1.5
                transition-all
                duration-300
                ${
                  isMenuOpen
                    ? "opacity-0 rotate-90 scale-75"
                    : "opacity-100 rotate-0 scale-100"
                }
              `}
            >
              <span className="block w-6 h-0.5 bg-white rounded-full" />
              <span className="block w-6 h-0.5 bg-white rounded-full" />
              <span className="block w-6 h-0.5 bg-white rounded-full" />
            </div>

            {/* Close */}
            <div
              className={`
                absolute
                transition-all
                duration-300
                ${
                  isMenuOpen
                    ? "opacity-100 rotate-0 scale-100"
                    : "opacity-0 -rotate-90 scale-75"
                }
              `}
            >
              <span
                className="
                  absolute
                  w-6
                  h-0.5
                  bg-white
                  rounded-full
                  -translate-x-1/2
                  rotate-45
                "
              />

              <span
                className="
                  absolute
                  w-6
                  h-0.5
                  bg-white
                  rounded-full
                  -translate-x-1/2
                  -rotate-45
                "
              />
            </div>
          </button>
        </div>

        {/* =====================================================
    MOBILE DROPDOWN
===================================================== */}
<div
  className={`
    navbar__mobile-menu
    md:hidden
    absolute
    top-full
    left-0
    w-full
    mt-2
    rounded-2xl
    bg-blue-500
    shadow-2xl
    border
    border-white/10
    overflow-hidden
    transition-all
    duration-300
    ease-out
    origin-top
    ${
      isMenuOpen
        ? "opacity-100 translate-y-0 scale-y-100 visible"
        : "opacity-0 -translate-y-3 scale-y-95 invisible"
    }
  `}
>
  <div className="relative px-4 py-5">

    {/* Decorative element */}
    <div
      className="
        absolute
        -top-16
        -right-16
        w-32
        h-32
        rounded-full
        bg-white/10
        blur-2xl
        pointer-events-none
      "
    />

    <div
      className="
        absolute
        -bottom-20
        -left-20
        w-40
        h-40
        rounded-full
        bg-blue-700/20
        blur-2xl
        pointer-events-none
      "
    />

    {/* Menu Content */}
    <div className="relative z-10">

      {/* Navigation Label */}
      <div className="px-2 mb-3">
        <span
          className="
            text-[10px]
            uppercase
            tracking-[0.2em]
            font-semibold
            text-white/50
          "
        >
          Navigation
        </span>
      </div>

      {/* Navigation Links */}
<div className="flex flex-col gap-1">
  {navLinks.map(({ href, text }) => (
    <Link
      key={text}
      href={href}
      className="
        group
        flex
        items-center
        justify-between
        w-full
        px-3
        py-3.5
        rounded-xl
        text-white
        font-medium
        transition-all
        duration-200
        hover:bg-white/10
        active:scale-[0.98]
      "
    >
      <span>{text}</span>

      <span
        className="
          text-white/40
          text-lg
          transition-all
          duration-200
          group-hover:text-white
          group-hover:translate-x-1
        "
      >
        →
      </span>
    </Link>
  ))}
</div>


      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <span className="h-px flex-1 bg-white/15" />

        <span className="w-1.5 h-1.5 rounded-full bg-white/30" />

        <span className="h-px flex-1 bg-white/15" />
      </div>


      {/* Authentication */}
      <div className="px-2 mb-3">
        <span
          className="
            text-[10px]
            uppercase
            tracking-[0.2em]
            font-semibold
            text-white/50
          "
        >
          Account
        </span>
      </div>


      {user ? (

        <div
          className="
            flex
            flex-col
            gap-3
            p-3
            rounded-xl
            bg-black/10
          "
        >

          {/* User */}
          <div className="flex items-center gap-3 px-2 py-1">

            <div
              className="
                w-9
                h-9
                rounded-full
                bg-white
                text-blue-500
                flex
                items-center
                justify-center
                font-bold
                text-sm
              "
            >
              {user.nama?.charAt(0)?.toUpperCase()}
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-[10px] text-white/50">
                Logged in as
              </span>

              <span className="text-sm text-white font-semibold truncate">
                {user.nama}
              </span>
            </div>

          </div>


          {/* Logout */}
          <button
            onClick={logout}
            className="
              w-full
              py-3
              rounded-xl
              bg-red-500
              text-white
              font-semibold
              text-sm
              hover:bg-red-600
              active:scale-[0.98]
              transition-all
              duration-200
            "
          >
            Logout
          </button>

        </div>

      ) : (

        <div className="flex flex-col gap-3">

          {/* Login */}
          <Link
            href="/internal"
            className="
              group
              flex
              items-center
              justify-between
              w-full
              px-4
              py-3
              rounded-xl
              bg-white
              text-blue-500
              font-semibold
              text-sm
              shadow-sm
              hover:bg-blue-50
              active:scale-[0.98]
              transition-all
              duration-200
            "
          >
            <span>Login</span>

            <span
              className="
                text-lg
                transition-transform
                duration-200
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </Link>


          {/* Register */}
          <Link
            href="/internal/sign"
            className="
              group
              flex
              items-center
              justify-between
              w-full
              px-4
              py-3
              rounded-xl
              border
              border-white/30
              text-white
              font-semibold
              text-sm
              hover:bg-white/10
              active:scale-[0.98]
              transition-all
              duration-200
            "
          >
            <span>Daftar</span>

            <span
              className="
                text-lg
                text-white/50
                transition-all
                duration-200
                group-hover:text-white
                group-hover:translate-x-1
              "
            >
              →
            </span>
          </Link>

        </div>

      )}

    </div>
  </div>
</div>
      </nav>
    </header>
  );
}