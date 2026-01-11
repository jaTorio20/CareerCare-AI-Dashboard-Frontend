import api from "@/lib/axios";
import type { JobApplicationEntry } from "@/types";


// Upload resume and create a Job Application entry
export async function createJobApplication({
  file,
  companyName,
  jobTitle,
  jobLink,
  jobDescription,
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
  jobDescription?: string;
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
  if (jobDescription) formData.append("jobDescription", jobDescription);
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
    // console.error("Failed to create job application:", err);
    throw err;
  }

}

//GET all the job application
interface JobApplicationPageData {
  data: JobApplicationEntry[];
  nextCursor: string | null;
}

interface GetJobApplicationParams {
  cursor?: string;
  limit?: number;
  search?: string;
}

export const getJobApplication = async ({
  cursor,
  limit = 9,
  search = '',
}: GetJobApplicationParams): Promise<JobApplicationPageData> => {
  // await new Promise((resolve) => setTimeout(resolve, 3000));
  const { data } = await api.get('/job-application', {
    params: { cursor, limit, search },
  });
  return data;
};


//GET detail job application
export const getDetailApplication = async (id: string): Promise<JobApplicationEntry> => {
  const {data} = await api.get(`/job-application/${id}`);
  return data;
}

// Delete job application
export const deleteJobApplication = async (id: string): Promise<void> => {
  await api.delete(`/job-application/${id}`)
}

// UPDATE job application
export const updateJobApplication = async (
  id: string,
  updatedApplication:{
    jobTitle: string;
    companyName: string;
    jobLink?: string;
    jobDescription?: string;
    status?: JobApplicationEntry["status"];
    location?: JobApplicationEntry["location"];
    notes?: string;
    salaryRange?: string;
    file?: File;           // new resume file (optional)
  }
): Promise<JobApplicationEntry> => {
  const formData = new FormData();
  formData.append("companyName", updatedApplication.companyName);
  formData.append("jobTitle", updatedApplication.jobTitle);


  if (updatedApplication.jobLink) formData.append("jobLink", updatedApplication.jobLink);
  if (updatedApplication.jobDescription) formData.append("jobDescription", updatedApplication.jobDescription);
  if (updatedApplication.status) formData.append("status", updatedApplication.status);
  if (updatedApplication.location) formData.append("location", updatedApplication.location);
  if (updatedApplication.notes) formData.append("notes", updatedApplication.notes);
  if (updatedApplication.salaryRange) formData.append("salaryRange", updatedApplication.salaryRange);

  // Append file if user selected a new one
  if (updatedApplication.file) {
    formData.append("resumeFile", updatedApplication.file);
  }

  const { data } = await api.put<JobApplicationEntry>(
    `/job-application/${id}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return data;
};


// GET file
export async function getDownloadFile(id: string): Promise<void> {
  const res = await api.get(`/job-application/${id}/download`, {
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

