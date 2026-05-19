import { useState } from 'react';

export default function useAttendanceInput() {
    const [loading, setLoading] = useState(false);
    const [userSuggestions, setUserSuggestions] = useState([]);
    
    const [form, setForm] = useState({
        namaUser: '',
        user_id: '',
        posisi: '',
        status_absen: '', 
        keterangan: '',
        acara: ''
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
            user_id: user.id, 
            namaUser: user.nama,
            posisi: user.posisi || prev.posisi
        }));
        setUserSuggestions([]); 
    };

    const submitAbsensi = async () => {
        if (!form.namaUser || !form.status_absen) return alert("Nama dan Status wajib diisi!");
        
        setLoading(true);
        try {
            const res = await fetch('/api/insertAttendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: form.user_id,
                    nama: form.namaUser,
                    status_absen: form.status_absen,
                    keterangan: form.keterangan || '-',
                    acara: form.acara
                }),
            });

            if (res.ok) {
                alert('Absensi berhasil dicatat!');
                setForm({ 
                    namaUser: '', 
                    user_id: '', 
                    posisi: '', 
                    status_absen: '', 
                    keterangan: '', 
                    acara: '' 
                });
            } else {
                alert('Gagal mencatat absensi.');
            }
        } catch (error) {
            console.error("Submit error:", error);
        } finally {
            setLoading(false);
        }
    };

    return { 
        form, 
        handleChange, 
        submitAbsensi, 
        loading, 
        userSuggestions, 
        pilihUser,
        setForm
    };
}