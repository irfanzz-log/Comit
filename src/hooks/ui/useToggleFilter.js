export default function ToggleFilterButton({handleToggleFilter, filterOpen, options, toggle, setToggle, type, setPage}) {
    return (
        <>
            <div className="relative md:w-2/3 w-full m-2">
                <button onClick={(e) => {
                    handleToggleFilter(e, type);
                }} className="md:ml-0 -ml-1 relative bg-white border-[0.5px] border-gray-600/10 rounded-md p-2 shadow-sm w-full text-left">{toggle}<span className="absolute right-2 top-3"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down size-4 opacity-50" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg></span></button>
                <div className={` ${filterOpen[type] ? 'block' : 'hidden'} z-10 absolute max-h-60 overflow-y-auto flex flex-col bg-white border-[0.5px] border-gray-600/10 rounded-md w-full p-2 mt-1 shadow-sm`}>
                    {options.map((option) => (
                        <button onClick={(e) => {
                            setToggle(option);
                            handleToggleFilter(e, type);
                            setPage(1);
                        }} className="text-left hover:bg-blue-200/50 px-2 py-1 rounded-sm" key={option}>{option}</button>
                    ))}
                </div>
            </div>
        </>
    )
}