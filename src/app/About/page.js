import Nav from "@/component/Nav";
import Link from "next/link";
import Footer from "@/component/Footer";
import Loading from "@/component/Loading";
import KegiatanCard from "@/component/kegiatan/KegiatanCard";
import Form from "@/component/Form";
import OnClick from "@/component/OnClick";
import CardSelect from "@/component/CardSelect";

export async function generateMetadata() {

  return {
    title: `About - Comunity of Infortmation Technology`,
  }
}

export default function About() {


  return (
    <>
      <main className="w-screen h-screen bg-gray-200 flex justify-center md:p-10 bg-[url(/background/imgHero4.png)]">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md"></div>
        <Loading></Loading>
        <section className="rounded-xl overflow-y-auto md:snap-y md:snap-mandatory scrollbar-hide">
          <Nav
            link1="/"
            textLink1="Home"
            link2="/Anouncement"
            textLink2="Anouncement"
          />
          <section className="relative snap-start content-base flex w-full items-center justify-center p-5 h-full bg-red-500 flex-col bg-[url(/background/imgHero2.png)] bg-center bg-cover bg-linear-90 from-gray-800 to-gray-700">
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800/80 to-gray-700/50"></div>
            <div className="relative z-10 w-full flex flex-col items-center justify-center ">
              <h2 className="md:text-7xl text-2xl sm:text-4xl font-bold text-center text-white md:w-1/2 w-3/3 ">
                Comunity of Information Technology
              </h2>
              <p className="m-5 text-white text-center">
                Semangat COMIT, salam teknologi!
              </p>
              <OnClick></OnClick>
            </div>
          </section>
          <section id='kepengurusan' className='relative md:snap-start md:content-base flex w-full md:h-auto align-center items-center bg-white flex-col md:pb-0 pb-10'>
            <div className="relative z-10 w-full flex flex-col items-center md:p-10">
              <header className=' md:w-1/2 2-full text-center'>
                <h2 className='text-5xl font-bold my-2'>Kepengurusan</h2>
                <p className='text-lg my-2'>Kepengurusan COMIT 2024-2025
                  (Sahitya Arsa). Kepengurusan COMIT merupakan wadah utama yang berperan dalam menggerakkan seluruh kegiatan organisasi, mulai dari perencanaan program kerja, pelaksanaan kegiatan, hingga pengembangan anggota.</p>
              </header>
              <div className="relative section-content w-full flex flex-wrap justify-center">
                <CardSelect></CardSelect>
              </div>
            </div>
          </section>
          <section id='kegiatan' className='relative md:snap-start md:content-base flex w-full md:h-auto align-center items-center bg-white flex-col md:p-0 p-2'>
            <article className="relative z-10 w-full flex flex-col items-center md:p-10">
              <header className=' md:w-1/2 2-full text-center'>
                <h2 className='text-5xl font-bold my-2'>Galeri</h2>
                <p className='text-lg my-2'>Dokumentasi perjalanan dan momen berharga bersama Community of Information Technology (COMIT).</p>
              </header>
              <KegiatanCard></KegiatanCard>
              <Link href='#' className="md:p-5 p-3 text-white md:text-xl text-lg bg-blue-500 rounded-lg xl my-7 hover:scale-110 transform transition duration-300 eas-in-out">Lihat Lainnya</Link>
            </article>
          </section>
          <section id='kepengurusan' className='relative md:snap-start md:content-base flex w-full md:h-auto align-center items-center bg-white flex-col md:pb-0 pb-10'>
            <div className="relative z-10 w-full flex flex-col items-center md:p-10 p-5">
              <header className=' md:w-1/2 2-full text-center'>
                <h2 className='text-5xl font-bold my-2'>Hubungi Kami</h2>
                <p className='text-lg my-2'>Punya pertanyaan, ide, atau ingin berkolaborasi?
                  Tim COMIT (Community of Information Technology) selalu terbuka untuk berdiskusi dan berbagi inspirasi di dunia teknologi informasi.</p>
              </header>
              <div className="relative section-content w-full flex flex-col items-center justify-center">
                <Form></Form>
              </div>
            </div>
          </section>
          <Footer></Footer>
        </section>
      </main>
    </>
  );
}
