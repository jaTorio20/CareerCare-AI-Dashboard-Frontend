import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { analyzeResume, createResume } from '@/api/resumes';
import type { ResumeAnalysis, ResumeEntry } from '@/types';

export const Route = createFileRoute('/resumes/analyze')({
  component: ResumeAnalyze,
});

type AnalysisResponse = {
  resumeFile: string
  jobDescription: string
  analysis: ResumeAnalysis
};

function ResumeAnalyze() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResponse | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: analyzeResume,
    onSuccess: (data) => {
      //  has data of shape { resumeFile, jobDescription, analysis }
      setAnalysisResult(data);
    }
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!file) return;

    if (file) {
      await mutateAsync({ file, jobDescription });
    }
  };

  const handleSave = async () => {
    if (!analysisResult) return;
    
    const entry: Omit<ResumeEntry, "_id" | "createdAt" | "updatedAt"> = {
      // userId: "123", // later from auth
      resumeFile: analysisResult.resumeFile, // Cloudinary URL from backend
      jobDescription: analysisResult.jobDescription,
      analysis: analysisResult.analysis,
    };
    await saveMutation(entry);
  };

  const handleCancel = () => {
    setAnalysisResult(null);
    setFile(null);
    setJobDescription('');
  };

 return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upload Resume for Analysis</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Resume File</label>
          <input
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
            onChange={(e) => setJobDescription(e.target.value)}
            rows={4}
            className="block w-full border border-gray-300 rounded-md p-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the job description here..."
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isPending ? "Analyzing..." : "Analyze Resume"}
        </button>
      </form>

      {/* Analysis Result */}
      {analysisResult?.analysis && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Analysis Result</h3>
          <p className="text-sm text-gray-700">
            <strong>ATS Friendly:</strong> {analysisResult?.analysis.atsFriendly ? "Yes " : "No "}
          </p>
          { analysisResult?.analysis.jobFitPercentage ?
            <p className="text-sm text-gray-700">
              <strong>Job Fit Percentage:</strong> {analysisResult?.analysis.jobFitPercentage}%
            </p>
            : null
          }

          <div className="mt-2">
            <strong className="text-sm text-gray-800">ATS Suggestions:</strong>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {analysisResult?.analysis.atsSuggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          {analysisResult?.analysis.jobFitSuggestions && analysisResult?.analysis.jobFitSuggestions.length > 0 && (
            <div className="mt-2">
              <strong className="text-sm text-gray-800">Job Fit Suggestions:</strong>
              <ul className="list-disc list-inside text-sm text-gray-700">
                {analysisResult?.analysis.jobFitSuggestions.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Save / Cancel buttons */}
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save Resume"}
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400"
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
