"use client";

import Icon from "@/component/internal/Icon";

/**
 * Toolbar pencarian + filter dropdown yang konsisten untuk halaman data.
 */
export default function FilterBar({
    searchValue,
    onSearchChange,
    onSearchSubmit,
    searchPlaceholder = "Cari nama...",
    children,
    onReset,
    showReset = false,
}) {
    return (
        <div className="flex flex-col gap-3">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    if (onSearchSubmit) onSearchSubmit(e);
                }}
                className="w-full"
            >
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <Icon name="search" size={16} />
                    </span>
                    <input
                        type="text"
                        name="searchName"
                        value={searchValue}
                        onChange={onSearchChange}
                        placeholder={searchPlaceholder}
                        className="w-full pl-9 pr-3 py-2.5 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
                    />
                </div>
            </form>

            {(children || showReset) && (
                <div className="flex flex-wrap items-center gap-2">
                    {children}
                    {showReset ? (
                        <button
                            type="button"
                            onClick={onReset}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <Icon name="x" size={14} />
                            Reset filter
                        </button>
                    ) : null}
                </div>
            )}
        </div>
    );
}
