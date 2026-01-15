import { createFileRoute, useNavigate, notFound, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { updateJobApplication, getDetailApplication } from '@/api/jobApplication'
import { useMutation, useSuspenseQuery, queryOptions} from '@tanstack/react-query'
import { ResumeViewer } from '@/components/Job-Application/ResumeViewer'
import ProtectedRoute from '@/components/ProtectedRoute'
import { toast } from 'sonner'
import NotFound from '@/components/NotFound'
import {z} from 'zod'
import ResumeFileInput from '@/components/Job-Application/ResumeFileInput'

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
    const [jobDescription, setJobDescription] = useState(jobApplication.jobDescription);
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
        jobDescription,
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
          to: '/applications/$applicationId',
          params: { applicationId: jobApplication._id}
        })
        toast.success('Updated successfully!')
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
  <div className="max-w-4xl mx-auto rounded-lg p-3 md:p-6 mt-5">
    <nav className="mb-4 text-sm text-gray-500">
      <Link to="/applications/$applicationId" params={{applicationId}}
       className="hover:text-indigo-600 transition-colors">
        Details
      </Link>
      <span className="mx-2">/</span>
      <span className="text-gray-900 font-medium">
        Edit application
      </span>
    </nav>

    {/* Header */}
    <div className="mb-12 text-center">
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
        Edit Application
      </h1>
    </div>

    <form onSubmit={handleSubmit} className="bg-white shadow-md p-6
    max-w-2xl mx-auto
     rounded-lg space-y-6 text-sm">
      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          required
          className="outline-none
          w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
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
          className="outline-none
          w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
        />
      </div>

      {/* Job Link */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Job Link</label>
        <input
          type="url"
          value={jobLink}
          onChange={(e) => setJobLink(e.target.value)}
          className="outline-none
          w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
        />
      </div>

      {/* Job Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
        <textarea
          value={jobDescription}
          onPaste={handleJobDescriptionPaste}
          onChange={(e) => setJobDescription(e.target.value.slice(0, MAX_LENGTH))}
          rows={3}
          className="outline-none
          w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
        />
        <p className="text-xs text-gray-500 mt-1 text-right">
          {jobDescription?.length ?? 0} / {MAX_LENGTH} characters
        </p>
      </div>

      {/* Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="outline-none
          w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
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
          className="outline-none
          w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
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
          className="outline-none
          w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
        />
      </div>

      {/* Salary Range */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
        <input
          type="text"
          value={salaryRange}
          onChange={(e) => setSalaryRange(e.target.value)}
          className="outline-none
          w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
        />
      </div>

      {/* Resume File */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Resume File (optional) {resumeFileName}
        </label>


        {resumeFileUrl && <ResumeViewer
        resumeFileUrl={resumeFileUrl} 
        applicationId={applicationId}/>}

      <ResumeFileInput file={resumeFile} setFile={setResumeFile}/>    
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
      >
        {isPending ? 'Updating...' : 'Update'}
      </button>
    </form>
  </div>
  )
}
