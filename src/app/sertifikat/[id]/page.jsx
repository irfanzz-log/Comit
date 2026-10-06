import { query } from "@/lib/db";
import CertificatePreview from "@/component/CertificatePreview";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { id } = await params;

  let result;
  try {
    result = await query(
      `
        SELECT c.*, t.background
        FROM certificates c
        JOIN certificate_templates t
          ON t.id = c.template_id
        WHERE c.id = $1
      `,
      [id]
    );
  } catch {
    // Query di atas melempar error PostgreSQL (mis. "invalid input syntax
    // for type uuid") ketika id bukan UUID yang valid — itu sama dengan
    // "sertifikat tidak ditemukan", jadi 404, bukan 500.
    notFound();
  }

  if (result.rowCount === 0) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 flex flex-col items-center justify-center overflow-auto py-10 px-4 sm:px-6">
      {/* Badge "CERTIFIED" */}
      <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-50 border border-emerald-200 shadow-sm mb-6">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="currentColor"
          className="text-emerald-600"
          viewBox="0 0 16 16"
          aria-hidden="true"
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
        </svg>
        <span className="text-sm font-bold tracking-[0.18em] text-emerald-700 uppercase">
          Sertifikat Terverifikasi
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-1.5">
        {result.rows[0].activity_name || "Sertifikat"}
      </h1>
      <p className="text-sm text-gray-500 text-center mb-7">
        Diterbitkan oleh COMIT &middot; Universitas Insan Pembangunan Indonesia
      </p>

      <div className="flex flex-col items-center w-full max-w-[1123px]">
        <CertificatePreview certificate={result.rows[0]} />
      </div>
    </div>
  );
}