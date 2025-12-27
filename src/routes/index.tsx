import { createFileRoute, Link } from '@tanstack/react-router'
import { FileText, FileSignature, Briefcase, Paperclip, Mic  } from 'lucide-react' 
import { UseProtectedNav } from '@/components/UseProtectedNav'


export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  const handleProtectedNav = UseProtectedNav();
  return (
  <div className="min-h-screen mt-5 flex flex-col">
      {/* Hero Section */}
    <section className="bg-linear-to-r rounded-lg from-blue-50 via-white to-white-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 tracking-tight">
          <span className='text-indigo-600'>CareerCare </span>  
          AI Automation Dashboard
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-700 leading-relaxed">
          Your one-stop platform for resumes, cover letters, and job applications.
        </p>
        {/* Call to Action */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={() => handleProtectedNav("/resumes/analyze")}
            className="px-6 py-3 rounded-lg cursor-pointer bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Get Started
          </button>
          <button
            onClick={() => handleProtectedNav("/applications")}
            className="px-6 py-3 rounded-lg cursor-pointer bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
          >
            View Applications
          </button>
        </div>
      </div>
    </section>


      {/* Main Content */}
      <main className="grow">
        <div className="max-w-7xl mx-auto px-6 py-18 grid gap-15 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* Resume Analyzer */}
          <button
            onClick={() => handleProtectedNav('/resumes/analyze')}
            className="relative transform rotate-1 hover:rotate-0 cursor-pointer
            group block bg-white rounded-lg shadow hover:shadow-md 
            transition p-6 text-center border border-gray-200"
          >
            <Paperclip className='absolute -rotate-30 -top-2 -left-2 w-6 h-6 text-emerald-600'></Paperclip>
            <FileText className="mx-auto mb-4 w-16 h-16 text-emerald-500 group-hover:text-emerald-600 transition-colors" />
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Resume Analyzer
            </h2>
            <p className="text-gray-600">
              Upload your resume and get AI-powered insights to improve your chances.
            </p>
          </button>

          {/* Generate Cover Letter */}
          <button
            onClick={() => handleProtectedNav('/cover-letter/generate')}
            className="relative transform -rotate-1 hover:rotate-0 cursor-pointer
            group block bg-white rounded-lg shadow hover:shadow-md 
            transition p-6 text-center border border-gray-200"
          >
            <Paperclip className='absolute -rotate-28 -top-2 -left-2 w-6 h-6 text-rose-500'></Paperclip>
            <FileSignature className="mx-auto mb-4 w-16 h-16 text-rose-500 group-hover:text-rose-600 transition-colors" />
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Generate Cover Letter
            </h2>
            <p className="text-gray-600">
              Create tailored cover letters instantly with AI assistance.
            </p>
          </button>

          {/* Job Application */}
          <button
            onClick={() => handleProtectedNav('/applications')}
            className="relative transform rotate-1 hover:rotate-0 cursor-pointer
            group block bg-white rounded-lg shadow hover:shadow-md 
            transition p-6 text-center border border-gray-200"
          >
            <Paperclip className='absolute -rotate-58 -top-2 -left-2 w-6 h-6 text-indigo-500'></Paperclip>

            <Briefcase className="mx-auto mb-4 w-16 h-16 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
            <h2 className="text-xl font-semibold mb-2 text-gray-800">
              Job Application
            </h2>
            <p className="text-gray-600">
              Manage and track your job applications in one place.
            </p>
          </button>
                    {/* Interview Sessions */}
          <button
            onClick={() => handleProtectedNav('/interview/sessions')}
            className="relative transform -rotate-1 hover:rotate-0 cursor-pointer
            group block bg-white rounded-lg shadow hover:shadow-md 
            transition p-6 text-center border border-gray-200"
          >
            <Paperclip className='absolute -rotate-45 -top-2 -left-2 w-6 h-6 text-purple-500' />
            <Mic className="mx-auto mb-4 w-16 h-16 text-purple-500 group-hover:text-purple-600 transition-colors" />
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Interview Practice</h2>
            <p className="text-gray-600">Prepare with AI-generated questions and feedback to ace your interviews.</p>
          </button>
        </div>
      </main>
    </div>
  )
}
