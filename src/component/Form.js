'use client'

import { useState } from "react";

export default function Form() {

     // contact function ---------------------
  const [status,setStatus] = useState();
  const [log,setLog] = useState(true);

  async function handleButtonContact(e) {
    e.preventDefault();

    const res = await fetch('api/contact', {
      method : 'POST',
      headers : {'Content-Type' : 'aplication/json'},
      body : JSON.stringify({
        name : e.target.name.value,
        email : e.target.email.value,
        message : e.target.email.value
      }),
    })

    const data = await res.json();
    setStatus(data.succes ? "Terkirim!" : "Gagal");
    setLog(true);
  }

  //------------------------------------------------------------------------------

  return (
    <>
      <form className="flex flex-col bg-blue-500 p-3 rounded-md my-5 md:w-1/3 w-5/6">
        <label htmlFor="name" className="text-white">
          Nama
        </label>
        <input
          name="name"
          placeholder="Nama"
          className="bg-white border-1 border-blue-500 p-1 rounded-md focus:outline-blue-500"
          required
        />
        <label htmlFor="email" className="text-white">
          Email
        </label>
        <input
          name="email"
          type="email"
          placeholder="Email"
          className="bg-white border-1 border-blue-500 p-1 rounded-md focus:outline-blue-500"
          required
        />
        <label htmlFor="message" className="text-white">
          Pesan
        </label>
        <textarea
          type="text"
          name="message"
          placeholder="Pesan"
          className="bg-white resize-none border-1 border-blue-500 p-1 rounded-md focus:outline-blue-500"
          required
        />
        <button
          className="bg-white text-blue-500 p-2 mt-3 rounded-md cursor-pointer hover:shadow-2xl"
          type="submit"
        >
          Kirim
        </button>
      </form>
      {log && (
        <p
          className={`${
            status === "Terkirim" ? "bg-green-400" : "bg-red-500"
          } w-full text-center text-white`}
        >
          {status}
        </p>
      )}
    </>
  );
}
