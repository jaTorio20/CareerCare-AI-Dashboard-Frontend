import { createFileRoute, useNavigate, Link, notFound } from '@tanstack/react-router'
import { getDetailLetter, deleteCoverLetter } from '@/api/coverLetter'
import { queryOptions, useSuspenseQuery, useMutation} from '@tanstack/react-query'
import { exportDocx } from '@/utils/exporterDocument'
import ProtectedRoute from '@/components/ProtectedRoute'
import { toast } from 'sonner'
import NotFound from '@/components/NotFound'
import ErrorPage from '@/components/ErrorPage'
import {z} from 'zod'
import { File, Trash, Pencil, ArrowLeft } from 'lucide-react'

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
    <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link
        to="/cover-letter"
        className="mb-5
        inline-flex items-center gap-2 text-indigo-600
        hover:text-indigo-800 transition-colors"
      >
        <div className="flex items-center 
        justify-center w-9 h-9 rounded-full border
        border-indigo-300 hover:border-indigo-500 hover:bg-indigo-50 transition">
          <ArrowLeft size={18} />
        </div>
        <span className="text-sm font-medium">Back</span>
      </Link>

      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900 mb-10 text-center">
        Cover Letter Details
      </h1>

      {/* Card */}
      <div className="bg-white
        border border-gray-200 rounded-lg 
        shadow-lg">
        {/* Job Info */}
        <div className="space-y-2 p-6">
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
        <div className="flex flex-col sm:flex-row gap-4 my-4">
          <Link
            to="/cover-letter/$coverLetterId/edit"
            params={{ coverLetterId: letter._id.toString() }}
            className="gap-2 flex-1 flex items-center justify-center px-5 
            py-2 text-sm
             font-medium text-indigo-600
             hover:text-indigo-800 cursor-pointer
              transition-colors text-center"
          >
            <Pencil className='h-5 w-5'/>
            <span>Edit</span>
          </Link>

          <button
            onClick={() => exportDocx(letter.editedLetter)}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-2 
            text-sm font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer
             transition-colors"
          >
            <File className='h-5 w-5'/>
            <span>Export as DOCX</span>
          </button>

          <button
            disabled={isPending}
            onClick={handleDelete}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 text-sm font-medium text-red-600
             rounded-lg cursor-pointer hover:text-red-800
             transition-colors disabled:opacity-50"
          >
            {isPending ? 
            <span>
              Deleting...
            </span>
            : 
            <>
              <Trash className='h-5 w-5'/>
              <span>
                Delete Letter
              </span>
            </>
            }
          </button>

        </div>
      </div>
    </div>

  )
}
