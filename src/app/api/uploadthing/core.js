import { createUploadthing } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Tentukan endpoint "imageUploader"
  imageUploader: f({ 
    image: { 
      maxFileSize: "1MB", 
      maxFileCount: 1 
    } 
  })
    .middleware(async () => {
      // Simulasi auth, bisa ganti dengan session asli nanti
      return { userId: "anonymous" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // Kode ini jalan di server setelah upload sukses
      console.log("Upload selesai untuk:", metadata.userId);
      console.log("URL file:", file.url);

      return { uploadedBy: metadata.userId };
    }),
};