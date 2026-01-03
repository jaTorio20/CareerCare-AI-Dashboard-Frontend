import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getResumes } from '@/api/resumes'
import { Link } from '@tanstack/react-router'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Plus } from 'lucide-react'
import { ResumeSkeleton } from '@/components/Resume/ResumeSkeleton'
import { Suspense } from 'react'

const resumeQueryOptions = () => {
  return queryOptions({
    queryKey: ['resumes'],
    queryFn: () => getResumes(),
  })
}

export const Route = createFileRoute('/resumes/')({
  head: () => ({
    meta: [
      { title: 'List of resumes', content: 'List of uploaded resumes' },
    ],  
  }),

  // component: ResumesPage,
    component: () => (
    <ProtectedRoute>
      <Suspense fallback={<ResumeSkeleton />}>
        <ResumesPage />
      </Suspense>
    </ProtectedRoute>
  ),

  // loader: async ({ context: { queryClient } }) => { //prefetching for faster load
  //   return queryClient.ensureQueryData(resumeQueryOptions())
  // }
})

function ResumesPage() {
  // const { data: resumes } = useSuspenseQuery(resumeQueryOptions());

  // Only fetch if the user exists
  const { data: resumes } = useSuspenseQuery(resumeQueryOptions());


  return (
<div className="max-w-7xl mx-auto px-6 py-10">
  {/* Header */}
  <div className="flex items-center justify-between mb-8">
    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
      Uploaded Resumes
    </h1>
    <Link
      to="/resumes/analyze"
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition-colors"
    >
      <Plus className="w-4 h-4" />
      <span className="hidden md:inline">+ Upload Resume</span>
    </Link>
  </div>

  {/* Empty State */}
  {resumes.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <svg
        className="w-12 h-12 text-gray-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      <p className="text-gray-500 text-lg">No resumes uploaded yet.</p>

    </div>
  ) : (
    /* Responsive Grid of Resume Cards */
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {resumes.map((resume) => (
        <li
          key={resume._id}
          className="group relative bg-white border border-gray-200 
          rounded-xl shadow-sm hover:shadow-lg hover:bg-linear-to-r
           hover:from-blue-50 hover:to-white transition-all p-6
            flex flex-col"
        >
          {/* Resume Title */}
          <p className="text-lg font-semibold text-gray-900 truncate">
            {resume.originalName}
          </p>

          {/* Metadata */}
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-500">
              Uploaded: {new Date(resume.createdAt).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">ID: {resume._id}</p>
          </div>

          {/* Action */}
          <Link
            to="/resumes/$resumeId"
            params={{ resumeId: resume._id }}
            className="mt-4 cursor-pointer inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors"
          >
            View Details
          </Link>

        </li>
      ))}
    </ul>
  )}
</div>
            
  )
}
