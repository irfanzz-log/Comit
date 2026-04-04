import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function useUserFilter() {
    const searchParams = useSearchParams();
    
        const [dataAnggota, setDataAnggota] = useState([]);
        const [page, setPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);
        const [totalUsers, setTotalUsers] = useState(0);
        const [name, setName] = useState("");
    
        const statusOptions = ["Aktif", "Tidak Aktif"];
        const posisiOptions = ["Ketua Umum", "Wakil Ketua Umum", "Sekretaris", "Bendahara", "Koordinator Akademik", "Koordinator Humas", "Koordinator SDM", "Koordinator Prasarana", "Koordinator Kominfo", "SDM", "Humas Internal", "Humas Eksternal", "Prasarana", "Kominfo", "Staff Programming", "Staff Design", "Staff Comnet", "Staff Office", "Anggota", "Alumni"];
        const minatOptions = ["Programming", "Design", "Comnet", "Office"];
    
        const [toggleStatus, setToggleStatus] = useState('Filter by status');
        const [toggleMinat, setToggleMinat] = useState('Filter by minat');
        const [togglePosisi, setTogglePosisi] = useState('Filter by posisi');
    
        const [filterOpen, setFilterOpen] = useState({
            status: false,
            posisi: false,
            minat: false,
        });
    
        function handleToggleFilter(e, type) {
            e.stopPropagation();
            setFilterOpen((prev) => ({
                status: false,
                posisi: false,
                minat: false,
                [type]: !prev[type],
            }));
        }
    
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
            if (toggleStatus !== 'Filter by status') params.set('status', toggleStatus);
            if (togglePosisi !== 'Filter by posisi') params.set('posisi', togglePosisi);
            if (toggleMinat !== 'Filter by minat') params.set('minat', toggleMinat);
            params.set('page', page);
    
            fetch(`/api/userInfo?${params.toString()}`)
                .then((res) => res.json())
                .then((data) => {
                    setDataAnggota(data.users);
                    setTotalPages(data.totalPages);
                    setTotalUsers(data.totalUsers);
                })
                .catch((error) => console.error('Error fetching data:', error));
    
            window.history.replaceState(null, '', `?${params.toString()}`);
        }, [page, name, toggleStatus, togglePosisi, toggleMinat]);

        return {
            dataAnggota,
            page,
            setPage,
            totalPages,
            totalUsers,
            name,
            setName,
            statusOptions,
            posisiOptions,
            minatOptions,
            toggleStatus,
            setToggleStatus,
            toggleMinat,
            setToggleMinat,
            togglePosisi,
            setTogglePosisi,
            filterOpen,
            setFilterOpen,
            handleToggleFilter,
            handleSearch
        };
}