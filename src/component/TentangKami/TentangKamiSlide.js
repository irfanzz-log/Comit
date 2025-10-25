'use client';   

import { useRef, useEffect } from "react";

export default function TentangKamiSlide() {

    const el = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('!translate-x-0', '!opacity-100');
                    observer.unobserve(entry.target);
                }   
            } , {threshold: 0.4}

        )

        if(el.current) observer.observe(el.current);
        return () => observer.disconnect();
      }, []);

  return (
    <> <div ref={el} className="relative z-10 w-full flex flex-col items-center transition-all duration-2000 ease-out translate-x-100 opacity-0">
              <header className='text-center'>
                <h3 className='font-bold'>Visi Misi</h3>
                <h2 className='text-3xl font-bold'>Tentang Kami</h2>
              </header>
              <div className="section-content md:p-10 p-2">
                <div className="content-head">
                  <p className='text-justify text-zinc-600'>Sebagai mahasiswa yang sadar akan panggilan ilmu pengetahuan dan perkembangan teknologi serta
                    mengupayakan penerapan etika Ilmu Pengetahuan dan Tri Dharma Perguruan Tinggi.
                    Menyadari akan tanggung jawab itu maka kami mahasiswa Kampus Insan Pembangunan berkewajiban membina
                    diri agar menjadi bangsa yang memiliki kemampuan akademik dan profesi, sehingga dapat menerapkan ilmu
                    pengetahuan dan mengembangkan teknologi. Oleh karena itu kami menghimpun diri dalam suatu wadah Organisasi
                    dibidang Teknologi, dengan nama “ Community of Information Technology “ pada tanggal 14 Februari 2010.</p>
                </div>
                <div className="section-col-tentang-kami md:flex-row md:mt-2 mt-10 flex-col flex fit-content">
                  <div className="left-section-content p-3 md:block md:w-1/2 hidden">
                    <img className='max-w-full rounded-lg' src="/background/imgHero5.png" alt="" />
                  </div>
                  <div className="relative fit-content right-section-content md:w-1/2 w-full flex flex-col justify-center bg-blue-100 shadow-lg p-3 rounded-lg lg:pl-5">
                    <ul className='mb-5 md:mb-1 md:text-left text-center'>
                      <li className='w-full'><h3 className='font-bold text-lg lg:text-2xl lg:text-left lg:px-5 text-center'>VISI</h3></li>
                      <ul className='relative bg-blue-100 md:pb-5'>
                        <li className='point-li md:line my-1 md:pl-3 text-zinc-600 lg:text-md md:text-sm lg:px-10'><p>Melaksanakan berbagai kegiatan yang bermanfaat dan yang bernilai positif.</p></li>
                        <li className='point-li md:line my-1 md:pl-3 text-zinc-600 lg:text-md md:text-sm lg:px-10'><p>Menjalin kerjasama dengan berbagai pihak dalam bidang teknologi informasi.</p></li>
                      </ul>
                    </ul>
                    <ul className='mt-5 md:mt-1 md:text-left text-center'>
                      <li className='w-full'><h3 className='font-bold text-lg lg:text-2xl lg:text-left lg:px-5 text-center'>MISI</h3></li>
                      <ul className='relative bg-blue-100'>
                        <li className='point-li md:line my-1 md:pl-3 text-zinc-600 lg:text-md md:text-sm lg:px-10'><p>Menghasilkan anggota COMIT yang handal dalam dunia informasi.</p></li>
                        <li className='point-li md:line my-1 md:pl-3 text-zinc-600 lg:text-md md:text-sm lg:px-10'><p>Memajukan dan mengembangkan almamater.</p></li>
                        <li className='point-li md:line my-1 md:pl-3 text-zinc-600 lg:text-md md:text-sm lg:px-10'><p>Menjadikan organisasi COMIT, sebagai organisasi yang unggul baik secara akademis maupun non akademis.</p></li>
                      </ul>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
    </>
  );
}   