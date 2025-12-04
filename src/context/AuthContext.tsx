'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch } from '@/lib/hooks';
import { setUser, logoutUser, setLoading } from '@/lib/slices/authSlice';
import { loginApi, logoutApi, getStoredUser } from '@/api/auth';

interface User {
  id?: string;
  email: string;
  name?: string;
  role?: string;
  userRole?: string;
  rolePermission?: string[];
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [loading, setLoadingState] = useState(true);
  const router = useRouter();
  const { toast } = useToast();
  const dispatch = useAppDispatch();

  // Initialize auth state from stored data
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = getStoredUser();
        if (storedUser) {
          setUserState(storedUser);
          dispatch(setUser(storedUser));
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setLoadingState(false);
        dispatch(setLoading(false));
      }
    };

    initializeAuth();
  }, [dispatch]);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoadingState(true);
      const response = await loginApi(email, password);

      if (response?.user) {
        setUserState(response.user);
        dispatch(setUser(response.user));

        toast({
          title: 'Login successful',
          description: 'You have been successfully logged in.',
        });

        return true;
      } else {
        throw new Error('No user data returned from login');
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: error?.message || 'Invalid email or password',
      });
      return false;
    } finally {
      setLoadingState(false);
    }
  };

  const logout = async () => {
    try {
      setLoadingState(true);
      await logoutApi();
      setUserState(null);
      dispatch(logoutUser());
      router.push('/');

      toast({
        title: 'Logged out',
        description: 'You have been successfully logged out.',
      });
    } catch (error: any) {
      console.error('Logout failed:', error);
      toast({
        variant: 'destructive',
        title: 'Logout failed',
        description: error?.message || 'Failed to logout',
      });
    } finally {
      setLoadingState(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
