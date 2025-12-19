// ProtectedRoute.tsx
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from '@tanstack/react-router';
import { type ReactNode, useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isAuthLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      navigate({ to: '/login', replace: true });
    }
  }, [user, isAuthLoading, navigate]);

  if (isAuthLoading || !user) return null; // block render

  return <>{children}</>;
}
