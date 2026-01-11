import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendPasswordReset } from "@/api/auth";
import { toast } from "sonner";
import { Loader } from "lucide-react";

export const Route = createFileRoute("/(auth)/forgot-password/")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { mutateAsync, isPending } = useMutation({
    mutationFn: sendPasswordReset,
    onSuccess: (data) => {
      toast.success(data.message || "Password reset email sent. Please check your inbox.");
      setEmail(""); // clear field
    },
    onError: (err: any) => {
      setError(err.message);
      toast.error("Failed to send reset email.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await mutateAsync(email);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-15 p-3 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl text-indigo-600 font-bold mb-6">Forgot Password</h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <input
          type="email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full border border-gray-300 outline-none focus:border-indigo-700 rounded-md p-2"
        />

        <button
          disabled={isPending}
          className="flex items-center justify-center
          bg-blue-600 hover:bg-blue-700 text-white 
          font-semibold px-4 py-2 rounded-md w-full 
          disabled:opacity-50
          "
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <Loader className="animate-spin h-5 w-5" /> 
              Sending... 
            </span>
            ) : "Send Reset Link"}
        </button>
      </form>

      <p className="text-sm text-center mt-4 space-x-0.5">
        <span>Remembered your password?</span>
        <Link to="/login" className="text-blue-600 hover:underline font-medium">
          Login
        </Link>
      </p>
    </div>
  );
}
