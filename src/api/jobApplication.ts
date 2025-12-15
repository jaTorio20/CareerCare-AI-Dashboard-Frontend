import api from "@/lib/axios";
import type { JobApplicationEntry } from "@/types";


// Upload resume and create a Job Application entry
export async function createJobApplication({
  file,
  companyName,
  jobTitle,
  jobLink,
  status = "applied",
  location = "remote",
  notes,
  salaryRange,
  userId,
}: {
  file: File;
  companyName: string;
  jobTitle: string;
  jobLink?: string;
  status?: JobApplicationEntry["status"];
  location?: JobApplicationEntry["location"];
  notes?: string;
  salaryRange?: string;
  userId?: string;
}): Promise<JobApplicationEntry> {
  const formData = new FormData();

  // Required fields
  formData.append("resumeFile", file);
  formData.append("companyName", companyName);
  formData.append("jobTitle", jobTitle);

  // Optional fields
  if (jobLink) formData.append("jobLink", jobLink);
  if (status) formData.append("status", status);
  if (location) formData.append("location", location);
  if (notes) formData.append("notes", notes);
  if (salaryRange) formData.append("salaryRange", salaryRange);
  if (userId) formData.append("userId", userId);

  const { data } = await api.post<JobApplicationEntry>("/job-application", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return data;
}



