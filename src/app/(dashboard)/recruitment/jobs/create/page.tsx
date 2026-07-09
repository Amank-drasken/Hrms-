'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { JobRequisitionForm } from '@/components/recruitment/jobs/JobRequisitionForm';
import { jobRequisitionAPI } from '@/lib/recruitment/api';

export default function CreateJobPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await jobRequisitionAPI.create({
        ...data,
        status: 'draft',
      });
      router.push('/recruitment/jobs');
    } catch (error: any) {
      alert('Failed to create job requisition: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Job Requisition</h1>
        <p className="text-gray-600 mt-1">Post a new job opening</p>
      </div>

      <JobRequisitionForm
        onSubmit={handleSubmit}
        onCancel={() => router.push('/recruitment/jobs')}
        isLoading={isLoading}
      />
    </div>
  );
}
