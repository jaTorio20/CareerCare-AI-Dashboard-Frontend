import api from "@/lib/axios";
import type { CoverLetterEntry } from "@/types";

// Generate cover letter (preview only, not saved)
export const generateCoverLetter = async({
  jobDescription, 
  userDetails}: {jobDescription: string, userDetails?: string}): Promise<{
    jobDescription: string,
    userDetails: string,
    generatedLetter: string,
  }> => {
  const { data } = await api.post("/cover-letter/generate", { jobDescription, userDetails })
  return data // shape: { jobDescription, userDetails, generatedLetter }
} 

// Save cover letter (creates card in DB)
export const createCoverLetter = async (entry: Omit<CoverLetterEntry, "_id" | "createdAt" | "updatedAt">): Promise<CoverLetterEntry> => {
  const { data } = await api.post("/cover-letter", entry)
  return data // full CoverLetterEntry with _id, timestamps
}
  