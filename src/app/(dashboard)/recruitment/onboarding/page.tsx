'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { onboardingAPI } from '@/lib/recruitment/api';
import { Search, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [checklists, setChecklists] = useState<any[]>([]);
  const [filteredChecklists, setFilteredChecklists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadChecklists();
  }, []);

  const loadChecklists = async () => {
    try {
      setIsLoading(true);
      const data = await onboardingAPI.getAll();
      setChecklists(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load onboarding data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let filtered = checklists;

    if (searchTerm) {
      filtered = filtered.filter(
        (c) =>
          c.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          c.employeeEmail.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      if (statusFilter === 'pending') {
        filtered = filtered.filter((c) => c.completionStatus < 100);
      } else if (statusFilter === 'completed') {
        filtered = filtered.filter((c) => c.completionStatus === 100);
      }
    }

    setFilteredChecklists(filtered);
  }, [searchTerm, statusFilter, checklists]);

  const stats = {
    total: checklists.length,
    pending: checklists.filter((c) => c.completionStatus < 100).length,
    completed: checklists.filter((c) => c.completionStatus === 100).length,
    inProgress: checklists.filter(
      (c) => c.completionStatus > 0 && c.completionStatus < 100
    ).length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Onboarding Management</h1>
          <p className="text-gray-600 mt-1">
            Digital onboarding checklists and document verification
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-red-600">{stats.pending}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">In Progress</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-gray-600">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
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
              className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Onboarding List */}
      {isLoading ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">Loading onboarding data...</p>
        </Card>
      ) : error ? (
        <Card className="p-8 text-center border-red-200 bg-red-50">
          <p className="text-red-600">{error}</p>
          <Button onClick={loadChecklists} className="mt-4">
            Try Again
          </Button>
        </Card>
      ) : filteredChecklists.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">No onboarding data found</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredChecklists.map((checklist) => (
            <Card
              key={checklist.id}
              className="p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => router.push(`/recruitment/onboarding/${checklist.id}`)}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">
                    {checklist.employeeName}
                  </h3>
                  <p className="text-sm text-gray-600">{checklist.employeeEmail}</p>

                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <span>{checklist.department}</span>
                    <span>Started: {new Date(checklist.startDate).toLocaleDateString()}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-medium text-gray-700">Progress</p>
                      <p className="text-xs font-bold text-blue-600">
                        {checklist.completionStatus}%
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${checklist.completionStatus}%` }}
                      />
                    </div>
                  </div>

                  {/* Completed Items */}
                  {checklist.items && (
                    <div className="mt-3 text-xs text-gray-600">
                      {checklist.items.filter((i: any) => i.status === 'completed').length} of{' '}
                      {checklist.items.length} tasks completed
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-3">
                  {checklist.completionStatus === 100 ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                  ) : checklist.completionStatus > 0 ? (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Clock className="w-5 h-5" />
                      <span className="text-sm font-medium">In Progress</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-red-600">
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Not Started</span>
                    </div>
                  )}

                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
