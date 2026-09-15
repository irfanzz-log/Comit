'use client';

export default function ToggleFilterButton({ handleToggleFilter, filterOpen, options, toggle, setToggle, type, setPage }) {
    const isOpen = Boolean(filterOpen?.[type]);

    return (
        <div className="relative md:w-2/3 w-full m-2">
            <button
                type="button"
                onClick={(e) => handleToggleFilter(e, type)}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                className="md:ml-0 -ml-1 relative bg-white bg-gray-800 text-gray-800 text-gray-200 border border-gray-200 border-gray-700 hover:bg-gray-50 hover:bg-gray-750 rounded-lg p-2.5 shadow-sm w-full text-left text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center justify-between"
            >
                <span className="truncate pr-4">{toggle}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 text-gray-400 text-gray-500 shrink-0 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
            </button>
            {isOpen && (
                <div
                    role="listbox"
                    className="z-30 absolute max-h-60 overflow-y-auto flex flex-col bg-white bg-gray-800 border border-gray-200 border-gray-700 rounded-lg w-full p-1 mt-1 shadow-lg"
                >
                    {options.map((option) => {
                        const isSelected = toggle === option;
                        return (
                            <button
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                onClick={(e) => {
                                    setToggle(option);
                                    handleToggleFilter(e, type);
                                    setPage(1);
                                }}
                                className={`text-left px-3 py-2 rounded-md text-sm transition-colors ${
                                    isSelected
                                        ? "bg-blue-50 bg-blue-900/30 text-blue-600 text-blue-400 font-medium"
                                        : "text-gray-700 text-gray-200 hover:bg-gray-100 hover:bg-gray-700"
                                }`}
                                key={option}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}