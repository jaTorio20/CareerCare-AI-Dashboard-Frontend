import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react' 
import { useMutation, useSuspenseQuery, queryOptions} from '@tanstack/react-query'
import { getDetailLetter, updateCoverLetter} from '@/api/coverLetter'
import CoverLetterEditor from '@/components/CoverLetterEditor'
import ProtectedRoute from '@/components/ProtectedRoute'
import { toast } from 'sonner'

const coverLetterQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ['cover-letter', id],
    queryFn: () => getDetailLetter(id),
  })
}

export const Route = createFileRoute('/cover-letter/$coverLetterId/edit')({
    component: () => (
      <ProtectedRoute>
       <CoverLetterEditPage/>
      </ProtectedRoute>
    ),

  // loader: async ({params, context: {queryClient}}) => {
  //   return queryClient.ensureQueryData(coverLetterQueryOptions(params.coverLetterId))
  // }
})

function CoverLetterEditPage() {
  const navigate = useNavigate();
  const { coverLetterId } = Route.useParams();
  const { data: coverLetter } = useSuspenseQuery(coverLetterQueryOptions(coverLetterId));


  const [jobTitle, setJobTitle] = useState(coverLetter.jobTitle);
  const [companyName, setCompanyName] = useState(coverLetter.companyName);
  const [jobDescription, setJobDescription] = useState(coverLetter.jobDescription);
  const [editedLetter, setEditedLetter] = useState(coverLetter.editedLetter);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: () => updateCoverLetter(coverLetterId, {
      jobTitle,
      companyName,
      jobDescription,
      editedLetter
    }),
    onSuccess: () => {
      navigate({
        to: '/cover-letter/$coverLetterId',
        params: { coverLetterId: coverLetter._id}
      })
      toast.success('Updated successfully!')
    },
    onError: (err: any) => {
      toast.error( err?.message || "An unexpected error occurred");
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync();
  }
          {/* <div>
          <label>Your Details (optional):</label><br />
          <textarea
            value={userDetails}
            onChange={(e) => setUserDetails(e.target.value)}
            rows={5}
            cols={50}
          />
        </div> */}

  return (
<div className="max-w-4xl mx-auto px-4 py-10">
  <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
    Edit Cover Letter
  </h1>

  <form
    onSubmit={handleSubmit}
    className="bg-white border border-gray-200 rounded-xl shadow-md p-2 md:p-8 space-y-6"
  >
    {/* Job Description */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Job Description
      </label>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={8}
        required
        className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
      />
    </div>

    {/* Job Title */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Job Title
      </label>
      <input
        type="text"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
      />
    </div>

    {/* Company Name */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Company Name
      </label>
      <input
        type="text"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
      />
    </div>

    {/* Cover Letter Editor */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Cover Letter Content
      </label>
      <div className="rounded-md border border-gray-300 bg-gray-50 p-3">
        <CoverLetterEditor
          initialHTML={editedLetter}
          onChange={(html) => setEditedLetter(html)}
        />
      </div>
    </div>

    {/* Submit Button */}
    <div className="pt-4">
      <button
        disabled={isPending}
        type="submit"
        className="w-full rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Updating..." : "Update Cover Letter"}
      </button>
    </div>
  </form>
</div>
  )
}
