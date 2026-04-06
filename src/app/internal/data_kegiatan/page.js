import Aside from "@/component/internal/Aside";
import HeaderSectionBody from "@/component/internal/HeaderSectionBody";
import MyUploadButton from "@/component/UploadButton";

export default function DataKegiatan() {
    return (
        <div className="main relative w-full h-screen flex flex-row bg-gray-100 overflow-x-hidden">
            <Aside />
            <main className="py-2 px-2 scrollbar-hide w-full h-screen overflow-y-scroll">
                <section className="main-section bg-white h-screen relative w-full rounded-lg shadow-md">
                    <HeaderSectionBody
                        title="Data Kegiatan"
                        profile="UP" />
                    <div className="main-section_body p-5">
                        <div className="main-section_content">
                            <div className="content-head">
                                <h1 className="text-xl font-bold">Data Kegiatan</h1>
                            </div>
                            <div className="content-body">
                                <p>Halaman ini masih dalam pengembangan. Mohon bersabar ya!</p>
                            <MyUploadButton />
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}