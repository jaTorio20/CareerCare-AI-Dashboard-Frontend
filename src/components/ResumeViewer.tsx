type Props = {
  applicationId: string;
  resumeFileUrl: string;
};

export function ResumeViewer({ resumeFileUrl }: Props) {
  if (resumeFileUrl?.endsWith(".pdf")) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-96 border rounded-md">
        <p className="mb-4 text-gray-600">No preview available for PDF files.</p>
      </div>
    );
  }

  if (resumeFileUrl?.endsWith(".docx")) {
    return (
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(resumeFileUrl)}`}
        className="w-full h-96 border rounded-md"
        title="Resume DOCX Preview"
      />
    );
  }

  return (
    <a
      href={resumeFileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 hover:underline"
    >
      View Resume
    </a>
  );
}
