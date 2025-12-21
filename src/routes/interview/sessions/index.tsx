import { createFileRoute } from '@tanstack/react-router'
import ProtectedRoute from '@/components/ProtectedRoute'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getSessions, getSessionMessages, sendChatMessage } from '@/api/interview'
import { useState } from 'react'
import type { InterviewMessage } from '@/types'
import ResponsiveSidebar from '@/components/Interview/ResponsiveSidebar'

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
    // Replace temp user message with actual + append AI reply
    queryClient.setQueryData<InterviewMessage[]>(["messages", activeSessionId], (old = []) => [
      ...(old?.filter((m) => m._id !== "temp-user") ?? []),
      data.userMessage,
      data.aiMessage,
    ]);
  },
  onError: (_err, _text, context) => {
    // Rollback if error
    queryClient.setQueryData<InterviewMessage[]>(["messages", activeSessionId], context?.prevMessages ?? []);  
  },
});


  return (
    <div className="flex h-screen">
      {/* Sidebar */}

        <ResponsiveSidebar
         sessions={sessions}
          activeSessionId={activeSessionId} 
          setActiveSessionId={setActiveSessionId}/>


      {/* Chatroom */}
      <main className="flex-1 p-4">
        {activeSessionId ? (
          <div>
            <div className="messages space-y-2">
              {messages?.map((m: any) => (
                <div key={m._id} className={m.role === 'user' ? 'text-right' : 'text-left'}>
                  <span className="inline-block p-2 rounded bg-gray-100">{m.text}</span>
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const input = form.elements.namedItem('text') as HTMLInputElement
                sendMessageMutation.mutate(input.value)
                input.value = ''
              }}
              className="mt-4 flex"
            >
              <input name="text" className="flex-1 border p-2 rounded" />
              <button type="submit" className="ml-2 p-2 bg-green-500 text-white rounded">
                Send
              </button>
            </form>
          </div>
        ) : (
          <p>Select or start a session to begin chatting</p>
        )}
      </main>
    </div>
  )
}
