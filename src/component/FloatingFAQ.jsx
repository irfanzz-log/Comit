"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

const faqData = [
  {
    question: "Apa itu COMIT?",
    answer:
      "COMIT (Community of Information Technology) adalah komunitas teknologi informasi yang menjadi wadah untuk belajar, berkembang, berkolaborasi, dan berbagi pengetahuan di bidang teknologi.",
  },
  {
    question: "Apa saja kegiatan COMIT?",
    answer:
      "COMIT mengadakan berbagai kegiatan seperti seminar, workshop, pelatihan, kompetisi, diskusi teknologi, dan kegiatan pengembangan anggota.",
  },
  {
    question: "Siapa yang bisa bergabung dengan COMIT?",
    answer:
      "COMIT terbuka bagi mahasiswa dan siapa saja yang memiliki minat terhadap teknologi informasi dan ingin belajar serta berkembang bersama.",
  },
  {
    question: "Apakah harus bisa programming?",
    answer:
      "Tidak. Kamu tidak harus sudah bisa programming. COMIT memiliki berbagai bidang yang dapat disesuaikan dengan minat dan kemampuanmu.",
  },
  {
    question: "Bagaimana mendapatkan informasi terbaru?",
    answer:
      "Kamu dapat melihat halaman Announcement untuk mendapatkan informasi terbaru mengenai kegiatan, event, dan pengumuman COMIT.",
  },
];

export default function FloatingFAQ() {
  const pathname = usePathname();

  // Jangan tampilkan di halaman /internal
  if (pathname.startsWith("/internal")) {
    return null;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [openQuestion, setOpenQuestion] = useState(null);

  const toggleQuestion = (index) => {
    setOpenQuestion(
      openQuestion === index ? null : index
    );
  };

  const closeFAQ = () => {
    setIsOpen(false);
    setOpenQuestion(null);
  };

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.button
            key="faq-button"
            initial={{
              opacity: 0,
              x: 80,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: 80,
            }}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            onClick={() => setIsOpen(true)}
            className="
              pointer-events-auto
              fixed
              bottom-6
              right-6
              flex
              items-center
              gap-3
              px-5
              py-3
              rounded-full
              shadow-2xl
              text-white
              bg-blue-500
              hover:bg-blue-500
              transition-colors
            "
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-full border border-white/50 font-bold">
              ?
            </span>

            <span className="font-semibold">
              Tanya COMIT
            </span>
          </motion.button>
        ) : (
          <motion.div
            key="faq-panel"
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 30,
              scale: 0.95,
            }}
            transition={{
              duration: 0.25,
            }}
            className="
              pointer-events-auto
              fixed
              bottom-6
              right-6
              w-[360px]
              max-w-[calc(100vw-32px)]
              bg-white
              rounded-2xl
              shadow-2xl
              overflow-hidden

              max-sm:left-1/2
              max-sm:right-auto
              max-sm:-translate-x-1/2
              max-sm:bottom-5
            "
          >
            {/* Header */}
            <div className="bg-blue-500 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg">
                  Tanya COMIT
                </h3>

                <p className="text-sm text-white/80">
                  Ada yang ingin kamu ketahui?
                </p>
              </div>

              <button
                onClick={closeFAQ}
                className="
                  w-9
                  h-9
                  flex
                  items-center
                  justify-center
                  rounded-full
                  hover:bg-blue-500
                  transition-colors
                "
              >
                ✕
              </button>
            </div>

            {/* Questions */}
            <div className="max-h-[450px] overflow-y-auto">
              {faqData.map((faq, index) => {
                const isQuestionOpen =
                  openQuestion === index;

                return (
                  <div
                    key={index}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <button
                      onClick={() =>
                        toggleQuestion(index)
                      }
                      className="
                        w-full
                        flex
                        items-center
                        justify-between
                        gap-4
                        text-left
                        p-4
                        hover:bg-gray-50
                        transition-colors
                      "
                    >
                      <span className="font-medium text-gray-800">
                        {faq.question}
                      </span>

                      <motion.span
                        animate={{
                          rotate: isQuestionOpen
                            ? 180
                            : 0,
                        }}
                        className="text-blue-500 shrink-0 font-bold"
                      >
                        ↓
                      </motion.span>
                    </button>

                    <AnimatePresence>
                      {isQuestionOpen && (
                        <motion.div
                          initial={{
                            height: 0,
                            opacity: 0,
                          }}
                          animate={{
                            height: "auto",
                            opacity: 1,
                          }}
                          exit={{
                            height: 0,
                            opacity: 0,
                          }}
                          className="overflow-hidden"
                        >
                          <p className="px-4 pb-4 text-sm leading-relaxed text-gray-600">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}