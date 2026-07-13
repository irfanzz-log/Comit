"use client";

import { useEffect, useState } from "react";
import HeaderSectionBody from "@/component/internal/HeaderSectionBody";
import Aside from "@/component/internal/Aside";
import { useAuth } from "@/app/context/AuthContext";

export default function Certificate() {

    const [templates, setTemplates] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [showTemplateDropdown, setShowTemplateDropdown] = useState(false);
    const { user } = useAuth();

    const [form, setForm] = useState({
        template_id: "",
        certificate_number: "",
        participant_name: "",
        activity_name: "",
        activity_info: "",
        issue_date: "",
        signer_name: "",
        signer_position: "",
        qr_code: ""
    });

    useEffect(() => {
        getTemplates();
    }, []);

    async function getTemplates() {
        const res = await fetch("/api/certificates/template");
        const data = await res.json();

        if (res.ok) {
            setTemplates(data.data);
        }
    }

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const res = await fetch("/api/certificates", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(form)
        });

        const data = await res.json();

        if (res.ok) {
            alert("Sertifikat berhasil dibuat");

            setForm({
                template_id: "",
                certificate_number: "",
                participant_name: "",
                activity_name: "",
                activity_info: "",
                issue_date: "",
                signer_name: "",
                signer_position: "",
                qr_code: ""
            });
        } else {
            alert(data.message);
        }
    }

    if (user?.user_role === 'developer' || user?.user_role === 'sekretaris' || user?.user_role === 'superadmin') {
    } else {
        return null;
    }

    return (
        <div className="main relative w-full h-screen flex flex-row bg-gray-100 overflow-x-hidden">
            <Aside />
            <main className="py-2 px-2 scrollbar-hide w-full h-screen overflow-y-scroll">
                <section className="main-section bg-white h-screen relative w-full rounded-lg shadow-md">
                    <HeaderSectionBody
                        title="Data Absensi"
                    />
                    <div className="main-section_body p-5">

                        <div className="main-section_content mb-6">
                            <h1 className="text-xl font-bold">
                                Data Sertifikat
                            </h1>

                            <p className="text-gray-500">
                                Informasi sertifikat
                            </p>
                        </div>

                        <div>

                        </div>

                        <div>
                            <h2 className="text-lg font-bold">Buat Sertifikat</h2>
                            <form
                            onSubmit={handleSubmit}
                            className="grid md:grid-cols-2 gap-5"
                        >

                            <div>
                                <label className="font-medium">
                                    Template
                                </label>

                                <div className="flex flex-col relative">
                                    <button type="button" className="mt-2 border-[0.5px] border-gray-300 rounded-lg w-full p-3" onClick={() => { setShowTemplateDropdown(!showTemplateDropdown) }}>
                                        {selectedTemplate ? selectedTemplate.name : "Pilih Template"}
                                    </button>
                                    <div className={`absolute top-15 left-0 w-full bg-white border-[0.5px] ${showTemplateDropdown ? 'block' : 'hidden'} border-gray-300 rounded-lg shadow-md z-10`}>
                                        {templates.map((template) => (
                                            <div
                                                key={template.id}
                                                className="p-3 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => {
                                                    setForm({ ...form, template_id: template.id });
                                                    setSelectedTemplate(template);
                                                    setShowTemplateDropdown(false);
                                                }}
                                            >
                                                {template.name}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label>Nomor Sertifikat</label>

                                <input
                                    type="text"
                                    name="certificate_number"
                                    value={form.certificate_number}
                                    onChange={handleChange}
                                    className="mt-2 border-[0.5px] border-gray-300 rounded-lg w-full p-3"
                                    required
                                />
                            </div>

                            <div>
                                <label>Nama Peserta</label>

                                <input
                                    type="text"
                                    name="participant_name"
                                    value={form.participant_name}
                                    onChange={handleChange}
                                    className="mt-2 border-[0.5px] border-gray-300 rounded-lg w-full p-3"
                                    required
                                />
                            </div>

                            <div>
                                <label>Nama Kegiatan</label>

                                <input
                                    type="text"
                                    name="activity_name"
                                    value={form.activity_name}
                                    onChange={handleChange}
                                    className="mt-2 border-[0.5px] border-gray-300 rounded-lg w-full p-3"
                                    required
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label>Informasi Kegiatan</label>

                                <textarea
                                    rows="4"
                                    name="activity_info"
                                    value={form.activity_info}
                                    onChange={handleChange}
                                    className="mt-2 border-[0.5px] border-gray-300 rounded-lg w-full p-3"
                                />
                            </div>

                            <div>
                                <label>Tanggal Terbit</label>

                                <input
                                    type="date"
                                    name="issue_date"
                                    value={form.issue_date}
                                    onChange={handleChange}
                                    className="mt-2 border-[0.5px] border-gray-300 rounded-lg w-full p-3"
                                    required
                                />
                            </div>

                            <div>
                                <label>Jabatan Penandatangan</label>

                                <input
                                    type="text"
                                    name="signer_position"
                                    value={form.signer_position}
                                    onChange={handleChange}
                                    className="mt-2 border-[0.5px] border-gray-300 rounded-lg w-full p-3"
                                />
                            </div>

                            <div>
                                <label>Nama Penandatangan</label>

                                <input
                                    type="text"
                                    name="signer_name"
                                    value={form.signer_name}
                                    onChange={handleChange}
                                    className="mt-2 border-[0.5px] border-gray-300 rounded-lg w-full p-3"
                                />
                            </div>

                            <div className="md:col-span-2 flex justify-end">

                                <button
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
                                >
                                    Buat Sertifikat
                                </button>

                            </div>

                        </form>
                        </div>

                    </div>
                </section>
            </main>

        </div>
    );
}