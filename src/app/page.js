import Nav from '@/component/Nav';
import Footer from '@/component/Footer';
import Loading from '@/component/Loading';
import Divisi from '@/component/divisi/Divisi';
import OnClick from '@/component/OnClick';
import CardParent from '@/component/CardParent/CardParent';
import ContainerSlide from '@/component/kegiatan/ContainerSlide';
import TentangKamiSlide from '@/component/TentangKami/TentangKamiSlide';

export default function Home() {

  return (
    <>
      <main className='w-screen h-screen bg-gray-200 flex justify-center md:p-10 bg-[url(/background/imgHero4.png)]'>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />
        <Loading />
        <section className='md:rounded-xl overflow-y-auto md:snap-y md:snap-mandatory scrollbar-hide'>
          <Nav  
            link1="/About"
            textLink1="About Us"
            link2="/Anouncement"
            textLink2="Anouncement"
          />
          <section className='relative snap-start content-base flex w-full items-center justify-center p-5 h-full bg-red-500 flex-col bg-[url(/background/imgHero2.png)] bg-center bg-cover'>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800/80 to-gray-700/50" />
            <div className="relative z-10 w-full flex flex-col items-center justify-center ">
              <h2 className='md:text-7xl text-4xl font-bold text-center text-white md:w-1/2 w-full'>Comunity of Information Technology</h2>
              <p className='m-5 text-white text-center'>Semangat COMIT, salam teknologi!</p>
              <OnClick />
            </div>
          </section>
          <section id='tentangKami' className='relative md:snap-start md:content-base flex w-full md:h-full h-auto items-center p-5 bg-white flex-col'>
           <TentangKamiSlide />
          </section>
          <section id='divisi' className='relative md:snap-start md:content-base flex w-full md:h-auto items-center p-5 bg-blue-500 flex-col'>
            <div className="relative z-10 w-full flex flex-col md:p-10">
              <header className='text-white lg:w-full md:w-1/2 w-full lg:text-center text-center md:text-left  '>
                <h2 className='text-5xl font-bold my-2'>Divisi yang kami miliki</h2>
                <p className='text-lg my-2'>Kami Mempunyai Beberapa Akademik yang Bisa Membantu Anda dalam Belajar tentang Teknologi</p>
              </header>
              <Divisi />
            </div>
          </section>
          <section id='mentor' className='relative md:snap-start md:content-base flex w-full md:h-auto items-center bg-white flex-col'>
            <div className="relative z-10 w-full flex flex-col md:mt-0 mt-10 items-center md:p-10">
              <header className='md:w-1/2 w-full text-center'>
                <h2 className='text-5xl font-bold my-2'>Mentor Kami</h2>
                <p className='text-lg my-2'>Kami mempunyai beberapa mentor yang sudah berpengalaman di bidangnya masing-masing</p>
              </header>
              <CardParent
                imgStyle="w-3/4 rounded-full shadow-xl"
                cardStyle="observe-item flex justify-center items-center max-w-1/2 flex-col my-3 transform transition duration-300 hover:scale-125 cursor-pointer"
              />
            </div>
          </section>
          <section id='kegiatan' className='relative md:snap-start md:content-base flex w-full md:h-auto items-center bg-white flex-col'>
              <ContainerSlide />
          </section>
          <Footer />
        </section>
        <div className="md:block hidden popup shadow-xl cursor-pointer" />
      </main>
    </>
  );
}