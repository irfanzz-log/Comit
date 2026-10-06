"use client";

import { useRouter } from "next/navigation";

const MAX_BUTTONS = 5;

/**
 * Paginasi reusable. `pageSize` default 10 mengikuti kontrak API existing.
 */
export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    pageSize = 10,
    syncUrl = true,
}) {
    const router = useRouter();

    const total = Math.max(totalPages || 1, 1);
    const half = Math.floor(MAX_BUTTONS / 2);
    let startPage = Math.max(1, currentPage - half);
    let endPage = Math.min(total, currentPage + half);

    if (endPage > total) {
        endPage = total;
        startPage = Math.max(1, endPage - MAX_BUTTONS + 1);
    }

    function handlePageChange(page) {
        if (page < 1 || page > total || page === currentPage) return;
        onPageChange(page);
        if (syncUrl) {
            const params = new URLSearchParams(window.location.search);
            params.set("page", String(page));
            router.push(`?${params.toString()}`, { scroll: false });
        }
    }

    const fromCount = totalItems > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const toCount = Math.min(currentPage * pageSize, totalItems);

    const baseBtn =
        "min-w-[36px] h-9 px-2 inline-flex items-center justify-center border rounded-lg text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed";

    return (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4 pt-1 text-sm">
            <p className="text-gray-500 order-2 sm:order-1">
                {totalItems > 0 ? (
                    <>
                        Menampilkan{" "}
                        <span className="font-semibold text-gray-900">{fromCount}</span>–
                        <span className="font-semibold text-gray-900">{toCount}</span> dari{" "}
                        <span className="font-semibold text-gray-900">{totalItems}</span> data
                    </>
                ) : (
                    "Tidak ada data"
                )}
            </p>

            <div className="flex items-center gap-1.5 order-1 sm:order-2">
                <button
                    type="button"
                    className={`${baseBtn} border-gray-200 bg-white text-gray-700 hover:bg-gray-50`}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    ‹
                </button>

                {Array.from({ length: Math.max(0, endPage - startPage + 1) }, (_, i) => startPage + i).map(
                    (page) => (
                        <button
                            key={page}
                            type="button"
                            onClick={() => handlePageChange(page)}
                            aria-current={page === currentPage ? "page" : undefined}
                            className={`${baseBtn} ${
                                page === currentPage
                                    ? "bg-blue-600 text-white border-blue-600 font-semibold"
                                    : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                            }`}
                        >
                            {page}
                        </button>
                    )
                )}

                <button
                    type="button"
                    className={`${baseBtn} border-gray-200 bg-white text-gray-700 hover:bg-gray-50`}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= total}
                >
                    ›
                </button>
            </div>
        </div>
    );
}
