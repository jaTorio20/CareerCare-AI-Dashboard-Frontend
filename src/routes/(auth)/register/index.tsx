import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '@/api/auth';
import { toast } from 'sonner';

export const Route = createFileRoute('/(auth)/register/')({
  
  component: RegisterPage,
})

function RegisterPage() {
const navigate = useNavigate();
// const { setAccessToken, setUser } = useAuth();
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');

const { mutateAsync, isPending } = useMutation({
  mutationFn: registerUser,
  // onSuccess: (data) => {
  onSuccess: (data) => {
    const verifiedEmail = data.email || email; // use backend email if returned
    navigate({ to: '/verify', search: { email: verifiedEmail } });
    toast.success('OTP sent. Please check your email');
  },
  onError: (err: any) => {
    setError(err.message);
  }
});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await mutateAsync({name, email, password}); //will take name, email, password from the form upon submission
    
  } catch (err: any) {
      console.log(err.message);
  }

}

  return (
    <div className='max-w-md mx-auto mt-5'>
      <h1 className="text-3xl font-bold mb-6">
        Register
      </h1>
      {
        error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            { error }
          </div>
        )
      }
      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)}
          placeholder='Name'
          // autoComplete='off' 
          className="w-full border
          border-gray outline-none focus:border-blue-700 rounded-md p-2" 

        />
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
          { isPending ? 'Registering...' : 'Register' }
        </button>
      </form>

      <p className="text-sm text-center mt-4 space-x-0.5">
        <span>
          Already have an account?
        </span>
        <Link to='/login' className='text-blue-600 hover:underline
        font-medium'>
          Login
        </Link>
      </p>
    </div>
  )
}
