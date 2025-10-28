"use client";

import useSlideNav from "@/hooks/ui/useSlideNav";

export default function userSectionBody(props) {
    const { isOpen, setIsOpen } = useSlideNav();
    
  return (
    <>
      <header className="header-main shadow-sm w-full p-4 flex flex-row justify-between items-center">
        <div className="header-main_head flex flex-row items-center gap-1">
            <button 
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&amp;_svg]:pointer-events-none [&amp;_svg:not([class*='size-'])]:size-4 [&amp;_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground size-9 h-7 w-7 -ml-1"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-panel-left"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M9 3v18"></path></svg></button>
            <h1 className="">{props.title}</h1>
        </div>
        <div className="header-main_content">
            <span className="flex p-2 text-sm bg-gray-200 text-black rounded-full">{props.profile}</span>
        </div>
      </header>
    </>
  );
}
