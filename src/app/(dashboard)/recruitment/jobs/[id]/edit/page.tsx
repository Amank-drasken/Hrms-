'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { JobRequisitionForm } from '@/components/recruitment/jobs/JobRequisitionForm';
import { jobRequisitionAPI } from '@/lib/recruitment/api';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await jobRequisitionAPI.getById(jobId);
        setJob(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load job');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [jobId]);

  const handleSubmit = async (data: any) => {
    try {
      setIsSaving(true);
      await jobRequisitionAPI.update(jobId, data);
      router.push(`/recruitment/jobs/${jobId}`);
    } catch (err: any) {
      alert('Failed to update job requisition: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-gray-600">Loading...</div>;
  }

  if (error || !job) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Card className="p-8 text-center border-red-200 bg-red-50">
          <p className="text-red-600">{error || 'Job not found'}</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Button variant="outline" onClick={() => router.back()} className="gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Edit Job Requisition</h1>
        <p className="text-gray-600 mt-1">Update the details for {job.title}</p>
      </div>

      <JobRequisitionForm initialData={job} onSubmit={handleSubmit} isLoading={isSaving} />
    </div>
  );
}
