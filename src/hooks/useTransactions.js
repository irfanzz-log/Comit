import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function useTransactions({tipe, kategori}) {
    const searchParams = useSearchParams();
    
        const [dataAnggota, setDataAnggota] = useState([]);
        const [page, setPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);
        const [totalUsers, setTotalUsers] = useState(0);
        const [name, setName] = useState("");

        // sync URL → state
        const pathPage = searchParams.get('page');
        useEffect(() => {
            if (pathPage) {
                setPage(Number(pathPage));
            }
        }, [pathPage]);
        
    
        //search name
        function handleSearch(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const searchName = formData.get('searchName');
            setName(searchName);
        }
    
        // fetch data saat page berubah
        useEffect(() => {
    
            const params = new URLSearchParams();
            if (name) params.set('name', name);
            if (tipe) params.set('tipe', tipe);
            if (kategori) params.set('kategori', kategori);
            params.set('page', page);
    
            fetch(`/api/transactions?${params.toString()}`)
                .then((res) => res.json())
                .then((data) => {
                    setDataAnggota(data.users);
                    setTotalPages(data.totalPages);
                    setTotalUsers(data.totalUsers);
                })
                .catch((error) => console.error('Error fetching data:', error));
    
            window.history.replaceState(null, '', `?${params.toString()}`);
        }, [page, name]);

        return {
            dataAnggota,
            page,
            setPage,
            totalPages,
            totalUsers,
            name,
            setName,
            handleSearch,
        };
}