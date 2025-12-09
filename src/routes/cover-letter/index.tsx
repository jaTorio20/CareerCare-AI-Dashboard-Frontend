import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cover-letter/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cover-letter/"!</div>
}
