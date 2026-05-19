"use client";

import { useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";

export default function MyUploadButton({ setImgUrl, setFileKey }) {
  const [fileName, setFileName] = useState("");

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      setImgUrl(res[0].url);
      setFileKey(res[0].key);
    },
    onUploadError: (err) => {
      alert(err.message);
    },
  });

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    await startUpload([file]);
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer">
        {isUploading ? "Uploading..." : "Pilih Foto Acara"}
        <input
          type="file"
          className="hidden"
          onChange={handleUpload}
          accept="image/png, image/jpeg"
        />
      </label>

      {fileName && <p className="text-sm text-gray-600">{fileName}</p>}
      <p className="text-xs text-gray-500">Maksimal 5MB (JPG/PNG)</p>
    </div>
  );
}