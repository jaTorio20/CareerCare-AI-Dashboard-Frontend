import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { loginUser } from '@/api/auth'
import { useAuth } from '@/context/AuthContext'
import {z} from "zod";

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
  const [error, setError] = useState('');

  const { mutateAsync, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      setUser(data.user);

      // If redirect param exists, go there. Otherwise fallback to /resumes
      const redirectTo = search?.redirect || "/resumes";
      navigate({ to: redirectTo });
    },
    onError: (err: any) => {
      setError(err.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await mutateAsync({
      email,
      password
    });
  }

  return (
    <div className='max-w-md mx-auto'>
      <h1 className="text-3xl font-bold mb-6">
        Login
      </h1>
      {
        error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            { error }
          </div>
        )
      }
      <form onSubmit={handleSubmit}
      className="space-y-4">

        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
          // autoComplete='off'          
          className="w-full border
          border-gray outline-none focus:border-blue-700 rounded-md p-2" 

        />
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Password'
          // autoComplete='off'
          className="w-full border
          border-gray outline-none focus:border-blue-700 rounded-md p-2" 
        />

        <button disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2
          rounded-md w-full disabled:opacity-50">
          {
            isPending ? 'Logging in...' : 'Login'
          }
        </button>
      </form>

      <p className="text-sm text-center mt-4 space-x-0.5">
        <span>
          Don't have an account?
        </span>
        <Link to='/register' className='text-blue-600 hover:underline
        font-medium'>
          Register
        </Link>
      </p>
    </div>
  )
}
