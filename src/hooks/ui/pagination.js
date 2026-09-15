'use client';

import { useRouter } from "next/navigation";

export default function Pagination({ currentPage, totalPages, onPageChange, userLength, totalUsers = 0 }) {
    const router = useRouter();
    const maxButton = 5;
    const halfMax = Math.floor(maxButton / 2);
    let startPage = Math.max(1, currentPage - halfMax);
    let endPage = Math.min(totalPages || 1, currentPage + halfMax);

    if (endPage > (totalPages || 1)) {
        endPage = totalPages || 1;
        startPage = Math.max(1, endPage - maxButton + 1);
    }

    function handlePageChange(page) {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page);
            router.push(`?page=${page}`, { scroll: false });
        }
    }

    const fromCount = totalUsers > 0 ? ((currentPage - 1) * 10) + 1 : 0;
    const toCount = Math.min(currentPage * 10, totalUsers);

    return (
        <div className="pagination justify-between items-center mt-4 flex md:flex-row flex-col gap-4 text-gray-700 text-gray-300">
            <p className="text-sm">
                Menampilkan data <span className="font-semibold text-gray-900 text-white">{fromCount}</span> sampai{" "}
                <span className="font-semibold text-gray-900 text-white">{toCount}</span> dari{" "}
                <span className="font-semibold text-gray-900 text-white">{totalUsers}</span> data
            </p>
            <div className="flex items-center text-sm gap-1">
                <button
                    type="button"
                    className="px-3 py-1.5 border border-gray-300 border-gray-700 rounded-md bg-white bg-gray-800 hover:bg-gray-100 hover:bg-gray-700 text-gray-700 text-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:bg-gray-800"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    Previous
                </button>
                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.max(0, endPage - startPage + 1) }, (_, i) => startPage + i).map((page) => (
                        <button
                            key={page}
                            type="button"
                            className={`px-3 py-1.5 border rounded-md transition-colors ${
                                page === currentPage
                                    ? "bg-blue-600 text-white border-blue-600 bg-blue-600 border-blue-600 font-semibold"
                                    : "border-gray-300 border-gray-700 bg-white bg-gray-800 hover:bg-gray-100 hover:bg-gray-700 text-gray-700 text-gray-200"
                            }`}
                            onClick={() => handlePageChange(page)}
                            aria-current={page === currentPage ? "page" : undefined}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                <button
                    type="button"
                    className="px-3 py-1.5 border border-gray-300 border-gray-700 rounded-md bg-white bg-gray-800 hover:bg-gray-100 hover:bg-gray-700 text-gray-700 text-gray-200 transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:bg-gray-800"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage >= totalPages || totalPages === 0}
                >
                    Next
                </button>
            </div>
        </div>
    );
}