import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { loginUser } from '@/api/auth'
import { useAuth } from '@/context/AuthContext'
import {z} from "zod";
import { toast } from 'sonner'
import { Loader } from 'lucide-react'
import { SiGoogle } from 'react-icons/si'
import { motion } from 'framer-motion'

export const Route = createFileRoute('/(auth)/login/')({
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
  component: LoginPage,
})

function LoginPage() {
  const search = useSearch({ from: "/(auth)/login/" });
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // If redirect param exists, go there. Otherwise fallback to /
  const redirectTo = search?.redirect || "/";

  const { mutateAsync, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      sessionStorage.setItem("justLoggedIn", "true");

      setAccessToken(data.accessToken);
      setUser(data.user);
      navigate({ to: redirectTo });
      toast.success(`Welcome back, ${data.user.name}!`);
    },
    onError: (err: any) => {
      // setError(msg);
      toast.error(err.message);
    },
  });

  const { mutateAsync: googleAsync, isPending: isRedirecting } = useMutation({
    mutationFn: async () => {
    sessionStorage.setItem("justLoggedIn", "true");
    return`${import.meta.env.VITE_API_URL}/api/auth/google?redirect=${encodeURIComponent(redirectTo)}`;
    },
    onSuccess: (url) => window.location.href = url,
    onError: (err) => {
      console.error("Google login failed:", err);
      toast.error("Google login failed. Please try again.");    
    },
  });
    
  const googleLogin = async () => {
    await googleAsync();
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync({
      email,
      password
    });
  }

  return (
  <motion.div
    initial={{ opacity: 0, y: 50 }}   // start slightly right
    whileInView={{ opacity: 1, y: 0 }} // slide to place
    viewport={{ once: true, amount: 0.3 }} // trigger when 30% visible
    transition={{ duration: 0.6 }}
  >
    <div className='max-w-4xl mx-auto px-2 mt-4 md:mt-15 rounded-xl'>
      <div className='grid grid-cols-1 md:grid-cols-2'>
        <div className="shadow-md
        flex flex-col justify-center items-center bg-indigo-50 rounded-t-2xl md:rounded-l-2xl p-10">
          <h1 className="text-4xl font-extrabold text-blue-500 mb-4 text-center">
            Welcome!
          </h1>
          <p className="text-gray-700 text-center max-w-xs">
            Access your dashboard, analyze resumes, generate cover letters, and track applications with AI-powered tools.
          </p>

          <div className="mt-8 w-full flex justify-center">
            <div className="h-1 w-24 bg-indigo-400 rounded-full animate-pulse" />
          </div>
        </div>


        <div className='p-4 bg-white shadow-md rounded-b-2xl md:rounded-r-2xl'>
          <h1 className="text-3xl font-bold text-indigo-600 tracking-tight">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-gray-500">
          Enter your credentials to access your account
          </p>
          <form onSubmit={handleSubmit}
            className="mt-8 space-y-5">

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-600
                  focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2
                  focus:outline-none focus:ring-2 focus:ring-blue-600
                  focus:border-transparent" 
              />
            </div>
            <button
              disabled={isPending}
              className="w-full rounded-lg bg-blue-600 py-2.5 text-white font-semibold
                hover:bg-blue-700 transition
                disabled:opacity-50 flex items-center justify-center"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader className="h-5 w-5 animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                or continue with
              </span>
            </div>
          </div>

          <button
            onClick={googleLogin}
            disabled={isRedirecting}
            className="w-full flex items-center justify-center gap-2
              border border-gray-300 rounded-lg py-2.5
              hover:bg-gray-50 transition
              disabled:opacity-50"
          >
            {isRedirecting ? (
              <>
                <Loader className="h-5 w-5 animate-spin" />
                Redirecting...
              </>
            ) : (
              <>
                <SiGoogle className='h-5 w-5 text-indigo-600'/>
                <span className='text-gray-600'>
                  Continue with Google
                </span>
              </>
            )}
          </button>


          <div className="mt-6 text-center text-sm text-gray-600">
            <p>
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-600 hover:underline font-medium">
                Sign up
              </Link>
            </p>
            <Link
              to="/forgot-password"
              className="block mt-2 text-blue-600 hover:underline"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
  )
}
