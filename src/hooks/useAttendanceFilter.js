import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function useUserFilter() {
    const searchParams = useSearchParams();
    
        const [dataAnggota, setDataAnggota] = useState([]);
        const [page, setPage] = useState(1);
        const [totalPages, setTotalPages] = useState(1);
        const [totalUsers, setTotalUsers] = useState(0);
        const [name, setName] = useState("");
    
        const posisiOptions = ["Ketua", "Wakil Ketua", "Sekretaris", "Bendahara", "Koordinator Akademik", "Koordinator Humas", "Koordinator SDM", "Koordinator Prasarana", "Koordinator Kominfo", "SDM", "Humas Internal", "Humas Eksternal", "Prasarana", "Kominfo", "Staff Programming", "Staff Design", "Staff Comnet", "Staff Office"];
        const statusOptions = ["Hadir", "Izin", "Sakit"];
        const [togglePosisi, setTogglePosisi] = useState('Filter by posisi');
        const [toggleStatusAbsen, setToggleStatusAbsen] = useState('Filter by status absen');
        const [toggleAcara, setToggleAcara] = useState('Filter by acara');
        const [acaraOptions, setAcaraOptions] = useState([]);

        const [filterOpen, setFilterOpen] = useState({
            status_absen: false,
            posisi: false,
            acara: false
        });
    
        function handleToggleFilter(e, type) {
            e.stopPropagation();
            setFilterOpen((prev) => ({
                posisi: false,
                status_absen: false,
                acara: false,
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
            if (togglePosisi !== 'Filter by posisi') params.set('posisi', togglePosisi);
            if (toggleStatusAbsen !== 'Filter by status absen') params.set('status_absen', toggleStatusAbsen);
            if (toggleAcara !== 'Filter by acara') params.set('acara', toggleAcara);
            params.set('page', page);
    
            fetch(`/api/userAttendance?${params.toString()}`)
                .then((res) => res.json())
                .then((data) => {
                    setDataAnggota(data.users);
                    setTotalPages(data.totalPages);
                    setTotalUsers(data.totalUsers);
                    setAcaraOptions(data.acara.map(user => user.acara).filter((value, index, self) => value && self.indexOf(value) === index)); // Extract unique acara options
                })
                .catch((error) => console.error('Error fetching data:', error));
    
            window.history.replaceState(null, '', `?${params.toString()}`);
        }, [page, name, togglePosisi, toggleStatusAbsen, toggleAcara]);

        return {
            dataAnggota,
            page,
            setPage,
            totalPages,
            totalUsers,
            name,
            setName,
            posisiOptions,
            statusOptions,
            toggleStatusAbsen,
            setToggleStatusAbsen,
            togglePosisi,
            setTogglePosisi,
            filterOpen,
            setFilterOpen,
            handleToggleFilter,
            handleSearch,
            toggleAcara,
            setToggleAcara,
            acaraOptions
        };
}