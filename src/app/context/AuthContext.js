'use client';
import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user,setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    async function fetchUser() {
        try {
            const res = await fetch('/api/auth/me', {credentials: 'include'});
            if (res.ok) {
                const userData = await res.json();
                setUser(userData.user);
            }
        } catch (error) {
            setUser(null);
            console.error('Error fetching user:', error);
        } finally {
            setLoading(false);  
        }
    }

    useEffect(() => {
        fetchUser();
    }, []);

    async function login(npm,password) {
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ npm, password }),
                credentials: 'include',
            });

            if (!res.ok) throw new Error('Login failed');

            const me = await fetch('/api/auth/me', {credentials: 'include'});
            const userData = await me.json();
            setUser(userData.user);

            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
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