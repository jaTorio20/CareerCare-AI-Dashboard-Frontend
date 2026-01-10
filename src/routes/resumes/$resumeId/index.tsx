import { createFileRoute, useNavigate, notFound, Link } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery, useMutation } from '@tanstack/react-query'
import { getResume, deleteResume, getDownloadFile} from '@/api/resumes'
import ProtectedRoute from '@/components/ProtectedRoute'
import { toast } from 'sonner'
import { z } from 'zod'
import NotFound from '@/components/NotFound'
import { AnimatedStat } from '@/components/Resume/AnimatedStat'
import { FileText, Trash } from "lucide-react"; 

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i)
const resumeQueryOptions = (resumeId: string) =>
  queryOptions({
    queryKey: ['resume', resumeId],
    queryFn: () => getResume(resumeId),
  })

export const Route = createFileRoute('/resumes/$resumeId/')({
  component: () => (
    <ProtectedRoute>
      <ResumeDetailsPage />
    </ProtectedRoute>
  ),
  notFoundComponent: NotFound,
  loader: async ({ params, context: { queryClient } }) => {
    // Block invalid IDs
    if (!objectIdSchema.safeParse(params.resumeId).success) {
      throw notFound()
    }
    return queryClient.ensureQueryData(resumeQueryOptions(params.resumeId)
    )
  },
})

function ResumeDetailsPage() {
  const {resumeId} = Route.useParams();
  const { data: resume } = useSuspenseQuery(resumeQueryOptions(resumeId));
  const navigate = useNavigate();
  
  const { mutateAsync: deleteMutate, isPending } = useMutation({
    mutationFn: () => deleteResume(resumeId),
    onSuccess: () => {
      navigate({to: '/resumes'});
      toast.success('Resume deleted successfully!')
    },
    onError: (err: any) => {
      toast.error(err?.message || "Delete failed. Please try again.");
    },
  });
  const { mutateAsync: downloadMutate, isPending: isDownload } = useMutation({
    mutationFn: () => getDownloadFile(resumeId),
    onSuccess: () => {
      toast.success('Downloaded successfully!')
    },
    onError: (err: any) => {
      toast.error(err?.message || "Download failed. Please try again.");
    },
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
  <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
    <nav className="mb-4 text-sm text-gray-500">
      <Link to="/resumes" className="hover:text-indigo-600 transition-colors">
        Resumes
      </Link>
      <span className="mx-2">/</span>
      <span className="text-gray-900 font-medium">
        Resume Details
      </span>
    </nav>

    {/* Header */}
    <div className="mb-12 text-center">
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
        Resume Details
      </h1>
      <p className="mt-3 text-sm sm:text-base text-gray-500">
        Review uploaded resume information and AI-generated insights
      </p>
    </div>

    {/* Main Card */}
    <div className="bg-white border border-gray-200 rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 space-y-10">
      
      {/* Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Resume ID
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-800 break-all">
            {resume._id}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <p className="text-xs uppercase tracking-wide text-gray-500">
            Uploaded At
          </p>
          <p className="mt-1 text-sm font-semibold text-gray-800">
            {new Date(resume.createdAt).toLocaleString()}
          </p>
        </div>
      </div>

      {/* Job Description */}
      <div className="space-y-3">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
          Job Description
        </h2>
        <div className="text-sm sm:text-base text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 p-5 rounded-xl border border-gray-200 max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {resume.jobDescription || (
            <span className="italic text-gray-400">
              No job description provided.
            </span>
          )}
        </div>
      </div>

      {/* Resume Analysis */}
      {resume.analysis && (
        <div className="pt-10 border-t border-gray-200 space-y-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Resume Analysis
          </h2>

          {/* Scores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {resume.analysis.atsScore> 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <p className="text-sm text-gray-600">ATS Score</p>
              <AnimatedStat value={resume.analysis.atsScore} barClass="bg-blue-600"/>
            </div>
            )}
            {resume.analysis.keywordMatchPercentage> 0 && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
              <p className="text-sm text-gray-600">Keyword Match</p>
              <AnimatedStat value={resume.analysis.keywordMatchPercentage} barClass="bg-indigo-600" />
            </div>
            )}            
          </div>

          {/* Format Issues */}
          {resume.analysis.formatIssues?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Formatting Issues
              </h3>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700">
                {resume.analysis.formatIssues.map((issue, index) => (
                  <li key={index}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Missing Keywords */}
          {resume.analysis.missingKeywords?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Missing Keywords
              </h3>
              <ul className="flex flex-wrap gap-2">
                {resume.analysis.missingKeywords.map((keyword, index) => (
                  <li
                    key={index}
                    className="px-3 py-1 text-sm rounded-full bg-red-100 text-red-700"
                  >
                    {keyword}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Strength Keywords */}
          {resume.analysis.strengthKeywords?.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">
                Strong Keywords
              </h3>
              <ul className="flex flex-wrap gap-2">
                {resume.analysis.strengthKeywords.map((keyword, index) => (
                  <li
                    key={index}
                    className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700"
                  >
                    {keyword}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Improvement Suggestions */}
          {resume.analysis.improvementSuggestions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Improvement Suggestions
              </h3>
              <ul className="space-y-3">
                {resume.analysis.improvementSuggestions.map((s, i) => {
                  const colorMap = {
                    high: "bg-red-50 border-red-200 text-red-800",
                    medium: "bg-amber-50 border-amber-200 text-amber-800",
                    low: "bg-emerald-50 border-emerald-200 text-emerald-800",
                  };

                  return (
                    <li
                      key={i}
                      className={`p-4 rounded-xl border sm:text-base text-sm ${colorMap[s.priority]} `}
                    >
                      <span className="font-semibold capitalize">{s.priority}:</span>{" "}
                      {s.message}
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons*/}
      <div className="flex flex-col sm:flex-row gap-4
       pt-8 border-t border-gray-200">
        <button
          disabled={isDownload}
          onClick={handleDownload}
          className="cursor-pointer flex-1 flex justify-center items-center gap-2 px-3 py-2 text-sm sm:text-base
             rounded-xl transition-colors text-blue-700 hover:text-blue-900"
          >
          <FileText className="h-5 w-5"/>
          {isDownload ? 'Downloading...' : `${resume.originalName}`}
        </button>

        <button
          onClick={handleDelete}
          disabled={isPending}
          className="cursor-pointer flex-1 flex justify-center items-center gap-2 px-6 py-3 text-sm sm:text-base
          text-red-600
          hover:text-red-700
          transition-colors disabled:opacity-50"
        >
          <Trash className="h-5 w-5" />
          {isPending ? <span>Deleting...</span> : <span>Delete Resume</span>}
        </button>
      </div>
    </div>
  </div>


  )
}
