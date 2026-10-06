"use client";

import { useState } from "react";
import { apiFetch } from "@/lib/api";
import { TextField } from "@/component/internal/FormField";
import Button from "@/component/internal/Button";
import Icon from "@/component/internal/Icon";

/**
 * Pencarian user dengan autocomplete (dipakai di form absensi & uang kas).
 * `onSelect` menerima { id, nama }.
 */
export default function UserSearchInput({ onSelect, placeholder = "Cari nama anggota..." }) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(null);
    const [open, setOpen] = useState(false);

    async function handleChange(e) {
        const value = e.target.value;
        setQuery(value);
        setSelected(null);
        setOpen(true);

        if (value.trim().length < 2) {
            setSuggestions([]);
            return;
        }

        setLoading(true);
        try {
            const data = await apiFetch(`/api/userSearch?query=${encodeURIComponent(value.trim())}`);
            setSuggestions(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Search error:", err);
            setSuggestions([]);
        } finally {
            setLoading(false);
        }
    }

    function handleSelect(user) {
        setSelected(user);
        setQuery(user.nama);
        setOpen(false);
        setSuggestions([]);
        if (onSelect) onSelect(user);
    }

    return (
        <div className="relative">
            <TextField
                name="namaUser"
                value={query}
                onChange={handleChange}
                placeholder={placeholder}
                autoComplete="off"
                onFocus={() => setOpen(true)}
                containerClassName="relative z-10"
            />

            {selected ? (
                <div className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md">
                    <Icon name="check" size={12} strokeWidth={2.5} />
                    {selected.nama} · ID {selected.id}
                </div>
            ) : null}

            {open && (query.trim().length >= 2 || suggestions.length > 0) ? (
                <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-30 max-h-56 overflow-y-auto">
                    {loading ? (
                        <div className="p-3 text-sm text-gray-400">Mencari...</div>
                    ) : suggestions.length === 0 ? (
                        <div className="p-3 text-sm text-gray-400">
                            Tidak ada anggota bernama “{query}”.
                        </div>
                    ) : (
                        suggestions.map((user) => (
                            <button
                                key={user.id}
                                type="button"
                                onClick={() => handleSelect(user)}
                                className="w-full flex items-center justify-between gap-2 px-3 py-2.5 text-left text-sm hover:bg-blue-50 transition-colors cursor-pointer"
                            >
                                <span className="font-medium text-gray-900 truncate">
                                    {user.nama}
                                </span>
                                <span className="text-xs text-gray-400 shrink-0">Pilih</span>
                            </button>
                        ))
                    )}
                </div>
            ) : null}
        </div>
    );
}
