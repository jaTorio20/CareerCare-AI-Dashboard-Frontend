import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query';
import { createJobApplication } from '@/api/jobApplication'
import ProtectedRoute from '@/components/ProtectedRoute';

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
  const [status, setStatus] = useState<'applied' | 'interview' | 'offer' | 'rejected' | 'accepted'>('applied');
  const [location, setLocation] = useState<'remote' | 'onsite' | 'hybrid'>('remote');
  const [notes, setNotes] = useState('');
  const [salaryRange, setSalaryRange] = useState('');

  const { mutateAsync, isPending } = useMutation({ //call mutateAsync if we submit a form
    mutationFn: createJobApplication,
    onSuccess: () => {
      navigate({ to: '/applications'}) //navigate is where the form navigate after submit
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
        status,
        location,
        notes,
        salaryRange,
    // userId can be passed here for context/auth
      })
    } catch (error) {
      console.error(error);
      alert('Something went wrong');
    }
  }  
  return (
  <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8 space-y-6">
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
      <label className="block text-sm font-medium text-gray-700 mb-1">Resume File (optional)</label>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="w-full text-gray-700"
      />
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={isPending}
      className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition disabled:opacity-50"
    >
      {isPending ? 'Submitting...' : 'Submit'}
    </button>
  </form>

  )
}
