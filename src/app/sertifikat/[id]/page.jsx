import { query } from "@/lib/db";
import CertificatePreview from "@/component/CertificatePreview";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
  const { id } = await params;

  const result = await query(
    `
      SELECT c.*, t.background
      FROM certificates c
      JOIN certificate_templates t
        ON t.id = c.template_id
      WHERE c.id = $1
    `,
    [id]
  );

  if (result.rowCount === 0) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center justify-center overflow-auto p-6">
      <div className="flex flex-row items-center justify-center mb-4">
        <h1 className="text-2xl text-green-800 font-bold mx-2">CERTIFIED</h1>
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-check-circle" viewBox="0 0 16 16">
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05" />
        </svg>
      </div>
      <div className="flex flex-col items-center w-full max-w-[1123px]">
        <CertificatePreview certificate={result.rows[0]} />
      </div>
    </div>
  );
}