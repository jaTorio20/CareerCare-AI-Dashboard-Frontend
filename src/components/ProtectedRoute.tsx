// ProtectedRoute.tsx
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from '@tanstack/react-router';
import { type ReactNode, useEffect, useRef } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!isAuthLoading && !user && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate({ to: '/login', replace: true });
    }
  }, [user, isAuthLoading, navigate]);

  if (isAuthLoading || !user) return null;

  return <>{children}</>;
}
