import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/resume/analyze')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/resume/analyze"!</div>
}
