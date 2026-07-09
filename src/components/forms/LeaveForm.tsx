'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Loader, CalendarDays } from 'lucide-react';
import { LEAVE_TYPES, countDays, leaveService, type LeaveTypeCode } from '@/lib/leaveData';

const leaveSchema = z
  .object({
    type: z.enum(['CL', 'SL', 'EL', 'WFH'], { message: 'Leave type is required' }),
    startDate: z.string().min(1, 'Start date is required'),
    endDate: z.string().min(1, 'End date is required'),
    reason: z.string().min(5, 'Please provide a reason (at least 5 characters)'),
  })
  .refine((data) => new Date(data.endDate) >= new Date(data.startDate), {
    message: 'End date cannot be before start date',
    path: ['endDate'],
  });

type LeaveFormData = z.infer<typeof leaveSchema>;

interface LeaveFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function LeaveForm({ onSuccess, onCancel }: LeaveFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<LeaveFormData>({
    resolver: zodResolver(leaveSchema),
    defaultValues: {
      type: undefined,
      startDate: '',
      endDate: '',
      reason: '',
    },
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const totalDays = countDays(startDate, endDate);

  const onSubmit = async (data: LeaveFormData) => {
    try {
      setError(null);
      setIsLoading(true);

      const employeeId = localStorage.getItem('user_id') || 'me';
      const firstName = localStorage.getItem('user_firstName') || 'Me';
      const lastName = localStorage.getItem('user_lastName') || '';
      const employeeName = `${firstName} ${lastName}`.trim();

      leaveService.create({
        employeeId,
        employeeName,
        type: data.type as LeaveTypeCode,
        startDate: data.startDate,
        endDate: data.endDate,
        reason: data.reason,
      });

      onSuccess?.();
    } catch (err: any) {
      setError(err?.message || 'Failed to submit leave request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className='p-8'>
      <h1 className='text-2xl font-bold text-gray-900 mb-6'>Apply for Leave</h1>

      {error && (
        <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3'>
          <AlertCircle className='w-5 h-5 text-red-600 mt-0.5 flex-shrink-0' />
          <p className='text-sm text-red-600'>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Leave Type */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Leave Type *
          </label>
          <Controller
            name='type'
            control={control}
            render={({ field }) => (
              <Select value={field.value || ''} onValueChange={field.onChange}>
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select leave type' />
                </SelectTrigger>
                <SelectContent>
                  {LEAVE_TYPES.map((t) => (
                    <SelectItem key={t.code} value={t.code}>
                      {t.code} — {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.type && (
            <p className='mt-1 text-sm text-red-600'>{errors.type.message}</p>
          )}
        </div>

        {/* Date Range */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              From *
            </label>
            <Input {...register('startDate')} type='date' />
            {errors.startDate && (
              <p className='mt-1 text-sm text-red-600'>{errors.startDate.message}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              To *
            </label>
            <Input {...register('endDate')} type='date' min={startDate || undefined} />
            {errors.endDate && (
              <p className='mt-1 text-sm text-red-600'>{errors.endDate.message}</p>
            )}
          </div>
        </div>

        {totalDays > 0 && (
          <div className='flex items-center gap-2 text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2'>
            <CalendarDays className='w-4 h-4' />
            Total: <span className='font-semibold'>{totalDays}</span>{' '}
            {totalDays === 1 ? 'day' : 'days'}
          </div>
        )}

        {/* Reason */}
        <div>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Reason *
          </label>
          <Textarea
            {...register('reason')}
            rows={4}
            placeholder='Briefly describe the reason for your leave...'
          />
          {errors.reason && (
            <p className='mt-1 text-sm text-red-600'>{errors.reason.message}</p>
          )}
        </div>

        {/* Actions */}
        <div className='flex gap-4 justify-end pt-4 border-t'>
          {onCancel && (
            <Button type='button' variant='outline' onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}
          <Button type='submit' disabled={isLoading} className='bg-blue-600 hover:bg-blue-700'>
            {isLoading ? (
              <>
                <Loader className='w-4 h-4 mr-2 animate-spin' />
                Submitting...
              </>
            ) : (
              'Submit Request'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
