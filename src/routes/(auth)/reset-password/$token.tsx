import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getPasswordToken, saveNewPassword } from "@/api/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/(auth)/reset-password/$token")({
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { token } = Route.useParams();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Verify token on mount
  const { data, isLoading, isError } = useQuery({
    queryKey: ["resetToken", token],
    queryFn: () => getPasswordToken(token),
  });

  // Mutation for saving new password
  const { mutateAsync: resetMutate, isPending } = useMutation({
    mutationFn: ({ token, password }: { token: string; password: string }) =>
      saveNewPassword(token, password),
    onSuccess: () => {
      toast.success("Password reset successful. Please log in.");
      navigate({ to: "/login" });
    },
    onError: (err: any) => {
      setError(err.message);
      toast.error("Failed to reset password.");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await resetMutate({ token, password });
    } catch (err: any) {
      console.log(err.message);
    }
  };

  if (isLoading) return <p>Verifying reset link...</p>;
  if (isError || !data?.valid) {
    return (
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4">Invalid or expired link</h1>
        <p className="text-gray-600">Please request a new password reset.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reset Password</h1>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          className="w-full border border-gray outline-none focus:border-blue-700 rounded-md p-2"
        />

        <button
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-md w-full disabled:opacity-50"
        >
          {isPending ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}
