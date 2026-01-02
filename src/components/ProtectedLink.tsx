import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from '@tanstack/react-router';
import { toast } from 'sonner';

interface ProtectedLinkProps {
  to: string;
  className?: string;
  children: React.ReactNode;
}

export function ProtectedLink({ to, className, children }: ProtectedLinkProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!user) {
      e.preventDefault();
       toast.error('You must be logged in to access this page');
      navigate({ to: '/login', search: { redirect: to } });
    }
  };

  return (
    <Link to={to} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
}
