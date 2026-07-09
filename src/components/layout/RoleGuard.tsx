'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUserRole } from '@/lib/roleGuard';
import type { UserRole } from '@/lib/roleGuard';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallback?: React.ReactNode;
}

export default function RoleGuard({ children, allowedRoles, fallback }: RoleGuardProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userRole = getUserRole();
    
    if (!userRole) {
      router.push('/login');
      return;
    }

    const hasAccess = allowedRoles.includes(userRole);
    
    if (!hasAccess) {
      router.push('/dashboard');
      return;
    }

    setIsAuthorized(true);
    setIsLoading(false);
  }, [router, allowedRoles]);

  if (isLoading) {
    return <div className='flex items-center justify-center min-h-screen'>Loading...</div>;
  }

  if (!isAuthorized) {
    return fallback || <div className='flex items-center justify-center min-h-screen'>Access Denied</div>;
  }

  return <>{children}</>;
}
