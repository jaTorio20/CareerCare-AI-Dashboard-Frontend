import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cover-letter/$coverLetterId/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cover-letter/$coverLetterId/"!</div>
}
