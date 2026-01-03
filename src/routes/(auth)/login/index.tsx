import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { loginUser } from '@/api/auth'
import { useAuth } from '@/context/AuthContext'
import {z} from "zod";
import { toast } from 'sonner'
import { Loader } from 'lucide-react'

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
    <div className='max-w-md mx-auto mt-10 p-2'>
      <h1 className="text-3xl font-bold mb-6">
        Login
      </h1>
      {/* {
        error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            { error }
          </div>
        )
      } */}
      <form onSubmit={handleSubmit}
      className="space-y-4">

        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
          required
          // autoComplete='off'          
          className="w-full border
          border-gray outline-none focus:border-blue-700 rounded-md p-2" 

        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder='Password'
          // autoComplete='off'
          className="w-full border
          border-gray outline-none focus:border-blue-700 rounded-md p-2" 
        />

        <button 
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-semibold px-4 py-2
          rounded-md w-full disabled:opacity-50 flex items-center justify-center">
          {isPending ? ( 
            <span className="flex items-center  gap-2">
              <Loader className="animate-spin h-5 w-5" /> 
              Logging in... 
            </span>
          ) :  "Login" } 
        </button>

      </form>

      <button
        onClick={googleLogin}
        disabled={isRedirecting}
        className={` flex items-center justify-center
          bg-red-600 hover:bg-red-700 cursor-pointer
        text-white font-semibold px-4 py-2 rounded-md w-full mt-4
        ${isRedirecting ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isRedirecting ? (
          <span className="flex items-center gap-2">
            <Loader className="animate-spin h-5 w-5" /> 
            Redirecting... 
          </span>
        ) : "Login with Google"}
      </button>

      <p className="text-sm text-center mt-4 space-x-0.5">
        <span>Don't have an account?</span>
        <Link to="/register" className="text-blue-600 hover:underline font-medium">
          Register
        </Link>
      </p>

      <p className="text-sm text-center mt-2">
        <Link to="/forgot-password" className="text-blue-600 hover:underline font-medium">
          Forgot Password?
        </Link>
      </p>

    </div>
  )
}
