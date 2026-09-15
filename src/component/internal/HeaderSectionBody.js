"use client";

import useSlideNav from "@/hooks/ui/useSlideNav";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useRef, useEffect } from "react";

export default function HeaderSectionBody(props) {
  const { isOpen, setIsOpen } = useSlideNav();
  const [objectOpen, setObjectOpen] = useState(false);
  const { user, logout } = useAuth();
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setObjectOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user?.nama
    ?.split(' ')
    .map(name => name.charAt(0))
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'U';

  return (
    <header className="header-main border-b border-gray-200 bg-white/50 backdrop-blur-sm w-full p-4 flex flex-row justify-between items-center transition-colors">
      <div className="header-main_head flex flex-row items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)} 
          aria-label="Toggle Sidebar"
          className="inline-flex items-center justify-center p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-panel-left">
            <rect width="18" height="18" x="3" y="3" rx="2"></rect>
            <path d="M9 3v18"></path>
          </svg>
        </button>
        <h1 className="text-lg font-bold text-gray-900">{props.title}</h1>
      </div>

      <div className="header-main_content flex flex-row items-center gap-3">
        

        <div className="hidden sm:flex flex-col items-end">
          <span className="text-sm font-semibold text-gray-900 leading-tight">{user?.nama || "User"}</span>
          <span className="text-xs text-gray-500 capitalize">{user?.user_role || "Anggota"}</span>
        </div>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setObjectOpen(!objectOpen)}
            aria-label="User menu"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-sm shadow-sm hover:ring-2 hover:ring-blue-500/50 transition-all cursor-pointer"
          >
            {initials}
          </button>

          {objectOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-xl rounded-xl p-1.5 z-50 transition-all">
              <div className="px-3 py-2 border-b border-gray-100 sm:hidden">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.nama}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.user_role}</p>
              </div>
              <button
                type="button"
                onClick={logout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer text-left"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                  <polyline points="16 17 21 12 16 7"></polyline>
                  <line x1="21" x2="9" y1="12" y2="12"></line>
                </svg>
                <span>Keluar</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
