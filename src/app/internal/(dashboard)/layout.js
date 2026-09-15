import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";
import Aside from "@/component/internal/Aside";

// Guard autentikasi sisi server: token diverifikasi di sini (bukan hanya
// keberadaannya di middleware), sehingga halaman internal tidak bisa
// diakses dengan cookie token palsu atau kedaluwarsa.
export default async function DashboardLayout({ children }) {
    const token = (await cookies()).get("token")?.value;
    const payload = token ? verifyToken(token) : null;

    if (!payload) {
        redirect("/internal/login");
    }

    return (
        <div className="main relative w-full min-h-screen flex flex-row bg-gray-100 overflow-x-hidden">
            <Aside />
            <main className="py-2 px-2 scrollbar-hide w-full min-h-screen min-w-0 overflow-y-scroll">
                {children}
            </main>
        </div>
    );
}
