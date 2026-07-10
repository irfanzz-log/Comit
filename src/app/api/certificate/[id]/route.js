import { pdf } from "@react-pdf/renderer";
import Certificate from "@/component/CertificatePreview";

export async function GET(request, { params }) {
  const data = {
    nama: "John Doe",
    kegiatan: "Pelatihan Next.js",
  };

  const blob = await pdf(
    <Certificate data={data} />
  ).toBlob();

  const arrayBuffer = await blob.arrayBuffer();

  return new Response(arrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'inline; filename="sertifikat.pdf"',
    },
  });
}