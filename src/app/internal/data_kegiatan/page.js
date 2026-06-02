'use client'
import Aside from "@/component/internal/Aside";
import HeaderSectionBody from "@/component/internal/HeaderSectionBody";
import MyUploadButton from "@/component/UploadButton";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

export default function DataKegiatan() {
    const [imgUrl, setImgUrl] = useState("");
    const [fileKey, setFileKey] = useState("");
    const [input, setInput] = useState({
        nameEvent : "",
        date : "",
        comment : ""
    });
    const { user } = useAuth();

    function handleChange(e) {
        const {name, value} = e.target;

        setInput((prev)=> ({
            ...prev,
            [name] : value,
        }))
    }

    const handleRemove = async (e) => {
        if (e) e.preventDefault();
        if (!fileKey) return;

        try {
            const res = await fetch("/api/uploadthing/delete",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ fileKey })
                }
            )

            if (res.ok) {
                setImgUrl("");
                setFileKey("");
                console.log("Berhasil dihapus");
            }

        } catch (error) {
            console.error(error);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if  (user?.user_role !== 'developer' && user?.user_role !== 'sekretaris' && user?.user_role !== 'staff') {
            alert("Anda tidak memiliki izin untuk membuat acara.");
            return;
        }
        try {
            await fetch('/api/addEvents', {
            method : "POST",
            headers : {
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                fileUrl : imgUrl,
                fileKey : fileKey,
                nameEvent : input.nameEvent,
                date : input.date,
                comment : input.comment,
                user_id : user.id
            })
        }).then((res)=> res.json())
        .then((data)=> {
            console.log("succes", data)
        }).catch((err) => {
            console.log("error", err)
        })

        alert("Upload Berhasil!");
        setInput({
            nameEvent : "",
            date : "",
            comment : ""
        });
        setFileKey("");
        setImgUrl("");
        } catch (error) {
            console.log(error);
            
        }
    }
    return (
        <div className="main relative w-full h-screen flex flex-row bg-gray-100 overflow-x-hidden">
            <Aside />
            <main className="py-2 px-2 scrollbar-hide w-full h-screen overflow-y-scroll">
                <section className="main-section bg-white relative w-full rounded-lg shadow-md">
                    <HeaderSectionBody
                        title="Data Kegiatan"
                        profile="UP" />
                    <div className="main-section_body p-5">
                        <div className="main-section_content">
                            <div className="content-head">
                                <h1 className="text-xl font-bold">Data Kegiatan</h1>
                            </div>
                            <div className="content-body">
                                <p>Halaman ini masih dalam pengembangan. Mohon bersabar ya!</p>
                                <div className="w-full p-4 my-5 flex flex-col items-center">
                                    <h2 className="text-2xl font-bold mb-5">Jadwalkan Kegiatan</h2>
                                    <form onSubmit={handleSubmit} className="w-full">
                                        <div className="w-full flex md:flex-row flex-col-reverse">
                                            <div className="left md:w-1/2 w-full m-2">
                                                <div className="flex flex-col">
                                                    <div className="flex flex-col my-2">
                                                        <label htmlFor="">Nama Acara</label>
                                                        <input onChange={handleChange} name="nameEvent" className="p-2 border border-[0.5px] border-gray-600/80 rounded-md" type="text" placeholder="Nama acara" value={input.nameEvent} />
                                                    </div>
                                                    <div className="flex flex-col my-2 w-1/3">
                                                        <label htmlFor="">Tanggal Acara</label>
                                                        <input onChange={handleChange} name="date" className="p-2 bg-gray-50 border border-[0.5px] border-gray-600/80 rounded-md" type="date" value={input.date} />
                                                    </div>
                                                    <div className="flex flex-col my-2">
                                                        <label htmlFor="">Komentar</label>
                                                        <textarea onChange={handleChange} name="comment" className="p-2 border border-[0.5px] border-gray-600/80 rounded-md" id="" value={input.comment}></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="right md:w-1/2 w-full m-2 border-[0.5px] border-gray-300 rounded-md p-4 flex items-center justify-center">
                                                <div className="w-full text-center flex flex-col items-center gap-4">
                                                    <label className="text-sm font-medium text-gray-700">Pilih Gambar</label>

                                                    {imgUrl ? (
                                                        <div className="flex flex-col items-center w-full bg-gray-50 p-2 rounded-lg">
                                                            <img
                                                                src={imgUrl}
                                                                alt="Preview"
                                                                className="max-h-40 w-auto object-contain rounded-md shadow-sm"
                                                            />
                                                            <button
                                                                onClick={handleRemove}
                                                                className="bg-red-500 hover:bg-red-600 mt-3 text-white px-3 py-1.5 rounded-md text-xs transition-colors"
                                                            >
                                                                Ganti Gambar
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        /* Komponen Upload */
                                                        <div className="w-full flex justify-center isolate">
                                                            <MyUploadButton setImgUrl={setImgUrl} setFileKey={setFileKey} />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button type="submit" className="p-2 m-2 bg-blue-600/80 text-white rounded-md">Buat Acara</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )


}

