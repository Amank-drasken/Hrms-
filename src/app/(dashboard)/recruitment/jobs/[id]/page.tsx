'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { jobRequisitionAPI, applicantAPI } from '@/lib/recruitment/api';
import { useRecruitmentStore } from '@/lib/recruitment/store';
import { JobStatusBadge } from '@/components/recruitment/jobs/JobStatusBadge';
import { ArrowLeft, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<any>(null);
  const [applicants, setApplicants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadJobDetails();
  }, [jobId]);

  const loadJobDetails = async () => {
    try {
      setIsLoading(true);
      const [jobData, applicantData] = await Promise.all([
        jobRequisitionAPI.getById(jobId),
        applicantAPI.getByJob(jobId),
      ]);
      setJob(jobData);
      setApplicants(applicantData);
    } catch (err: any) {
      setError(err.message || 'Failed to load job details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async () => {
    if (confirm('Submit this requisition for approval?')) {
      try {
        const updated = await jobRequisitionAPI.submitForApproval(jobId);
        setJob(updated);
      } catch (err: any) {
        alert('Failed to submit for approval');
      }
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this job requisition?')) {
      try {
        await jobRequisitionAPI.delete(jobId);
        router.push('/recruitment/jobs');
      } catch (err: any) {
        alert('Failed to delete');
      }
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  if (error || !job) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Card className="p-8 text-center border-red-200 bg-red-50">
          <p className="text-red-600">{error || 'Job not found'}</p>
        </Card>
      </div>
    );
  }

  const applicationStatistics = {
    total: applicants.length,
    screening: applicants.filter((a) => a.status === 'screening').length,
    shortlisted: applicants.filter((a) => a.status === 'shortlisted').length,
    interviewed: applicants.filter((a) => a.status === 'interview_scheduled').length,
    offered: applicants.filter((a) => a.status === 'offer_extended').length,
    hired: applicants.filter((a) => a.status === 'hired').length,
    rejected: applicants.filter((a) => a.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div className="flex gap-2">
          {job.status === 'draft' && (
            <>
              <Button
                onClick={handleApprove}
                className="gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" />
                Submit for Approval
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push(`/recruitment/jobs/${jobId}/edit`)}
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Button>
            </>
          )}
          <Button
            variant="outline"
            onClick={handleDelete}
            className="gap-2 text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Job Information */}
      <Card className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
            <p className="text-gray-600 mt-1">{job.department}</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <JobStatusBadge status={job.status} />
            {job.approvalStatus && (
              <JobStatusBadge status={job.approvalStatus} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t">
          <div>
            <p className="text-sm text-gray-600">Salary Range</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">
              {job.currency} {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Employment Type</p>
            <p className="text-lg font-semibold text-gray-900 mt-1 capitalize">{job.employmentType}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Experience Required</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">{job.experience_years}+ years</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-6 pt-6 border-t">
          <div>
            <p className="text-sm text-gray-600">Location</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">{job.location}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Reporting To</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">{job.reportingTo}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Education</p>
            <p className="text-lg font-semibold text-gray-900 mt-1">{job.education}</p>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold text-gray-900 mb-2">Job Description</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
        </div>

        {/* Required Skills */}
        {job.requiredSkills && job.requiredSkills.length > 0 && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold text-gray-900 mb-3">Required Skills</h3>
            <div className="flex flex-wrap gap-2">
              {job.requiredSkills.map((skill: string) => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Application Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Applications</p>
          <p className="text-2xl font-bold text-gray-900">{applicationStatistics.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Shortlisted</p>
          <p className="text-2xl font-bold text-blue-600">{applicationStatistics.shortlisted}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Offered</p>
          <p className="text-2xl font-bold text-green-600">{applicationStatistics.offered}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Hired</p>
          <p className="text-2xl font-bold text-purple-600">{applicationStatistics.hired}</p>
        </Card>
      </div>

      {/* Applicants List */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Applicants</h2>
          <Link href={`/recruitment/applicants?jobId=${jobId}`}>
            <Button variant="outline">View All Applicants</Button>
          </Link>
        </div>

        {applicants.length === 0 ? (
          <p className="text-gray-600">No applicants yet</p>
        ) : (
          <div className="space-y-3">
            {applicants.slice(0, 5).map((applicant) => (
              <div
                key={applicant.id}
                className="flex justify-between items-center p-3 border rounded hover:bg-gray-50"
              >
                <div>
                  <p className="font-medium text-gray-900">
                    {applicant.firstName} {applicant.lastName}
                  </p>
                  <p className="text-sm text-gray-600">{applicant.email}</p>
                </div>
                <div className="text-right">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                    {applicant.status}
                  </div>
                  {applicant.resume_score && (
                    <p className="text-sm text-gray-600 mt-1">
                      Match: {applicant.resume_score}%
                    </p>
                  )}
                </div>
              </div>
            ))}
            {applicants.length > 5 && (
              <p className="text-sm text-gray-600 pt-2">
                +{applicants.length - 5} more applicants
              </p>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
