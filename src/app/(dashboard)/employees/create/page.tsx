'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import EmployeeForm from '@/components/forms/EmployeeForm';
import { getUserRole } from '@/lib/roleGuard';

export default function CreateEmployeePage() {
  const router = useRouter();

  useEffect(() => {
    // Check role - only ADMIN and HR can create
    const userRole = getUserRole();
    if (userRole !== 'ADMIN' && userRole !== 'HR') {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSuccess = () => {
    router.push('/employees');
  };

  return (
    <div className='p-8'>
      <EmployeeForm onSuccess={handleSuccess} />
    </div>
  );
}
