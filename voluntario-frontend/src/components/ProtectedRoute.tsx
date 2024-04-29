import { useAuth } from '@/hooks/useAuth';
import { useAuthContext } from '@/hooks/useAuthContext';
import { getAuthUser } from '@/utils/api/api';
import { FC, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';

type ProtectedRouteProps = {
  replacePath?: string;
};

export const ProtectedRoute: FC<
  React.PropsWithChildren & ProtectedRouteProps
> = ({ replacePath = '/', children }) => {
  // const { user, isLoading } = useAuth();
  const { user, setUser } = useAuthContext();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // console.log('ProtectedRoute user: ' + JSON.stringify(user));

  // useEffect(() => {
  //   // console.log('ProtectedRoute user: ' + JSON.stringify(user));
  //   getAuthUser()
  //     .then((response) => {
  //       const user = response.data;
  //       setUser(user);
  //       console.log('Authenticated user: ' + JSON.stringify(user));
  //     })
  //     .catch(() => {
  //       // const err = error as AxiosError;
  //       // console.warn('User is unauthenticated', err);
  //       setUser(null);
  //       navigate('/');
  //     })
  //     .finally(() => {
  //       // setTimeout(() => setIsLoading(false), 1000);
  //       setIsLoading(false);
  //     });
  // }, []);

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
        // await setTimeout(() => {}, 5000);
        setUser(null);
        // navigate('/');
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
