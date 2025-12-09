import api from "@/lib/axios";
import type { ResumeEntry, ResumeAnalysis } from "@/types";

// Analyze resume (preview only, not saved)
export async function analyzeResume(file: File, jobDescription: string): Promise<ResumeAnalysis> {
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

