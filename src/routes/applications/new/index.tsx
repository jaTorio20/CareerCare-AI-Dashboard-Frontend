import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/applications/new/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/applications/new/"!</div>
}
