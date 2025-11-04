import { dataTransaksi } from "@/lib/dataKas"

export default function useDateFilter(dateStart, dateEnd) {
    const group = {}

    dataTransaksi.forEach((item) => {
        const date = new Date(item.tanggal);
        const key = `${date.getFullYear()}-${date.getMonth() + 1}`

        if (!group[key]) group[key] = 0; //check group not null

        group[key] += item.jumlah;
    });

    const numStart = Number(dateStart?.replace("-",""));
    const numEnd = Number(dateEnd?.replace("-",""));     

    const filtered = Object.fromEntries(
        Object.entries(group).filter(([key])=> {
            const num = Number(key.replace("-",""));
            return num >= numStart && num <= numEnd;
        }));
    
    const transaction = Object.entries(filtered).map(([key,value])=> ({month: key, amount: Number(value)}));
    
    return (
        transaction
    )
}