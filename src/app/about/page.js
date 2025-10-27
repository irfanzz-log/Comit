import Nav from "@/component/Nav";
import Link from "next/link";
import Footer from "@/component/Footer";
import Loading from "@/component/Loading";
import KegiatanCard from "@/component/kegiatan/KegiatanCard";
import Form from "@/component/Form";
import OnClick from "@/component/OnClick";
import Kepengurusan from "@/component/Kepengurusan/Kepengurusan";
import Galeri from "@/component/Galeri/Galeri";

export async function generateMetadata() {
  return {
    title: 'About - Community of Information Technology',
  }
}

export default function About() {
  return (
    <>
      {/* Main container */}
      <main className="about__container w-screen h-screen bg-gray-200 flex justify-center md:p-10 bg-[url(/background/imgHero4.png)]">
        <div className="about__overlay absolute inset-0 bg-black/70 backdrop-blur-md"></div>
        <Loading />
        
        {/* Content wrapper */}
        <section className="about__content md:rounded-xl overflow-y-auto md:snap-y md:snap-mandatory scrollbar-hide">
          {/* Navigation */}
          <Nav
            link1="/"
            textLink1="Home"
            link2="/Anouncement"
            textLink2="Anouncement"
          />

          {/* Hero section */}
          <section className="hero relative snap-start flex w-full items-center justify-center p-5 h-full flex-col bg-[url(/background/imgHero3.png)] bg-center bg-cover">
            <div className="hero__overlay absolute inset-0 bg-gradient-to-r from-gray-800/80 to-gray-700/50"></div>
            <div className="hero__content relative z-10 w-full flex flex-col items-center justify-center">
              <h2 className="hero__title md:text-7xl text-2xl sm:text-4xl font-bold text-center text-white md:w-1/2">
                Community of Information Technology
              </h2>
              <p className="hero__subtitle m-5 text-white text-center">
                Semangat COMIT, salam teknologi!
              </p>
              <OnClick targetId="kepengurusan" content="Eksplorasi" />
            </div>
          </section>

          {/* Management section */}
          <section id="kepengurusan" className="management relative md:snap-start flex w-full md:h-auto items-center bg-white flex-col md:pb-0 pb-10">
            <Kepengurusan />
          </section>

          {/* Gallery section */}
          <section id="kegiatan" className="gallery relative md:snap-start flex w-full md:h-auto items-center bg-white flex-col md:p-0 p-2">
            <article className="gallery__content relative z-10 w-full flex flex-col items-center md:p-10">
              <Galeri />
            </article>
          </section>

          {/* Contact section */}
          <section className="contact relative md:snap-start flex w-full md:h-auto items-center bg-white flex-col md:pb-0 pb-10">
            <div className="contact__content relative z-10 w-full flex flex-col items-center md:p-10 p-5">
              <header className="contact__header md:w-1/2 text-center">
                <h2 className="text-5xl font-bold my-2">Hubungi Kami</h2>
                <p className="text-lg my-2">
                  Punya pertanyaan, ide, atau ingin berkolaborasi?
                  Tim COMIT (Community of Information Technology) selalu terbuka untuk berdiskusi dan berbagi inspirasi di dunia teknologi informasi.
                </p>
              </header>
              <div className="contact__form w-full flex flex-col items-center justify-center">
                <Form />
              </div>
            </div>
          </section>

          <Footer />
        </section>
      </main>
    </>
  );
}
