import { ReactNode, useState } from 'react';
import { UserType } from '@/utils/types/types';
import { AuthContext } from './context/AuthContext';

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<UserType | null>(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
