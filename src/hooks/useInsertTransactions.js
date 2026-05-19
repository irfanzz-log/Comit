import { useState } from 'react';

export default function useInsertTransactions({ tipe, kategori }) {
    const [loading, setLoading] = useState(false);
    const [userSuggestions, setUserSuggestions] = useState([]);
    
    const [form, setForm] = useState({
        deskripsi: '',
        jumlah: '',
        target_user_id: '',
        namaUser: ''
    });

    const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'namaUser') {
        if (value.length > 1) {
            fetch(`/api/userSearch?query=${encodeURIComponent(value)}`)
                .then(res => res.json())
                .then(data => {
                    setUserSuggestions(Array.isArray(data) ? data : []);
                })
                .catch(err => {
                    console.error("Search error:", err);
                    setUserSuggestions([]);
                });
        } else {
            setUserSuggestions([]);
        }
    }
};

const pilihUser = (user) => {
    setForm(prev => ({
        ...prev,
        target_user_id: user.id, 
        namaUser: user.nama      
    }));
    setUserSuggestions([]); 
};

    const submitTransaksi = async () => {
        if (!form.jumlah) return alert("Isi data dengan lengkap!");
        
        setLoading(true);
        try {
            const res = await fetch('/api/inserttransactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tipe: tipe,
                    jumlah: parseFloat(form.jumlah),
                    deskripsi: form.deskripsi || 'Uang Kas',
                    kategori: kategori,
                    target_user_id: form.target_user_id || null
                }),
            });

            if (res.ok) {
                alert('Berhasil!');
                setForm({ deskripsi: '', jumlah: '', target_user_id: '', namaUser: '' });
            }
        } finally {
            setLoading(false);
        }
    };

    return { 
        form, 
        handleChange, 
        submitTransaksi, 
        loading, 
        userSuggestions, 
        pilihUser,
        dataAnggota: [], 
        setName: () => {}, 
        setPage: () => {},
        handleSearch: (e) => e.preventDefault(),
    };
}