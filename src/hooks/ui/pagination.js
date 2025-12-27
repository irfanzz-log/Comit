'use client';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    const maxButton = 5; // Maksimal tombol halaman yang ditampilkan
    const halfMax = Math.floor(maxButton / 2);
    let startPage = Math.max(1, currentPage - halfMax);
    let endPage = Math.min(totalPages, currentPage + halfMax);

    if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxButton + 1);
    }

    return (
        <div className="pagination justify-between items-center mt-4 flex">
            <p>Menampilkan data {(((currentPage - 1) * 10 ) + 1 )} sampai {(Math.min(currentPage * 10, totalPages * 10))} dari {totalPages * 10} </p>
            <div className="flex items-center">
                <button 
                    className="px-3 py-1 border border-1 border-black/10 rounded-md mr-2"
                    onClick={() => onPageChange(currentPage - 1 )}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>
                <div className="btn-list">
                    {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
                        <button
                            key={page}
                            className={`px-3 py-1 border border-1 border-black/10 rounded-md mr-2 ${page === currentPage ? 'bg-gray-200' : ''}`}
                            onClick={() => onPageChange(page)}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                <button 
                    className="px-3 py-1 border border-1 border-black/10 rounded-md"
                    onClick={() => onPageChange(currentPage + 1 )}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
         </div>
    )
}