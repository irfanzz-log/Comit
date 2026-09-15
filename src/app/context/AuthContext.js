'use client';
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { apiFetch, ApiError } from "@/lib/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const pathname = usePathname();

    useEffect(() => {
        let cancelled = false;

        async function fetchUser() {
            try {
                const data = await apiFetch('/api/auth/me');
                if (!cancelled) setUser(data.user);
            } catch (error) {
                if (cancelled) return;
                setUser(null);
                if (error instanceof ApiError && error.status === 401 && pathname.startsWith("/internal")) {
                    router.replace("/internal/login");
                } else if (!(error instanceof ApiError)) {
                    console.error(error);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        fetchUser();
        return () => {
            cancelled = true;
        };
    }, []);

    async function login(npm, password, remembered) {
        try {
            await apiFetch('/api/auth/login', {
                method: 'POST',
                body: JSON.stringify({ npm, password, remembered }),
            });

            const me = await apiFetch('/api/auth/me');
            setUser(me.user);

            return { success: true };

        } catch (error) {
            setUser(null);

            return {
                success: false,
                error: error.message || 'Login gagal',
            };
        }
    }

    async function logout() {
        try {
            await apiFetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            router.push('/internal/login');
        }
    }

    function updateUser(updatedUser) {
        setUser(prev => ({ ...prev, ...updatedUser }));
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
