'use client';

import { Applicant, CandidateStatus } from '@/lib/recruitment/types';
import { Button } from '@/components/ui/button';
import { Mail, Phone, ExternalLink, Trash2, Eye } from 'lucide-react';

interface ApplicantStatusBadgeProps {
  status: CandidateStatus;
}

export function ApplicantStatusBadge({ status }: ApplicantStatusBadgeProps) {
  const statusConfig = {
    applied: { color: 'bg-blue-100 text-blue-800', label: 'Applied' },
    screening: { color: 'bg-yellow-100 text-yellow-800', label: 'Screening' },
    shortlisted: { color: 'bg-green-100 text-green-800', label: 'Shortlisted' },
    interview_scheduled: { color: 'bg-purple-100 text-purple-800', label: 'Interview Scheduled' },
    offer_extended: { color: 'bg-indigo-100 text-indigo-800', label: 'Offer Extended' },
    rejected: { color: 'bg-red-100 text-red-800', label: 'Rejected' },
    hired: { color: 'bg-green-600 text-white', label: 'Hired' },
    archived: { color: 'bg-gray-100 text-gray-800', label: 'Archived' },
  };

  const config = statusConfig[status];

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      {config.label}
    </span>
  );
}

interface ApplicantCardProps {
  applicant: Applicant;
  onView?: (applicant: Applicant) => void;
  onEdit?: (applicant: Applicant) => void;
  onDelete?: (applicantId: string) => void;
  onStatusChange?: (applicantId: string, status: CandidateStatus) => void;
}

export function ApplicantCard({
  applicant,
  onView,
  onEdit,
  onDelete,
  onStatusChange,
}: ApplicantCardProps) {
  return (
    <div className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-900">
            {applicant.firstName} {applicant.lastName}
          </h3>
          <p className="text-sm text-gray-600 mt-1">{applicant.jobTitle}</p>

          {/* Contact Info */}
          <div className="flex items-center gap-4 mt-3 text-sm">
            <a
              href={`mailto:${applicant.email}`}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <Mail className="w-3 h-3" />
              {applicant.email}
            </a>
            <a
              href={`tel:${applicant.phone}`}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <Phone className="w-3 h-3" />
              {applicant.phone}
            </a>
          </div>

          {/* Details */}
          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
            <span>{applicant.yearsOfExperience} years experience</span>
            {applicant.currentPosition && <span>{applicant.currentPosition}</span>}
            <span>{new Date(applicant.appliedDate).toLocaleDateString()}</span>
          </div>

          {/* Skills */}
          {applicant.skills && applicant.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {applicant.skills.slice(0, 4).map((skill) => (
                <span key={skill} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
              {applicant.skills.length > 4 && (
                <span className="text-xs text-gray-600">+{applicant.skills.length - 4}</span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col items-end gap-2">
          <ApplicantStatusBadge status={applicant.status} />
          {applicant.resume_score && (
            <div className="text-right">
              <p className="text-xs text-gray-600">Resume Match</p>
              <p className="text-lg font-bold text-blue-600">{applicant.resume_score}%</p>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 pt-4 border-t flex justify-between">
        <div className="flex gap-2">
          {onView && (
            <Button
              onClick={() => onView(applicant)}
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <Eye className="w-3 h-3" />
              View
            </Button>
          )}
          {applicant.resumeUrl && (
            <a href={applicant.resumeUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" className="gap-1">
                <ExternalLink className="w-3 h-3" />
                Resume
              </Button>
            </a>
          )}
        </div>

        {onDelete && (
          <Button
            onClick={() => onDelete(applicant.id)}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700 gap-1"
          >
            <Trash2 className="w-3 h-3" />
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}

interface ApplicantTableProps {
  applicants: Applicant[];
  onSelect?: (applicant: Applicant) => void;
  onStatusChange?: (applicantId: string, status: CandidateStatus) => void;
}

export function ApplicantTable({ applicants, onSelect, onStatusChange }: ApplicantTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Job Title</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Match</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Applied</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {applicants.map((applicant) => (
            <tr
              key={applicant.id}
              onClick={() => onSelect?.(applicant)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3 text-sm text-gray-900 font-medium">
                {applicant.firstName} {applicant.lastName}
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">{applicant.email}</td>
              <td className="px-4 py-3 text-sm text-gray-600">{applicant.jobTitle}</td>
              <td className="px-4 py-3 text-sm">
                <ApplicantStatusBadge status={applicant.status} />
              </td>
              <td className="px-4 py-3 text-sm font-medium text-blue-600">
                {applicant.resume_score}%
              </td>
              <td className="px-4 py-3 text-sm text-gray-600">
                {new Date(applicant.appliedDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-sm">
                {applicant.resumeUrl && (
                  <a
                    href={applicant.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Resume
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
