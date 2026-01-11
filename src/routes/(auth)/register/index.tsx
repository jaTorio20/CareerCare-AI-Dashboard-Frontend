import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '@/api/auth';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';

export const Route = createFileRoute('/(auth)/register/')({
  
  component: RegisterPage,
})

function RegisterPage() {
const navigate = useNavigate();
// const { setAccessToken, setUser } = useAuth();
const [email, setEmail] = useState('');
// const [error, setError] = useState('');

const { mutateAsync, isPending } = useMutation({
  mutationFn: registerUser,
  // onSuccess: (data) => {
  onSuccess: (data) => {
    const verifiedEmail = data.email || email; // use backend email if returned
    navigate({ to: '/verify', search: { email: verifiedEmail } });
    toast.success('OTP sent. Please check your email');
  },
  onError: (err: any) => {
    // setError(err.message);
    const msg = err.response?.data?.error ||
      err.response?.data?.message ||
      'Failed to register';
    toast.error(msg)
    throw new Error(msg);
  }
});

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await mutateAsync({email}); //will take name, email, password from the form upon submission
    
  } catch (err: any) {
      console.log(err.message);
  }
}

  return (
    <div className='max-w-md mx-auto mt-15 p-4 rounded-lg bg-white shadow-sm'>
      <h1 className="text-3xl text-indigo-600 font-bold mb-6">
        Register
      </h1>
      {/* {
        error && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
            { error }
          </div>
        )
      } */}
      <form onSubmit={handleSubmit} className="space-y-4">

        <input 
          type="email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Email'
          required
          // autoComplete='off'          
          className="w-full border
          border-gray-300 outline-none focus:border-indigo-700 rounded-md p-2" 

        />

        <button disabled={isPending}
          className=" flex items-center justify-center
          bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2
          rounded-md w-full disabled:opacity-50">
          { isPending ? (
            <span className="flex items-center  gap-2">
              <Loader className="animate-spin h-5 w-5" /> 
              Registering... 
            </span>
          ) : 'Register' }
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
