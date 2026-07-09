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
import { authAPI, employeeAPI } from '@/lib/api';
import { departmentAPIWithFallback, locationAPIWithFallback } from '@/lib/apiWithFallback';

const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Phone must be at least 10 characters'),
  dob: z.string().min(1, 'Date of birth is required'),
  currentAddress: z.string().min(1, 'Current address is required'),
  permanentAddress: z.string().min(1, 'Permanent address is required'),
  maritalStatus: z.string().min(1, 'Marital status is required'),
  bloodGroup: z.string().min(1, 'Blood group is required'),
  physicallyHandicapped: z.boolean(),
  nationality: z.string().min(1, 'Nationality is required'),
  role: z.string().min(1, 'Role is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  departmentId: z.string().optional(),
  locationId: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  onSuccess?: () => void;
}

export default function EmployeeForm({ onSuccess }: EmployeeFormProps) {
  const [departments, setDepartments] = useState<any[]>([]);
  const [locations, setLocations] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      phone: '',
      dob: '',
      currentAddress: '',
      permanentAddress: '',
      maritalStatus: '',
      bloodGroup: '',
      physicallyHandicapped: false,
      nationality: '',
      role: '',
      password: '',
      departmentId: '',
      locationId: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, locRes] = await Promise.all([
          departmentAPIWithFallback.getAll(),
          locationAPIWithFallback.getAll(),
        ]);
        setDepartments(deptRes.data);
        setLocations(locRes.data);
      } catch (err) {
        setError('Failed to load departments and locations');
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      setError(null);
      setIsLoading(true);

      // Use authAPI.createEmployee which calls /auth/register endpoint
      await authAPI.createEmployee({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: data.role,
        phone: data.phone,
        dob: data.dob,
        currentAddress: data.currentAddress,
        permanentAddress: data.permanentAddress,
        maritalStatus: data.maritalStatus,
        bloodGroup: data.bloodGroup,
        physicallyHandicapped: data.physicallyHandicapped,
        nationality: data.nationality,
        departmentId: data.departmentId ? parseInt(data.departmentId) : undefined,
        locationId: data.locationId ? parseInt(data.locationId) : undefined,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create employee');
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
      <h1 className='text-2xl font-bold text-gray-900 mb-6'>Create Employee</h1>

      {error && (
        <div className='mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3'>
          <AlertCircle className='w-5 h-5 text-red-600 mt-0.5 flex-shrink-0' />
          <p className='text-sm text-red-600'>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
        {/* Personal Information */}
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Personal Information
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                First Name *
              </label>
              <Input {...register('firstName')} placeholder='John' />
              {errors.firstName && (
                <p className='mt-1 text-sm text-red-600'>{errors.firstName.message}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Middle Name
              </label>
              <Input {...register('middleName')} placeholder='M' />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Last Name *
              </label>
              <Input {...register('lastName')} placeholder='Doe' />
              {errors.lastName && (
                <p className='mt-1 text-sm text-red-600'>{errors.lastName.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Contact Information
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email *
              </label>
              <Input {...register('email')} placeholder='john@example.com' type='email' />
              {errors.email && (
                <p className='mt-1 text-sm text-red-600'>{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Phone *
              </label>
              <Input {...register('phone')} placeholder='+1 (555) 000-0000' />
              {errors.phone && (
                <p className='mt-1 text-sm text-red-600'>{errors.phone.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Personal Details */}
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Personal Details
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Date of Birth *
              </label>
              <Input {...register('dob')} type='date' />
              {errors.dob && (
                <p className='mt-1 text-sm text-red-600'>{errors.dob.message}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Blood Group *
              </label>
              <Controller
                name='bloodGroup'
                control={control}
                render={({ field }) => (
                  <Select value={field.value || ''} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select blood group' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='O+'>O+</SelectItem>
                      <SelectItem value='O-'>O-</SelectItem>
                      <SelectItem value='A+'>A+</SelectItem>
                      <SelectItem value='A-'>A-</SelectItem>
                      <SelectItem value='B+'>B+</SelectItem>
                      <SelectItem value='B-'>B-</SelectItem>
                      <SelectItem value='AB+'>AB+</SelectItem>
                      <SelectItem value='AB-'>AB-</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.bloodGroup && (
                <p className='mt-1 text-sm text-red-600'>{errors.bloodGroup.message}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Marital Status *
              </label>
              <Controller
                name='maritalStatus'
                control={control}
                render={({ field }) => (
                  <Select value={field.value || ''} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select marital status' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='Single'>Single</SelectItem>
                      <SelectItem value='Married'>Married</SelectItem>
                      <SelectItem value='Divorced'>Divorced</SelectItem>
                      <SelectItem value='Widowed'>Widowed</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.maritalStatus && (
                <p className='mt-1 text-sm text-red-600'>{errors.maritalStatus.message}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Nationality *
              </label>
              <Input {...register('nationality')} placeholder='Indian' />
              {errors.nationality && (
                <p className='mt-1 text-sm text-red-600'>{errors.nationality.message}</p>
              )}
            </div>

            <div className='flex items-end gap-2'>
              <label className='flex items-center gap-2 text-sm font-medium text-gray-700'>
                <input type='checkbox' {...register('physicallyHandicapped')} />
                Physically Handicapped
              </label>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Address Information
          </h3>
          <div className='grid grid-cols-1 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Current Address *
              </label>
              <Input {...register('currentAddress')} placeholder='123 Main St, City, State' />
              {errors.currentAddress && (
                <p className='mt-1 text-sm text-red-600'>{errors.currentAddress.message}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Permanent Address *
              </label>
              <Input {...register('permanentAddress')} placeholder='456 Oak Ave, City, State' />
              {errors.permanentAddress && (
                <p className='mt-1 text-sm text-red-600'>{errors.permanentAddress.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Professional Information */}
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Professional Information
          </h3>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Role *
              </label>
              <Input {...register('role')} placeholder='e.g., Manager, Developer' />
              {errors.role && (
                <p className='mt-1 text-sm text-red-600'>{errors.role.message}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Department
              </label>
              <Controller
                name='departmentId'
                control={control}
                render={({ field }) => (
                  <Select value={field.value || ''} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select department' />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={String(dept.id)}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.departmentId && (
                <p className='mt-1 text-sm text-red-600'>{errors.departmentId.message}</p>
              )}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Location
              </label>
              <Controller
                name='locationId'
                control={control}
                render={({ field }) => (
                  <Select value={field.value || ''} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder='Select location' />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc.id} value={String(loc.id)}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.locationId && (
                <p className='mt-1 text-sm text-red-600'>{errors.locationId.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Account Information
          </h3>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Password *
            </label>
            <Input {...register('password')} type='password' placeholder='••••••••' />
            {errors.password && (
              <p className='mt-1 text-sm text-red-600'>{errors.password.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className='flex gap-4 justify-end pt-4 border-t'>
          <Button type='submit' disabled={isLoading} className='bg-blue-600 hover:bg-blue-700'>
            {isLoading ? (
              <>
                <Loader className='w-4 h-4 mr-2 animate-spin' />
                Creating...
              </>
            ) : (
              'Create Employee'
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
