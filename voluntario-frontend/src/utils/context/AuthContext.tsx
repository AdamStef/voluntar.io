import { UserType } from '@/utils/types/types';
import { createContext } from 'react';

type AuthContextType = {
  user?: UserType | null;
  setUser: (user: UserType | null) => void;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType,
);
