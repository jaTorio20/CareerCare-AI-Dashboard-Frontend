import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { getDetailLetter, deleteCoverLetter } from '@/api/coverLetter'
import { queryOptions, useSuspenseQuery, useMutation} from '@tanstack/react-query'
import { exportDocx } from '@/utils/exporterDocument'

const coverLetterQueryOptions = (coverLetterId: string) => {
  return queryOptions({
    queryKey: ['cover-letter', coverLetterId],
    queryFn: () => getDetailLetter(coverLetterId),
  })
}

export const Route = createFileRoute('/cover-letter/$coverLetterId/')({
  component: CoverLetterDetailsPage,
  loader: async ({params, context: {queryClient}}) => {
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
    }
  })

  const handleDelete = async() => {
    const confirmDelete = window.confirm("Are you sure you want to delete this cover letter?");
    if (confirmDelete) {
      await mutateAsync();
    }
  }


  return (
    <div>
      <p>{letter.jobTitle}</p>
      <p>{letter.companyName}</p>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: letter.editedLetter }}
      />
      <button disabled={isPending}
        onClick={handleDelete}>
        {isPending ? 'Deleting...' : 'Delete Cover Letter'}
      </button>
      <button 
        onClick={() => exportDocx(letter.editedLetter)} 
        style={{ marginTop: 12 }}
      >
        Export as DOCX
      </button>
    </div>
  )
}
