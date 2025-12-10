import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { getResume } from '@/api/resumes'

export const Route = createFileRoute('/resumes/$resumeId/')({
  component: ResumeDetailsPage,
})

function ResumeDetailsPage() {
  return <div>Hello "/resumes/$resumeId/"!</div>
}
