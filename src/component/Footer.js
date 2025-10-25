'use client'

import Link from "next/link";

export default function Footer() {
  return (
    <>
      <section
        id="footer"
        className="relative md:snap-start md:content-base flex w-full md:h-auto align-center items-center bg-blue-500 flex-col"
      >
        <div className="relative z-10 w-full flex flex-col items-center md:p-10">
          <footer className="text-white">
            <div className="grid md:grid-cols-4 grid-cols-1">
              <div className="sec-1 md:col-span-2 flex flex-row md:justify-start justify-center">
                <img className="max-w-1/4 h-auto object-contain" src="./logo/commitLogo.png" alt="" />
                <img className="max-w-1/4 h-auto object-contain" src="./logo/unipi.png" alt="" />
              </div>
              <div className="sec-2 md:text-left text-center">
                <h4 className="text-xl font-bold my-2">Content</h4>
                <ul>
                  <li className="font-light text-sm">
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .getElementById("tentangKami")
                          .scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Tentang Kami
                    </Link>
                  </li>
                  <li className="font-light text-sm">
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .getElementById("divisi")
                          .scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Divisi
                    </Link>
                  </li>
                  <li className="font-light text-sm">
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .getElementById("mentor")
                          .scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Mentor
                    </Link>
                  </li>
                  <li className="font-light text-sm">
                    <Link
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .getElementById("kegiatan")
                          .scrollIntoView({ behavior: "smooth" });
                      }}
                    >
                      Kegiatan
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="sec-2 md:text-left text-center">
                <h4 className="text-xl font-bold my-2">Events</h4>
                <ul>
                  <li className="font-light text-sm">Workshop Data Analyst</li>
                  <li className="font-light text-sm">Workshop Arduio</li>
                  <li className="font-light text-sm">LDC</li>
                  <li className="font-light text-sm">Digidraw</li>
                </ul>
              </div>
            </div>
            <hr className="my-7" />
            <div className="flex justify-between p-3">
              <p>©2025</p>
              <a href="#">Comunity of Information Technology</a>
            </div>
          </footer>
        </div>
      </section>
    </>
  );
}
