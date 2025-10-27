import Image from "next/image"
import Link from "next/link"

export default function LoginPage() {
    return (
        <div className="login-page-container w-full bg-blue-500 h-screen flex flex-col justify-center items-center">
            <div className="login-page w-1/2 p-10 flex flex-col justify-center items-center">
                <div className="login-page_header flex flex-row justify-center items-center mb-5">
                    <Image src="/logo/commitLogo.png" width={300} height={300} alt="comit logo" className="max-w-1/4" />
                    <div className="header_body p-5">
                        <h1 className="text-white font-bold text-xl">Masuk dengan akun COMIT</h1>
                        <p className="text-white text-sm">Masukkan username dan password kamu</p>
                    </div>
                </div>
                <div className="login-page_body w-full">
                    <form>
                        <div className="username w-full my-3">
                        <label htmlFor="username" className="text-white ">Username</label>
                        <input type="text" id="username" name="username" placeholder="Username" className="p-2 w-full bg-white rounded-lg shadow-xl focus:ring-white focus:outline-none focus:ring-2" />
                    </div>

                    <div className="password w-full my-3">
                        <label htmlFor="password" className="text-white ">Password</label>
                        <input type="password" id="password" name="password" placeholder="Password" className="p-2 w-full bg-white rounded-lg shadow-xl focus:ring-white focus:outline-none focus:ring-2" />
                    </div>

                    <div className="form-content w-full flex justify-between items-center text-white text-sm">
                        <div className="form-content_info flex items-center gap-2">
                            <input type="checkbox" id="checkbox" name="checkbox" className="w-4 h-4 cursor-pointer" />
                            <label htmlFor="checkbox" className="cursor-pointer">Ingat saya</label>
                        </div>
                        <Link href="#">Lupa Password?</Link>
                    </div>

                    <button className="w-full bg-white text-blue-500 p-2 rounded-lg my-3 cursor-pointer hover:scale-102 transition transition-duration-300 ease-out">Masuk</button>

                    <div className="form-footer text-center">
                        <p className="text-white text-sm">Belum punya akun? <Link href="/internal/sign" className="font-bold underline">Daftar disini</Link></p>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    )
}