'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { JobRequisitionSchema, JobRequisitionFormData } from '@/lib/recruitment/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { X, Plus } from 'lucide-react';

interface JobFormProps {
  initialData?: any;
  onSubmit: (data: JobRequisitionFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function JobRequisitionForm({ initialData, onSubmit, onCancel, isLoading }: JobFormProps) {
  const router = useRouter();
  const [skills, setSkills] = useState<string[]>(initialData?.requiredSkills || []);
  const [skillInput, setSkillInput] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<JobRequisitionFormData>({
    resolver: zodResolver(JobRequisitionSchema),
    defaultValues: initialData,
  });

  const minSalary = watch('salary_min');
  const maxSalary = watch('salary_max');

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleFormSubmit = handleSubmit(async (data) => {
    await onSubmit({
      ...data,
      requiredSkills: skills,
    });
  });

  return (
    <Card className="p-6">
      <form onSubmit={handleFormSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Information</h3>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Senior Developer, Manager, etc."
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>}
            </div>

            <div>
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                {...register('department')}
                placeholder="Engineering, Sales, etc."
                className={errors.department ? 'border-red-500' : ''}
              />
              {errors.department && (
                <p className="text-sm text-red-500 mt-1">{errors.department.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="reportingTo">Reporting To *</Label>
              <Input
                id="reportingTo"
                {...register('reportingTo')}
                placeholder="Manager name"
                className={errors.reportingTo ? 'border-red-500' : ''}
              />
              {errors.reportingTo && (
                <p className="text-sm text-red-500 mt-1">{errors.reportingTo.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                {...register('location')}
                placeholder="City, Country"
                className={errors.location ? 'border-red-500' : ''}
              />
              {errors.location && (
                <p className="text-sm text-red-500 mt-1">{errors.location.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="employmentType">Employment Type *</Label>
              <select
                id="employmentType"
                {...register('employmentType')}
                className="mt-1 h-9 w-full rounded-lg border border-border bg-input px-2.5 text-sm outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/20"
              >
                <option value="">Select type</option>
                <option value="full-time">Full-Time</option>
                <option value="part-time">Part-Time</option>
                <option value="contract">Contract</option>
                <option value="temporary">Temporary</option>
              </select>
              {errors.employmentType && (
                <p className="text-sm text-red-500 mt-1">{errors.employmentType.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="description">Job Description *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Detailed job description, responsibilities, and expectations..."
              rows={6}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>
            )}
          </div>
        </div>

        {/* Compensation */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Compensation</h3>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="salary_min">Minimum Salary *</Label>
              <Input
                id="salary_min"
                type="number"
                {...register('salary_min', { valueAsNumber: true })}
                placeholder="0"
                className={errors.salary_min ? 'border-red-500' : ''}
              />
              {errors.salary_min && (
                <p className="text-sm text-red-500 mt-1">{errors.salary_min.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="salary_max">Maximum Salary *</Label>
              <Input
                id="salary_max"
                type="number"
                {...register('salary_max', { valueAsNumber: true })}
                placeholder="0"
                className={errors.salary_max ? 'border-red-500' : ''}
              />
              {errors.salary_max && (
                <p className="text-sm text-red-500 mt-1">{errors.salary_max.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="currency">Currency *</Label>
              <Input
                id="currency"
                {...register('currency')}
                placeholder="INR"
                className={errors.currency ? 'border-red-500' : ''}
              />
              {errors.currency && (
                <p className="text-sm text-red-500 mt-1">{errors.currency.message}</p>
              )}
            </div>
          </div>

          {minSalary && maxSalary && minSalary > maxSalary && (
            <p className="text-sm text-red-500">Minimum salary should be less than maximum</p>
          )}
        </div>

        {/* Requirements */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Requirements</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="experience_years">Years of Experience *</Label>
              <Input
                id="experience_years"
                type="number"
                {...register('experience_years', { valueAsNumber: true })}
                placeholder="0"
                className={errors.experience_years ? 'border-red-500' : ''}
              />
              {errors.experience_years && (
                <p className="text-sm text-red-500 mt-1">{errors.experience_years.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="education">Education *</Label>
              <Input
                id="education"
                {...register('education')}
                placeholder="Bachelor's, Master's, etc."
                className={errors.education ? 'border-red-500' : ''}
              />
              {errors.education && (
                <p className="text-sm text-red-500 mt-1">{errors.education.message}</p>
              )}
            </div>
          </div>

          {/* Skills */}
          <div>
            <Label>Required Skills *</Label>
            <div className="flex gap-2 mb-3">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                placeholder="Add a skill and press Enter"
              />
              <Button
                type="button"
                onClick={handleAddSkill}
                variant="outline"
                className="px-3"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <div
                    key={skill}
                    className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {errors.requiredSkills && (
              <p className="text-sm text-red-500 mt-1">{errors.requiredSkills.message}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => (onCancel ? onCancel() : router.back())}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Saving...' : initialData ? 'Update Requisition' : 'Create Requisition'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
