import { createFileRoute } from '@tanstack/react-router'
import { getCoverLetter } from '@/api/coverLetter'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'

const coverLetterQueryOptions = () => {
  return queryOptions({
    queryKey: ["cover-letters"],
    queryFn: () => getCoverLetter(),
  })
};

export const Route = createFileRoute('/cover-letter/')({
  head: () => ({
    meta: [
      { title: 'List of cover-letter', content: 'List of draft cover-letter' },
    ],  
  }),

  component: CoverLetterPage,

  loader: async ({context: {queryClient}}) => {
    return queryClient.ensureQueryData(coverLetterQueryOptions())
  }

});


function CoverLetterPage() {
  const {data: letters} = useSuspenseQuery(coverLetterQueryOptions());

  return (
    <div>
      <div>
        <Link to={`/cover-letter/generate`}>Generate Cover Letter</Link>
      </div>
      <div>
        {letters.length === 0 ? (
          <p>No cover letter drop yet.</p>
        ) : (
        <ul className="space-y-4">
          {letters.map((letter) => (

              <li key={letter._id} className="border rounded p-4 shadow-sm">
                <Link to={letter._id}>
                  <h3 className="font-semibold text-lg">Job Description</h3>
                  <p className="text-gray-700 mb-2">{letter.jobDescription}</p>
                  <p className="text-gray-700 mb-2">Job Title: {letter.jobTitle}</p>
                  <p className="text-gray-700 mb-2">Company Name: {letter.companyName}</p>

                  <div className="text-sm text-gray-500">
                    {/* <p>Created: {new Date(letter.createdAt).toLocaleString()}</p> */}
                    <p>Updated: {new Date(letter.updatedAt).toLocaleString()}</p>
                  </div>
                </Link>
              </li>

          ))}
        </ul>
          )}
      </div>
    </div>
  )

}
