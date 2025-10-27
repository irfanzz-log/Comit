import Nav from '@/component/Nav';
import Footer from '@/component/Footer';
import Loading from '@/component/Loading';
import Divisi from '@/component/divisi/Divisi';
import OnClick from '@/component/OnClick';
import CardParent from '@/component/CardParent/CardParent';
import KegiatanCard from '@/component/kegiatan/KegiatanCard';
import TentangKamiSlide from '@/component/TentangKami/TentangKamiSlide';

export default function Home() {
  return (
    <>
      {/* Main Container */}
      <main className='home__container w-screen h-screen bg-gray-200 flex justify-center md:p-10 bg-[url(/background/imgHero4.png)] overflow-hidden'>
        <div className="home__overlay absolute inset-0 bg-black/70 backdrop-blur-md" />
        <Loading />

        {/* Content Wrapper */}
        <section className='home__content md:rounded-xl overflow-y-auto md:snap-y md:snap-mandatory scrollbar-hide'>
          {/* Navigation */}
          <Nav  
            link1="/about"
            textLink1="About Us"
            link2="/anouncement"
            textLink2="Anouncement"
          />

          {/* Hero Section */}
          <section className='hero relative snap-start flex w-full items-center justify-center p-5 h-full bg-[url(/background/imgHero2.png)] bg-center bg-cover'>
            <div className="hero__overlay absolute inset-0 bg-gradient-to-r from-gray-800/80 to-gray-700/50" />
            <div className="hero__content relative z-10 w-full flex flex-col items-center justify-center">
              <h2 className='hero__title md:text-7xl text-4xl font-bold text-center text-white md:w-1/2 w-full'>Community of Information Technology</h2>
              <p className='hero__subtitle m-5 text-white text-center'>Semangat COMIT, salam teknologi!</p>
              <OnClick targetId="tentangKami" content="Eksplorasi" />
            </div>
          </section>

          {/* About Section */}
          <section id='tentangKami' className='about relative md:snap-start flex w-full md:h-full h-auto items-center p-5 bg-white flex-col overflow-hidden'>
            <TentangKamiSlide />
          </section>

          {/* Division Section */}
          <section id='divisi' className='division relative md:snap-start flex w-full md:h-auto items-center p-5 bg-blue-500 flex-col'>
            <div className="division__content relative z-10 w-full flex flex-col md:p-10">
              <header className='division__header text-white lg:w-full md:w-1/2 w-full text-center md:text-left'>
                <h2 className='text-5xl font-bold my-2'>Divisi yang kami miliki</h2>
                <p className='text-lg my-2'>Kami Mempunyai Beberapa Akademik yang Bisa Membantu Anda dalam Belajar tentang Teknologi</p>
              </header>
              <Divisi />
            </div>
          </section>

          {/* Mentor Section */}
          <section id='mentor' className='mentor relative md:snap-start flex w-full md:h-auto items-center bg-white flex-col'>
            <div className="mentor__content relative z-10 w-full flex flex-col md:mt-0 mt-10 items-center md:p-10">
              <header className='mentor__header md:w-1/2 w-full text-center'>
                <h2 className='text-5xl font-bold my-2'>Mentor Kami</h2>
                <p className='text-lg my-2'>Kami mempunyai beberapa mentor yang sudah berpengalaman di bidangnya masing-masing</p>
              </header>
              <CardParent
                imgStyle="w-3/4 rounded-full shadow-xl"
                cardStyle="mentor__card flex justify-center items-center max-w-1/2 flex-col my-3 transform transition duration-300 hover:scale-125 cursor-pointer"
              />
            </div>
          </section>

          {/* Activities Section */}
          <section id='kegiatan' className='activities relative md:snap-start flex w-full md:h-auto items-center bg-white flex-col'>
            <KegiatanCard />
          </section>

          <Footer />
        </section>

        {/* Popup Button */}
        <div className="popup md:block hidden shadow-xl cursor-pointer" />
      </main>
    </>
  );
}