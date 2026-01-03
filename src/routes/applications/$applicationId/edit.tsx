import { createFileRoute, useNavigate, notFound } from '@tanstack/react-router'
import { useState } from 'react'
import { updateJobApplication, getDetailApplication } from '@/api/jobApplication'
import { useMutation, useSuspenseQuery, queryOptions} from '@tanstack/react-query'
import { ResumeViewer } from '@/components/Job-Application/ResumeViewer'
import ProtectedRoute from '@/components/ProtectedRoute'
import { toast } from 'sonner'
import NotFound from '@/components/NotFound'
import {z} from 'zod'

const objectIdSchema = z.string().regex(/^[a-f\d]{24}$/i)
const jobApplicationQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: ['applications', id],
    queryFn: async () => await getDetailApplication(id),
  })
}

export const Route = createFileRoute('/applications/$applicationId/edit')({
    component: () => (
      <ProtectedRoute>
       <ApplicationEditPage/>
      </ProtectedRoute>
    ),
    notFoundComponent: NotFound,
    loader: async ({params, context: {queryClient}}) => {
      if (!objectIdSchema.safeParse(params.applicationId).success) {
        throw notFound()
      }
      try {
        return queryClient.ensureQueryData(jobApplicationQueryOptions(params.applicationId))
      } catch (err: any) {
      if (err.response?.status === 400) {
        throw notFound();
      }
      throw err;         
      }
  }
})

function ApplicationEditPage() {
    const navigate = useNavigate();
    const { applicationId } = Route.useParams();
    const { data: jobApplication } = useSuspenseQuery(jobApplicationQueryOptions(applicationId));
  
  
    const [jobTitle, setJobTitle] = useState(jobApplication.jobTitle);
    const [companyName, setCompanyName] = useState(jobApplication.companyName);
    const [jobLink, setJobLink] = useState(jobApplication.jobLink);
    const [status, setStatus] = useState(jobApplication.status);
    const [location, setLocation] = useState(jobApplication.location);
    const [notes, setNotes] = useState(jobApplication.notes);
    const [salaryRange, setSalaryRange] = useState(jobApplication.salaryRange);
    const [resumeFileName, setResumeFileName] = useState(jobApplication.originalName);
    const [resumeFileUrl, setResumeFileUrl] = useState<string | undefined>(jobApplication.resumeFile);
    const [resumeFile, setResumeFile] = useState<File | null>(null);

    const { mutateAsync, isPending } = useMutation({
      mutationFn: () => updateJobApplication(applicationId, {
        jobTitle,
        companyName,
        jobLink,
        status,
        location,
        notes,
        salaryRange,
        file: resumeFile ?? undefined,
      }),
      onSuccess: (updated) => {
        setResumeFileUrl(updated.resumeFile);
        setResumeFileName(updated.originalName);
        navigate({
          to: '/applications/$applicationId/edit',
          params: { applicationId: jobApplication._id}
        })
        toast.success('Updated successfully!')
      }
    })
    

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
    await mutateAsync();
  }
  return (
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-6 mt-5">
    {/* Company Name */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
      <input
        type="text"
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        required
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
      />
    </div>

    {/* Job Title */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
      <input
        type="text"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        required
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
      />
    </div>

    {/* Job Link */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Job Link</label>
      <input
        type="url"
        value={jobLink}
        onChange={(e) => setJobLink(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
      />
    </div>

    {/* Status */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as typeof status)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
      >
        <option value="applied">Applied</option>
        <option value="interview">Interview</option>
        <option value="offer">Offer</option>
        <option value="rejected">Rejected</option>
        <option value="accepted">Accepted</option>
      </select>
    </div>

    {/* Location */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
      <select
        value={location}
        onChange={(e) => setLocation(e.target.value as typeof location)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
      >
        <option value="remote">Remote</option>
        <option value="onsite">Onsite</option>
        <option value="hybrid">Hybrid</option>
      </select>
    </div>

    {/* Notes */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={3}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
      />
    </div>

    {/* Salary Range */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
      <input
        type="text"
        value={salaryRange}
        onChange={(e) => setSalaryRange(e.target.value)}
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
      />
    </div>

    {/* Resume File */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Resume File (optional) | {resumeFileName}
      </label>


    {resumeFileUrl && <ResumeViewer
     resumeFileUrl={resumeFileUrl} 
     applicationId={applicationId}/>}

      <input
        type="file"
        onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)}
        className="w-full text-gray-700"
      />
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={isPending}
      className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
    >
      {isPending ? 'Updating...' : 'Update'}
    </button>
  </form>
  )
}
