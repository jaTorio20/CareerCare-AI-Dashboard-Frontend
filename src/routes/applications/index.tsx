import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getJobApplication } from '@/api/jobApplication'
import { Link } from '@tanstack/react-router'
import { StatusBadge } from '@/components/StatusBadge'
import ProtectedRoute from '@/components/ProtectedRoute'

const jobApplicationQueryOptions = () => {
  return queryOptions({
    queryKey: ['applications'],
    queryFn: () => getJobApplication(),
  })
}

export const Route = createFileRoute('/applications/')({
  head: () => ({
    meta: [
      { title: 'Job Applications', content: 'List of Job Applied' },
    ],  
  }),

    component: () => (
      <ProtectedRoute>
       <JobApplicationPage/>
      </ProtectedRoute>
    ),

  // loader: async ({context: {queryClient}}) => {
  // return queryClient.ensureQueryData(jobApplicationQueryOptions())
  // }
})

function JobApplicationPage() {
  const {data: jobApplications} = useSuspenseQuery(jobApplicationQueryOptions());
  return (
  <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-10">
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
        Job Applications
      </h1>

      {/* New Job Application Button */}
      <Link
        to="/applications/new"
        className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
      >
        + New Application
      </Link>
    </div>
    

    {jobApplications.length === 0 ? (
      <p className="text-gray-500 text-center">No applications found.</p>
    ) : (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jobApplications.map((jobApplication: any) => (
          <div
            key={jobApplication._id}
            className="flex flex-col justify-between border border-gray-200 rounded-xl bg-white p-6 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
          >
            <div>
              <h2 className="text-lg font-semibold text-gray-800">
                {jobApplication.jobTitle}{" "}
                <span className="text-gray-500 font-normal">@ {jobApplication.companyName}</span>
              </h2>

              <div className="flex items-center gap-2 mt-3">
                <StatusBadge status={jobApplication.status} />
                <span className="text-sm text-gray-500">
                  {jobApplication.location}
                </span>
              </div>
            </div>

            <Link
              to={`/applications/$applicationId`}
              params={{applicationId: jobApplication._id}}
              className="mt-6 inline-block text-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    )}
  </div>

  )
}
