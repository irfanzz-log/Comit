"use client";

import useSlideNav from "@/hooks/ui/useSlideNav";
import { useAuth } from "@/app/context/AuthContext";
import { use, useState } from "react";

export default function HeaderSectionBody(props) {
  const { isOpen, setIsOpen } = useSlideNav();
  const [objectOpen, setObjectOpen] = useState(false);
  const { user, logout } = useAuth();

  function objectOpenHandler() {
    setObjectOpen(!objectOpen);
  }

  const initials = user?.nama
    ?.split(' ')
    .map(name => name.charAt(0))
    .join('') || '';



  return (
    <>
      <header className="header-main shadow-sm w-full p-4 flex flex-row justify-between items-center">
        <div className="header-main_head flex flex-row items-center gap-1">
          <button
            onClick={() => setIsOpen(!isOpen)} 
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground size-9 h-7 w-7 -ml-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-panel-left"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 3v18"></path></svg></button>
          <h1 className="">{props.title}</h1>
        </div>
        <div className="header-main_content flex flex-row items-center gap-2">
          <p className="flex">{user?.nama}</p>
          <div onClick={objectOpenHandler} className={`relative ${objectOpen && 'bg-gray-100/80'} hover:bg-gray-100/80  p-2 rounded-xl`}><span className="flex w-8 h-8 items-center justify-center text-sm bg-blue-200/50 text-black rounded-full">{initials}
            <div onClick={logout} className={`${objectOpen ? 'block' : 'hidden'} absolute -bottom-14 right-0 p-2 w-30  bg-white hover:bg-blue-200/50 shadow-xl rounded-md flex items-center gap-2`}><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="red" className="bi bi-box-arrow-left" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z" />
              <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z" />
            </svg><p>Logout</p></div>
          </span></div>
        </div>
      </header>
    </>
  );
}
