'use client';
import Navigation from '@/component/Nav';
import Footer from '@/component/Footer';
import Loading from '@/component/Loading';
import Divisi from '@/component/divisi/Divisi';
import OnClick from '@/component/OnClick';
import KegiatanCard from '@/component/kegiatan/KegiatanCard';
import TentangKamiSlide from '@/component/TentangKami/TentangKamiSlide';
import { motion } from 'motion/react';
import Image from 'next/image';
import { data } from '@/lib/dataMentor';
import useGetEvent from '@/hooks/useGetEvent';

export default function Home() {
  const event = useGetEvent(20);
  console.log(event);

  return (
    <>
      {/* Main Container */}
      <main className='home__container w-screen h-screen bg-gray-200 flex justify-center md:p-10 bg-[url(/background/imgHero4.png)] overflow-hidden'>
        <div className="home__overlay absolute inset-0 bg-black/70 backdrop-blur-md" />
        <Loading />

        {/* Content Wrapper */}
        <section
          className='home__content md:rounded-xl overflow-x-hidden overflow-y-auto md:snap-y md:snap-mandatory scrollbar-hide'>
          {/* Navigation */}
          < Navigation
            link1="/"
            textLink1="Home"
            link2="/about"
            textLink2="About Us"
            link3="/announcement"
            textLink3="Announcement"
          />

          {/* Hero Section */}
          <section
            className='hero relative snap-start flex w-full items-center justify-center p-5 h-full bg-[url(/background/imgHero2.png)] bg-center bg-cover'>
            <div className="hero__overlay absolute inset-0 bg-gradient-to-r from-gray-800/80 to-gray-700/50" />
            <div className="hero__content relative z-10 w-full flex flex-col items-center justify-center">
              <h2 className='hero__title md:text-7xl text-4xl font-bold text-center text-white md:w-1/2 w-full'>Community of Information Technology</h2>
              <p className='hero__subtitle m-5 text-white text-center'>Semangat COMIT, salam teknologi!</p>
              <OnClick targetId="tentangKami" content="Eksplorasi" />
            </div>
          </section>

          {/* About Section */}
          <section
            id='tentangKami' className='about relative md:snap-start flex w-full md:h-full h-auto items-center p-5 bg-white flex-col overflow-hidden'>
            <TentangKamiSlide />
          </section>

          {/* Division Section */}
          <section
            id='divisi' className='division relative md:snap-start flex w-full md:h-auto items-center p-5 bg-blue-500 flex-col'>
            <div className="division__content relative z-10 w-full flex flex-col md:p-10">
              <header className='division__header text-white lg:w-full md:w-1/2 w-full text-center md:text-left'>
                <h2 className='text-5xl font-bold my-2'>Divisi yang kami miliki</h2>
                <p className='text-lg my-2'>Kami Mempunyai Beberapa Akademik yang Bisa Membantu Anda dalam Belajar tentang Teknologi</p>
              </header>
              <Divisi />
            </div>
          </section>

          {/* Mentor Section */}
          <section
            id='mentor' className='mentor relative md:snap-start flex w-full md:h-auto items-center bg-white flex-col'>
            <div className="mentor__content relative z-10 w-full flex flex-col md:mt-0 mt-10 items-center md:p-10">
              <header className='mentor__header md:w-1/2 w-full text-center'>
                <h2 className='text-5xl font-bold my-2'>Mentor Kami</h2>
                <p className='text-lg my-2'>Kami mempunyai beberapa mentor yang sudah berpengalaman di bidangnya masing-masing</p>
              </header>
              <div className='relative w-full flex flex-wrap justify-center'>
                {data.map((data, idx) => {
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5 }}
                      className='relative hover:scale-105 transition-transform duration-600 ease-out md:w-1/6 w-full md:m-10 md:p-0 p-10'
                    >
                      <div className='relative w-full overflow-hidden rounded-full shadow-xl'>
                        <Image src={data.imgurl} height={400} width={400} alt="Mentor" />
                      </div>
                      <div className='text-center pt-5'>
                        <h3 className='text-md font-bold'>{data.nama}</h3>
                        <p className='text-sm'>{data.divisi}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>

          {/* Activities Section */}
          <section
            id='kegiatan' className='activities relative md:snap-start flex w-full md:h-auto items-center bg-white flex-col md:px-0 px-10'>

            <div className='w-full my-20'>
              <header className='activities__header w-full flex justify-center flex-col text-center'>
                <h2 className='text-5xl font-bold my-2'>Kegiatan Kami</h2>
                <p className='text-lg my-2'>Kami mempunyai beberapa kegiatan yang sudah kami lakukan selama ini</p>
              </header>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:px-20 px-0">
                {event?.map((item, idx) => (
                  <div key={idx} className="h-full">
                    <div className="h-full flex flex-col rounded-lg p-4">
                      <Image
                        src="/background/imgHero1.png"
                        alt="Activity"
                        width={400}
                        height={300}
                        className="w-full"
                      />

                      <div className="flex-1 mt-4">
                        <h3 className="font-bold text-2xl mb-2">
                          {item.nama_acara}
                        </h3>

                        <p className="text-sm">
                          {item.komentar}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <Footer />
        </section>

        {/* Popup Button */}
        <div className="popup md:block hidden shadow-xl cursor-pointer" />
      </main>
    </>
  );
}