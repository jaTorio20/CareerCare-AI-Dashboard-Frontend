import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { generateCoverLetter, createCoverLetter } from '@/api/coverLetter';
import type { CoverLetterEntry } from '@/types';
import CoverLetterEditor from '@/components/CoverLetterEditor';
import { exportDocx } from '@/utils/exporterDocument';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'sonner';

import { useQuota } from '@/context/QuotaContext';

export const Route = createFileRoute('/cover-letter/generate')({
  component: () => (
    <ProtectedRoute>
     <CoverLetterGenerate/>
    </ProtectedRoute>
  ),
});

function CoverLetterGenerate() {
  const [jobDescription, setJobDescription] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [userDetails, setUserDetails] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState(''); // AI draft
  const [editedLetter, setEditedLetter] = useState('');       // user edits
  const navigate = useNavigate();

  useEffect(() => {
    if (jobDescription) localStorage.setItem("jobDescription", jobDescription)
  }, [jobDescription])

  useEffect(() => {
    if (jobTitle) localStorage.setItem("jobTitle", jobTitle)
  }, [jobTitle])

  useEffect(() => {
    if (companyName) localStorage.setItem("companyName", companyName)
  }, [companyName])

  useEffect(() => {
    if (userDetails) localStorage.setItem("userDetails", userDetails)
  }, [userDetails])

  useEffect(() => {
    if (generatedLetter) localStorage.setItem("generatedLetter", generatedLetter)
  }, [generatedLetter])

  useEffect(() => {
    if (editedLetter) localStorage.setItem("coverLetter", editedLetter)
  }, [editedLetter])


  const convertToParagraphs = (text: string) => {
    if (!text) return "";
    return text
      .split(/\n+/) // split on newlines
      .map(p => `<p>${p.trim()}</p>`)
      .join('');
  }

  const { quotaExceeded, setQuotaExceeded } = useQuota();
  const {mutateAsync, isPending} = useMutation({
    mutationFn: generateCoverLetter,
    onSuccess: (data) => {
      // console.log("generateCoverLetter response:", data);
      // if (!data?.generatedLetter) {
      //   toast.error("No generated letter returned from API");
      //   return;
      // }
      const formatted = convertToParagraphs(data.generatedLetter);
      setGeneratedLetter(formatted);
      setEditedLetter(formatted);
    },
    onError: (err: any) => {
      const message = err?.response?.data?.message || "Please try again.";
      const retryDelay = err?.response?.data?.retryDelay;

      if (/quota/i.test(message)) {
        setQuotaExceeded(true);
        toast.error(
          retryDelay ? `${message} Retry after ${retryDelay}.` : message
        );
      } else {
        toast.error(message);
      }
    },
  });


  const {mutateAsync: saveMutation, isPending: isSaving} = useMutation({
    mutationFn: createCoverLetter,
    onSuccess: (saved) => {
      console.log("Saved cover letter:", saved);
      handleCancel();
      navigate({ to: "/cover-letter" }); // Back to cover letters list after save
      toast.success('Saved successfully!')
    },
    onError: (err: any) => {
      toast.error( err?.message || "An unexpected error occurred");
    }
  })

  useEffect(() => {
    const savedLetter = localStorage.getItem("coverLetter")
    const savedJob = localStorage.getItem("jobDescription")
    const savedTitle = localStorage.getItem("jobTitle")
    const savedCompany = localStorage.getItem("companyName")
    const savedDetails = localStorage.getItem("userDetails")
    const savedGenerated = localStorage.getItem("generatedLetter")

    if (savedLetter) setEditedLetter(savedLetter)
    if (savedJob) setJobDescription(savedJob)
    if (savedTitle) setJobTitle(savedTitle)
    if (savedCompany) setJobTitle(savedCompany)
    if (savedDetails) setUserDetails(savedDetails)
    if (savedGenerated) setGeneratedLetter(savedGenerated)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription) return;
    
    if(jobDescription) {
      await mutateAsync({ jobDescription, jobTitle, companyName, userDetails });
    }
  };



  const handleSave = async () => {
    if (!generatedLetter) return;

    const entry: Omit<CoverLetterEntry, "_id" | "createdAt" | "updatedAt"> = {
      // userId: "123", // later from auth
      jobDescription,
      jobTitle,
      companyName,
      userDetails,
      generatedLetter,
      editedLetter, // current edited content
    };
    await saveMutation(entry);
  }

  const handleCancel = () => {
    setEditedLetter("")
    setJobDescription("")
    setJobTitle("")
    setCompanyName("")
    setGeneratedLetter("")
    setUserDetails("")
    localStorage.removeItem("coverLetter")
    localStorage.removeItem("generatedLetter")
    localStorage.removeItem("jobTitle")
    localStorage.removeItem("companyName")
    localStorage.removeItem("jobDescription")
    localStorage.removeItem("userDetails")
  }

  return (
<div className="max-w-3xl mx-auto px-6 py-10">
  {/* Header */}
  <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
    Generate Cover Letter
  </h1>

  {/* Clear Text Button */}
  <div className="flex justify-end mb-4">
    <button
      type="button"
      onClick={handleCancel}
      className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition"
    >
      Clear Text
    </button>
  </div>

  {/* Form */}
  <form
    onSubmit={handleSubmit}
    className="bg-white border border-gray-200 rounded-xl shadow-md p-8 space-y-6"
  >
    {/* Job Description */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Job Description
      </label>
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows={8}
        required
        className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
      />
    </div>

    {/* Job Title */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Job Title
      </label>
      <input
        type="text"
        required
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
      />
    </div>

    {/* Company Name */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Company Name
      </label>
      <input
        type="text"
        required
        value={companyName}
        onChange={(e) => setCompanyName(e.target.value)}
        className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
      />
    </div>

    {/* User Details */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Your Details (optional)
      </label>
      <textarea
        value={userDetails}
        onChange={(e) => setUserDetails(e.target.value)}
        rows={5}
        className="w-full rounded-md border border-gray-300 bg-gray-50 p-3 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-200 transition"
      />
    </div>

    {/* Submit Button */}
    <div className="pt-4">
      <button
        type="submit"
        disabled={isPending || quotaExceeded}
        className="w-full rounded-lg bg-linear-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white font-semibold shadow-md hover:from-blue-700 hover:to-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Generating..." : "Generate Cover Letter"}
      </button>
    </div>
  </form>

  {/* Editor after generation */}
  {generatedLetter && !isPending && (
    <div className="mt-10 bg-white border border-gray-200 rounded-xl shadow-md p-8 space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">
        Edit Your Cover Letter
      </h2>
      <div className="rounded-md border border-gray-300 bg-gray-50 p-3">
        <CoverLetterEditor
          initialHTML={editedLetter}
          onChange={(html) => setEditedLetter(html)}
        />
      </div>

      {/* Editor Actions */}
      <div className="flex flex-col sm:flex-row gap-4 pt-4">
        <button
          onClick={handleSave}
          disabled={isSaving || !editedLetter.trim()}
          className="flex-1 px-5 py-3 text-sm font-medium text-white bg-green-600 rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save"}
        </button>

        <button
          onClick={handleCancel}
          className="flex-1 px-5 py-3 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
        >
          Cancel
        </button>

        <button
          onClick={() => exportDocx(editedLetter)}
          className="flex-1 px-5 py-3 text-sm font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition"
        >
          Export as DOCX
        </button>
      </div>
    </div>
  )}
</div>

  )
}
