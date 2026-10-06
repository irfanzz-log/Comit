import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/jwt";
import Aside from "@/component/internal/Aside";
import { query } from "@/lib/db";

// Guard autentikasi sisi server: token diverifikasi di sini, dan keberadaan
// user dicek ulang ke database — bukan hanya membaca klaim cookie — sehingga
// halaman internal tidak bisa diakses dengan cookie palsu, dan akun yang
// sudah dihapus tidak tetap menjaga sesi.
export default async function DashboardLayout({ children }) {
    const tokenStore = await cookies();
    const token = tokenStore.get("token")?.value;
    const payload = token ? verifyToken(token) : null;

    if (!payload?.id) {
        redirect("/internal/login");
    }

    const res = await query(`SELECT 1 FROM users WHERE id = $1`, [payload.id]);

    if (res.rowCount === 0) {
        redirect("/internal/login");
    }

    return (
        <div className="relative w-full min-h-screen flex flex-row bg-gray-50 overflow-x-hidden">
            <Aside />
            <main className="flex-1 min-w-0 min-h-screen overflow-y-auto scrollbar-hide p-2 md:p-4">
                {children}
            </main>
        </div>
    );
}
