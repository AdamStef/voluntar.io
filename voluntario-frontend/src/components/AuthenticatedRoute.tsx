import { useAuth } from '@/hooks/useAuth';
import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export const AuthenticatedRoute: FC<React.PropsWithChildren> = ({
  children,
}) => {
  const location = useLocation();
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>loading</div>;
  }

  if (user) return <>{children}</>;
  return <Navigate to="/login" state={{ from: location }} replace />;
};
