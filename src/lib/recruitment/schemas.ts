import { z } from 'zod';

// Job Requisition Schema
export const JobRequisitionSchema = z.object({
  title: z.string().min(3, 'Job title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  department: z.string().min(1, 'Department is required'),
  reportingTo: z.string().min(1, 'Reporting manager is required'),
  salary_min: z.number().positive('Minimum salary must be positive'),
  salary_max: z.number().positive('Maximum salary must be positive'),
  currency: z.string().optional(),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'temporary']),
  location: z.string().min(1, 'Location is required'),
  requiredSkills: z.array(z.string()).min(1, 'At least one skill is required'),
  experience_years: z.number().min(0, 'Experience cannot be negative'),
  education: z.string().min(1, 'Education requirement is required'),
});

export type JobRequisitionFormData = z.infer<typeof JobRequisitionSchema>;

// Applicant Schema
export const ApplicantFilterSchema = z.object({
  jobId: z.string().optional(),
  status: z.string().optional(),
  source: z.string().optional(),
  searchTerm: z.string().optional(),
});

export type ApplicantFilterData = z.infer<typeof ApplicantFilterSchema>;

// Interview Scheduling Schema
export const InterviewScheduleSchema = z.object({
  interviewType: z.enum(['phone', 'video', 'in-person', 'group']),
  scheduledDate: z.string().min(1, 'Interview date is required'),
  scheduledTime: z.string().min(1, 'Interview time is required'),
  duration: z.number().min(15, 'Duration must be at least 15 minutes'),
  interviewers: z.array(z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  })).min(1, 'At least one interviewer is required'),
  meetingLink: z.string().url().optional().or(z.literal('')),
  notes: z.string().optional(),
});

export type InterviewScheduleData = z.infer<typeof InterviewScheduleSchema>;

// Interview Feedback Schema
export const InterviewFeedbackSchema = z.object({
  overallRating: z.number().min(1).max(5),
  technicalSkills: z.number().min(1).max(5),
  communication: z.number().min(1).max(5),
  cultureFit: z.number().min(1).max(5),
  comments: z.string().min(10, 'Comments must be at least 10 characters'),
  recommendation: z.enum(['strong_yes', 'yes', 'maybe', 'no', 'strong_no']),
});

export type InterviewFeedbackData = z.infer<typeof InterviewFeedbackSchema>;

// Offer Letter Schema
export const OfferLetterSchema = z.object({
  salary: z.number().positive('Salary must be positive'),
  currency: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  benefits: z.array(z.string()).optional(),
  reportingManager: z.string().min(1, 'Reporting manager is required'),
  expiryDate: z.string().min(1, 'Expiry date is required'),
});

export type OfferLetterData = z.infer<typeof OfferLetterSchema>;

// Onboarding Checklist Schema
export const OnboardingChecklistItemSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  category: z.enum(['it_setup', 'compliance', 'training', 'paperwork', 'other']),
  dueDate: z.string().min(1, 'Due date is required'),
  assignedTo: z.string().optional(),
});

export type OnboardingChecklistItemData = z.infer<typeof OnboardingChecklistItemSchema>;

// Document Upload Schema
export const DocumentUploadSchema = z.object({
  documentType: z.enum(['aadhar', 'pan', 'bank_details', 'offer_letter', 'nda', 'contract', 'other']),
  documentName: z.string().min(1, 'Document name is required'),
  expiryDate: z.string().optional(),
});

export type DocumentUploadData = z.infer<typeof DocumentUploadSchema>;
