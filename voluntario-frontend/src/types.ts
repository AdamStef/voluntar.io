import { AxiosError } from 'axios';

export type User = {
  id: string;
  email: string;
  roles: string[];
};

export type LoginDataType = {
  email: string;
  password: string;
};

export type AuthContextType = {
  user?: User | null;
  isLoading: boolean;
  login: (data: LoginDataType) => Promise<void | AxiosError>;
  logout: () => void;
  // setAuthUser: (user: User) => void;
};
