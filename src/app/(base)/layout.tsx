'use client';

import AdminPanelLayout from '@/components/admin-panel/admin-panel-layout';
import { useAppSelector } from '@/lib/hooks';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state: any) => state.auth
  );

  // Check permissions and redirect if necessary
  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, redirect to login page (root)
      if (!isAuthenticated) {
        router.push('/');
        return;
      }

      // If user is subAdmin, check specific permissions
      if (user?.userRole === 'subAdmin') {
        checkPermission(pathname?.split('/')?.[1]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading, pathname]);

  const checkPermission = (path: string) => {
    let isPermission = false;
    const normalizedPath =
      path === 'Government officials' ? 'govt-officials' : path;

    // Check if user has permission to view this path
    if (
      user?.rolePermission?.includes(
        `${normalizedPath?.toLocaleLowerCase()}_can_view`
      )
    ) {
      isPermission = true;
    }

    // If no permission, redirect to dashboard
    if (!isPermission) {
      router.push('/dashboard');
    }
  };

  // Show loading spinner while auth is being checked
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If not authenticated, don't render anything (will redirect in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  if(pathname.includes('dashboard/')) {
    return <>{children}</>;
  }

  // Render authenticated layout
  return <AdminPanelLayout>{children}</AdminPanelLayout>;
}
