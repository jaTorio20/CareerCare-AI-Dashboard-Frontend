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

interface ChatResponse { 
  userMessage: InterviewMessage;
  aiMessage: InterviewMessage; 
}
// Send audio message in a session
export const sendAudioMessage = async (
  formData: FormData
): Promise<ChatResponse> => {
  const sessionId = formData.get("sessionId") as string;
  const { data } = await api.post(`/interview/sessions/${sessionId}/chat`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  // console.log("API response:", data);
  return data;
};


// Fetch signed audio URL for playback
export const getAudioUrl = async (sessionId: string, key: string): Promise<string> => {
  const { data } = await api.get<{ url: string }>(`/interview/sessions/${sessionId}/audio/${key}`);
  return data.url; // signed URL from backend
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

// Delete interview sessions
export const deleteSessions = async (id: string): Promise<void> => {
  try {
    const { data} = await api.delete(`/interview/sessions/${id}`);
    return data;
  } catch (err) {
    throw err;
  }
};
