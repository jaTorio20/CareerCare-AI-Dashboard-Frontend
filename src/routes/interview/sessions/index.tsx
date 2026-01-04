import { createFileRoute } from '@tanstack/react-router'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {sendChatMessage, sendAudioMessage } from '@/api/interview'
import { useState, useRef, useEffect } from 'react'
import type { InterviewMessage } from '@/types'
import ResponsiveSidebar from '@/components/Interview/ResponsiveSidebar'
import AudioRecorder from '@/components/Interview/AudioRecorder'
import AudioMessage from '@/components/Interview/AudioMessage'
import { deleteSessions } from '@/api/interview'
import AITypingIndicator from '@/components/Interview/AITypingIndicator'
import { v4 as uuidv4 } from "uuid";
import { sessionsQueryOptions, messagesQueryOptions } from '@/features/interview/interview.queries'

export const Route = createFileRoute('/interview/sessions/')({
  component: () => (
    <ProtectedRoute>
      <InterviewSessionsPage />
    </ProtectedRoute>
  ),
  // loader: async ({ context: { queryClient } }) => {
  //   await queryClient.ensureQueryData(sessionsQueryOptions())
  //   return null
  // },
})

function InterviewSessionsPage() {
  const queryClient = useQueryClient()
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

  //  --------------- Sidebar: fetch sessions -------------
  const { data: sessions } = useQuery(sessionsQueryOptions())

  // ----------- Chatroom: fetch messages for active session ----------
  const { data: messages = [] } = useQuery({
    ...messagesQueryOptions(activeSessionId!),
    enabled: !!activeSessionId,
  })
 
  // ------------------ SEND TEXT MESSAGE ------------------
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
      const tempMessageId = uuidv4();
      queryClient.setQueryData<InterviewMessage[]>(["messages", activeSessionId], (old = []) => [
        ...old,
        { _id: tempMessageId, 
          sessionId: activeSessionId!,
          role: "user",
          text, 
          createdAt: new Date().toISOString() 
        },
      ]);
      return { prevMessages, tempMessageId };
    },
    onSuccess: (data, _text, context) => {
      if (!data?.userMessage || !data?.aiMessage) return;

      queryClient.setQueryData<InterviewMessage[]>(
        ["messages", activeSessionId],
        (old = []) => {
          return old
            .map(m =>
              m._id === context?.tempMessageId ? data.userMessage : m
            )
            .concat(data.aiMessage);
        }
      );
    },
    onError: (_err, _text, context) => {
      // Rollback if error
      queryClient.setQueryData<InterviewMessage[]>(["messages", activeSessionId], context?.prevMessages ?? []);  
    },
  });

  // ---------------- SEND AUDIO -------------------
  const sendAudioMutation = useMutation({
    mutationFn: async (formData: FormData) => sendAudioMessage(formData),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["messages", activeSessionId] });
      const prevMessages = queryClient.getQueryData<InterviewMessage[]>(["messages", activeSessionId]);

      const tempAudioId = uuidv4();
      queryClient.setQueryData<InterviewMessage[]>(["messages", activeSessionId], (old = []) => [
        ...old,
        {
          _id: tempAudioId,
          sessionId: activeSessionId!,
          role: "user",
          text: "[sending audio…]",
          createdAt: new Date().toISOString(),
        },
      ]);
      return { prevMessages, tempAudioId };
    },

    onSuccess: (data, _variables, context) => {
      if (!data?.userMessage || !data?.aiMessage || !context?.tempAudioId) return;

      // Replace temporary message with actual audio message
      queryClient.setQueryData<InterviewMessage[]>(["messages", activeSessionId], (old = []) =>
        old
          .map(m => (m._id === context.tempAudioId ? data.userMessage : m))
          .concat(data.aiMessage)
      );
    },
    onError: (_err, _variables, context) => {
      // Remove temporary message if sending failed
      queryClient.setQueryData<InterviewMessage[]>(["messages", activeSessionId], (old = []) =>
        old?.filter(m => m._id !== context?.tempAudioId) ?? []
      );
    },
  });

  // ------------- DELETE SESSIONS -----------------
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

  // --------------- MESSAGE FORM SUBMIT -----------------
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentText = text; // snapshot before clearing

    // Clear immediately
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Trigger mutation with rollback
    sendMessageMutation.mutate(currentText, {
      onError: () => {
        // Rollback: restore text if mutation fails
        setText(currentText);
        if (textareaRef.current) {
          textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
      },
    });
  };

  //---------------- SCROLL TO LATEST MESSAGE --------------
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeSessionId) return;
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeSessionId]);


  return (
<div className="flex h-[calc(97dvh-var(--header-h))] bg-gray-50 w-full overflow-hidden">

  {/* Sidebar */}
  <ResponsiveSidebar
    sessions={sessions}
    activeSessionId={activeSessionId}
    setActiveSessionId={setActiveSessionId}
    deleteMutate={deleteMutate}
    isDeleting={isDeleting}
    
  />

  {/* Chat Area */}
  <main className="flex-1 flex justify-center">
    {activeSessionId ? (
      <section className='max-w-3xl w-full justify-items-center flex flex-col'>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto flex flex-col px-4 pt-2 pb-4">
          {messages.length === 0 ? (
            <div className="text-center items-center text-gray-400 text-sm pt-20">
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
                    {/* Only show text if this is a text message*/}
                    {!m.audioUrl && m.text && (
                      <p className="whitespace-pre-wrap">{m.text}</p>
                    )}

                    {/* Only show audio player if message has audio */}
                    {m.audioUrl && (
                      <div className="">
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
          {sendMessageMutation.isPending && !sendAudioMutation.isPending && (
            <div className="flex justify-start">
              <div className="rounded-2xl border bg-white px-4 py-2">
                <AITypingIndicator />
              </div>
            </div>
          )}

          {/* scroll target */} 
          <div ref={messagesEndRef} />
        </div>

          {/* Input Area */}
          <form
            onSubmit={handleSubmit}
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
              onKeyDown={(e) => { 
                if (e.key === "Enter" && !e.shiftKey) { 
                  e.preventDefault();
                  (e.target as HTMLTextAreaElement).form?.requestSubmit();
                  } 
                }}
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
      </section>
    ) : (
      <section className='max-w-3xl justify-items-center flex flex-col'>
        <div className="flex flex-1 items-center justify-center text-gray-500 text-sm">
          Select or start a session to begin your AI interview
        </div>
      </section>
    )}
  </main>
</div>

  )
}
