import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { generateCoverLetter, createCoverLetter } from '@/api/coverLetter';
import type { CoverLetterEntry } from '@/types';
import CoverLetterEditor from '@/components/CoverLetterEditor';
import { exportDocx } from '@/utils/exporterDocument';


export const Route = createFileRoute('/cover-letter/generate')({
  component: CoverLetterGenerate,
});

function CoverLetterGenerate() {
  const [jobDescription, setJobDescription] = useState('');
  const [userDetails, setUserDetails] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState(''); // AI draft
  const [editedLetter, setEditedLetter] = useState('');       // user edits
  const navigate = useNavigate();

  useEffect(() => {
    if (jobDescription) localStorage.setItem("jobDescription", jobDescription)
  }, [jobDescription])

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
    return text
      .split(/\n+/) // split on newlines
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
      handleCancel();
      navigate({ to: "/cover-letter" }); // Back to cover letters list after save
    },
    onError: (err) => {
      console.error("Failed to save cover letter:", err);
      alert("Failed to save cover letter");
    },
  })

  useEffect(() => {
    const savedLetter = localStorage.getItem("coverLetter")
    const savedJob = localStorage.getItem("jobDescription")
    const savedDetails = localStorage.getItem("userDetails")
    const savedGenerated = localStorage.getItem("generatedLetter")

    if (savedLetter) setEditedLetter(savedLetter)
    if (savedJob) setJobDescription(savedJob)
    if (savedDetails) setUserDetails(savedDetails)
    if (savedGenerated) setGeneratedLetter(savedGenerated)
  }, [])

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

  const handleCancel = () => {
    setEditedLetter("")
    setJobDescription("")
    setGeneratedLetter("")
    setUserDetails("")
    localStorage.removeItem("coverLetter")
    localStorage.removeItem("generatedLetter")
    localStorage.removeItem("jobDescription")
    localStorage.removeItem("userDetails")
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

        <button           
          onClick={handleCancel}
        >
          Cancel
        </button>
        <button 
          onClick={() => exportDocx(editedLetter)} 
          style={{ marginTop: 12 }}
        >
          Export as DOCX
        </button>

      </div>
    )}

    </>
  )
}
