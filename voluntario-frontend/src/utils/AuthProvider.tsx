import { ReactNode, useEffect, useState } from 'react';
import { UserType } from '@/utils/types/types';
import { AuthContext } from './context/AuthContext';
import { getAuthUser } from './api/api';
import { useNavigate } from 'react-router-dom';

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // useEffect(() => {
  //   // console.log('ProtectedRoute user: ' + JSON.stringify(user));
  //   // getAuthUser()
  //   //   .then((response) => {
  //   //     const user = response.data;
  //   //     setUser(user);
  //   //     console.log('Authenticated user: ' + JSON.stringify(user));
  //   //   })
  //   //   .catch(() => {
  //   //     // const err = error as AxiosError;
  //   //     // console.warn('User is unauthenticated', err);
  //   //     setUser(null);
  //   //     navigate('/');
  //   //   })
  //   //   .finally(() => {
  //   //     // setTimeout(() => setIsLoading(false), 1000);
  //   //     setIsLoading(false);
  //   //   });

  //   const getUser = async () => {
  //     try {
  //       const response = await getAuthUser();
  //       if (response.status === 200) {
  //         const user = response.data;
  //         setUser(user);
  //         console.log('Authenticated user: ' + JSON.stringify(user));
  //       }
  //     } catch (error) {
  //       console.warn('User is unauthenticated');
  //       await setTimeout(() => {}, 5000);
  //       setUser(null);
  //       navigate('/');
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   getUser();
  // }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
