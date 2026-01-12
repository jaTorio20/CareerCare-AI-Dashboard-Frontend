import { createFileRoute, useNavigate, notFound, Link } from '@tanstack/react-router'
import { useState } from 'react' 
import { useMutation, useSuspenseQuery, queryOptions} from '@tanstack/react-query'
import { getDetailLetter, updateCoverLetter} from '@/api/coverLetter'
import CoverLetterEditor from '@/components/cover-letter/CoverLetterEditor'
import ProtectedRoute from '@/components/ProtectedRoute'
import { toast } from 'sonner'
import NotFound from '@/components/NotFound'
import {z} from 'zod'

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i)
const coverLetterQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ['cover-letter', id],
    queryFn: async () => await getDetailLetter(id),
  })
}

export const Route = createFileRoute('/cover-letter/$coverLetterId/edit')({
    component: () => (
      <ProtectedRoute>
       <CoverLetterEditPage/>
      </ProtectedRoute>
    ),
    notFoundComponent: NotFound,
    loader: async ({params, context: {queryClient}}) => {
    if (!objectIdSchema.safeParse(params.coverLetterId).success) {
      throw notFound()
    }
    try {
      return await queryClient.ensureQueryData(
        coverLetterQueryOptions(params.coverLetterId)
      );
    } catch (err: any) {
      if (err.response?.status === 400) {
        throw notFound();
      }
      throw err; 
    }
  }
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

  // Text limiting
  const MAX_LENGTH = 4000; // maximum allowed characters
  const handleJobDescriptionPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault(); 
    const paste = e.clipboardData.getData('text');

    const newValue = (jobDescription + paste).slice(0, MAX_LENGTH);
    setJobDescription(newValue);
  };

  return (
<div className="max-w-4xl mx-auto px-4 py-10">
  <nav className="mb-4 text-sm text-gray-500">
    <Link to="/cover-letter/$coverLetterId" params={{coverLetterId}}
      className="hover:text-indigo-600 transition-colors">
      Details
    </Link>
    <span className="mx-2">/</span>
    <span className="text-gray-900 font-medium">
      Edit Cover Letter
    </span>
  </nav>

  {/* Header */}
  <div className="mb-12 text-center">
    <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
      Edit Cover Letter
    </h1>
  </div>

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
        onPaste={handleJobDescriptionPaste}
        onChange={(e) => setJobDescription(e.target.value.slice(0, MAX_LENGTH))}
        rows={8}
        required
        className="outline-none
        w-full rounded-md border border-gray-300 bg-gray-50 p-3
         text-gray-700
         focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
      />
        <p className="text-xs text-gray-500 mt-1 text-right">
          {jobDescription.length} / {MAX_LENGTH} characters
        </p>
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
        className="outline-none
        w-full rounded-md border border-gray-300 bg-gray-50 p-3
         text-gray-700 focus:border-indigo-500 focus:ring
          focus:ring-indigo-200 transition"
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
        className="outline-none
        w-full rounded-md border
         border-gray-300 bg-gray-50 p-3 text-gray-700
          focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition"
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
        className="w-full rounded-lg bg-linear-to-r
         from-indigo-600 to-indigo-600 px-6 py-3 text-white 
         font-semibold shadow-md hover:from-indigo-700
          hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Updating..." : "Update Cover Letter"}
      </button>
    </div>
  </form>
</div>
  )
}
