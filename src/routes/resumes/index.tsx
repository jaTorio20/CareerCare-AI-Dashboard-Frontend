import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/resumes/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/resume/"!</div>
}
