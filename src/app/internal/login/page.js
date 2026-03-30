'use client'

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/app/context/AuthContext"

export default function LoginPage() {
    const [npm, setNpm] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(npm, password);
            // Redirect to dashboard or home page after successful login
            router.push('/internal/home');
        } catch (error) {
            alert(error.message);
        }
    }
    

    return (
        <div className="login-page-container w-full bg-blue-500 h-screen flex flex-col justify-center items-center">
            <div className="login-page md:w-1/2 p-10 flex flex-col justify-center items-center">
                <div className="login-page_header flex flex-row justify-center items-center mb-5">
                    <Image src="/logo/commitLogo.png" width={300} height={300} alt="comit logo" className="max-w-1/4" />
                    <div className="header_body p-5">
                        <h1 className="text-white font-bold text-xl">Masuk dengan akun COMIT</h1>
                        <p className="text-white text-sm">Masukkan NPM dan password kamu</p>
                    </div>
                </div>
                <div className="login-page_body w-full">
                    <form onSubmit={handleLogin}>
                        <div className="NPM w-full my-3">
                        <label htmlFor="NPM" className="text-white ">NPM</label>
                        <input onChange={(e) => setNpm(e.target.value)} type="number" id="NPM" name="NPM" placeholder="NPM" className="p-2 w-full bg-white rounded-lg shadow-xl focus:ring-white focus:outline-none focus:ring-2" />
                    </div>

                    <div className="password w-full my-3">
                        <label htmlFor="password" className="text-white ">Password</label>
                        <input onChange={(e) => setPassword(e.target.value)} type="password" id="password" name="password" placeholder="Password" className="p-2 w-full bg-white rounded-lg shadow-xl focus:ring-white focus:outline-none focus:ring-2" />
                    </div>

                    <div className="form-content w-full flex justify-between items-center text-white text-sm">
                        <div className="form-content_info flex items-center gap-2">
                            <input type="checkbox" id="checkbox" name="checkbox" className="w-4 h-4 cursor-pointer" />
                            <label htmlFor="checkbox" className="cursor-pointer">Ingat saya</label>
                        </div>
                        <Link href="#">Lupa Password?</Link>
                    </div>

                    <button type="submit" className="w-full bg-white text-blue-500 p-2 rounded-lg my-3 cursor-pointer hover:scale-102 transition transition-duration-300 ease-out">Masuk</button>

                    <div className="form-footer text-center">
                        <p className="text-white text-sm">Belum punya akun? <Link href="/internal/sign" className="font-bold underline">Daftar disini</Link></p>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    )
}