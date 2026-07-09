'use client';

import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, Loader } from 'lucide-react';
import { attendanceAPI } from '@/lib/api';
import { employeeAPIWithFallback } from '@/lib/apiWithFallback';

const attendanceSchema = z.object({
  employeeId: z.string().min(1, 'Employee is required'),
  date: z.string().min(1, 'Date is required'),
  checkIn: z.string().min(1, 'Check In time is required'),
  checkOut: z.string().optional(),
});

type AttendanceFormData = z.infer<typeof attendanceSchema>;

interface AttendanceFormProps {
  onSuccess?: () => void;
}

export default function AttendanceForm({ onSuccess }: AttendanceFormProps) {
  const [employees, setEmployees] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AttendanceFormData>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: {
      employeeId: '',
      date: '',
      checkIn: '',
      checkOut: '',
    },
  });

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await employeeAPIWithFallback.getAll();
        setEmployees(res.data);
      } catch (err) {
        setError('Failed to load employees');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchEmployees();
  }, []);

  const onSubmit = async (data: AttendanceFormData) => {
    try {
      setError(null);
      setIsLoading(true);

      await attendanceAPI.create(data);

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create attendance record');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingData) {
    return (
      <Card className='p-8'>
        <div className='flex items-center justify-center'>
          <Loader className='w-6 h-6 animate-spin text-blue-600' />
        </div>
      </Card>
    );
  }

  return (
    <Card className='p-8'>
      <h1 className='text-2xl font-bold text-gray-900 mb-6'>Add Attendance</h1>

      {error && (
        <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3'>
          <AlertCircle className='w-5 h-5 text-red-600 mt-0.5 flex-shrink-0' />
          <p className='text-sm text-red-600'>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Employee *
            </label>
            <Controller
              name='employeeId'
              control={control}
              render={({ field }) => (
                <Select value={field.value || ''} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select employee' />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={String(emp.id)}>
                        {emp.firstName} {emp.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.employeeId && (
              <p className='mt-1 text-sm text-red-600'>{errors.employeeId.message}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Date *
            </label>
            <Controller
              name='date'
              control={control}
              render={({ field }) => (
                <Input {...field} type='date' />
              )}
            />
            {errors.date && (
              <p className='mt-1 text-sm text-red-600'>{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Check In Time *
            </label>
            <Controller
              name='checkIn'
              control={control}
              render={({ field }) => (
                <Input {...field} type='time' />
              )}
            />
            {errors.checkIn && (
              <p className='mt-1 text-sm text-red-600'>{errors.checkIn.message}</p>
            )}
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Check Out Time
            </label>
            <Controller
              name='checkOut'
              control={control}
              render={({ field }) => (
                <Input {...field} type='time' />
              )}
            />
          </div>
        </div>

        <div className='flex gap-4 justify-end pt-4 border-t'>
          <Button type='submit' disabled={isLoading} className='bg-blue-600 hover:bg-blue-700'>
            {isLoading ? (
              <>
                <Loader className='w-4 h-4 mr-2 animate-spin' />
                Creating...
              </>
            ) : (
              'Add Attendance'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
