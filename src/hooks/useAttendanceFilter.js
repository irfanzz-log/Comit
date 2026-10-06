import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

const DEFAULT_POSISI = "Filter by posisi";
const DEFAULT_STATUS = "Filter by status absen";
const DEFAULT_ACARA = "Filter by acara";

export default function useAttendanceFilter() {
    const searchParams = useSearchParams();

    const [dataAnggota, setDataAnggota] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);

    const [togglePosisi, setTogglePosisi] = useState(DEFAULT_POSISI);
    const [toggleStatusAbsen, setToggleStatusAbsen] = useState(DEFAULT_STATUS);
    const [toggleAcara, setToggleAcara] = useState(DEFAULT_ACARA);
    const [acaraOptions, setAcaraOptions] = useState([]);

    const pathPage = searchParams.get("page");
    useEffect(() => {
        if (pathPage) {
            setPage(Number(pathPage));
        }
    }, [pathPage]);

    function handleSearch(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        setName(formData.get("searchName"));
    }

    const posisiValue = togglePosisi !== DEFAULT_POSISI ? togglePosisi : "";
    const statusValue = toggleStatusAbsen !== DEFAULT_STATUS ? toggleStatusAbsen : "";
    const acaraValue = toggleAcara !== DEFAULT_ACARA ? toggleAcara : "";

    useEffect(() => {
        let cancelled = false;

        const params = new URLSearchParams();
        if (name) params.set("name", name);
        if (posisiValue) params.set("posisi", posisiValue);
        if (statusValue) params.set("status_absen", statusValue);
        if (acaraValue) params.set("acara", acaraValue);
        params.set("page", String(page));

        setLoading(true);
        apiFetch(`/api/userAttendance?${params.toString()}`)
            .then((data) => {
                if (cancelled) return;
                setDataAnggota(data.users || []);
                setTotalPages(data.totalPages || 1);
                setTotalUsers(data.totalUsers || 0);
                setAcaraOptions(
                    (data.acara || [])
                        .map((a) => a.acara)
                        .filter((v, i, arr) => v && arr.indexOf(v) === i)
                );
            })
            .catch((error) => {
                if (!cancelled) console.error("Error fetching data:", error);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        window.history.replaceState(null, "", `?${params.toString()}`);
        return () => {
            cancelled = true;
        };
    }, [page, name, posisiValue, statusValue, acaraValue]);

    return {
        dataAnggota,
        loading,
        page,
        setPage,
        totalPages,
        totalUsers,
        name,
        setName,
        togglePosisi,
        setTogglePosisi,
        toggleStatusAbsen,
        setToggleStatusAbsen,
        toggleAcara,
        setToggleAcara,
        acaraOptions,
        handleSearch,
    };
}
