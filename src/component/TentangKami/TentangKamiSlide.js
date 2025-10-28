'use client';   

import { useRef, useEffect } from "react";
import Image from "next/image";

export default function TentangKamiSlide() {
    const el = useRef(null);

    // Intersection Observer for slide-in animation
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('!translate-x-0', '!opacity-100');
                    observer.unobserve(entry.target);
                }   
            }, 
            {threshold: 0.4}
        );

        if(el.current) observer.observe(el.current);
        return () => observer.disconnect();
    }, []);

    return (
        <div ref={el} className="tentang-kami__container relative z-10 w-full flex flex-col items-center transition-all duration-1000 ease-out md:translate-x-100 translate-x-20 opacity-0">
            {/* Header Section */}
            <header className="tentang-kami__header text-center">
                <h3 className="tentang-kami__subtitle font-bold">Visi Misi</h3>
                <h2 className="tentang-kami__title text-3xl font-bold">Tentang Kami</h2>
            </header>

            {/* Main Content Section */}
            <div className="tentang-kami__content md:p-10 p-2">
                {/* Description */}
                <div className="tentang-kami__description">
                    <p className="text-justify text-zinc-600">
                        {`Sebagai mahasiswa yang sadar akan panggilan ilmu pengetahuan dan perkembangan teknologi serta
                        mengupayakan penerapan etika Ilmu Pengetahuan dan Tri Dharma Perguruan Tinggi.
                        Menyadari akan tanggung jawab itu maka kami mahasiswa Kampus Insan Pembangunan berkewajiban membina
                        diri agar menjadi bangsa yang memiliki kemampuan akademik dan profesi, sehingga dapat menerapkan ilmu
                        pengetahuan dan mengembangkan teknologi. Oleh karena itu kami menghimpun diri dalam suatu wadah Organisasi
                        dibidang Teknologi, dengan nama " Community of Information Technology " pada tanggal 14 Februari 2010.`}
                    </p>
                </div>

                {/* Vision Mission Section */}
                <div className="tentang-kami__vision-mission md:flex-row md:mt-2 mt-10 flex-col flex">
                    {/* Image Section */}
                    <div className="tentang-kami__image flex justify-center md:block mx-2 md:w-1/2 hidden">
                        <Image width={1000} height={600} className="max-w-full rounded-lg" src="/background/imgHero5.png" alt="Tentang Kami" />
                    </div>

                    {/* Vision Mission Content */}
                    <div className="tentang-kami__info md:w-1/2 w-full flex flex-col justify-center bg-blue-100 shadow-lg p-3 rounded-lg lg:pl-5">
                        {/* Vision */}
                        <div className="vision-section mb-5 md:mb-1 md:text-left text-center">
                            <h3 className="vision-title font-bold text-lg lg:text-2xl lg:text-left lg:px-5 text-blue-500 text-center">VISI</h3>
                            <ul className="vision-list bg-blue-100 md:pb-5">
                                <li className="vision-item md:pl-3 my-1 text-zinc-600 lg:text-md md:text-sm lg:px-10">
                                    <p>Melaksanakan berbagai kegiatan yang bermanfaat dan yang bernilai positif.</p>
                                </li>
                                <li className="vision-item md:pl-3 my-1 text-zinc-600 lg:text-md md:text-sm lg:px-10">
                                    <p>Menjalin kerjasama dengan berbagai pihak dalam bidang teknologi informasi.</p>
                                </li>
                            </ul>
                        </div>

                        {/* Mission */}
                        <div className="mission-section mt-5 md:mt-1 md:text-left text-center">
                            <h3 className="mission-title font-bold text-lg lg:text-2xl lg:text-left lg:px-5 text-blue-500 text-center">MISI</h3>
                            <ul className="mission-list bg-blue-100">
                                <li className="mission-item md:pl-3 my-1 text-zinc-600 lg:text-md md:text-sm lg:px-10">
                                    <p>Menghasilkan anggota COMIT yang handal dalam dunia informasi.</p>
                                </li>
                                <li className="mission-item md:pl-3 my-1 text-zinc-600 lg:text-md md:text-sm lg:px-10">
                                    <p>Memajukan dan mengembangkan almamater.</p>
                                </li>
                                <li className="mission-item md:pl-3 my-1 text-zinc-600 lg:text-md md:text-sm lg:px-10">
                                    <p>Menjadikan organisasi COMIT, sebagai organisasi yang unggul baik secara akademis maupun non akademis.</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}