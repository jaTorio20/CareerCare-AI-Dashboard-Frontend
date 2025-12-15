import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/applications/$applicationId/another')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/applications/$applicationId/another"!</div>
}
