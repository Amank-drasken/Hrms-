'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { ApplicantCard, ApplicantTable } from '@/components/recruitment/applicants/ApplicantCard';
import { applicantAPI, jobRequisitionAPI } from '@/lib/recruitment/api';
import { Search, Filter, Grid3x3, List } from 'lucide-react';

export default function ApplicantsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobIdFilter = searchParams.get('jobId');

  const [applicants, setApplicants] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [jobFilter, setJobFilter] = useState(jobIdFilter || '');
  const [sourceFilter, setSourceFilter] = useState('');

  const [filteredApplicants, setFilteredApplicants] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [applicantData, jobData] = await Promise.all([
        applicantAPI.getAll(),
        jobRequisitionAPI.getAll(),
      ]);
      setApplicants(applicantData);
      setJobs(jobData);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = applicants;

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    if (jobFilter) {
      filtered = filtered.filter((app) => app.jobId === jobFilter);
    }

    if (sourceFilter) {
      filtered = filtered.filter((app) => app.source === sourceFilter);
    }

    setFilteredApplicants(filtered);
  }, [searchTerm, statusFilter, jobFilter, sourceFilter, applicants]);

  // Statistics
  const stats = {
    total: applicants.length,
    screening: applicants.filter((a) => a.status === 'screening').length,
    shortlisted: applicants.filter((a) => a.status === 'shortlisted').length,
    interviewed: applicants.filter((a) => a.status === 'interview_scheduled').length,
    offered: applicants.filter((a) => a.status === 'offer_extended').length,
    hired: applicants.filter((a) => a.status === 'hired').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Applicant Tracking System</h1>
          <p className="text-gray-600 mt-1">Manage and track all job applicants</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-6 gap-3">
        <Card className="p-3">
          <p className="text-xs text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-gray-600">Screening</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.screening}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-gray-600">Shortlisted</p>
          <p className="text-2xl font-bold text-blue-600">{stats.shortlisted}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-gray-600">Interviewed</p>
          <p className="text-2xl font-bold text-purple-600">{stats.interviewed}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-gray-600">Offered</p>
          <p className="text-2xl font-bold text-indigo-600">{stats.offered}</p>
        </Card>
        <Card className="p-3">
          <p className="text-xs text-gray-600">Hired</p>
          <p className="text-2xl font-bold text-green-600">{stats.hired}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-5 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Search</label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="mt-1 h-8 w-full rounded-lg border border-border bg-input px-2.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"
            >
              <option value="">All Statuses</option>
              <option value="applied">Applied</option>
              <option value="screening">Screening</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="interview_scheduled">Interview Scheduled</option>
              <option value="offer_extended">Offer Extended</option>
              <option value="hired">Hired</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Job</label>
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="mt-1 h-8 w-full rounded-lg border border-border bg-input px-2.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"
            >
              <option value="">All Jobs</option>
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Source</label>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="mt-1 h-8 w-full rounded-lg border border-border bg-input px-2.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"
            >
              <option value="">All Sources</option>
              <option value="website">Website</option>
              <option value="linkedin">LinkedIn</option>
              <option value="referral">Referral</option>
              <option value="job_portal">Job Portal</option>
              <option value="others">Others</option>
            </select>
          </div>

          <div className="flex items-end justify-between gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setJobFilter(jobIdFilter || '');
                setSourceFilter('');
              }}
            >
              <Filter className="w-4 h-4" />
            </Button>
            <div className="flex gap-1 border rounded-lg p-1">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
                className="p-2"
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'table' ? 'default' : 'outline'}
                onClick={() => setViewMode('table')}
                className="p-2"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Applicants List */}
      {isLoading ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">Loading applicants...</p>
        </Card>
      ) : error ? (
        <Card className="p-8 text-center border-red-200 bg-red-50">
          <p className="text-red-600">{error}</p>
          <Button onClick={loadData} className="mt-4">
            Try Again
          </Button>
        </Card>
      ) : filteredApplicants.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No applicants found</p>
        </Card>
      ) : viewMode === 'grid' ? (
        <div className="grid gap-4">
          {filteredApplicants.map((applicant) => (
            <ApplicantCard
              key={applicant.id}
              applicant={applicant}
              onView={(app) => router.push(`/recruitment/applicants/${app.id}`)}
              onDelete={async (appId) => {
                if (confirm('Remove this applicant?')) {
                  try {
                    await applicantAPI.delete(appId);
                    loadData();
                  } catch {
                    alert('Failed to delete');
                  }
                }
              }}
            />
          ))}
        </div>
      ) : (
        <Card className="p-4">
          <ApplicantTable
            applicants={filteredApplicants}
            onSelect={(app) => router.push(`/recruitment/applicants/${app.id}`)}
          />
        </Card>
      )}
    </div>
  );
}
