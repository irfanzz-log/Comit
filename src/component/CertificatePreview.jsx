'use client';

import { useRef } from "react";
import { toJpeg } from "html-to-image";

function formatDate(value) {
    if (!value) return "-";
    try {
        return new Date(value).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    } catch {
        return String(value);
    }
}

export default function CertificatePreview({ certificate }) {
    const ref = useRef(null);

    const download = async () => {
        const dataUrl = await toJpeg(ref.current, {
            quality: 1,
            pixelRatio: 4,
            cacheBust: true,
        });

        const link = document.createElement("a");
        link.download = `${certificate.certificate_number}.jpg`;
        link.href = dataUrl;
        link.click();
    };

    const meta = [
        { label: "Nomor Sertifikat", value: certificate.certificate_number },
        { label: "Nama Peserta", value: certificate.participant_name },
        { label: "Kegiatan", value: certificate.activity_name },
        {
            label: "Tanggal Terbit",
            value: formatDate(certificate.issue_date),
        },
        ...(certificate.signer_name
            ? [
                  {
                      label: "Penandatangan",
                      value: [certificate.signer_name, certificate.signer_position]
                          .filter(Boolean)
                          .join(" · "),
                  },
              ]
            : []),
    ];

    return (
        <div className="w-full flex flex-col items-center gap-8">
            {/* Sertifikat */}
            <div className="w-full rounded-2xl bg-white p-3 sm:p-5 shadow-[0_18px_60px_-15px_rgba(16,24,40,0.22)] ring-1 ring-gray-200/70">
                <div
                    ref={ref}
                    className="relative w-full overflow-hidden rounded-xl aspect-[1123/794]"
                >
                    <img
                        src={certificate.background}
                        alt="Background sertifikat"
                        className="absolute inset-0 w-full h-full object-cover"
                        draggable={false}
                    />

                    <p
                        className="absolute left-1/2 -translate-x-1/2 text-[#2A2C67] font-semibold"
                        style={{ top: 88, fontSize: 13 }}
                    >
                        {certificate.participant_name}
                    </p>

                    <p
                        className="absolute left-1/2 -translate-x-1/2"
                        style={{ top: 120, fontSize: 5 }}
                    >
                        {certificate.activity_name}
                    </p>

                    <p
                        className="absolute left-11 -translate-x-1/2 font-bold opacity-75 text-center"
                        style={{ top: 25, fontSize: 5 }}
                    >
                        {certificate.certificate_number}
                    </p>

                    <p
                        className="absolute left-[54px] -translate-x-1/2 font-bold opacity-75 text-center"
                        style={{ top: 31, fontSize: 3 }}
                    >
                        {certificate.id}
                    </p>

                    <p
                        className="absolute left-1/2 -translate-x-1/2 text-center"
                        style={{ top: 150, fontSize: 2 }}
                    >
                        {certificate.activity_info}
                    </p>
                </div>
            </div>

            {/* Kartu metadata */}
            <div className="w-full max-w-3xl rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60">
                    <h2 className="text-sm font-bold text-gray-900">Detail Sertifikat</h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        Verifikasi keaslian sertifikat ini
                    </p>
                </div>

                <dl className="divide-y divide-gray-100">
                    {meta.map((item) => (
                        <div
                            key={item.label}
                            className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-6 py-3.5"
                        >
                            <dt className="text-xs font-medium uppercase tracking-wider text-gray-400 sm:w-40 shrink-0">
                                {item.label}
                            </dt>
                            <dd className="text-sm font-medium text-gray-800 break-words">
                                {item.value}
                            </dd>
                        </div>
                    ))}
                </dl>

                <div className="px-6 py-4 bg-gray-50/60 border-t border-gray-100">
                    <button
                        onClick={download}
                        className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <path d="M7 10l5 5 5-5" />
                            <path d="M12 15V3" />
                        </svg>
                        Download JPG
                    </button>
                </div>
            </div>
        </div>
    );
}
