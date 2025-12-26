import { createFileRoute } from '@tanstack/react-router'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSessions, getSessionMessages, sendChatMessage, sendAudioMessage } from '@/api/interview'
import { useState } from 'react'
import type { InterviewMessage } from '@/types'
import ResponsiveSidebar from '@/components/Interview/ResponsiveSidebar'
import {  } from '@/api/interview'
import AudioRecorder from '@/components/Interview/AudioRecorder'
import AudioMessage from '@/components/Interview/AudioMessage'
import { deleteSessions } from '@/api/interview'
import AITypingIndicator from '@/components/Interview/AITypingIndicator'
import { useRef } from 'react'

export const Route = createFileRoute('/interview/sessions/')({
  component: () => (
    <ProtectedRoute>
      <InterviewSessionsPage />
    </ProtectedRoute>
  ),
})

function InterviewSessionsPage() {
  const queryClient = useQueryClient()
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

  // Sidebar: fetch sessions
  const { data: sessions } = useQuery({
    queryKey: ['sessions'],
    queryFn: getSessions,
  })

  // Chatroom: fetch messages for active session
  const { data: messages } = useQuery({
    queryKey: ['messages', activeSessionId],
    queryFn: () => activeSessionId ? getSessionMessages(activeSessionId) : [],
    enabled: !!activeSessionId,
  })

  const sendMessageMutation = useMutation({
    mutationFn: (text: string) =>
      sendChatMessage({ sessionId: activeSessionId!, text }),
    onMutate: async (text: string) => {
      // Cancel ongoing fetches
      await queryClient.cancelQueries({ queryKey: ["messages", activeSessionId] });

      // Snapshot previous messages
      const prevMessages = queryClient.getQueryData<InterviewMessage[]>([
        "messages",
        activeSessionId,
      ]);

      // Optimistically add user message
      queryClient.setQueryData<InterviewMessage[]>(["messages", activeSessionId], (old = []) => [
        ...old,
        { _id: "temp-user", 
          sessionId: activeSessionId!,
          role: "user",
          text, 
          createdAt: new Date().toISOString() 
        },
      ]);
      return { prevMessages };
    },
    onSuccess: (data) => {
      console.log("Mutation success:", data);
      // Replace temp user message with actual + append AI reply
      queryClient.invalidateQueries({ queryKey: ["messages", activeSessionId] });
    },
    onError: (_err, _text, context) => {
      // Rollback if error
      queryClient.setQueryData<InterviewMessage[]>(["messages", activeSessionId], context?.prevMessages ?? []);  
    },
  });


  const sendAudioMutation = useMutation({
    mutationFn: (formData: FormData) => sendAudioMessage(formData),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["messages", activeSessionId] });
      const prevMessages = queryClient.getQueryData<InterviewMessage[]>(["messages", activeSessionId]);

      queryClient.setQueryData<InterviewMessage[]>(["messages", activeSessionId], (old = []) => [
        ...old,
        {
          _id: "temp-audio",
          sessionId: activeSessionId!,
          role: "user",
          text: "[sending audio…]",
          createdAt: new Date().toISOString(),
        },
      ]);
      return { prevMessages };
    },

    onSuccess: (data) => {
      if (!data?.userMessage || !data?.aiMessage) {
        console.error("Invalid response:", data);
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["messages", activeSessionId] });
    },
    onError: (_err, _formData, context) => {
      queryClient.setQueryData<InterviewMessage[]>(["messages", activeSessionId], context?.prevMessages ?? []);
    },
  });

  const { mutateAsync: deleteMutate, isPending: isDeleting } = useMutation({
    mutationFn: (id: string) => deleteSessions(id),
    onSuccess: (_data, id) => {
      // Refresh sessions list
      queryClient.invalidateQueries({ queryKey: ["sessions"] });

      // Clear messages cache for the deleted session
      queryClient.removeQueries({ queryKey: ["messages", id] });

      // If the deleted session was active, reset activeSessionId
      if (activeSessionId === id) {
        setActiveSessionId(null);
      }
    },
  });


  // -------------- TEXT AREA ----------------
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = useState("");
  const isDisabled = text.trim() === "";
  const handleInput = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto"; // reset
    textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
  };




  return (
<div className="flex h-[90vh] md:h-[85vh] lg:h-[80vh] bg-gray-50 mt-2">
  {/* Sidebar */}
  <ResponsiveSidebar
    sessions={sessions}
    activeSessionId={activeSessionId}
    setActiveSessionId={setActiveSessionId}
    deleteMutate={deleteMutate}
    isDeleting={isDeleting}
  />

  {/* Chat Area */}
  <main className="flex-1 flex flex-col ">
    {activeSessionId ? (
      <>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto flex flex-col justify-center px-4">
          {(!messages || messages.length === 0) ? (
            <div className="text-center text-gray-400 text-sm">
              How can I help you?
            </div>
          ) : (
            messages.map((m: any) => {
              if (!m?.role) return null;

              const isUser = m.role === "user";

              return (
                <div
                  key={m._id}
                  className={`flex my-2 ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm
                      ${isUser
                        ? "bg-indigo-600 text-white rounded-br-md"
                        : "bg-white text-gray-800 rounded-bl-md border"
                      }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text ?? ""}</p>

                    {m.audioUrl && (
                      <div className="mt-2">
                        <AudioMessage
                          sessionId={activeSessionId}
                          audioKey={m.audioUrl}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}

          {/* AI Typing */}
          {sendMessageMutation.isPending && (
            <div className="flex justify-start">
              <div className="rounded-2xl border bg-white px-4 py-2">
                <AITypingIndicator />
              </div>
            </div>
          )}
        </div>

          {/* Input Area */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.target as HTMLFormElement;
              const input = form.elements.namedItem("text") as HTMLInputElement;
              sendMessageMutation.mutate(input.value);
              input.value = "";
            }}
            className="mx-5 rounded-lg bg-gray-200 px-4 py-3 gap-2"
          >
            <textarea
              ref={textareaRef}
              name="text"
              placeholder="Type here..."
              rows={1}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onInput={handleInput}
              className="flex-1 min-w-full border text-sm resize-none
                        overflow-y-auto max-h-40 focus:outline-none border-none"
            />

            <div className='justify-end space-x-1.5 flex'>
              <button
                type="submit"
                disabled={isDisabled}
                className={`
                  rounded-xl px-4 py-2 text-sm font-medium transition
                  ${isDisabled
                    ? "bg-indigo-300 cursor-not-allowed text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"}
                `}
              >
                Send
              </button>
              
              {/* Audio Recorder */}
              <AudioRecorder
                sessionId={activeSessionId}
                onSend={sendAudioMutation.mutateAsync}
                disabled={sendAudioMutation.isPending}
              />
            </div>
          </form>
      </>
    ) : (
      <div className="flex flex-1 items-center justify-center text-gray-500 text-sm">
        Select or start a session to begin your AI interview
      </div>
    )}
  </main>
</div>

  )
}
