import { useAuth } from '@/hooks/useAuth';
import { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  replacePath?: string;
};

export const ProtectedRoute: FC<
  React.PropsWithChildren & ProtectedRouteProps
> = ({ replacePath = '/home', children }) => {
  const location = useLocation();
  const { user, isLoading } = useAuth();

  return children; //TODO: remove this line

  if (isLoading) {
    return <div>loading</div>;
  }

  if (user) return <>{children}</>;
  return <Navigate to={replacePath} state={{ from: location }} replace />;
};
