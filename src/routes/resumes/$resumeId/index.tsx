import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery, useMutation } from '@tanstack/react-query'
import { getResume, deleteResume } from '@/api/resumes'

const resumeQueryOptions = (resumeId: string) =>{
  return queryOptions({
    queryKey: ['resume', resumeId],
    queryFn: () => getResume(resumeId)
  })
}

export const Route = createFileRoute('/resumes/$resumeId/')({
  component: ResumeDetailsPage,
  loader: async ({ params, context: { queryClient } }) => {
    return queryClient.ensureQueryData(resumeQueryOptions(params.resumeId));
  }
})

function ResumeDetailsPage() {
  const {resumeId} = Route.useParams();
  const { data: resume } = useSuspenseQuery(resumeQueryOptions(resumeId));
  const navigate = useNavigate();
  
  const { mutateAsync: deleteMutate, isPending } = useMutation({
    mutationFn: () => deleteResume(resumeId),
    onSuccess: () => {
      navigate({to: '/resumes'});
    }
  });

  const handleDelete = async() => {
    const confirmDelete = window.confirm("Are you sure you want to delete this resume?");
    if (confirmDelete) {
      await deleteMutate();
    }
  }
  return (
    <>
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Resume Details</h1>
        <div className="border p-4 rounded-md shadow-sm">
          <p className="font-medium text-lg text-gray-800 mb-2">Resume ID: {resume._id}</p>
          <p className="text-gray-600 mb-2">Uploaded At: {new Date(resume.createdAt).toLocaleString()}</p>
          <p className="mb-4">{resume.resumeFile}</p>
          <p>{resume.jobDescription}</p>

          <div> {resume.analysis && (
            <div className="mt-4">
              <h2 className="text-2xl font-semibold mb-2">Resume Analysis</h2>
              <p className="mb-2">{resume.analysis.atsFriendly}</p>
              <p className="mb-2">Job Fit Percentage: {resume.analysis.jobFitPercentage}%</p>
              <div className="mb-2">
                <h3 className="font-semibold">ATS Suggestions:</h3>
                <ul className="list-disc list-inside">
                  {resume.analysis.atsSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold">Job Fit Suggestions:</h3>
                <ul className="list-disc list-inside">
                  {resume.analysis.jobFitSuggestions.map((suggestion, index) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          )} </div>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 disabled:opacity-50"
          >
            {isPending ? 'Deleting...' : 'Delete Resume'}
          </button>
        </div>
      </div>
    </>
  )
}
