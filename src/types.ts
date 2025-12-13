// Base analysis type
export type ResumeAnalysis = {
  atsFriendly: boolean;
  atsSuggestions: string[];
  jobFitPercentage: number;
  jobFitSuggestions: string[];
}

// Saved resume entry (card)
export type ResumeEntry = {
  _id: string;
  userId?: string;
  publicId: string;
  resumeFile: string;
  jobDescription?: string;
  analysis: ResumeAnalysis;
  createdAt: string;
  updatedAt: string;
}

export type CoverLetterEntry = {
  _id: string;
  userId?: string;
  jobDescription: string;
  jobTitle: string;
  companyName: string;
  userDetails?: string;
  generatedLetter: string;
  editedLetter: string;
  createdAt: string;
  updatedAt: string;
} 
