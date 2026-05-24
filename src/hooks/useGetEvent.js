import { useState, useEffect, use } from "react";

export default function useGetEvent(limit) {
    const [dataAcara, setDataAcara] = useState();

    useEffect(() => {
        fetch(`/api/events?limit=${limit}`)
        .then(res => res.json())
        .then(data => setDataAcara(data))
        .catch(err => console.error("Error fetching events:", err)); 
    }, [limit]);

    return dataAcara;
}