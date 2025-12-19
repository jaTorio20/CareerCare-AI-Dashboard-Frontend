import api from "@/lib/axios";
import type { ResumeEntry, ResumeAnalysis } from "@/types";
import { getStoredAccessToken } from "@/lib/authToken";

// Analyze resume (preview only, not saved)
export async function analyzeResume({
  file,
  jobDescription,
}: {
  file: File
  jobDescription: string
}): Promise<{
  resumeFile: string
  publicId: string 
  originalName: string
  jobDescription: string
  analysis: ResumeAnalysis

}> {
  const formData = new FormData();
  formData.append("resumeFile", file);
  formData.append("jobDescription", jobDescription);

  const { data } = await api.post("/resumes/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

  return data // shape: { resumeFile, jobDescription, analysis }
}

// Save resume (creates card in DB)
export async function createResume(entry: Omit<ResumeEntry, "_id" | "createdAt" | "updatedAt">): Promise<ResumeEntry> {
  const { data } = await api.post("/resumes", entry)
  return data // full ResumeEntry with _id, timestamps
}

// Fetch all resumes
// export async function getResumes(): Promise<ResumeEntry[]> {
//   const { data } = await api.get("/resumes")
//   return data
// }

export async function getResumes(): Promise<ResumeEntry[]> {
  const token = getStoredAccessToken() // get token from memory
  if (!token) throw new Error('No access token available') // avoid 401

  const { data } = await api.get('/resumes', {
    headers: {
      Authorization: `Bearer ${token}`, // attach token
    },
  })
  return data
}

// Fetch single resume by id
export async function getResume(id: string): Promise<ResumeEntry> {
  const { data } = await api.get(`/resumes/${id}`)
  return data
}

// Delete resume
export async function deleteResume(id: string): Promise<void> {
  await api.delete(`/resumes/${id}`)
}

export async function getDownloadFile(id: string): Promise<void> {
  const res = await api.get(`/resumes/${id}/download`, {
    responseType: "blob", //expect binary data instead of JSON
  });

  // Create a blob URL
  const url = window.URL.createObjectURL(new Blob([res.data]));

  // Extract filename from Content-Disposition header (set by backend)
  const contentDisposition = res.headers["content-disposition"];
  let fileName = "resume.pdf"; // fallback
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="(.+)"/);
    if (match?.[1]) {
      fileName = match[1];
    }
  }

  // Trigger download
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.URL.revokeObjectURL(url);
}