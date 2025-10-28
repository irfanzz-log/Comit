import Aside from "@/component/internal/Aside";
import HeaderSectionBody from "@/component/internal/HeaderSectionBody";

export default function ProfilPengguna() {
    return (
        <div className="main relative w-full h-screen flex flex-row bg-gray-100 overflow-x-hidden">
            <Aside />
            <main className="py-2 px-2 scrollbar-hide w-full h-screen overflow-y-scroll">
                <section className="main-section bg-white h-screen relative w-full rounded-lg shadow-md">
                    <HeaderSectionBody
                        title="Profil Pengguna"
                        profile="UP" /> 
                    <div className="main-section_body p-5">
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Error, tempora. Quisquam voluptatum sint pariatur fugit explicabo dolores inventore, quia aliquam fugiat. Deleniti temporibus molestias vel quaerat libero sunt, dolore quam.</p>
                    </div>
                </section>
            </main>
            
        </div>
    );
}