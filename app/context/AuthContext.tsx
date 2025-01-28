'use client';

import { createContext, useContext } from 'react';

interface User {
  id?: string;
  token: string;
  correo?: string;
  curp?: string;
  celular?: string;
  aplicaciones?: string;
  grupos?: string;
}

interface Noti {
  open: boolean;
  type: 'error' | 'warning' | 'info' | 'success';
  message: string;
}

interface AuthContextProps {
  user: User | null;
  // eslint-disable-next-line no-unused-vars
  setUser: (user: User | null) => void;
  noti: Noti | null;
  // eslint-disable-next-line no-unused-vars
  setNoti: (noti: Noti | null) => void;
  loading: boolean;
  // eslint-disable-next-line no-unused-vars
  setLoading: (loading: boolean) => void;
  isAuthenticated: () => boolean;
  removeAuth: () => void;
  // eslint-disable-next-line no-unused-vars
  activateAuth: (userData: User) => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useAuthContext must be used within a AuthProvider',
    );
  }
  return context;
}
