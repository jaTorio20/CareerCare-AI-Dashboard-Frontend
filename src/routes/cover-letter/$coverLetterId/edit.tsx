import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/cover-letter/$coverLetterId/edit')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/cover-letter/$coverLetterId/edit"!</div>
}
