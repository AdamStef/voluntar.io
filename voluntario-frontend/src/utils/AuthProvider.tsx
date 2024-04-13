import { ReactNode, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from './api/axios';
import { LoginDataType, User } from '@/types';
import { AxiosError } from 'axios';
import { AuthContext } from './context/AuthContext';

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  // const controller = new AbortController();

  const login = async (data: LoginDataType) => {
    try {
      const response = await axiosClient.post('/auth/login', data);
      if (response.status === 200) {
        const user = response.data;
        setUser(user);
        console.log('Logged in user: ' + JSON.stringify(user));
        navigate('/home');
      }
    } catch (error) {
      const err = error as AxiosError;
      return err;
    }
  };

  const logout = async () => {
    try {
      await axiosClient.post('/auth/logout');
      setUser(null);
      setIsLoading(false);
      console.log('Logged out');
      navigate('/');
    } catch (error) {
      return error;
    }
  };

  useEffect(() => {
    const getAuthUser = async () => {
      setIsLoading(true);

      try {
        const response = await axiosClient.get('/auth/me');
        if (response.status === 200) {
          const user = response.data;
          setUser(user);
          console.log('Authenticated user: ' + JSON.stringify(user));
        }
      } catch (error) {
        console.error('AuthProvider ' + error);
      } finally {
        setIsLoading(false);
      }
    };

    getAuthUser();

    // return () => {
    //   controller.abort();
    // };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
