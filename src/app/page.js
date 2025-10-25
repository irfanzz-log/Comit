import Link from 'next/link'
import Card from '@/component/Cards';
import { kegiatan } from '@/lib/dataMentor';
import Nav from '@/component/Nav';
import Footer from '@/component/Footer';
import Loading from '@/component/Loading';
import Divisi from '@/component/divisi/Divisi';
import OnClick from '@/component/OnClick';
import CardParent from '@/component/CardParent/CardParent';

export default function Home() {

  return (
    <>
      <main className='w-screen h-screen bg-gray-200 flex justify-center md:p-10 bg-[url(/background/imgHero4.png)]'>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
        <Loading></Loading>
        <section className='rounded-xl overflow-y-auto md:snap-y md:snap-mandatory scrollbar-hide'>
          <Nav  
            link1="/About"
            textLink1="About Us"
            link2="/Anouncement"
            textLink2="Anouncement"
          />
          <section className='relative snap-start content-base flex w-full items-center justify-center p-5 h-full bg-red-500 flex-col bg-[url(/background/imgHero2.png)] bg-center bg-cover bg-linear-90 from-gray-800 to-gray-700'>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800/80 to-gray-700/50"></div>
            <div className="relative z-10 w-full flex flex-col items-center justify-center ">
              <h2 className='md:text-7xl text-4xl font-bold text-center text-white md:w-1/2 w-3/3'>Comunity of Information Technology</h2>
              <p className='m-5 text-white text-center'>Semangat COMIT, salam teknologi!</p>
              <OnClick></OnClick>
            </div>
          </section>
          <section id='tentangKami' className='relative md:snap-start md:content-base flex w-full md:h-full h-auto items-center p-5 bg-white flex-col'>
            <div className="relative z-10 w-full flex flex-col items-center ">
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
                <div className="section-col md:grid md:grid-cols-2 gap-2">
                  <div className="left-section-content p-3">
                    <img className='max-w-full rounded-lg' src="./background/imgHero5.png" alt="" />
                  </div>
                  <div className="right-section-content flex flex-col justify-center bg-blue-100 shadow-lg p-5 rounded-lg">
                    <ul className='mb-5 md:text-left text-justify'>
                      <li><h3 className='font-bold text-lg md:text-left text-center'>Visi</h3></li>
                      <ul className='relative bg-blue-100 md:pb-5'>
                        <li className='point-li md:line my-1 md:pl-3 text-zinc-600'><p>Melaksanakan berbagai kegiatan yang bermanfaat dan yang bernilai positif.</p></li>
                        <li className='point-li md:line my-1 md:pl-3 text-zinc-600'><p>Menjalin kerjasama dengan berbagai pihak dalam bidang teknologi informasi.</p></li>
                      </ul>
                    </ul>
                    <ul className='mt-5 md:text-left text-justify'>
                      <li><h3 className='font-bold text-lg md:text-left text-center'>Misi</h3></li>
                      <ul className='relative bg-blue-100 md:pb-12'>
                        <li className='point-li md:line my-1 md:pl-3 text-zinc-600'><p>Menghasilkan anggota COMIT yang handal dalam dunia informasi.</p></li>
                        <li className='point-li md:line my-1 md:pl-3 text-zinc-600'><p>Memajukan dan mengembangkan almamater.</p></li>
                        <li className='point-li md:line my-1 md:pl-3 text-zinc-600'><p>Menjadikan organisasi COMIT, sebagai organisasi yang unggul baik secara akademis maupun non akademis.</p></li>
                      </ul>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section id='divisi' className='relative md:snap-start md:content-base flex w-full md:h-auto align-center items-center p-5 bg-blue-500 flex-col'>
            <div className="relative z-10 w-full flex flex-col align-center md:p-10">
              <header className='text-white md:w-1/2 2-full md:text-left text-center'>
                <h2 className='text-5xl font-bold my-2'>Divisi yang kami miliki</h2>
                <p className='text-lg my-2'>Kami Mempunyai Beberapa Akademik yang Bisa Membantu Anda dalam Belajar tentang Teknologi</p>
              </header>
              <Divisi></Divisi>
            </div>
          </section>
          <section id='mentor' className='relative md:snap-start md:content-base flex w-full md:h-auto align-center items-center bg-white flex-col'>
            <div className="relative z-10 w-full flex flex-col items-center md:p-10">
              <header className=' md:w-1/2 2-full text-center'>
                <h2 className='text-5xl font-bold my-2'>Mentor Kami</h2>
                <p className='text-lg my-2'>Kami mempunyai beberapa mentor yang sudah berpengalaman di bidangnya masing-masing</p>
              </header>
              <CardParent></CardParent>
            </div>
          </section>
          <section id='kegiatan' className='relative md:snap-start md:content-base flex w-full md:h-auto align-center items-center bg-white flex-col'>
            <article className="relative z-10 w-full flex flex-col items-center md:p-10">
              <header className=' md:w-1/2 2-full text-center'>
                <h2 className='text-5xl font-bold my-2'>Kegiatan Kami</h2>
                <p className='text-lg my-2'>Kami dengan bangga mempersembahkan berbagai kegiatan dan acara yang telah kami selenggarakan. Setiap acara dirancang untuk memberikan pengalaman yang berkesan dan penuh makna.</p>
              </header>
              <div className="flex section-content flex-wrap w-full">
                {kegiatan.map((k, index) => {
                  return (
                    <Card
                      key={index}
                      throw="#"
                      nama={k.namaKegiatan}
                      url={k.img}
                      divisi={k.content}
                      imgStyle="w-full rounded-xl"
                      cardStyle="flex justify-center md:w-1/3 w-full p-7 rounded-xl items-center flex-col my-3 transform transition duration-300 hover:bg-blue-200 hover:scale-105 cursor-pointer"
                    />
                  )
                })}
              </div>
            </article>
          </section>
          <Footer></Footer>
        </section>
        <div className="z-100 md:hidden fixed bottom-10 right-5">
          <Link href="/About" className=''>
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bg-blue-500 shadow-lg bi my-2 rounded-full p-2 text-white bi-info-circle" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
            </svg>
          </Link>
          <Link href="/About" className=''>
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bg-blue-500 shadow-lg bi my-2 rounded-full p-2 text-white bi-megaphone" viewBox="0 0 16 16">
              <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0v-.214c-2.162-1.241-4.49-1.843-6.912-2.083l.405 2.712A1 1 0 0 1 5.51 15.1h-.548a1 1 0 0 1-.916-.599l-1.85-3.49-.202-.003A2.014 2.014 0 0 1 0 9V7a2.02 2.02 0 0 1 1.992-2.013 75 75 0 0 0 2.483-.075c3.043-.154 6.148-.849 8.525-2.199zm1 0v11a.5.5 0 0 0 1 0v-11a.5.5 0 0 0-1 0m-1 1.35c-2.344 1.205-5.209 1.842-8 2.033v4.233q.27.015.537.036c2.568.189 5.093.744 7.463 1.993zm-9 6.215v-4.13a95 95 0 0 1-1.992.052A1.02 1.02 0 0 0 1 7v2c0 .55.448 1.002 1.006 1.009A61 61 0 0 1 4 10.065m-.657.975 1.609 3.037.01.024h.548l-.002-.014-.443-2.966a68 68 0 0 0-1.722-.082z" />
            </svg>
          </Link>
        </div>
        <div className="md:block hidden popup shadow-xl cursor-pointer"></div>
      </main>
    </>
  );
}