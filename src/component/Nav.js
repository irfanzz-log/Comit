"use client";

import { useState } from "react";
import Link from "next/link";

export default function Nav(props) {

  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="relative flex justify-center relative mx-2">
        <nav className="flex md:absolute fixed z-100 justify-between items-center shadow-lg p-2 m-2 md:w-5/5 w-5/6 bg-blue-500 rounded-xl">
          <div className="logo flex flex-row items-center">
            <img className="max-w-15" src="/logo/commitLogo.png" alt="" />
          </div>
          <ul className="md:flex flex-row hidden">
            <li className="px-2 text-white">
              <Link href={props.link1}>{props.textLink1}</Link>
            </li>
            <li className="px-2 text-white">
              <Link href={props.link2}>{props.textLink2} </Link>
            </li>
          </ul>
          <ul className="flex flex-row">
            <li className="py-2 px-5 md:block text-white hidden">
              <Link href="#">Daftar</Link>
            </li>
            <li className="bg-white py-2 px-5 rounded-xl text-blue-500 md:block shadow-lg hidden">
              <Link href="#">Login</Link>
            </li>
            <li className="relative bg-white py-2 px-5 rounded-xl text-blue-500 md:hidden shadow-lg block" onClick={() => setOpen(!open)}>
              <Link href="#" className="ham">
                <div className="w-6 rounded-lg h-[2px] bg-blue-500 my-1"></div>
                <div className="w-6 rounded-lg h-[2px] bg-blue-500 my-1"></div>
                <div className="w-6 rounded-lg h-[2px] bg-blue-500 my-1"></div>
              </Link>
            </li>
          </ul>
          <div className={`w-full absolute top-0 left-0 h-auto pb-5 rounded-xl shadow-lg -z-1 bg-blue-500 ${open ? 'block' : 'hidden'} `}>
            <div className="text-center flex flex-col items-center mt-20 space-y-5">
              <Link href={props.link1} className="text-white text-lg font-normal text-center">{props.textLink1}</Link>
              <Link href={props.link2} className="text-white text-lg font-normal text-center">{props.textLink2}</Link>
              <span className="w-full border-b-[0.1px] border-white"></span>
              <ul className="w-full flex justify-around">
                <li className="rounded-md text-white ">
                  <Link href='#'>Login</Link>
                </li>
                <li className="rounded-md text-white ">
                  <Link href='#'>Daftar</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
