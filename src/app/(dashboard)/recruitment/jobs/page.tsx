'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { JobCard } from '@/components/recruitment/jobs/JobStatusBadge';
import { jobRequisitionAPI } from '@/lib/recruitment/api';
import { Plus, Search, Filter } from 'lucide-react';

export default function JobRequisitionsPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setIsLoading(true);
      const data = await jobRequisitionAPI.getAll();
      setJobs(data);
      setFilteredJobs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    if (departmentFilter) {
      filtered = filtered.filter((job) => job.department === departmentFilter);
    }

    setFilteredJobs(filtered);
  }, [searchTerm, statusFilter, departmentFilter, jobs]);

  const departments = Array.from(new Set(jobs.map((j) => j.department)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Requisitions</h1>
          <p className="text-gray-600 mt-1">Manage job openings and recruitment workflow</p>
        </div>
        <Link href="/recruitment/jobs/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Requisition
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Search</label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search jobs..."
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
              <option value="draft">Draft</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="open">Open</option>
              <option value="filled">Filled</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="mt-1 h-8 w-full rounded-lg border border-border bg-input px-2.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
                setDepartmentFilter('');
              }}
              className="w-full"
            >
              <Filter className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Job List */}
      {isLoading ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">Loading job requisitions...</p>
        </Card>
      ) : error ? (
        <Card className="p-8 text-center border-red-200 bg-red-50">
          <p className="text-red-600">{error}</p>
          <Button onClick={loadJobs} className="mt-4">
            Try Again
          </Button>
        </Card>
      ) : filteredJobs.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600 mb-4">No job requisitions found</p>
          <Link href="/recruitment/jobs/create">
            <Button>Create First Requisition</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onSelect={(job) => router.push(`/recruitment/jobs/${job.id}`)}
              onEdit={(job) => router.push(`/recruitment/jobs/${job.id}/edit`)}
              onDelete={async (jobId) => {
                if (confirm('Are you sure?')) {
                  try {
                    await jobRequisitionAPI.delete(jobId);
                    loadJobs();
                  } catch (err) {
                    alert('Failed to delete');
                  }
                }
              }}
            />
          ))}
        </div>
      )}

      {/* Summary Cards */}
      {jobs.length > 0 && (
        <div className="grid grid-cols-4 gap-4 mt-6">
          <Card className="p-4">
            <p className="text-sm text-gray-600">Open Positions</p>
            <p className="text-2xl font-bold text-blue-600">
              {jobs.filter((j) => j.status === 'open').length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Pending Approval</p>
            <p className="text-2xl font-bold text-yellow-600">
              {jobs.filter((j) => j.status === 'pending_approval').length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Filled Positions</p>
            <p className="text-2xl font-bold text-green-600">
              {jobs.filter((j) => j.status === 'filled').length}
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-gray-600">Total Requisitions</p>
            <p className="text-2xl font-bold text-gray-600">{jobs.length}</p>
          </Card>
        </div>
      )}
    </div>
  );
}
