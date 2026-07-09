'use client';

import { JobStatus, ApprovalStatus } from '@/lib/recruitment/types';
import { Check, Clock, X, Loader } from 'lucide-react';

interface StatusBadgeProps {
  status: JobStatus | ApprovalStatus;
  variant?: 'compact' | 'detailed';
}

export function JobStatusBadge({ status, variant = 'compact' }: StatusBadgeProps) {
  const statusConfig = {
    draft: { color: 'bg-gray-100 text-gray-800', icon: null, label: 'Draft' },
    pending_approval: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending Approval' },
    approved: { color: 'bg-green-100 text-green-800', icon: Check, label: 'Approved' },
    open: { color: 'bg-blue-100 text-blue-800', icon: null, label: 'Open' },
    closed: { color: 'bg-gray-100 text-gray-800', icon: X, label: 'Closed' },
    filled: { color: 'bg-green-100 text-green-800', icon: Check, label: 'Filled' },
    rejected: { color: 'bg-red-100 text-red-800', icon: X, label: 'Rejected' },
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, label: 'Pending' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      {Icon && <Icon className="w-3 h-3" />}
      {config.label}
    </div>
  );
}

interface JobCardProps {
  job: any;
  onSelect?: (job: any) => void;
  onEdit?: (job: any) => void;
  onDelete?: (jobId: string) => void;
  onApprove?: (jobId: string) => void;
  onReject?: (jobId: string) => void;
}

export function JobCard({
  job,
  onSelect,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}: JobCardProps) {
  return (
    <div
      onClick={() => onSelect?.(job)}
      className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">{job.title}</h3>
          <p className="text-sm text-gray-600 mt-1">{job.department}</p>
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <span>{job.location}</span>
            <span>{job.employmentType}</span>
            <span>Exp: {job.experience_years}+ years</span>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-sm font-semibold">{job.currency} {job.salary_min.toLocaleString()} - {job.salary_max.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <JobStatusBadge status={job.status} />
          {job.approvalStatus && <JobStatusBadge status={job.approvalStatus} />}
        </div>
      </div>

      {/* Skills */}
      {job.requiredSkills && job.requiredSkills.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <p className="text-xs font-semibold text-gray-600 mb-2">Skills</p>
          <div className="flex flex-wrap gap-2">
            {job.requiredSkills.slice(0, 5).map((skill: string) => (
              <span key={skill} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
            {job.requiredSkills.length > 5 && (
              <span className="text-xs text-gray-600">+{job.requiredSkills.length - 5} more</span>
            )}
          </div>
        </div>
      )}

      {/* Actions based on status */}
      {(job.status === 'draft' || job.status === 'pending_approval') && (
        <div className="mt-4 pt-4 border-t flex gap-2">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(job);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(job.id);
              }}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Delete
            </button>
          )}
          {job.status === 'draft' && onApprove && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApprove(job.id);
              }}
              className="text-sm text-green-600 hover:text-green-800 font-medium"
            >
              Submit for Approval
            </button>
          )}
        </div>
      )}
    </div>
  );
}
