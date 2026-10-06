import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function useTransactions({ tipe, kategori }) {
    const searchParams = useSearchParams();

    const [dataAnggota, setDataAnggota] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(true);

    // sync URL → state
    const pathPage = searchParams.get("page");
    useEffect(() => {
        if (pathPage) {
            setPage(Number(pathPage));
        }
    }, [pathPage]);

    // search name
    function handleSearch(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const searchName = formData.get("searchName");
        setName(searchName);
    }

    // fetch data saat page / name / tipe / kategori berubah
    useEffect(() => {
        let cancelled = false;

        const params = new URLSearchParams();
        if (name) params.set("name", name);
        if (tipe) params.set("tipe", tipe);
        if (kategori) params.set("kategori", kategori);
        params.set("page", page);

        setLoading(true);
        apiFetch(`/api/transactions?${params.toString()}`)
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
    }, [page, name, tipe, kategori]);

    return {
        dataAnggota,
        loading,
        page,
        setPage,
        totalPages,
        totalUsers,
        name,
        setName,
        handleSearch,
    };
}
