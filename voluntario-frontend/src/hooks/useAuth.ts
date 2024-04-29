import { getAuthUser } from '@/utils/api/api';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from './useAuthContext';

export function useAuth() {
  const { user, setUser } = useAuthContext();
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // useEffect(() => {
  //   getAuthUser()
  //     .then((response) => {
  //       const user = response.data;
  //       setUser(user);
  //       // console.log('Authenticated user: ' + JSON.stringify(user));
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

  //   // const getUser = async () => {
  //   //   // setIsLoading(true);

  //   //   try {
  //   //     const response = await getAuthUser();
  //   //     if (response.status === 200) {
  //   //       const user = response.data;
  //   //       setUser(user);
  //   //       console.log('Authenticated user: ' + JSON.stringify(user));
  //   //     }
  //   //   } catch (error) {
  //   //     console.warn('User is unauthenticated');
  //   //     await setTimeout(() => {}, 5000);
  //   //     setUser(null);
  //   //     // navigate('/');
  //   //   } finally {
  //   //     setIsLoading(false);
  //   //   }
  //   // };

  //   // getUser();
  // }, []);

  return { user, isLoading };
}
