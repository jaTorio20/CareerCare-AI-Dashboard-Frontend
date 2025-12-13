import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react' 
import { useMutation, useSuspenseQuery, queryOptions} from '@tanstack/react-query'
import { getDetailLetter, updateCoverLetter} from '@/api/coverLetter'
import CoverLetterEditor from '@/components/CoverLetterEditor'

const coverLetterQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ['cover-letter', id],
    queryFn: () => getDetailLetter(id),
  })
}

export const Route = createFileRoute('/cover-letter/$coverLetterId/edit')({
  component: CoverLetterEditPage,
  loader: async ({params, context: {queryClient}}) => {
    return queryClient.ensureQueryData(coverLetterQueryOptions(params.coverLetterId))
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
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync();
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Description:</label><br />
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={10}
            cols={50}
            required
          />
        </div>
        <div>
          <label>Job Title:</label>
          <input type="text" 
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Company Name:</label>
          <input type="text" 
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        {/* <div>
          <label>Your Details (optional):</label><br />
          <textarea
            value={userDetails}
            onChange={(e) => setUserDetails(e.target.value)}
            rows={5}
            cols={50}
          />
        </div> */}


        <CoverLetterEditor
          initialHTML={editedLetter}
          onChange={(html) => setEditedLetter(html)}
        />

        <div className="pt-4">
          <button
            disabled={isPending}
            type="submit"
            className=" disabled
            w-full rounded-lg bg-linear-to-r
            from-blue-600 to-indigo-600 
            px-6 py-3 text-white font-semibold 
            shadow-md hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? 'Updating...' : 'Update Cover Letter'}
          </button>
        </div>
      </form>    
    </>
  )
}
