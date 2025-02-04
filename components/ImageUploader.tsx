"use client";

import { useState } from "react";
import Image from 'next/image'

export default function ImageUploader({ onUpload }: { onUpload: (file: File) => void }) {
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onUpload(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" id="fileInput" />
      <label htmlFor="fileInput" className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md">
        Upload Image
      </label>
      {preview && <Image src={preview} alt="Preview" className="mt-4 w-64 h-64 object-cover rounded-lg" />}
    </div>
  );
}
