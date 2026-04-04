import { useState, useEffect } from "react";

export default function useDateFilter(dateStart, dateEnd) {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                // 1. Ambil semua data dari API (Tanpa pagination agar chart lengkap)
                const response = await fetch(`/api/transactions?limit=999`);
                const result = await response.json();
                const dataTransaksi = result.users || [];

                // 2. Grouping data berdasarkan Bulan (YYYY-MM)
                const group = {};
                dataTransaksi.forEach((item) => {
                    const date = new Date(item.created_at);
                    // Pastikan format bulan selalu 2 digit (01, 02, dst) agar sortir string benar
                    const year = date.getFullYear();
                    const month = String(date.getMonth() + 1).padStart(2, '0');
                    const key = `${year}-${month}`;

                    if (!group[key]) group[key] = 0;
                    group[key] += Number(item.jumlah);
                });

                // 3. Filter berdasarkan Range Tanggal
                // Kita bandingkan string "YYYY-MM" langsung, ini valid di JS
                const transactionArray = Object.entries(group)
                    .map(([key, value]) => ({ month: key, amount: value }))
                    .filter((item) => {
                        if (!dateStart || !dateEnd) return true; // Tampilkan semua jika filter kosong
                        
                        // Normalisasi input agar formatnya YYYY-MM (tambah 0 jika perlu)
                        const formatInput = (d) => {
                            const [y, m] = d.split("-");
                            return `${y}-${String(m).padStart(2, '0')}`;
                        };

                        const current = item.month;
                        return current >= formatInput(dateStart) && current <= formatInput(dateEnd);
                    })
                    .sort((a, b) => a.month.localeCompare(b.month)); // Urutkan dari bulan terkecil

                setTransactions(transactionArray);
            } catch (error) {
                console.error("Gagal filter tanggal:", error);
            }
        }

        fetchData();
    }, [dateStart, dateEnd]);

    return transactions;
}