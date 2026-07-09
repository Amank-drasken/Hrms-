'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { interviewAPI } from '@/lib/recruitment/api';
import { Search, Calendar, Users, CheckCircle, Trash2, Edit2 } from 'lucide-react';
import Link from 'next/link';

export default function InterviewsPage() {
  const router = useRouter();
  const [interviews, setInterviews] = useState<any[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadInterviews();
  }, []);

  const loadInterviews = async () => {
    try {
      setIsLoading(true);
      const data = await interviewAPI.getAll();
      setInterviews(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load interviews');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = interviews;

    if (searchTerm) {
      filtered = filtered.filter(
        (i) =>
          i.applicantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          i.jobTitle.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((i) => i.status === statusFilter);
    }

    setFilteredInterviews(filtered);
  }, [searchTerm, statusFilter, interviews]);

  const stats = {
    total: interviews.length,
    scheduled: interviews.filter((i) => i.status === 'scheduled').length,
    completed: interviews.filter((i) => i.status === 'completed').length,
    cancelled: interviews.filter((i) => i.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interview Scheduling</h1>
          <p className="text-gray-600 mt-1">Schedule and manage candidate interviews</p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total Interviews</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Scheduled</p>
          <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Cancelled</p>
          <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Search</label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search interviews..."
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
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
            >
              <option value="">All Statuses</option>
              <option value="scheduled">Scheduled</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="pending_feedback">Pending Feedback</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('');
              }}
              className="w-full"
            >
              Reset
            </Button>
          </div>
        </div>
      </Card>

      {/* Interviews List */}
      {isLoading ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">Loading interviews...</p>
        </Card>
      ) : error ? (
        <Card className="p-8 text-center border-red-200 bg-red-50">
          <p className="text-red-600">{error}</p>
          <Button onClick={loadInterviews} className="mt-4">
            Try Again
          </Button>
        </Card>
      ) : filteredInterviews.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No interviews found</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredInterviews.map((interview) => (
            <Card
              key={interview.id}
              className="p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {interview.applicantName}
                  </h3>
                  <p className="text-sm text-gray-600">{interview.jobTitle}</p>

                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(interview.scheduledDate).toLocaleDateString()} {interview.scheduledTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {interview.interviewers.length} interviewer(s)
                    </div>
                    <span className="capitalize text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {interview.interviewType}
                    </span>
                  </div>

                  {interview.meetingLink && (
                    <div className="mt-2">
                      <a
                        href={interview.meetingLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Join Meeting →
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    interview.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                    interview.status === 'completed' ? 'bg-green-100 text-green-800' :
                    interview.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {interview.status.replace(/_/g, ' ')}
                  </div>

                  {interview.feedback && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-xs font-medium">Feedback given</span>
                    </div>
                  )}

                  <div className="flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(`/recruitment/interviews/${interview.id}`)}
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600"
                      onClick={() => {
                        if (confirm('Delete this interview?')) {
                          interviewAPI.cancel(interview.id).then(() => loadInterviews());
                        }
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
