import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { generateCoverLetter, createCoverLetter } from '@/api/coverLetter';
import type { CoverLetterEntry } from '@/types';
import CoverLetterEditor from '@/components/CoverLetterEditor';


export const Route = createFileRoute('/cover-letter/generate')({
  component: CoverLetterGenerate,
});

// type GenerateResponse = {
//   jobDescription: string,
//   userDetails: string,
//   generatedLetter: string,
// }


function CoverLetterGenerate() {
  const [jobDescription, setJobDescription] = useState('');
  const [userDetails, setUserDetails] = useState('');
  // const [generatedLetter, setGeneratedLetter] = useState<GenerateResponse | null>(null);
  const [generatedLetter, setGeneratedLetter] = useState(''); // AI draft
  const [editedLetter, setEditedLetter] = useState('');       // user edits
  const navigate = useNavigate();

  function convertToParagraphs(text: string) {
    return text
      .split(/\n\s*\n/) // split on blank lines
      .map(p => `<p>${p.trim()}</p>`)
      .join('');
  }

  const {mutateAsync, isPending} = useMutation({
    mutationFn: generateCoverLetter,
    onSuccess: (data) => {
      const formatted = convertToParagraphs(data.generatedLetter);
      setGeneratedLetter(formatted);
      setEditedLetter(formatted);
    }
  });


  const {mutateAsync: saveMutation, isPending: isSaving} = useMutation({
    mutationFn: createCoverLetter,
    onSuccess: (saved) => {
      console.log("Saved cover letter:", saved);
      setGeneratedLetter('');
      setEditedLetter('');
      navigate({ to: "/cover-letter" }); // Back to cover letters list after save
    },
    onError: (err) => {
      console.error("Failed to save cover letter:", err);
      alert("Failed to save cover letter");
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription) return;
    
    if(jobDescription) {
      await mutateAsync({ jobDescription, userDetails });
    }
  };

  const handleSave = async () => {
    if (!generatedLetter) return;

    const entry: Omit<CoverLetterEntry, "_id" | "createdAt" | "updatedAt"> = {
      // userId: "123", // later from auth
      jobDescription,
      userDetails,
      generatedLetter,
      editedLetter, // current edited content
    };
    await saveMutation(entry);
  }

  return (
 <>
      <h1>Generate Cover Letter</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Description:</label><br />
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={10}
            cols={50}
            required
          />
        </div>
        <div>
          <label>Your Details (optional):</label><br />
          <textarea
            value={userDetails}
            onChange={(e) => setUserDetails(e.target.value)}
            rows={5}
            cols={50}
          />
        </div>
        <button type="submit" disabled={isPending}>
          {isPending ? 'Generating...' : 'Generate Cover Letter'}
        </button>
      </form>

    {/* Render editor only after generation and not while pending */}
    {generatedLetter && !isPending && (
      <div style={{ marginTop: 20 }}>
        <h2>Edit Your Cover Letter</h2>
        <CoverLetterEditor
          initialHTML={editedLetter}
          onChange={(html) => setEditedLetter(html)}
        />
        <button
          onClick={handleSave}
          disabled={isSaving || !editedLetter.trim()}
          style={{ marginTop: 12 }}
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    )}

    </>
  )
}
