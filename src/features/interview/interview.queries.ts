import { queryOptions } from '@tanstack/react-query'
import { getSessions, getSessionMessages } from '@/api/interview'

export const sessionsQueryOptions = () =>
  queryOptions({
    queryKey: ['sessions'],
    queryFn: getSessions,
  })

export const messagesQueryOptions = (sessionId: string) =>
  queryOptions({
    queryKey: ['messages', sessionId],
    queryFn: () => getSessionMessages(sessionId),
  })
