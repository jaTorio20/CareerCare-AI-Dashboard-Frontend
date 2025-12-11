import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { generateCoverLetter } from '@/api/coverLetter';
// import type { CoverLetterEntry } from '@/types';
import api from '@/lib/axios';

export const Route = createFileRoute('/cover-letter/generate')({
  component: CoverLetterGenerate,
});

type GenerateResponse = {
  jobDescription: string,
  userDetails: string,
  generatedLetter: string,
}


function CoverLetterGenerate() {
  const [jobDescription, setJobDescription] = useState('');
  const [userDetails, setUserDetails] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState<GenerateResponse | null>(null);

  const {mutateAsync, isPending} = useMutation({
    mutationFn: generateCoverLetter,
    onSuccess: (data) => {
      setGeneratedLetter(data);
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription) return;
    
    if(jobDescription) {
      await mutateAsync({ jobDescription, userDetails });
    }
  };

  return (
    <>
      <h1>Generate Cover Letter</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Description:</label><br/>
          <textarea 
            value={jobDescription} 
            onChange={(e) => setJobDescription(e.target.value)} 
            rows={10} 
            cols={50} 
            required
          />
        </div>
        <div>
          <label>Your Details (optional):</label><br/>
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
      
      {generatedLetter && (
        <div style={{ marginTop: '20px' }}>
          <h2>Edit Your Cover Letter:</h2>
          <textarea
            value={generatedLetter.generatedLetter}
            onChange={(e) =>
              setGeneratedLetter({
                ...generatedLetter,
                generatedLetter: e.target.value, // treat this as editedLetter
              })
            }
            rows={15}
            cols={70}
          />
          {/* <div style={{ marginTop: '10px' }}>
            <button onClick={handleSave}>Save</button>
            <button onClick={handleExportPDF}>Export PDF</button>
            <button onClick={handleExportDocx}>Export DOCX</button>
          </div> */}
        </div>
      )}

    </>
  )
}
