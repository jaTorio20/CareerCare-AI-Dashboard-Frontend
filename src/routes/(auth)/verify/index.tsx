import { createFileRoute, Link, useNavigate, useSearch } from '@tanstack/react-router'
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { verifyUser, resendOtp } from '@/api/auth';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { ResendOtpButton } from '@/components/ResendOtpButton';

export const Route = createFileRoute('/(auth)/verify/')({
  // declare allowed search params
  validateSearch: (search: { email?: string; redirect?: string }) => search,
  component: VerifyPage,
})

function VerifyPage() {
  const { email: searchEmail, redirect } = Route.useSearch();
  const navigate = useNavigate();
  const { setAccessToken, setUser } = useAuth();

  // read email from query string (?email=...)
  const [email] = useState(searchEmail || "");
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const emailParam = params.get('email');
  //   if (emailParam) setEmail(emailParam);
  // }, []);

// mutation for verifying OTP
const { mutateAsync: verifyMutate, isPending: isVerifying } = useMutation({
  mutationFn: verifyUser,
  onSuccess: (data) => {
    setAccessToken(data.accessToken);
    setUser(data.user);

    // If redirect param exists, go there. Otherwise fallback to /home page
    const redirectTo = redirect || "/";
    navigate({ to: redirectTo });

    toast.success(`Account verified! Welcome, ${data.user.name}.`);
  },
  onError: (err: any) => {
    setError(err.message);
    toast.error("Verification failed. Please try again.");
  }
});

  // mutation for resending OTP
  const { mutateAsync: resendMutate, isPending: isResending } = useMutation({
    mutationFn: resendOtp,
    onSuccess: (data) => {
      setMessage(data.message);
      toast.success("A new OTP has been sent to your email.");
    },
    onError: (err: any) => {
      setError(err.message);
      toast.error("Failed to resend OTP. Please resend 1 minute");
    }
  });

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      await verifyMutate({ email, otp: otp.trim()});
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const handleResend = async () => {
    setError("");
    setMessage("");
    try {
      await resendMutate({ email });
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Verify Account</h1>

      {/* {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded mb-4">
          {message}
        </div>
      )} */}

      <form onSubmit={handleVerify} className="space-y-4">
        <input
          type="email"
          value={email}
          readOnly
          className="w-full border border-gray outline-none rounded-md p-2 bg-gray-100"
        />
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          className="w-full border border-gray outline-none focus:border-blue-700 rounded-md p-2"
        />

        <button
          disabled={isVerifying}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md w-full disabled:opacity-50"
        >
          {isVerifying ? 'Verifying...' : 'Verify'}
        </button>
      </form>

      <ResendOtpButton
        email={email}
        isResending={isResending}
        onResend={async (email) => {
          setError("");
          setMessage("");
          try {
            await resendMutate({ email });
          } catch (err: any) {
            console.log(err.message);
          }
        }}
      />
      <p className="text-sm text-center mt-4 space-x-0.5">
        <span>Already verified?</span>
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Login
        </Link>
      </p>
    </div>
  );
}
