import api from "@/lib/axios";
import type { CreateResumeInput, ResumeEntry } from "@/types";

// Analyze resume (preview only, not saved)
export async function analyzeResume({
  file,
  jobDescription,
}: {
  file: File
  jobDescription: string
}): Promise<{ jobId: string }> {
  const formData = new FormData();
  formData.append("resumeFile", file);
  formData.append("jobDescription", jobDescription);

  const { data } = await api.post("/resumes/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return { jobId: data.jobId };
}


// Poll for completed analysis
export async function waitForAnalysis(
  jobId: string,
  maxTries = 20,
  intervalMs = 1000
) {
  for (let i = 0; i < maxTries; i++) {
    try {
      const { data } = await api.get(`/resumes/temp`, {
        params: { jobId },
      });

      if (data?.analysis) {
        return data;
      }
    } catch (err: any) {
    }

    await new Promise(res => setTimeout(res, intervalMs));
  }

  throw new Error("Analysis timed out");
}

// Save resume (creates card in DB)
export async function createResume( entry: CreateResumeInput ): Promise<ResumeEntry> {
  const { data } = await api.post("/resumes", entry);
  return data;
}

export async function getResumes(): Promise<ResumeEntry[]> {

  const { data } = await api.get('/resumes', )
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

// Delete temporary resume 
export const deleteTempResume = async (id: string) => {
  return api.delete(`/resumes/temp/${id}`);
};

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