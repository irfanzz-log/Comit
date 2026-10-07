"use client";

// ==========================================================================
// Hook data reaktif di atas apiCache.
//
// Mengapa hook sendiri, bukan useEffect + useState per komponen?
// Sebelum ini setiap halaman memanggil apiFetch di useEffect dan menyimpan
// hasil ke state lokal. Konsekuensinya:
//   - navigasi internal → full refetch + loading spinner tiap kali.
//   - tidak ada cara bagi mutasi di komponen lain untuk memberi tahu
//     komponen ini bahwa datanya basi.
//
// useApi berlangganan ke cache. Manfaat:
//   - data tersedia instan saat cache hangat (render tanpa loading).
//   - setelah mutasi memanggil invalidateCache, semua komponen yang
//     memakai endpoint itu re-render otomatis dengan data baru.
//   - request identik di-dedupe lintas komponen.
//
// Pemakaian:
//   const { data, error, loading, mutate } = useApi("/api/transactions", {
//       params: { page: 1, tipe: "pemasukkan" },
//   });
// ==========================================================================

import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
    getCached,
    getInflight,
    invalidateCache,
} from "@/lib/apiCache";

/** Endpoint → set listener. Jumlah pemantau kecil, tidak butuh Emitter class. */
const listeners = new Map();

function subscribe(key, cb) {
    if (!listeners.has(key)) listeners.set(key, new Set());
    listeners.get(key).add(cb);
    return () => {
        const set = listeners.get(key);
        if (set) {
            set.delete(cb);
            if (set.size === 0) listeners.delete(key);
        }
    };
}

/** Beri tahu semua komponen yang memakai key ini bahwa data berubah. */
export function notifyKeyChanged(key) {
    const set = listeners.get(key);
    if (set) for (const cb of set) cb();
}

function buildUrl(endpoint, params) {
    if (!params) return endpoint;
    const search = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null && v !== "") search.set(k, String(v));
    }
    const qs = search.toString();
    return qs ? `${endpoint}?${qs}` : endpoint;
}

/**
 * @param {string} endpoint - path API, mis. "/api/transactions"
 * @param {object} opts
 * @param {object} [opts.params] - query params; perubahan memicu fetch ulang
 * @param {boolean} [opts.enabled=true] - set false untuk skip fetch (mis.
 *   sampai user lain di-select)
 */
export default function useApi(endpoint, opts = {}) {
    const { params, enabled = true } = opts;
    const url = buildUrl(endpoint, params);

    // Inisialisasi dari cache agar render pertama langsung berisi data bila
    // pernah dimuat (SSR-safe: getCached hanya baca Map di client).
    const [data, setData] = useState(() => (enabled ? getCached(url) : null));
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(
        () => enabled && getCached(url) === null
    );

    // Tarik ulang manual (mis. tombol refresh).
    const mutate = useCallback(async () => {
        invalidateCache(url);
        try {
            const fresh = await apiFetch(url);
            setData(fresh);
            setError(null);
            notifyKeyChanged(url);
        } catch (err) {
            setError(err);
        }
    }, [url]);

    useEffect(() => {
        if (!enabled) return;

        let active = true;

        async function load() {
            // Sudah ada request serupa in-flight? tunggu, jangan Gandakan.
            const existing = getInflight(url);
            try {
                const body = existing ?? (await apiFetch(url));
                if (!active) return;
                setData(body);
                setError(null);
            } catch (err) {
                if (!active) return;
                setError(err);
            } finally {
                if (active) setLoading(false);
            }
        }

        // Re-render saat cache untuk key ini di-invalidasi atau diperbarui
        // (mis. setelah mutasi di komponen lain).
        const unsubscribe = subscribe(url, () => {
            const cached = getCached(url);
            if (cached !== null) setData(cached);
        });

        load();
        return () => {
            active = false;
            unsubscribe();
        };
    }, [url, enabled]);

    return { data, error, loading, mutate };
}
