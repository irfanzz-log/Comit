'use client';
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const pathname = usePathname();

    async function fetchUser() {
        try {
            const res = await fetch('/api/auth/me', {
                credentials: 'include'
            });

            if (res.status === 401) {
                setUser(null);
                if (pathname.startsWith("/internal")) {
                    router.replace("/internal/login");
                }

                return;
            }

            if (!res.ok) {
                throw new Error('Failed to fetch user');
            }

            const userData = await res.json();
            setUser(userData.user);
        } catch (error) {
            setUser(null);
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    async function login(npm, password, remembered) {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ npm, password, remembered }),
                credentials: 'include',
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Login failed');
            }

            const me = await fetch('/api/auth/me', {
                credentials: 'include',
            });

            if (me.status === 401) {
                throw new Error('Session tidak valid');
            }

            if (!me.ok) {
                throw new Error('Gagal mengambil data user');
            }

            const userData = await me.json();
            setUser(userData.user);

            return { success: true };

        } catch (error) {
            setUser(null);

            return {
                success: false,
                error: error.message,
            };
        }
    }

    async function logout() {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });
            setUser(null);
            router.push('/internal/login');
        } catch (error) {
            console.error('Logout error:', error);
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