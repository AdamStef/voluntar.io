import { AuthContextType } from '@/types';
import { AuthContext } from '@/utils/context/AuthContext';
import { useContext } from 'react';

export function useAuth() {
  return useContext(AuthContext) as AuthContextType;
}
