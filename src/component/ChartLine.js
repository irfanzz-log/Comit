"use client";

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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

// Menerima data dari parent (useGetAmountTransactions) agar tidak ada
// request ganda — sebelumnya komponen ini memanggil hook-nya sendiri.
export default function ChartLine({ dataForChartByMonth }) {
  const source = dataForChartByMonth || {
    Pemasukkan: Array(12).fill(0),
    Pengeluaran: Array(12).fill(0),
  };

  const chartData = {
    labels: monthNames,
    datasets: [
      {
        label: "Pemasukkan",
        data: source.Pemasukkan,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0.4,
      },
      {
        label: "Pengeluaran",
        data: source.Pengeluaran,
        fill: true,
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="bg-white p-4 h-[300px] md:h-[340px] rounded-xl border border-gray-100 shadow-sm mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-4">Grafik Pemasukkan</h2>
      <Line data={chartData} options={options} />
    </div>
  );
}
