import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/api/auth";
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';


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

  const handleProtectedNav = (path: string) => {
  if (!user) {
    toast.error("You need to login first");
    navigate({
      to: "/login",
      search: { redirect: path },
    });
    return;
  }

  navigate({ to: path });
};

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
        className="text-gray-700 hover:text-blue-600 font-medium"
      >
        Resumes
      </button>

      <button onClick={() => handleProtectedNav("/cover-letter")} className="text-gray-700 hover:text-blue-600 font-medium">Cover Letter</button>
      <button
        onClick={() => handleProtectedNav("/applications")}
        className="text-gray-700 hover:text-blue-600 font-medium"
      >
        Applications
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
            <span className="text-gray-700 font-medium px-2">Welcome, {user.name}</span>
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

  {/* Mobile Menu */}
  <div
    className={`md:hidden bg-white border-t border-gray-200 overflow-hidden transition-all duration-300 ease-linear ${
      isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
    }`}
  >
    <nav className="px-6 py-4 flex flex-col space-y-4">
      <button 
        onClick={() => {
          handleProtectedNav("/resumes");
          setIsOpen(false);
          }
        } 
        className="text-gray-700 hover:text-blue-600 font-medium">
          Resumes
      </button>
      <button        
          onClick={() => {
          handleProtectedNav("/cover-letter");
          setIsOpen(false);
          }
        } 
        className="text-gray-700 hover:text-blue-600 font-medium">
          Cover Letter
      </button>

      <button         
        onClick={() => {
          handleProtectedNav("/applications");
          setIsOpen(false);
          }
        } 
        className="text-gray-700 hover:text-blue-600 font-medium">
          Applications
      </button>

      {/* Auth Buttons (mobile) */}
      <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
        {!user ? (
          <>
            <Link to="/login" onClick={() => setIsOpen(false)} className="text-gray-600 hover:text-gray-700 font-medium px-3 py-2">Login</Link>
            <Link to="/register" onClick={() => setIsOpen(false)} className="bg-gray-100 text-gray-800 hover:bg-gray-200 font-medium px-4 rounded-md py-2">Register</Link>
          </>
        ) : (
          <>
            <span className="text-gray-700 font-medium">Welcome, {user.name}</span>
            <button
              onClick={() => { handleLogout(); setIsOpen(false); }}
              className="text-red-600 hover:text-red-900 font-medium px-3 py-2 cursor-pointer"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  </div>
</header>

  );
};

export default Header
