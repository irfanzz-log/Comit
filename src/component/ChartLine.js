"use client";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { dataTransaksi } from "@/lib/dataKas";
import useDateFilter from "@/hooks/ui/useDateFilter";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Legend,
  Tooltip
);

const monthNames = ["January", "February", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export default function ChartLine({date}) {
    const dateMonthNum = date?.map(item => {
      const [year,month] = item.month.split("-");
      return {
        ...item,
        month : monthNames[Number(month) -1]
      }
    }) || [] ;

    //DefaultData
    const defaultData = useDateFilter("2025-1", "2025-12");

    const dateMonth = dateMonthNum?.length > 0 ? dateMonthNum.map(date => date.month) : monthNames ;

    const dateAmount = date?.length > 0 ? date?.map(date => date.amount) : defaultData.map(item => item.amount) ;
    console.log(defaultData);
    

  const data = {
    labels: dateMonth,
    datasets: [
      {
        label: "Pemasukkan",
        data: dateAmount,
        fill: false,
        borderColor: "rgb(0, 255, 0)",
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, text: "Judul Chart" },
      legend: { position: "top" },
      tooltip: { enabled: true },
    },
    interaction: {
      mode: "index", // hover akan tampil untuk semua dataset pada posisi x yang sama
      intersect: false,
    },
  };

  return ( 

    <div className="relative h-80">
      <Line data={data} options={options} />
    </div>

   )
}
