'use client'
import Aside from "@/component/internal/Aside";
import HeaderSectionBody from "@/component/internal/HeaderSectionBody";
import MyUploadButton from "@/component/UploadButton";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import Scanner from "@/component/Scanner";
import QRGenerator from "@/component/Qr";

export default function DataKegiatan() {
    const [imgUrl, setImgUrl] = useState("");
    const [fileKey, setFileKey] = useState("");
    const [onInputType, setOnInputType] = useState(false);
    const [data, setData] = useState();
    const [input, setInput] = useState({
        nameEvent: "",
        date: "",
        comment: "",
        tipe: "internal"
    });
    const { user } = useAuth();
    function handleChange(e) {
        const { name, value } = e.target;

        setInput((prev) => ({
            ...prev,
            [name]: value,
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

        if (input.nameEvent === '' || input.date === '' || input.comment === '') {
            alert('Harap lengkapi Form!');
            return;
        }

        if (user?.user_role !== 'developer' && user?.user_role !== 'sekretaris' && user?.user_role !== 'staff') {
            alert("Anda tidak memiliki izin untuk membuat acara.");
            return;
        }
        try {
            await fetch('/api/addEvents', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fileUrl: imgUrl,
                    fileKey: fileKey,
                    nameEvent: input.nameEvent,
                    date: input.date,
                    comment: input.comment,
                    tipe: input.tipe,
                    user_id: user.id
                })
            }).then((res) => res.json())
                .then((data) => {
                    console.log("succes")
                }).catch((err) => {
                    console.log("error", err)
                })

            alert("Upload Berhasil!");
            setInput({
                nameEvent: "",
                date: "",
                comment: "",
                tipe: input.tipe
            });
            setFileKey("");
            setImgUrl("");
        } catch (error) {
            console.log(error);

        }
    }
    useEffect(() => {
        const getEvent = async () => {
            try {
                const res = await fetch('/api/events?limit=1');
                const result = await res.json();

                if (!res.ok) {
                    console.log('Tidak dapat mengambil data kegiatan');
                    return;
                }

                setData(result[0]);
            } catch (err) {
                console.log('Error', err);
            }
        }

        getEvent();
    }, [])
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
                                <p>Informasi kegiatan yang terhubung dengan sistem absensi digital</p>
                                <div className="w-full border-[0.5px] border-gray-200 rounded-md my-2 p-4">
                                    <h2 className="text-2xl font-bold mb-5 md:text-left text-center">Absensi Kegiatan Mendatang</h2>
                                    <div className="flex md:flex-row flex-col">
                                        <div className="flex md:flex-row flex-col border-[0.5px] border-gray-200 rounded-md mx-5 md:my-0 my-5">
                                            <QRGenerator uuid={data?.uuid} />
                                            <div className="flex p-5 flex-col md:text-left text-center">
                                                <p className="font-bold">Nama Kegiatan : <span className="font-light">{data?.nama_acara}</span></p>
                                                <p className="font-bold">Tanggal Kegiatan : <span className="font-light">{
                                                    data?.tanggal_acara ? new Date(data.tanggal_acara).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' }) : ''}</span></p>
                                            </div>
                                        </div>
                                        <Scanner />
                                    </div>
                                </div>
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
                                                    <div className="relative flex flex-col my-2 w-1/3">
                                                        <label htmlFor="">Tipe Acara</label>
                                                        <button className={`relative bg-blue-600/80 p-2 text-white z-2 ${onInputType ? 'rounded-t-md' : 'rounded-md'}`} type="button" onClick={() => setOnInputType(!onInputType)}>
                                                            {input.tipe}
                                                        </button>
                                                        <div className={`absolute w-full bg-white flex-col -bottom-20 z-1 shadow-md ${onInputType ? 'flex' : 'hidden'}`}>
                                                            <button className="p-2 hover:bg-gray-300/80 cursor-pointer" name="tipe" onClick={(e) => { handleChange(e); setOnInputType(!onInputType) }} type="button" value="internal">Internal</button>
                                                            <button className="p-2 hover:bg-gray-300/80 cursor-pointer" name="tipe" onClick={(e) => { handleChange(e); setOnInputType(!onInputType) }} type="button" value="public">Public</button>
                                                        </div>
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

