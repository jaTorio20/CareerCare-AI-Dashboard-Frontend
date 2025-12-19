import { useState, useEffect } from "react";

interface ResendOtpButtonProps {
  email: string;
  onResend: (email: string) => Promise<void>;
  isResending: boolean;
}

export function ResendOtpButton({ email, onResend, isResending }: ResendOtpButtonProps) {
  const [cooldown, setCooldown] = useState(0);

  const handleClick = async () => {
    await onResend(email);
    setCooldown(60); // start 60s cooldown
  };

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  return (
    <button
      onClick={handleClick}
      disabled={isResending || cooldown > 0}
      className="mt-4 bg-gray-600 hover:bg-gray-700 text-white font-semibold px-4 py-2 rounded-md w-full disabled:opacity-50"
    >
      {isResending
        ? "Resending..."
        : cooldown > 0
        ? `Resend OTP (${cooldown}s)`
        : "Resend OTP"}
    </button>
  );
}
