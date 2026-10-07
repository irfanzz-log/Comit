import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { getCached } from "@/lib/apiCache";

const DEFAULT_STATUS = "Filter by status";
const DEFAULT_POSISI = "Filter by posisi";
const DEFAULT_MINAT = "Filter by minat";

export default function useUserFilter() {
    const searchParams = useSearchParams();

    const [dataAnggota, setDataAnggota] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);

    const [toggleStatus, setToggleStatus] = useState(DEFAULT_STATUS);
    const [toggleMinat, setToggleMinat] = useState(DEFAULT_MINAT);
    const [togglePosisi, setTogglePosisi] = useState(DEFAULT_POSISI);

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

    const statusValue = toggleStatus !== DEFAULT_STATUS ? toggleStatus : "";
    const posisiValue = togglePosisi !== DEFAULT_POSISI ? togglePosisi : "";
    const minatValue = toggleMinat !== DEFAULT_MINAT ? toggleMinat : "";

    useEffect(() => {
        let cancelled = false;

        const params = new URLSearchParams();
        if (name) params.set("name", name);
        if (statusValue) params.set("status", statusValue);
        if (posisiValue) params.set("posisi", posisiValue);
        if (minatValue) params.set("minat", minatValue);
        params.set("page", String(page));

        setLoading(true);

        const cached = getCached(`/api/userInfo?${params.toString()}`);
        if (cached) {
            setDataAnggota(cached.users || []);
            setTotalPages(cached.totalPages || 1);
            setTotalUsers(cached.totalUsers || 0);
            setLoading(false);
        }

        apiFetch(`/api/userInfo?${params.toString()}`)
            .then((data) => {
                if (cancelled) return;
                setDataAnggota(data.users || []);
                setTotalPages(data.totalPages || 1);
                setTotalUsers(data.totalUsers || 0);
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
    }, [page, name, statusValue, posisiValue, minatValue]);

    return {
        dataAnggota,
        loading,
        page,
        setPage,
        totalPages,
        totalUsers,
        name,
        setName,
        toggleStatus,
        setToggleStatus,
        toggleMinat,
        setToggleMinat,
        togglePosisi,
        setTogglePosisi,
        handleSearch,
    };
}
