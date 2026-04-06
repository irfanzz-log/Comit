"use client";
import { UploadButton } from "@uploadthing/react";

export default function MyUploadButton() {
  return (
    <div className="p-5 bg-blue-600/80 w-1/2 text-center rounded-md cursor-pointer text-white hover:text-blue-700">
        <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        alert("Upload Selesai! URL: " + res[0].url);
      }}
      onUploadError={(error) => {
        alert(`Error: ${error.message}`);
      }}
    />
    </div>
  );
}