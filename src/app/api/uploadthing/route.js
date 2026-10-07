import { createUploadthing, createRouteHandler } from "uploadthing/next";
import { getAuthPayload } from "@/lib/auth";

// Sebelumnya route ini TIDAK memeriksa token sama sekali — siapa pun
// (bahkan tanpa login) bisa upload gambar ke storage Uploadthing aplikasi
// (bandwidth/storage abuse). Bandingkan sibling /api/uploadthing/delete
// yang sudah requireRole. Middleware di bawah menutup celah itu.
//
// Upload dipakai oleh staff untuk sertifikat & galeri kegiatan, jadi
// dibatasi untuk role yang berhak.
const UPLOAD_ROLES = ["developer", "superadmin", "sekretaris", "staff"];

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const payload = getAuthPayload(req);
      if (!payload) {
        throw new Error("Unauthorized");
      }
      if (!UPLOAD_ROLES.includes(payload.role)) {
        throw new Error("Forbidden");
      }
      return { userId: payload.id, role: payload.role };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload selesai untuk user:", metadata.userId);
      return { url: file.url, key: file.key, uploadedBy: metadata.userId };
    }),
};

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
