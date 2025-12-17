import { useState } from 'react'
import { Link } from '@tanstack/react-router'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo / Branding */}
        <Link to={"/"} className="text-xl font-semibold text-gray-800">
          CareerCare
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <Link to="/resumes/analyze" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
            Upload
          </Link>
          <Link to="/resumes" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
            Resumes
          </Link>
          <Link to="/cover-letter" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
            Cover Letter
          </Link>
          <Link to="/applications" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
            Applications
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-gray-700 focus:outline-none transition-transform duration-300"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? 'rotate-90' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu with transition */}
      <div
        className={`md:hidden bg-white border-t border-gray-200 overflow-hidden transition-all duration-300 ease-linear ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="px-6 py-4 space-y-4">
          <Link to="/resumes/analyze" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium" onClick={() => setIsOpen(false)}>
            Upload
          </Link>
          <Link to="/resumes" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium" onClick={() => setIsOpen(false)}>
            Resumes
          </Link>
          <Link to="/cover-letter" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium" onClick={() => setIsOpen(false)}>
            Cover Letter
          </Link>
          <Link to="/applications" className="block text-gray-700 hover:text-blue-600 transition-colors font-medium" onClick={() => setIsOpen(false)}>
            Applications
          </Link>
        </nav>
      </div>
    </header>
  )
}

export default Header
