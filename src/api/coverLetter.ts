import api from "@/lib/axios";
import type { CoverLetterEntry } from "@/types";

// Generate cover letter (preview only, not saved)
export const generateCoverLetter = async({
  jobDescription,
  jobTitle, 
  companyName,
  userDetails}: {jobDescription: string, jobTitle: string, companyName: string, userDetails?: string}): Promise<{
    jobDescription: string,
    jobTitle: string,
    companyName: string,
    userDetails: string,
    generatedLetter: string,
  }> => {
  const { data } = await api.post("/cover-letter/generate", { jobDescription, jobTitle, companyName, userDetails })
  return data // shape: { jobDescription, userDetails, generatedLetter }
} 

// Save cover letter (creates card in DB)
export const createCoverLetter = async (entry: Omit<CoverLetterEntry, "_id" | "createdAt" | "updatedAt">): Promise<CoverLetterEntry> => {
  const { data } = await api.post("/cover-letter", entry)
  return data // full CoverLetterEntry with _id, timestamps
}

//GET all the cover letter
export const getCoverLetter = async (): Promise<CoverLetterEntry[]> => {
  const {data} = await api.get(`/cover-letter`)
  return data;
}

//GET detail cover letter
export const getDetailLetter = async (id: string): Promise<CoverLetterEntry> => {
  const {data} = await api.get(`/cover-letter/${id}`)
  return data;
}

// Delete cover letter
export async function deleteCoverLetter(id: string): Promise<void> {
  await api.delete(`/cover-letter/${id}`)
}


  