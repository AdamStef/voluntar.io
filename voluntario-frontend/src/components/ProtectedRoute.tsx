import { useAuthContext } from '@/hooks/useAuthContext';
import { getAuthUser } from '@/utils/api/api';
import { FC, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

type ProtectedRouteProps = {
  replacePath?: string;
};

export const ProtectedRoute: FC<
  React.PropsWithChildren & ProtectedRouteProps
> = ({ replacePath = '/', children }) => {
  const { user, setUser } = useAuthContext();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await getAuthUser();
        if (response.status === 200) {
          const user = response.data;
          setUser(user);
          console.log('Authenticated user: ' + JSON.stringify(user));
        }
      } catch (error) {
        console.warn('User is unauthenticated');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, []);

  if (isLoading) {
    return <div>loading</div>;
  }

  if (user) return children ? <>{children}</> : <Outlet />;
  console.log('nagivate to /', user);
  return <Navigate to={replacePath} state={{ from: location }} replace />;
};
