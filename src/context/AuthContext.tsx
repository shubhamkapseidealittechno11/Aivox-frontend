'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';
import { useAppDispatch } from '@/lib/hooks';
import { setUser, logoutUser, setLoading } from '@/lib/slices/authSlice';
import { loginApi, logoutApi, getStoredUser } from '@/api/auth';
import Swal from 'sweetalert2';

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
      console.log('Login failed:in aurth --', error);
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
  const result = await Swal.fire({
    text: 'Are you sure you want to logout?',
    showCancelButton: true,
    confirmButtonText: 'Yes, Logout',
    cancelButtonText: 'Cancel',
    imageUrl: '/logout.png', // optional
    imageWidth: 60,
    imageHeight: 60,
    confirmButtonColor: `#DCEDC0`,
    cancelButtonColor: "white",
    customClass: {
      popup: "max-w-full md:max-w-[400px] px-8 py-4 rounded-2xl",
      icon: "text-[9.275px] mt-[0!important]",
      htmlContainer:
        "px-[0!important] pb-[0!important] [font-size:16px!important]",
      actions: "-mx-5",
      confirmButton:
        "[flex:0_0_auto] w-[calc(50%_-10px)] px-[0!important] text-black bg-btn !rounded-[24px] hover:!bg-none",
      cancelButton: `w-[calc(50%_-10px)] text-black border border-[#e2e8f0] border-solid px-[0!important] !rounded-[20px]`,
    },
  });

  // ❌ User cancelled
  if (!result.isConfirmed) return;

  try {
    setLoadingState(true);

    await logoutApi();           // clear storage / backend
    setUserState(null);          // clear local state
    dispatch(logoutUser());      // redux reset
    router.push('/');            // redirect

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
