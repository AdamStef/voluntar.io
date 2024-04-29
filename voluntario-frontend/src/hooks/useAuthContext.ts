import { AuthContext } from '@/utils/context/AuthContext';
import { useContext } from 'react';

export function useAuthContext() {
  return useContext(AuthContext);
}
