import { useState } from 'react';
import type { ChangeEvent } from 'react';

interface ResumeFileInputProps {
  file: File | null;
  setFile: (file: File | null) => void;
}

export default function ResumeFileInput({ file, setFile }: ResumeFileInputProps) {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null;

    if (selectedFile) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];

      if (!allowedTypes.includes(selectedFile.type)) {
        setError("Only PDF or Word documents (.doc, .docx) are allowed.");
        setFile(null);
        e.target.value = ""; 
        return;
      }
    }

    setError(null);
    setFile(selectedFile);
  };


  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Resume File (optional)
      </label>
      <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={handleFileChange}
        className="w-full text-gray-700"
      />
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      {file && !error && <p className="text-green-600 text-xs mt-1">{file.name}</p>}
    </div>
  );
}
