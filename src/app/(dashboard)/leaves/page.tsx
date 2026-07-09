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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import LeaveForm from '@/components/forms/LeaveForm';
import {
  LEAVE_TYPES,
  leaveService,
  getLeaveTypeLabel,
  type LeaveRequest,
  type LeaveStatus,
} from '@/lib/leaveData';
import { CalendarDays, Plus, Clock, CheckCircle2, XCircle, Plane } from 'lucide-react';
import { format } from 'date-fns';

const statusStyles: Record<LeaveStatus, string> = {
  PENDING: 'bg-amber-500/20 text-amber-600 border-amber-500/40',
  APPROVED: 'bg-emerald-500/20 text-emerald-600 border-emerald-500/40',
  REJECTED: 'bg-red-500/20 text-red-600 border-red-500/40',
};

const typeColors: Record<string, string> = {
  CL: 'from-blue-500 to-cyan-500',
  SL: 'from-rose-500 to-pink-500',
  EL: 'from-emerald-500 to-teal-500',
  WFH: 'from-purple-500 to-indigo-500',
};

export default function LeavesPage() {
  const router = useRouter();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [balance, setBalance] = useState<ReturnType<typeof leaveService.getBalance> | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const loadData = useCallback(() => {
    const employeeId = localStorage.getItem('user_id') || 'me';
    setLeaves(
      leaveService
        .getForEmployee(employeeId)
        .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
    );
    setBalance(leaveService.getBalance(employeeId));
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    loadData();
  }, [router, loadData]);

  const handleSuccess = () => {
    setIsOpen(false);
    loadData();
  };

  const counts = {
    pending: leaves.filter((l) => l.status === 'PENDING').length,
    approved: leaves.filter((l) => l.status === 'APPROVED').length,
    rejected: leaves.filter((l) => l.status === 'REJECTED').length,
  };

  return (
    <div className='min-h-screen bg-background p-8'>
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div>
          <div className='flex items-center gap-3'>
            <Plane className='text-blue-500' size={32} />
            <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent'>
              My Leaves
            </h1>
          </div>
          <p className='text-muted-foreground'>Apply for leave and track your requests</p>
        </div>
        <Button onClick={() => setIsOpen(true)} className='bg-blue-600 hover:bg-blue-700'>
          <Plus className='w-4 h-4 mr-1.5' />
          Apply Leave
        </Button>
      </div>

      {/* Leave Balance */}
      <h2 className='text-lg font-semibold text-foreground mb-3'>Leave Balance</h2>
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        {LEAVE_TYPES.map((t) => {
          const b = balance?.[t.code];
          return (
            <div
              key={t.code}
              className='relative p-6 rounded-xl border border-border bg-card overflow-hidden'
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${typeColors[t.code]} opacity-10`}
              />
              <div className='relative z-10'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='text-sm font-medium text-muted-foreground'>{t.label}</span>
                  <span className='text-xs font-bold px-2 py-0.5 rounded bg-foreground/5 text-foreground'>
                    {t.code}
                  </span>
                </div>
                <p className='text-3xl font-bold text-foreground'>
                  {b ? b.remaining : t.defaultBalance}
                </p>
                <p className='text-xs text-muted-foreground mt-1'>
                  of {b ? b.total : t.defaultBalance} remaining
                  {b && b.used > 0 ? ` · ${b.used} used` : ''}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Status summary */}
      <div className='grid grid-cols-3 gap-4 mb-8'>
        <div className='flex items-center gap-3 p-4 rounded-xl border border-border bg-card'>
          <Clock className='text-amber-500' size={24} />
          <div>
            <p className='text-2xl font-bold text-foreground'>{counts.pending}</p>
            <p className='text-xs text-muted-foreground'>Pending</p>
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

      {/* Leave history */}
      <div className='bg-card rounded-xl border border-border overflow-hidden shadow-lg'>
        <div className='p-6 border-b border-border flex items-center gap-2'>
          <CalendarDays className='w-5 h-5 text-blue-500' />
          <h3 className='text-lg font-semibold text-foreground'>Leave History</h3>
        </div>
        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='border-border hover:bg-transparent'>
                <TableHead className='font-semibold text-muted-foreground bg-card'>Type</TableHead>
                <TableHead className='font-semibold text-muted-foreground bg-card'>From</TableHead>
                <TableHead className='font-semibold text-muted-foreground bg-card'>To</TableHead>
                <TableHead className='font-semibold text-muted-foreground bg-card'>Days</TableHead>
                <TableHead className='font-semibold text-muted-foreground bg-card'>Reason</TableHead>
                <TableHead className='font-semibold text-muted-foreground bg-card'>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaves.length > 0 ? (
                leaves.map((l) => (
                  <TableRow key={l.id} className='border-border hover:bg-muted/40 transition-colors'>
                    <TableCell className='py-3'>
                      <span className='font-semibold text-foreground'>{l.type}</span>
                      <span className='block text-xs text-muted-foreground'>
                        {getLeaveTypeLabel(l.type)}
                      </span>
                    </TableCell>
                    <TableCell className='text-muted-foreground py-3 text-sm'>
                      {format(new Date(l.startDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className='text-muted-foreground py-3 text-sm'>
                      {format(new Date(l.endDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className='text-foreground py-3 font-medium'>{l.days}</TableCell>
                    <TableCell className='text-muted-foreground py-3 text-sm max-w-xs truncate'>
                      {l.reason}
                    </TableCell>
                    <TableCell className='py-3'>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${statusStyles[l.status]}`}
                      >
                        {l.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className='border-border'>
                  <TableCell colSpan={6} className='text-center py-12'>
                    <div className='flex flex-col items-center gap-2'>
                      <CalendarDays className='text-muted-foreground' size={32} />
                      <p className='text-muted-foreground'>No leave requests yet</p>
                      <Button
                        onClick={() => setIsOpen(true)}
                        variant='outline'
                        className='mt-2'
                      >
                        <Plus className='w-4 h-4 mr-1.5' />
                        Apply for your first leave
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Apply Leave Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className='sm:max-w-2xl p-0 border-0 bg-transparent shadow-none'>
          <DialogHeader className='sr-only'>
            <DialogTitle>Apply for Leave</DialogTitle>
          </DialogHeader>
          <LeaveForm onSuccess={handleSuccess} onCancel={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
