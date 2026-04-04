import { useState, useEffect } from "react";

export default function useGetAmountTransactions() { 
    const [data, setData] = useState();
    const [pemasukkan, setPemasukkan] = useState(0);
    const [pengeluaran, setPengeluaran] = useState(0);

    useEffect(() => {
        function fetchData() {
            try {
                fetch("/api/transactions?limit=9999")
                .then((res) => res.json())
                .then((json) => {
                    setData(json);
                });
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        }

        fetchData();
        
    }, []);


    useEffect(() => {
        if (data) {
            const totalPemasukkan = data.users.reduce((total, transaction) => {
                return transaction.tipe === "Pemasukkan" ? total + parseInt(transaction.jumlah) : total;
            }, 0);
            const totalPengeluaran = data.users.reduce((total, transaction) => {
                return transaction.tipe === "Pengeluaran" ? total + parseInt(transaction.jumlah) : total;
            }, 0);
            setPemasukkan(totalPemasukkan);
            setPengeluaran(totalPengeluaran);
        }
    }, [data]);

    const dataForChart = data?.users ? data.users.map((transaction) => ({
    tipe: transaction.tipe,
    jumlah: parseInt(transaction.jumlah),
    created_at: transaction.created_at,
})) : [];

    const dataForChartByTipe = {
        Pemasukkan: dataForChart.filter((item) => item.tipe === "Pemasukkan"),
        Pengeluaran: dataForChart.filter((item) => item.tipe === "Pengeluaran"),
    };

    const dataForChartByMonth = {
        Pemasukkan: Array(12).fill(0), // Inisialisasi array untuk 12 bulan
        Pengeluaran: Array(12).fill(0),
    };

   dataForChart.forEach((item) => {
    const month = new Date(item.created_at).getMonth();
    if (item.tipe === "Pemasukkan") {
        dataForChartByMonth.Pemasukkan[month] += item.jumlah; // <--- Uang sudah dijumlahkan di sini
    }
    if (item.tipe === "Pengeluaran") {
        dataForChartByMonth.Pengeluaran[month] += item.jumlah; // <--- Uang sudah dijumlahkan di sini
    }  
});

    const kas = pemasukkan - pengeluaran;



    return { pemasukkan, pengeluaran, kas, dataForChartByTipe, dataForChartByMonth };
}