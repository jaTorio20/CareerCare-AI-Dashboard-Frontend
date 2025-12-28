import { createFileRoute, useNavigate, Link, notFound } from '@tanstack/react-router'
import { getDetailLetter, deleteCoverLetter } from '@/api/coverLetter'
import { queryOptions, useSuspenseQuery, useMutation} from '@tanstack/react-query'
import { exportDocx } from '@/utils/exporterDocument'
import ProtectedRoute from '@/components/ProtectedRoute'
import { toast } from 'sonner'
import NotFound from '@/components/NotFound'
import ErrorPage from '@/components/ErrorPage'
import {z} from 'zod'

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i)
const coverLetterQueryOptions = (coverLetterId: string) => {
  return queryOptions({
    queryKey: ['cover-letter', coverLetterId],
    queryFn: async () => await getDetailLetter(coverLetterId),
  })
}

export const Route = createFileRoute('/cover-letter/$coverLetterId/')({
  component: () => (
    <ProtectedRoute>
      <CoverLetterDetailsPage/>
    </ProtectedRoute>
  ),
  notFoundComponent: NotFound,
  errorComponent: ErrorPage,

  loader: async ({params, context: {queryClient}}) => {
    // Block invalid IDs
    if (!objectIdSchema.safeParse(params.coverLetterId).success) {
      throw notFound()
    }
    return queryClient.ensureQueryData(coverLetterQueryOptions(params.coverLetterId));
  }
})

function CoverLetterDetailsPage() {
  const {coverLetterId} = Route.useParams();
  const {data: letter} = useSuspenseQuery(coverLetterQueryOptions(coverLetterId))
  const navigate = useNavigate();

  const {mutateAsync, isPending} = useMutation({
    mutationFn: () => deleteCoverLetter(coverLetterId),
    onSuccess: () => {
      navigate({to: '/cover-letter'});
      toast.success('Deleted Successfully!')
    },
    onError: (err: any) => {
      toast.error(err?.message || "Something went wrong. Please try again.");
    },
  })

  const handleDelete = async() => {
    const confirmDelete = window.confirm("Are you sure you want to delete this cover letter?");
    if (confirmDelete) {
      await mutateAsync();
    }
  }


  return (
<div className="max-w-4xl mx-auto px-6 py-12">
  {/* Header */}
  <h1 className="text-4xl font-extrabold text-gray-900 mb-10 text-center">
    Cover Letter Details
  </h1>

  {/* Card */}
  <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 space-y-8">
    {/* Job Info */}
    <div className="space-y-2">
      <p className="text-xl font-semibold text-gray-900">{letter.jobTitle}</p>
      <p className="text-lg text-gray-700">{letter.companyName}</p>
    </div>

    {/* Cover Letter Content */}
<div
  className="
    max-w-none bg-gray-50 p-6 rounded-md border border-gray-200
    overflow-y-auto max-h-[500px]
    leading-relaxed
    [&_p]:mb-4 [&_p:last-child]:mb-0
    [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4
    [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-3
    [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:mb-2
    [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4
    [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4
    [&_li]:mb-1
    [&_br]:block
  "
>
  <div dangerouslySetInnerHTML={{ __html: letter.editedLetter }} />
</div>


    {/* Action Buttons */}
    <div className="flex flex-col sm:flex-row gap-4">
      <button
        disabled={isPending}
        onClick={handleDelete}
        className="flex-1 px-5 py-3 text-sm font-medium text-white bg-red-600 rounded-lg shadow hover:bg-red-700 transition-colors disabled:opacity-50"
      >
        {isPending ? "Deleting..." : "Delete Cover Letter"}
      </button>

      <button
        onClick={() => exportDocx(letter.editedLetter)}
        className="flex-1 px-5 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition-colors"
      >
        Export as DOCX
      </button>

      <Link
        to="/cover-letter/$coverLetterId/edit"
        params={{ coverLetterId: letter._id.toString() }}
        className="flex-1 px-5 py-3 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-colors text-center"
      >
        Edit
      </Link>
    </div>
  </div>
</div>

  )
}
