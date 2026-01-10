import { createFileRoute } from '@tanstack/react-router'
import { getCoverLetter } from '@/api/coverLetter'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import ProtectedRoute from '@/components/ProtectedRoute'
import { Plus } from 'lucide-react'
import { CoverLetterSkeleton } from '@/components/cover-letter/CoverLetterSkeleton'
import { Suspense } from 'react'

const coverLetterQueryOptions = () => {
  return queryOptions({
    queryKey: ["cover-letters"],
    queryFn: () => getCoverLetter(),
  })
};

export const Route = createFileRoute('/cover-letter/')({
  head: () => ({
    meta: [
      { title: 'List of cover-letter', content: 'List of draft cover-letter' },
    ],  
  }),

  component: () => (
    <ProtectedRoute>
      <Suspense fallback={<CoverLetterSkeleton />}>
        <CoverLetterPage />
      </Suspense>
    </ProtectedRoute>
  ),

  // loader: async ({context: {queryClient}}) => {
  //   return queryClient.ensureQueryData(coverLetterQueryOptions())
  // }

});


function CoverLetterPage() {
  const {data: letters} = useSuspenseQuery(coverLetterQueryOptions());

  return (
<div className="max-w-5xl mx-auto px-6 py-10">
  {/* Header */}
  <div className="flex items-center justify-between mb-8">
    <h1 className="text-3xl font-bold text-gray-900">Cover Letters</h1>
    <Link
      to="/cover-letter/generate"
      className="inline-flex items-center gap-2 px-4 py-2 text-sm 
      font-medium text-white bg-indigo-600 rounded-lg shadow
       hover:bg-indigo-700 transition-colors"
    >
      <Plus className="w-4 h-4" />
      <span className="hidden md:inline">Cover Letter</span>

    </Link>
  </div>

  {/* Empty State */}
  {letters.length === 0 ? (
    <Link 
      to="/cover-letter/generate"
      className="flex flex-col items-center justify-center py-16
      hover:border-indigo-400 
       border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
      <Plus className="w-12 h-12 hover:text-indigo-400 
       text-gray-400" />
      <p className="text-gray-500
       text-lg">No cover letters yet.</p>

    </Link>
  ) : (
    /* Responsive Grid of Cover Letter Cards */
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {letters.map((letter) => (
        <li
          key={letter._id}
          className="group relative bg-white border border-gray-200 
          rounded-xl shadow-sm hover:shadow-lg transition-shadow 
          p-6 flex flex-col"
        >
          <Link to={letter._id} className="flex flex-col h-full">
            {/* Job Info */}
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {letter.jobTitle || "Untitled Position"}
            </h3>
            <p className="text-sm text-gray-700 mb-1">
              <span className="font-medium">Company:</span> {letter.companyName}
            </p>
            <p className="text-sm text-gray-700 mb-3 line-clamp-3">
              {letter.jobDescription}
            </p>

            {/* Footer */}
            <div className="mt-auto text-xs text-gray-500">
              Updated: {new Date(letter.updatedAt).toLocaleString()}
            </div>
          </Link>

          {/* Decorative hover ring */}
          <div className="absolute inset-0 rounded-xl ring-2 ring-transparent
           group-hover:ring-indigo-200 transition pointer-events-none"></div>
        </li>
      ))}
    </ul>
  )}
</div>

  )

}
