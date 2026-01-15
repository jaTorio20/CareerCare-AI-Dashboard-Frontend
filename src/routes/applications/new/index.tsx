import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import { createJobApplication } from '@/api/jobApplication'
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'sonner';
import ResumeFileInput from '@/components/Job-Application/ResumeFileInput';

export const Route = createFileRoute('/applications/new/')({
    component: () => (
      <ProtectedRoute>
       <NewJobApplication/>
      </ProtectedRoute>
    ),
})

function NewJobApplication() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobLink, setJobLink] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [status, setStatus] = useState<'applied' | 'interview' | 'offer' | 'rejected' | 'accepted'>('applied');
  const [location, setLocation] = useState<'remote' | 'onsite' | 'hybrid'>('remote');
  const [notes, setNotes] = useState('');
  const [salaryRange, setSalaryRange] = useState('');

  const { mutateAsync, isPending } = useMutation({ //call mutateAsync if we submit a form
    mutationFn: createJobApplication,
    onSuccess: () => {
      navigate({ to: '/applications'}) //navigate is where the form navigate after submit
      toast.success('Added successfully!')
    },
    onError: (err: any) => {
      toast.error( err?.message || "An unexpected error occurred");
    }
  });

  const handleSubmit = async (e:React.FormEvent) => {
    e.preventDefault();

    if(!companyName.trim() || !jobTitle.trim()){
      alert('Please fill in the Company Name and Job Title');
      return;
    }

    try {
      await mutateAsync({
        file: file ?? undefined,
        companyName,
        jobTitle,
        jobLink,
        jobDescription,
        status,
        location,
        notes,
        salaryRange,
    // userId can be passed here for context/auth
      })
    } catch (err: any) {
      toast.error(err.mesage);
      // alert('Something went wrong');
    }
  } 
  
    // Text limiting
  const MAX_LENGTH = 2000; // maximum allowed characters
  const handleJobDescriptionPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault(); 
    const paste = e.clipboardData.getData('text');

    const newValue = (jobDescription + paste).slice(0, MAX_LENGTH);
    setJobDescription(newValue);
  };
  const handleNotesPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault(); 
    const paste = e.clipboardData.getData('text');

    const newValue = (notes + paste).slice(0, MAX_LENGTH);
    setNotes(newValue);
  };

  
  return (
  <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-2 mt-5">
    <nav className="mb-4 text-sm text-gray-500">
      <Link to="/applications" className="hover:text-blue-600 transition-colors">
        Job Applications
      </Link>
      <span className="mx-2">/</span>
      <span className="text-gray-900 font-medium">
        New application
      </span>
    </nav>

    {/* Header */}
    <div className="mb-12 text-center">
      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 tracking-tight">
        New Application
      </h1>
      <p className="mt-3 text-sm sm:text-base text-gray-500">
        Start by uploading your new job application
      </p>
    </div>
    <form onSubmit={handleSubmit} className="text-sm
      max-w-2xl mx-auto rounded-lg space-y-6">
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
          placeholder="Paste the job description here..."
        />
        <p className="text-xs text-gray-500 mt-1 text-right">
          {jobDescription.length} / {MAX_LENGTH} characters
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
          onPaste={handleNotesPaste}
          onChange={(e) => setNotes(e.target.value.slice(0, MAX_LENGTH))}
          rows={3}
          className="outline-none
          w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
          placeholder="Notes here..."
        />
        <p className="text-xs text-gray-500 mt-1 text-right">
          {notes.length} / {MAX_LENGTH} characters
        </p>
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
        <ResumeFileInput file={file} setFile={setFile} />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isPending }
        className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
      >
        {isPending ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  </div>
  )
}
