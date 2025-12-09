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
  resumeFile: string;
  jobDescription?: string;
  analysis: ResumeAnalysis;
  createdAt: string;
  updatedAt: string;
}
