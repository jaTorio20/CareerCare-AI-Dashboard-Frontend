import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/api/auth";
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { UseProtectedNav } from './UseProtectedNav';
import { Bot, Briefcase, Pencil, File } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const { user, setUser, setAccessToken } = useAuth();

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      setAccessToken(null);
      setUser(null);
      navigate({ to: "/login" });
      toast.success('Successfully Logged out!')
    },
    onError: (err: any) => {
      console.error("Logout failed:", err);
    }
  });
  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const handleProtectedNav = UseProtectedNav();

  // ACTIVE NAV BUTTON
  const base = 'text-indigo-400';
  const active = 'text-white hover:text-indigo-400';

  return (
<header className="bg-white shadow-md sticky top-0 z-50">
  <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
    {/* Logo */}
    <Link to="/" className="text-xl font-semibold text-gray-800">
      CareerCare
    </Link>

    {/* Desktop Nav + Auth */}
    <div className="hidden md:flex items-center space-x-8">
      <nav className="flex space-x-8">
        <button
          onClick={() => handleProtectedNav("/resumes")}
          className="text-gray-700 cursor-pointer hover:text-blue-600 font-medium"
        >
          Resumes
        </button>

        <button onClick={() => handleProtectedNav("/cover-letter")} 
        className="text-gray-700 cursor-pointer hover:text-blue-600 font-medium">Cover Letter</button>
        <button
          onClick={() => handleProtectedNav("/applications")}
          className="text-gray-700 cursor-pointer hover:text-blue-600 font-medium"
        >
          Applications
        </button>
        <button
          onClick={() => handleProtectedNav("/interview/sessions")}
          className="text-gray-700 cursor-pointer hover:text-blue-600 font-medium"
        >
          AI Interview
        </button>
      </nav>

      {/* Auth Buttons (desktop) */}
      <div className="flex items-center space-x-2">
        {!user ? (
          <>
            <Link to="/login" className="text-gray-600 hover:text-gray-700 font-medium px-3 py-2">Login</Link>
            <Link to="/register" className="bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium px-4 rounded-md py-2">Register</Link>
          </>
        ) : (
          <>
            {/* <span className="text-gray-700 font-medium px-2">Welcome, {user.name}</span> */}
            <button
              onClick={handleLogout}
              className="text-red-600 hover:text-red-900 font-medium px-3 py-2 cursor-pointer"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>

    {/* Mobile Hamburger */}
    <button
      className="md:hidden text-gray-700 focus:outline-none"
      onClick={() => setIsOpen(!isOpen)}
    >
      <svg
        className={`w-6 h-6 transform transition-transform duration-300 ${isOpen ? "rotate-90" : "rotate-0"}`}
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

  <div className={ `md:hidden bg-white border-t border-gray-200 
    overflow-hidden transition-all duration-300 ease-linear `}>
    <nav className=" bg-white border-t border-gray-200 flex justify-around py-2 md:hidden">
      <button onClick={() => handleProtectedNav("/resumes")}
       className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-blue-600">
        <File className="h-6 w-6" />
        <span className="text-xs">Resumes</span>
      </button>
      <button onClick={() => handleProtectedNav("/cover-letter")} 
       className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-blue-600">
        <Pencil className="h-6 w-6" />
        <span className="text-xs">Cover Letter</span>
      </button>
      <button onClick={() => handleProtectedNav("/applications")} 
       className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-blue-600">
        <Briefcase className="h-6 w-6" />
        <span className="text-xs">Applications</span>
      </button>
      <button onClick={() => handleProtectedNav("/interview/sessions")} 
       className="flex flex-col items-center cursor-pointer text-gray-700 hover:text-blue-600">
        <Bot className="h-6 w-6" />
        <span className="text-xs">AI Interview</span>
      </button>
    </nav>
  </div>

  {/* Sidebar for Auth (mobile) */}
    <div className={`fixed inset-0 z-40 transition-opacity
        ${isOpen ? "pointer-events-auto" : "pointer-events-none"}
      `}>
      {/* Backdrop */}
      <div
        className={`absolute inset-0
           transition-opacity duration-300 ease-in-out
          ${isOpen ? "bg-black/40 transition-opacity pointer-events-auto" : "bg-opacity-0 pointer-events-none"}`}
        onClick={() => setIsOpen(false)}

      ></div>

      {/* Sidebar */}
      <div className={`absolute top-0 right-0 h-full rounded-l-3xl
       w-68 bg-gray-50 shadow-lg
        z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
        >
          ✕
        </button>

        <div className="mt-12 flex flex-col space-y-4 px-6">
          {!user ? (
            <>
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-gray-700 hover:text-blue-600 font-medium px-3 py-2 rounded-md transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium px-4 rounded-md py-2 transition-colors"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {/* <span className="text-gray-700 font-medium">Welcome, {user.name}</span> */}
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="text-red-600 hover:text-red-900 font-medium px-3 py-2 cursor-pointer transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>


</header>

  );
};

export default Header
