'use client';

import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { setUser, setLoading } from './slices/authSlice';
import { useAuth } from '@/context/AuthContext';

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();
  const { user, loading: authLoading } = useAuth();
  const { isLoading } = useAppSelector((state: any) => state.auth);

  // Sync auth context with Redux store
  useEffect(() => {
    if (user) {
      dispatch(setUser(user));
    } else {
      dispatch(setLoading(false));
    }
  }, [user, dispatch]);

  // Show loading spinner while auth is initializing
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return children;
};

export default AuthWrapper;
