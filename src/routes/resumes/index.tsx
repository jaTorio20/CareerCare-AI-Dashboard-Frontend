import { createFileRoute } from '@tanstack/react-router'
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import { getResumes } from '@/api/resumes'
import { Link } from '@tanstack/react-router'

const resumeQueryOptions = () =>{
  return queryOptions({
    queryKey: ['resumes'],
    queryFn: () => getResumes(),
  })
}

export const Route = createFileRoute('/resumes/')({
  head: () => ({
    meta: [
      { title: 'List of resumes', content: 'List of uploaded resumes' },
    ],  
  }),

  component: ResumesPage,

  loader: async ({ context: { queryClient } }) => { //prefetching for faster load
    return queryClient.ensureQueryData(resumeQueryOptions())
  }
})

function ResumesPage() {
  const {data: resumes} = useSuspenseQuery(resumeQueryOptions());

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold mb-6">Uploaded Resumes</h1>
        {resumes.length === 0 ? (
          <p className="text-gray-600">No resumes uploaded yet.</p>
        ) : (
          <ul className="space-y-4">
            {resumes.map((resume) => (
              <li key={resume._id} className="border p-4 rounded-md shadow-sm hover:shadow-md transition-shadow">
                <p className="font-medium text-lg text-gray-800">Resume ID: {resume._id}</p> 
                <p className="text-gray-600">Uploaded At: {new Date(resume.createdAt).toLocaleString()}</p>  
                <p>{resume.resumeFile}</p>
                <Link
                  to="/resumes/$resumeId"
                  params={{ resumeId: resume._id }}
                  className="mt-2 inline-block text-blue-600 hover:underline"
                >
                  View Details
                </Link>   
              </li>
            ))}
          </ul>
        )}
      </div>                
    </>
  )
}
