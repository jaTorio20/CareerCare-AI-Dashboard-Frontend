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
  originalName: string;
  isTemp: boolean;
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

export type JobApplicationEntry = {
  _id: string;
  userId?: string;
  companyName: string;
  jobTitle: string;
  jobLink: string;
  originalName: string
  status: "applied" | "interview" | "offer" | "rejected" | "accepted";
  location: "remote" | "onsite" | "hybrid";
  notes: string;
  salaryRange: string;
  resumeFile?: string;
  publicId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewSession {
  _id: string;
  userId: string;
  jobTitle: string;
  companyName: string;
  topic: string;
  difficulty: string;
  status: "in-progress" | "completed";
  startedAt: string;
}

export interface InterviewMessage {
  _id: string;
  sessionId: string;
  role: "user" | "ai";
  text: string;
  audioUrl?: string;
  createdAt: string;
}

