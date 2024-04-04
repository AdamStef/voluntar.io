import { AuthContextType } from '@/types';
import { createContext } from 'react';

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);
