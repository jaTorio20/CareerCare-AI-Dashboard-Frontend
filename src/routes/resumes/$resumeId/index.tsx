import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery, useMutation } from '@tanstack/react-query'
import { getResume, deleteResume, getDownloadFile} from '@/api/resumes'
import ProtectedRoute from '@/components/ProtectedRoute'

const resumeQueryOptions = (resumeId: string) =>{
  return queryOptions({
    queryKey: ['resume', resumeId],
    queryFn: () => getResume(resumeId)
  })
}

export const Route = createFileRoute('/resumes/$resumeId/')({
    component: () => (
    <ProtectedRoute>
      <ResumeDetailsPage />
    </ProtectedRoute>
  ),
  // loader: async ({ params, context: { queryClient } }) => {
  //   return queryClient.ensureQueryData(resumeQueryOptions(params.resumeId));
  // }
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

  const handleDownload = async () => {
    try {
    await getDownloadFile(resumeId);
  } catch (e) {
    alert("Could not download file. Please try again.");
  }
  };


  return (
<div className="max-w-4xl mx-auto px-6 py-12">
  {/* Header */}
  <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
    Resume Details
  </h1>

  {/* Card */}
  <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 space-y-8">
    {/* Metadata */}
    <div className="grid sm:grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-medium text-gray-500">Resume ID</p>
        <p className="text-lg font-semibold text-gray-800">{resume._id}</p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">Uploaded At</p>
        <p className="text-lg font-semibold text-gray-800">
          {new Date(resume.createdAt).toLocaleString()}
        </p>
      </div>
    </div>

    {/* Job Description */}
    <div>
      <h2 className="text-xl font-semibold text-gray-900 mb-3">Job Description</h2>
      <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-4 rounded-md border border-gray-200 max-h-56 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        {resume.jobDescription}
      </div>
    </div>

    {/* Resume Analysis */}
    {resume.analysis && (
      <div className="pt-6 border-t border-gray-200 space-y-4">
        <h2 className="text-2xl font-semibold text-gray-900">Resume Analysis</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          <p className="text-gray-700">
            <span className="font-medium">ATS Status:</span>{" "}
            {resume.analysis.atsFriendly ? "✅ ATS Friendly" : "❌ Not ATS Friendly"}
          </p>
          <p className="text-gray-700">
            <span className="font-medium">Job Fit Percentage:</span>{" "}
            <span className="font-semibold text-blue-600">
              {resume.analysis.jobFitPercentage}%
            </span>
          </p>
        </div>

        {resume.analysis.atsSuggestions?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">ATS Suggestions</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {resume.analysis.atsSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}

        {resume.analysis.jobFitSuggestions?.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Job Fit Suggestions</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {resume.analysis.jobFitSuggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )}

    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
      <button
        onClick={handleDownload}
        className="flex-1 px-5 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition-colors"
      >
        Download {resume.originalName}
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="flex-1 px-5 py-3 text-sm font-medium text-white bg-red-600 rounded-lg shadow hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {isPending ? "Deleting..." : "Delete Resume"}
      </button>
    </div>
  </div>
</div>

  )
}
