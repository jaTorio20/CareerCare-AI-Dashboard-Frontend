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
  file?: File;
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
  formData.append("companyName", companyName);
  formData.append("jobTitle", jobTitle);

  // Optional fields
  if(file) formData.append("resumeFile", file);
  if (jobLink) formData.append("jobLink", jobLink);
  if (status) formData.append("status", status);
  if (location) formData.append("location", location);
  if (notes) formData.append("notes", notes);
  if (salaryRange) formData.append("salaryRange", salaryRange);
  if (userId) formData.append("userId", userId);

  try {
    const { data } = await api.post<JobApplicationEntry>("/job-application", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  } catch (err){
    console.error("Failed to create job application:", err);
    throw err;
  }

}

//GET all the job application
export const getJobApplication = async (): Promise<JobApplicationEntry[]> => {
  const {data} = await api.get(`/job-application`);
  return data;
}

//GET detail job application
export const getDetailApplication = async (applicationId: string): Promise<JobApplicationEntry> => {
  const {data} = await api.get(`/job-application/${applicationId}`);
  return data;
}

// Delete job application
export const deleteJobApplication = async (applicationId: string): Promise<void> => {
  await api.delete(`/job-application/${applicationId}`)
}

// UPDATE job application
export const updateJobApplication = async (
  applicationId: string,
  updatedApplication: Partial<{
    jobTitle: string;
    companyName: string;
    jobLink: string;
    status: JobApplicationEntry["status"];
    location: JobApplicationEntry["location"];
    notes: string;
    salaryRange: string;
    resumeFile: string;   // Cloudinary secure_url
    publicId: string;     // Cloudinary public_id
  }>
): Promise<JobApplicationEntry> => {
  const { data } = await api.put<JobApplicationEntry>(
    `/job-application/${applicationId}`,
    updatedApplication
  );
  return data;
};

// GET file
export async function getDownloadFile(id: string): Promise<void> {
  const res = await api.get(`/applications/${id}/download`, {
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

