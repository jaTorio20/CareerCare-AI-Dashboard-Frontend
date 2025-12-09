import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { analyzeResume } from '@/api/resumes';
import type { ResumeAnalysis } from '@/types';

export const Route = createFileRoute('/resume/analyze')({
  component: ResumeAnalyze,
});

function ResumeAnalyze() {
  // const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState('');
  const [analysisResult, setAnalysisResult] = useState<ResumeAnalysis | null>(null);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: analyzeResume,
    onSuccess: (data) => {
      setAnalysisResult(data.analysis);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(!file) return;

    if (file) {
      await mutateAsync({ file, jobDescription });
    }
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
      {analysisResult && (
        <div className="mt-6 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Analysis Result</h3>
          <p className="text-sm text-gray-700">
            <strong>ATS Friendly:</strong> {analysisResult.atsFriendly ? "Yes " : "No "}
          </p>
        { analysisResult.jobFitPercentage ?
          <p className="text-sm text-gray-700">
            <strong>Job Fit Percentage:</strong> {analysisResult.jobFitPercentage}%
          </p>
          : null
        }

          <div className="mt-2">
            <strong className="text-sm text-gray-800">ATS Suggestions:</strong>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {analysisResult.atsSuggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>

          { analysisResult.jobFitPercentage ?
          <div className="mt-2">
            <strong className="text-sm text-gray-800">Job Fit Suggestions:</strong>
            <ul className="list-disc list-inside text-sm text-gray-700">
              {analysisResult.jobFitSuggestions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
            : null
          }
        </div>
      )}
    </div>
  )
}

export default ResumeAnalyze
