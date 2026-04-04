"use client"; // Wajib jika menggunakan Next.js App Router

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";
import useGetAmountTransactions from "@/hooks/useGetAmountTransactions";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler //
);

export default function ChartLine() {

  const { dataForChartByMonth } = useGetAmountTransactions();

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

  const chartData = {
  labels: monthNames, 
  datasets: [
    {
      label: "Pemasukkan",
      data: dataForChartByMonth.Pemasukkan, 
      fill: true,
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      borderColor: "rgba(75, 192, 192, 1)",
      tension: 0.4,
    },
    {
      label: "Pengeluaran",
      data: dataForChartByMonth.Pengeluaran, 
      fill: true,
      backgroundColor: "rgba(255, 99, 132, 0.2)",
      borderColor: "rgba(255, 99, 132, 1)",
      tension: 0.4,
    }
  ],
};

// Di dalam komponen ChartLine.js
const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

  return (
    <div className="bg-white p-4 md:h-100 h-100 rounded-xl border border-gray-100 shadow-sm mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Grafik Pemasukkan</h2>
      <Line data={chartData} options={options} />
    </div>
  );
}