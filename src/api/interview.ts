import api from "@/lib/axios";
import type { InterviewSession, InterviewMessage } from "@/types";


// Create a new interview session
export const createSession = async ({
  jobTitle,
  companyName,
  topic,
  difficulty,
}: {
  jobTitle: string;
  companyName: string;
  topic: string;
  difficulty?: string;
}): Promise<InterviewSession> => {
  const { data } = await api.post("/interview/sessions", {
    jobTitle,
    companyName,
    topic,
    difficulty,
  });
  return data; // shape: InterviewSession
};

// Send a message in a session (user → AI)
export const sendChatMessage = async ({
  sessionId,
  text,
  audioUrl,
}: {
  sessionId: string;
  text: string;
  audioUrl?: string;
}): Promise<{ userMessage: InterviewMessage; aiMessage: InterviewMessage }> => {
  const { data } = await api.post(`/interview/sessions/${sessionId}/chat`, {
    text,
    audioUrl,
  });
  return data; // shape: { userMessage, aiMessage }
};

// Fetch all messages for a session
export const getSessionMessages = async (
  sessionId: string
): Promise<InterviewMessage[]> => {
  const { data } = await api.get(`/interview/sessions/${sessionId}/messages`);
  return data; // shape: InterviewMessage[]
};

export const getSessions = async (): Promise<InterviewSession[]> => {
  const { data } = await api.get("/interview/sessions");
  return data; // shape: InterviewSession[]
};