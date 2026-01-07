import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { analyzeResume, createResume, waitForAnalysis } from '@/api/resumes';
import type { CreateResumeInput } from '@/types';
import api from '@/lib/axios';
import ProtectedRoute from '@/components/ProtectedRoute';
import { toast } from 'sonner';
import { useQuota } from '@/context/QuotaContext';
import NotFound from '@/components/NotFound';
import { Loader } from 'lucide-react';
import { AnimatedStat } from '@/components/Resume/AnimatedStat';

export const Route = createFileRoute('/resumes/analyze/')({
    component: () => (
    <ProtectedRoute>
      <ResumeAnalyze />
    </ProtectedRoute>
  ),
  notFoundComponent: NotFound,
  
});

function ResumeAnalyze() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<CreateResumeInput | null>(null);

  const { quotaExceeded } = useQuota();

  const { mutateAsync: saveMutation, isPending: isSaving} = useMutation({
    mutationFn: createResume,
    onSuccess: (saved) => {
      console.log("Saved resume:", saved);
      setAnalysisResult(null);
      navigate({ to: "/resumes" }); // Back to resumes list after save
    },
    onError: (err) => {
      console.error("Failed to save resume:", err);
      alert("Failed to save resume");
    },
  });

  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
      if (!file || loading || quotaExceeded) return;

    try {
      setAnalysisResult(null);
      setLoading(true);

      // enqueue job
      const { jobId } = await analyzeResume({ file, jobDescription });

      // wait for worker to finish
      const result = await waitForAnalysis(jobId);
      setAnalysisResult(result);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to analyze resume");
    } finally {
      setLoading(false);
    }
  };


  const handleSave = async () => {
    if (!analysisResult) return;
    
    const entry = {
      publicId: analysisResult.publicId,
      originalName: analysisResult.originalName,
      jobDescription: analysisResult.jobDescription,
      analysis: analysisResult.analysis,
      jobId: analysisResult.jobId, // optional, include if exists
      resumeFile: analysisResult.resumeFile,
    };
    await saveMutation(entry);
  };

  const handleCancel = async () => {
    if (analysisResult?.publicId) {
      try {
        await api.delete(`/resumes/temp/${analysisResult.publicId}`);
      } catch (err) {
        console.error("Failed to delete temp file:", err);
      }
    }
    setAnalysisResult(null);
    setFile(null);
    setJobDescription('');
  };

  // Text limiting
  const MAX_LENGTH = 2000; // maximum allowed characters
  const handleJobDescriptionPaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault(); 
    const paste = e.clipboardData.getData('text');

    const newValue = (jobDescription + paste).slice(0, MAX_LENGTH);
    setJobDescription(newValue);
  };

 return (
    <div className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6 mt-5">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload Resume for Analysis</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resume File</label>
          <input
            required
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Job Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
          <textarea
            value={jobDescription}
            onPaste={handleJobDescriptionPaste}
            onChange={(e) => setJobDescription(e.target.value.slice(0, MAX_LENGTH))}
            rows={15}
            className="block w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Paste the job description here..."
          />
          <p className="text-xs text-gray-500 mt-1 text-right">
            {jobDescription.length} / {MAX_LENGTH} characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || quotaExceeded}
           className={`w-full bg-blue-600 text-white py-2 px-4 
            rounded-md hover:bg-blue-700 transition-colors
            ${loading || quotaExceeded ? "opacity-50 cursor-not-allowed hover:bg-blue-600" : ""}
          `}
        >
          {quotaExceeded
            ? "Quota Exhausted"
            : loading
            ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader className="animate-spin h-5 w-5" />
                  Analyzing...
                </span>
              )
            : "Analyze Resume"}
        </button>

      </form>

      {/* Analysis Result */}
      {analysisResult?.analysis && (
      <div className="mt-10 pt-8 border-t border-gray-200 space-y-8">

        {/* Section Header */}
        <h2 className="text-2xl font-semibold text-gray-900">
          Resume Analysis
        </h2>

        {/* Scores */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {analysisResult.analysis.atsScore > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <p className="text-md font-medium text-gray-600">ATS Score</p>
              <AnimatedStat value={analysisResult.analysis.atsScore} barClass="bg-blue-600"/>
            </div>
            )}

            {analysisResult.analysis.keywordMatchPercentage > 0 && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
              <p className="text-md font-medium text-gray-600">Keyword Match</p>
              <AnimatedStat value={analysisResult.analysis.keywordMatchPercentage} barClass="bg-indigo-600" />
           </div>
            )}
        </div>

        {/* Format Issues */}
        {analysisResult.analysis.formatIssues.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Formatting Issues
            </h3>
              <ul className="list-disc list-inside space-y-2 text-sm sm:text-base text-gray-700">
                {analysisResult.analysis.formatIssues.map((issue, i) => (
                  <li
                    key={i}
                    className="p-4 text-sm sm:text-base "
                  >
                    {issue}
                  </li>
                ))}
              </ul>
          </div>
        )}

        {/* Missing Keywords */}
        {analysisResult.analysis.missingKeywords.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Missing Keywords
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <ul className="flex flex-wrap gap-2">
                {analysisResult.analysis.missingKeywords.map((kw, i) => (
                  <li key={i}
                  className='px-3 py-1 text-sm rounded-full bg-red-100 text-red-700'
                  >{kw}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Strength Keywords */}
        {analysisResult.analysis.strengthKeywords.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Strong Keywords
            </h3>
            <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
              <ul className="flex flex-wrap gap-2">
                {analysisResult.analysis.strengthKeywords.map((kw, i) => (
                  <li key={i}
                  className='px-3 py-1 text-sm rounded-full bg-green-100 text-green-700'
                  >{kw}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Improvement Suggestions */}
        {analysisResult.analysis.improvementSuggestions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Improvement Suggestions
            </h3>
            <ul className="space-y-3">
              {analysisResult.analysis.improvementSuggestions.map((s, i) => {
                // Map priority to Tailwind color classes
                const colorMap = {
                  high: "bg-red-50 border-red-200 text-red-800",
                  medium: "bg-amber-50 border-amber-200 text-amber-800",
                  low: "bg-emerald-50 border-emerald-200 text-emerald-800",
                };

                return (
                  <li
                    key={i}
                    className={`p-4 rounded-xl border sm:text-base text-sm ${colorMap[s.priority]} `}
                  >
                    <span className="font-semibold capitalize">{s.priority}:</span>{" "}
                    {s.message}
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-5 py-3 text-sm font-medium text-white bg-green-600 rounded-lg shadow hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Resume"}
          </button>

          <button
            onClick={handleCancel}
            className="flex-1 px-5 py-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
        </div>

      </div>
    )}


    </div>
  )
}

export default ResumeAnalyze
