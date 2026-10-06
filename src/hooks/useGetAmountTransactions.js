import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

// Mengambil ringkasan keuangan dari agregat sisi server (satu request),
// bukan menarik seluruh baris transaksi untuk dijumlahkan di client.
export default function useGetAmountTransactions() {
    const [pemasukkan, setPemasukkan] = useState(0);
    const [pengeluaran, setPengeluaran] = useState(0);
    const [dataForChartByMonth, setDataForChartByMonth] = useState({
        Pemasukkan: Array(12).fill(0),
        Pengeluaran: Array(12).fill(0),
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function fetchData() {
            try {
                const json = await apiFetch("/api/transactions/summary");

                if (cancelled) return;

                setPemasukkan(json.totalPemasukkan || 0);
                setPengeluaran(json.totalPengeluaran || 0);
                setDataForChartByMonth(
                    json.byMonth || {
                        Pemasukkan: Array(12).fill(0),
                        Pengeluaran: Array(12).fill(0),
                    }
                );
                setError(null);
            } catch (err) {
                if (!cancelled) {
                    console.error("Error fetching summary:", err);
                    setError(err);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchData();
        return () => {
            cancelled = true;
        };
    }, []);

    const kas = pemasukkan - pengeluaran;

    return {
        pemasukkan,
        pengeluaran,
        kas,
        dataForChartByMonth,
        loading,
        error,
    };
}
