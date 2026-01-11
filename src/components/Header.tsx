import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useRouterState  } from '@tanstack/react-router'
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/api/auth";
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ProtectedLink } from './ProtectedLink';
import { Bot, Briefcase, Pencil, File, LogOut, ChevronDown, Loader } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [guestDropdownOpen, setGuestDropdownOpen] = useState(false);
  const [avatarDropdownOpen, setAvatarDropdownOpen] = useState(false);

  const navigate = useNavigate();

  const { user, setUser, setAccessToken } = useAuth();

  const {mutateAsync, isPending} = useMutation({
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
  const handleLogout = async () => {
    await mutateAsync();
  };

  // const handleProtectedNav = UseProtectedNav();

  // ACTIVE NAV BUTTON MD TO LARGE SCREEN
  const navItems = [
    { label: "Resumes", path: "/resumes"},
    { label: "Cover Letter", path: "/cover-letter"},
    { label: "Applications", path: "/applications"},
    { label: "AI Interview", path: "/interview/sessions"},
  ];
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const base = 'text-gray-700 px-2 text-sm font-medium cursor-pointer rounded-lg hover:text-indigo-600 hover:bg-blue-100 font-sm';
  const active = 'text-indigo-600 text-sm font-medium cursor-pointer hover:text-indigo-700';
  
  // ACTIVE NAV BUTTON FOR SMALLER SCREEN
  const navItemsMobile = [
    { icon: File, label: "Resumes", path: "/resumes"},
    { icon: Pencil, label: "Cover Letter", path: "/cover-letter"},
    { icon: Briefcase,label: "Applications", path: "/applications"},
    { icon: Bot, label: "AI Interview", path: "/interview/sessions"},
  ];
  const pathnameMobile = useRouterState({ select: (s) => s.location.pathname });
  const baseMobile = 'text-gray-700rounded-lg cursor-pointer hover:text-indigo-600 font-medium';
  const activeMobile = 'text-indigo-600 font-medium cursor-pointer hover:text-indigo-700';

  // dropdownRef
  const guestDropdownRef = useRef<HTMLDivElement>(null);
  const avatarDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (guestDropdownRef.current && !guestDropdownRef.current.contains(e.target as Node)) {
        setGuestDropdownOpen(false);
      }
      if (avatarDropdownRef.current && !avatarDropdownRef.current.contains(e.target as Node)) {
        setAvatarDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside, true);
    return () => document.removeEventListener("mousedown", handleClickOutside, true);
  }, []);


  return (   
    <header id='app-header'
    className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-semibold text-indigo-600">
          CareerCare
        </Link>

        {/* Desktop Nav + Auth */}
        <div className="hidden md:flex items-center space-x-8">
          <nav className="flex space-x-8">
            {navItems.map(item => {
              const isActive = pathname.startsWith(item.path);
              return (
                  <ProtectedLink
                    key={item.path}
                    to={item.path}
                    className={isActive ? active : base}
                  >
                    {item.label}
                  </ProtectedLink>
              );
            })}
            
          </nav>

          {/* Auth Buttons (desktop) */}
        <div className="relative flex items-center">
          {!user ? (
          <div ref={guestDropdownRef} className="relative">
            <button
              onClick={() => setGuestDropdownOpen(v => !v)}
              className="hover:text-indigo-600
              cursor-pointer text-gray-700 text-sm
              flex items-center gap-1 font-medium px-3 py-2"
            >
              Menu
            <ChevronDown
              className={`w-4 h-4 text-gray-800 hover:text-indigo-600 transition-transform duration-200
                group-hover:text-gray-700
                ${guestDropdownOpen ? "rotate-180 text-indigo-600" : ""}
            `}/>

            </button>

            {guestDropdownOpen && (
              <div className="
                absolute right-0 top-full mt-2 w-50
                rounded-xl bg-white
                border border-gray-200
                shadow-lg
                z-50
                overflow-hidden
              ">
                <Link
                  to="/login"
                  onClick={() => setGuestDropdownOpen(false)}
                  className="
                    flex items-center gap-2
                    px-4 py-2.5 text-sm text-gray-700
                    hover:bg-gray-50 hover:text-indigo-600
                    transition-colors
                  "
                >
                  Login
                </Link>

                <div className="h-px bg-gray-100" />

                <Link
                  to="/register"
                  onClick={() => setGuestDropdownOpen(false)}
                  className="
                    flex items-center gap-2
                    px-4 py-2.5 text-sm text-gray-700
                    hover:bg-gray-50 hover:text-indigo-600
                    transition-colors
                  "
                >
                  Register
                </Link>
              </div>
            )}

          </div>
          ) : (
          <div ref={avatarDropdownRef} className="relative">
            <button
              onClick={() => setAvatarDropdownOpen(v => !v)}
              className="cursor-pointer
              flex items-center focus:outline-none text-gray-800 hover:text-gray-600 "
            >
              <img
                src={
                  user?.avatar?.url || "/user.png"
                }
                alt="User avatar"
                className="w-9 h-9 rounded-full object-cover transition"
              />
            <ChevronDown
              className={`w-4 h-4 transition-transform duration-200
                ${avatarDropdownOpen ? "rotate-180 text-indigo-600" : ""}
            `}/>

            </button>

            {avatarDropdownOpen && (
            <div className="absolute right-0 mt-3 w-54 rounded-xl bg-white shadow-lg border border-gray-100 z-50 overflow-hidden">
              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>

              {/* Actions */}
              <button
                disabled={isPending}
                onClick={() => {
                  handleLogout();
                  setAvatarDropdownOpen(false);
                }}
                className="disabled:opacity-50 disabled:cursor-not-allowed
                w-full flex items-center gap-2 px-4 py-2.5 text-sm
              text-red-600 hover:bg-red-50 transition-colors"
              >
              {/* 
                Logout */}
              {isPending ? (
                <span className="flex items-center gap-2 ">
                  <Loader className="animate-spin h-5 w-5 text-red-500" /> 
                  Logging out...
                </span>
                ) : (
                  <span className='flex items-center gap-2'>
                    <LogOut className="w-4 h-4 text-red-500" />
                    Logout
                  </span>
                )}
              </button>
            </div>
            )}
          </div>
          )}
        </div>
      </div>

        {/* Mobile Hamburger */}
        <button
          className="cursor-pointer
          md:hidden text-gray-700 hover:text-indigo-600 focus:outline-none"
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

      <div className={ `md:hidden bg-white 
        overflow-hidden transition-all duration-300 ease-linear `}>
        <nav className=" bg-white border-gray-200 flex justify-around py-2 md:hidden">
            {navItemsMobile.map(item => {
              const isActive = pathnameMobile.startsWith(item.path);
              return (
                  <ProtectedLink
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center gap-1 ${isActive ? activeMobile : baseMobile}`}
                  >
                    <item.icon className="h-6 w-6" />
                    <span className="text-xs">{item.label}</span>
                  </ProtectedLink>
              );
            })}
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
                  
                  <div className='flex items-center gap-2'>
                    <img
                      src={
                        user?.avatar?.url || "/user.png"
                      }
                      alt="User avatar"
                      className="w-9 h-9 rounded-full object-cover transition"
                    />

                    <div className="border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <button
                    disabled={isPending}
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="text-red-600
                     hover:text-red-900 font-medium px-3 
                     py-2 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader className="animate-spin h-5 w-5 text-red-500" /> 
                        Logging out...
                      </span>
                      ) : (
                        <span className='flex items-center gap-2'>
                          <LogOut className="w-4 h-4 text-red-500" />
                          Logout
                        </span>
                    )}
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
