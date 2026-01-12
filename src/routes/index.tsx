import { createFileRoute } from '@tanstack/react-router'
import { FileText, FileSignature, Briefcase, Paperclip, Mic  } from 'lucide-react'
import { ProtectedLink } from '@/components/ProtectedLink'
import { Footer } from '@/components/Footer'
import { motion } from 'framer-motion'


export const Route = createFileRoute('/')({
  head: () => ({
    title: 'CareerCare - AI Job Application & Resume Dashboard',
    meta: [
      {
        name: 'description',
        content:
          'CareerCare helps you analyze resumes, generate cover letters, track job applications, and practice interviews using AI.',
      },
    ],
  }),
  component: App,
})

function App() {
  return (
  <div
    className="min-h-screen flex flex-col"
  >
    <motion.section
      initial={{ opacity: 0, y: 50 }}   // start slightly right
      whileInView={{ opacity: 1, y: 0 }} // slide to place
      viewport={{ once: true, amount: 0.3 }} // trigger when 30% visible
      transition={{ duration: 0.6 }}
    >
        {/* Hero Section */}
      <section className="max-w-7xl mx-auto 
      bg-linear-to-r mt-15 rounded-lg from-blue-50 via-white to-white-50 shadow-sm">
        <div className="px-6 py-20 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 tracking-tight">
            <span className='text-indigo-600'>CareerCare </span>  
            AI Automation Dashboard
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-gray-700 leading-relaxed">
            Your all-in-one AI assistant to optimize resumes, generate personalized cover letters,
            track applications, and practice interviews with real-time speech-to-text 
            feedback.
          </p>
          {/* Call to Action */}
          <div className="mt-8 flex justify-center gap-4">
            <ProtectedLink
              to="/resumes/analyze"
              className="px-6 py-3 rounded-lg cursor-pointer bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              Get Started
            </ProtectedLink>
            <ProtectedLink
              to="/applications"
              className="px-6 py-3 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
            >
              View Applications
            </ProtectedLink>
          </div>
        </div>
      </section>
    </motion.section>

    {/* Features Section */}
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <section className="max-w-7xl mx-auto 
      mt-20 bg-white rounded-2xl shadow-sm py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mx-5">
          {[
            { icon: FileText, title: 'Features', desc: 'AI-powered resume analysis, cover letter generation, job tracking, and interview practice using speech-to-text.', bg: 'bg-indigo-50', color: 'text-indigo-600' },
            { icon: FileSignature, title: 'Benefits', desc: 'Improve your chances of landing your dream job by leveraging AI insights.', bg: 'bg-rose-50', color: 'text-rose-600' },
            { icon: Briefcase, title: 'Who Can Use It', desc: 'Students, job seekers, and professionals wanting a smarter, faster way.', bg: 'bg-emerald-50', color: 'text-emerald-600' },
          ].map((card, i) => (
            <div key={i}
              className={`${card.bg} rounded-xl p-6 flex flex-col items-center
               text-center hover:shadow-lg transition`}
            >
              <card.icon className={`w-12 h-12 ${card.color} mb-4`} />
              <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
              <p className="text-gray-600">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </motion.section>

    {/* How It Works Section */}
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >   
      <section className="max-w-7xl mx-auto 
        mt-20 rounded-xl bg-white shadow-sm py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            How It Works
          </h2>
          <p className="text-lg text-gray-700 mb-12 max-w-3xl mx-auto">
            CareerCare AI guides you through the entire job application process, making it faster and smarter.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center text-center">
              <FileText className="w-12 h-12 text-indigo-600 mb-3" />
              <h3 className="font-semibold mb-1">Upload Resume</h3>
              <p className="text-gray-600 text-sm">Get AI feedback on your current resume.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <FileSignature className="w-12 h-12 text-rose-600 mb-3" />
              <h3 className="font-semibold mb-1">Generate Cover Letter</h3>
              <p className="text-gray-600 text-sm">Create a tailored cover letter instantly.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Briefcase className="w-12 h-12 text-emerald-600 mb-3" />
              <h3 className="font-semibold mb-1">Track Applications</h3>
              <p className="text-gray-600 text-sm">Organize all your applications in one place.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <Mic className="w-12 h-12 text-purple-600 mb-3" />
              <h3 className="font-semibold mb-1">Practice Interviews</h3>
              <p className="text-gray-600 text-sm">Speak your answers naturally—AI transcribes them in real time and gives instant feedback.</p>
            </div>
          </div>
        </div>
      </section>
    </motion.section> 

    <motion.main
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >   
      {/* Main Content */}
      <main className="grow">
        <div className="max-w-7xl mx-auto px-6 py-18 grid gap-15 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {/* Resume Analyzer */}
          <ProtectedLink
            to='/resumes/analyze'
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
          </ProtectedLink>

          {/* Generate Cover Letter */}
          <ProtectedLink
            to='/cover-letter/generate'
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
          </ProtectedLink>

          {/* Job Application */}
          <ProtectedLink
            to='/applications'
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
          </ProtectedLink>
          {/* Interview Sessions */}
          <ProtectedLink
            to='/interview/sessions'
            className="relative transform -rotate-1 hover:rotate-0 cursor-pointer
            group block bg-white rounded-lg shadow hover:shadow-md 
            transition p-6 text-center border border-gray-200"
          >
            <Paperclip className='absolute -rotate-45 -top-2 -left-2 w-6 h-6 text-purple-500' />
            <Mic className="mx-auto mb-4 w-16 h-16 text-purple-500 group-hover:text-purple-600 transition-colors" />
            <h2 className="text-xl font-semibold mb-2 text-gray-800">AI Interview</h2>
            <p className="text-gray-600">Practice interviews with AI questions and real-time speech-to-text feedback.</p>
          </ProtectedLink>
        </div>
      </main>
    </motion.main>  

    {/* About Section */}
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      <section className="max-w-7xl mx-auto mt-20 bg-white rounded-2xl shadow-sm py-16 px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            About CareerCare
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            CareerCare was created to make the job application process easier and more effective. 
            Many people struggle with writing resumes, tailoring cover letters, and preparing for interviews. 
            This project uses AI to provide practical tools that save time and reduce stress.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            By offering resume analysis, instant cover letter generation, application tracking, 
            and interview practice with real-time feedback, CareerCare helps job seekers 
            present themselves more confidently and improve their chances of success.
          </p>
        </div>
      </section>
</motion.section>



        <Footer/>
    </div>
  )
}
