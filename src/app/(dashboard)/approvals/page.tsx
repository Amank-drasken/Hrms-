'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  leaveService,
  getLeaveTypeLabel,
  type LeaveRequest,
  type LeaveStatus,
} from '@/lib/leaveData';
import { getUserRole } from '@/lib/roleGuard';
import {
  ClipboardCheck,
  Check,
  X,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
} from 'lucide-react';
import { format } from 'date-fns';

type FilterTab = 'PENDING' | 'ALL';

const statusStyles: Record<LeaveStatus, string> = {
  PENDING: 'bg-amber-500/20 text-amber-600 border-amber-500/40',
  APPROVED: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/40',
  REJECTED: 'bg-red-500/20 text-red-600 border-red-500/40',
};

export default function ApprovalsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [tab, setTab] = useState<FilterTab>('PENDING');

  const loadData = useCallback(() => {
    setRequests(
      leaveService
        .getAll()
        .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    );
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    const role = getUserRole();
    if (role !== 'ADMIN' && role !== 'HR') {
      router.push('/dashboard');
      return;
    }
    loadData();
  }, [router, loadData]);

  const handleDecision = (id: string, status: LeaveStatus) => {
    const reviewer = localStorage.getItem('user_firstName') || getUserRole() || 'Manager';
    leaveService.updateStatus(id, status, reviewer);
    loadData();
  };

  const counts = {
    pending: requests.filter((r) => r.status === 'PENDING').length,
    approved: requests.filter((r) => r.status === 'APPROVED').length,
    rejected: requests.filter((r) => r.status === 'REJECTED').length,
  };

  const visible = tab === 'PENDING' ? requests.filter((r) => r.status === 'PENDING') : requests;

  return (
    <div className='min-h-screen bg-background p-8'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center gap-3'>
          <ClipboardCheck className='text-purple-500' size={32} />
          <h1 className='text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent'>
            Leave Approvals
          </h1>
        </div>
        <p className='text-muted-foreground'>Review and act on your team&apos;s leave requests</p>
      </div>

      {/* Summary */}
      <div className='grid grid-cols-3 gap-4 mb-8'>
        <div className='flex items-center gap-3 p-4 rounded-xl border border-border bg-card'>
          <Clock className='text-amber-500' size={24} />
          <div>
            <p className='text-2xl font-bold text-foreground'>{counts.pending}</p>
            <p className='text-xs text-muted-foreground'>Awaiting Action</p>
          </div>
        </div>
        <div className='flex items-center gap-3 p-4 rounded-xl border border-border bg-card'>
          <CheckCircle2 className='text-emerald-500' size={24} />
          <div>
            <p className='text-2xl font-bold text-foreground'>{counts.approved}</p>
            <p className='text-xs text-muted-foreground'>Approved</p>
          </div>
        </div>
        <div className='flex items-center gap-3 p-4 rounded-xl border border-border bg-card'>
          <XCircle className='text-red-500' size={24} />
          <div>
            <p className='text-2xl font-bold text-foreground'>{counts.rejected}</p>
            <p className='text-xs text-muted-foreground'>Rejected</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className='inline-flex items-center gap-1 p-1 rounded-lg bg-muted mb-4'>
        <button
          onClick={() => setTab('PENDING')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            tab === 'PENDING'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Pending ({counts.pending})
        </button>
        <button
          onClick={() => setTab('ALL')}
          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
            tab === 'ALL'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          All Requests ({requests.length})
        </button>
      </div>

      {/* Table */}
      <div className='bg-card rounded-xl border border-border overflow-hidden shadow-lg'>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='border-border hover:bg-transparent'>
                <TableHead className='font-semibold text-muted-foreground bg-card'>Employee</TableHead>
                <TableHead className='font-semibold text-muted-foreground bg-card'>Type</TableHead>
                <TableHead className='font-semibold text-muted-foreground bg-card'>From</TableHead>
                <TableHead className='font-semibold text-muted-foreground bg-card'>To</TableHead>
                <TableHead className='font-semibold text-muted-foreground bg-card'>Days</TableHead>
                <TableHead className='font-semibold text-muted-foreground bg-card'>Reason</TableHead>
                <TableHead className='font-semibold text-muted-foreground bg-card'>Status</TableHead>
                <TableHead className='font-semibold text-muted-foreground bg-card text-right'>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visible.length > 0 ? (
                visible.map((r) => (
                  <TableRow key={r.id} className='border-border hover:bg-muted/40 transition-colors'>
                    <TableCell className='py-3'>
                      <span className='font-semibold text-foreground'>{r.employeeName}</span>
                    </TableCell>
                    <TableCell className='py-3'>
                      <span className='font-semibold text-foreground'>{r.type}</span>
                      <span className='block text-xs text-muted-foreground'>
                        {getLeaveTypeLabel(r.type)}
                      </span>
                    </TableCell>
                    <TableCell className='text-muted-foreground py-3 text-sm'>
                      {format(new Date(r.startDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className='text-muted-foreground py-3 text-sm'>
                      {format(new Date(r.endDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className='text-foreground py-3 font-medium'>{r.days}</TableCell>
                    <TableCell className='text-muted-foreground py-3 text-sm max-w-xs truncate'>
                      {r.reason}
                    </TableCell>
                    <TableCell className='py-3'>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${statusStyles[r.status]}`}
                      >
                        {r.status}
                      </span>
                    </TableCell>
                    <TableCell className='py-3 text-right'>
                      {r.status === 'PENDING' ? (
                        <div className='flex items-center justify-end gap-2'>
                          <Button
                            size='sm'
                            onClick={() => handleDecision(r.id, 'APPROVED')}
                            className='bg-emerald-600 hover:bg-emerald-700'
                          >
                            <Check className='w-3.5 h-3.5 mr-1' />
                            Approve
                          </Button>
                          <Button
                            size='sm'
                            variant='destructive'
                            onClick={() => handleDecision(r.id, 'REJECTED')}
                          >
                            <X className='w-3.5 h-3.5 mr-1' />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className='text-xs text-muted-foreground'>
                          {r.reviewedBy ? `by ${r.reviewedBy}` : '—'}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className='border-border'>
                  <TableCell colSpan={8} className='text-center py-12'>
                    <div className='flex flex-col items-center gap-2'>
                      <Users className='text-muted-foreground' size={32} />
                      <p className='text-muted-foreground'>
                        {tab === 'PENDING'
                          ? 'No pending requests. All caught up!'
                          : 'No leave requests found'}
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
