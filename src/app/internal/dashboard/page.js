import Image from "next/image";

export default function DashboardPage() {
    return (
        <div className="main relative w-full h-screen flex flex-row bg-gray-100 overflow-x-hidden">
            <aside className="md:w-1/5 w-3/4 md:fixed absolute h-screen md:left-0 -left-100 z-10 top-0 md:flex flex-col hidden">
                <header className="w-full p-5 flex flex-row items-center ">
                    <Image 
                        src="/logo/commitLogo.png"
                        width={100}
                        height={100}
                        className="max-w-1/6"
                    />
                    <h2>COMIT</h2>
                </header>
            </aside>
            <main className="py-2 md:px-5 px-2">
                <section className="main-section bg-white h-screen relative md:left-1/5 md:w-4/5 w-full rounded-lg shadow-md">
                    <header className="shadow-sm w-full p-4">
                        <h1>Dashboard Page</h1>
                    </header>
                    <div className="main-section_body p-5">
                        <p>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Error, tempora. Quisquam voluptatum sint pariatur fugit explicabo dolores inventore, quia aliquam fugiat. Deleniti temporibus molestias vel quaerat libero sunt, dolore quam.</p>
                    </div>
                </section>
            </main>
            
        </div>
    );
}