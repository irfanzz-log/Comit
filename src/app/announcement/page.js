'use client'
import Loading from "@/component/Loading";
import Nav from "@/component/Nav";
import OnClick from "@/component/OnClick";
import Footer from "@/component/Footer";
import { useState, useEffect } from "react";
import { motion } from "motion/react";

export default function Announcement() {

    const [dataAcara, setDataAcara] = useState();

    useEffect(() => {
        fetch('/api/events',
        )
            .then((res) => res.json())
            .then((data) => setDataAcara(data)
            )
            .catch((err) => console.log(err)
            );

    }, []);

    return (
        <>
            <main className="about__container w-screen h-screen bg-gray-200 flex justify-center md:p-10 bg-[url(/background/imgHero4.png)]">
                <div className="about__overlay absolute inset-0 bg-black/70 backdrop-blur-md"></div>
                <Loading />

                {/* Content wrapper */}
                <motion.section
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="about__content md:rounded-xl overflow-y-auto md:snap-y md:snap-mandatory scrollbar-hide"
                >
                    {/* Navigation */}
                    <Nav
                        link1="/"
                        textLink1="Home"
                        link2="/about"
                        textLink2="About Us"
                        link3="/announcement"
                        textLink3="Announcement"
                    />

                    {/* Hero section */}
                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        className="hero relative snap-start flex w-full items-center justify-center p-5 h-full flex-col bg-[url(/background/imgHero3.png)] bg-center bg-cover"
                    >
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
                    </motion.section>

                    <motion.section
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1 }}
                        viewport={{ once: true }}
                        id="events"
                        className="relative flex w-full items-center snap-start justify-center p-5 flex-col bg-white"
                    >
                        <div className="md:w-3/4 w-full my-20 flex flex-col items-center justify-center">
                            {dataAcara?.map((data, index) => (

                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 1 }}
                                    viewport={{ once: true }}
                                    className="w-full"
                                >
                                    <div className="flex w-full md:flex-row flex-col my-3 shadow-lg hover:scale-101 transition-transform duration-300 ease-out overflow-hidden rounded-md">
                                        <div className="md:w-1/2 w-full bg-blue-500 overflow-hidden h-100"><img src={data.file_url || '/background/imgHero3.png'} onError={(e) => {
                                            e.currentTarget.src = "/background/imgHero3.png";
                                        }} className="w-full h-full object-cover" /></div>
                                        <div className="p-10 relative md:w-3/4 w-full">
                                            <h2 className="font-bold text-3xl">{data.nama_acara}</h2>
                                            <p>{data.komentar}</p>
                                            <div className="my-20">
                                                <p>Tanggal Acara</p>
                                                <span className="text-gray-600/80">12 April 2026</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                            ))}
                        </div>
                    </motion.section>

                    <Footer />
                </motion.section>
            </main>
        </>
    )
}