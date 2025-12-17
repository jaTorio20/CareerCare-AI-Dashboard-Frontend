import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { getDetailApplication, getDownloadFile, deleteJobApplication } from '@/api/jobApplication'
import { queryOptions, useSuspenseQuery, useMutation} from '@tanstack/react-query'
import { StatusBadge } from '@/components/StatusBadge'

const jobApplicationQueryOptions = (applicationId: string) => {
  return queryOptions({
    queryKey: ['applications', applicationId],
    queryFn: () => getDetailApplication(applicationId),
  })
}


export const Route = createFileRoute('/applications/$applicationId/')({
  component: ApplicationDetailsPage,

  loader: async ({params, context: {queryClient}}) => {
    return queryClient.ensureQueryData(jobApplicationQueryOptions(params.applicationId));
  }
})

function ApplicationDetailsPage() {
    const {applicationId} = Route.useParams();
    const {data: jobApplication} = useSuspenseQuery(jobApplicationQueryOptions(applicationId))
    const navigate = useNavigate();

    const { mutateAsync: deleteMutate, isPending } = useMutation({
      mutationFn: () => deleteJobApplication(applicationId),
      onSuccess: () => {
        navigate({to: '/applications'});
      }
    });

    const { mutateAsync: downloadMutate, isPending: isDownload } = useMutation({
      mutationFn: () => getDownloadFile(applicationId),
      onSuccess: (data) => data, 
    });

    const handleDelete = async() => {
      const confirmDelete = window.confirm("Are you sure you want to delete this resume?");
      if (confirmDelete) {
        await deleteMutate();
      }
    }

    const handleDownload = async () => {
      try {
      await downloadMutate();
    } catch (e) {
      alert("Could not download file. Please try again.");
    }
    };

  return (
 <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 sm:p-8">
        {/* Title + Company */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {jobApplication.jobTitle}
        </h1>
        <h2 className="text-lg text-gray-700 mb-6">
          {jobApplication.companyName}
        </h2>

        {/* Status + Location */}
        <div className="flex items-center gap-3 mb-6">
          <StatusBadge status={jobApplication.status} />
          <span className="text-sm text-gray-500">
            Location: {jobApplication.location}
          </span>
        </div>

        {/* Salary Range */}
        {jobApplication.salaryRange && (
          <p className="text-gray-600 mb-4">
            <span className="font-medium text-gray-800">Salary Range:</span>{" "}
            {jobApplication.salaryRange}
          </p>
        )}

        {/* Job Link */}
        {jobApplication.jobLink && (
          jobApplication.jobLink.startsWith("http") ? (
            <a
              href={jobApplication.jobLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mb-6 text-blue-600 hover:underline text-sm"
            >
              View Job Posting
            </a>
          ) : (
            <p className="mb-6 text-gray-600 text-sm">
              {jobApplication.jobLink}
            </p>
          )
        )}

        {/* Notes */}
        {jobApplication.notes && (
          <p className="text-gray-600 mb-6">{jobApplication.notes}</p>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to={`/applications/$applicationId/edit`}
            params={{applicationId: jobApplication._id}}
             className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
          >
            Edit Application
          </Link>

          {jobApplication.originalName && (
            <button
              disabled={isDownload}
              onClick={handleDownload}
              className="flex-1 px-4 py-2 text-center cursor-pointer text-sm 
              font-medium text-blue-600 border border-blue-600
              disabled:opacity-50 rounded-md hover:bg-blue-50 transition"
            >
              { isDownload ? 'Downloading' : `Download ${ jobApplication.originalName }` }
            </button>
          )}

          <button
            onClick={handleDelete}
            disabled={isPending}
            className="flex-1 px-4 py-2 text-center cursor-pointer text-sm 
            font-medium text-red-600 border border-red-600 rounded-md 
            disabled:opacity-50 hover:bg-red-50 transition"
          >
            {isPending ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>


  )
}
