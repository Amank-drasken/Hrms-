// Job Requisition Types
export type JobStatus = 'draft' | 'pending_approval' | 'approved' | 'open' | 'closed' | 'filled' | 'rejected';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface JobRequisition {
  id: string;
  title: string;
  description: string;
  department: string;
  reportingTo: string;
  salary_min: number;
  salary_max: number;
  currency: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'temporary';
  location: string;
  requiredSkills: string[];
  experience_years: number;
  education: string;
  status: JobStatus;
  approvalStatus?: ApprovalStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
}

// Applicant & ATS Types
export type CandidateStatus = 'applied' | 'screening' | 'shortlisted' | 'interview_scheduled' | 'offer_extended' | 'rejected' | 'hired' | 'archived';
export type ApplicationSource = 'website' | 'linkedin' | 'referral' | 'job_portal' | 'others';

export interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  jobId: string;
  jobTitle: string;
  appliedDate: string;
  status: CandidateStatus;
  source: ApplicationSource;
  resumeUrl?: string;
  portfolioUrl?: string;
  coverLetter?: string;
  yearsOfExperience: number;
  currentCompany?: string;
  currentPosition?: string;
  skills: string[];
  resume_score?: number; // 0-100 AI-based scoring
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Interview Types
export type InterviewType = 'phone' | 'video' | 'in-person' | 'group';
export type InterviewStatus = 'scheduled' | 'completed' | 'cancelled' | 'pending_feedback';

export interface Interview {
  id: string;
  applicantId: string;
  applicantName: string;
  jobId: string;
  jobTitle: string;
  interviewType: InterviewType;
  status: InterviewStatus;
  scheduledDate: string;
  scheduledTime: string;
  duration: number; // in minutes
  interviewers: {
    id: string;
    name: string;
    email: string;
  }[];
  meetingLink?: string;
  notes?: string;
  feedback?: InterviewFeedback;
  createdAt: string;
  updatedAt: string;
}

export interface InterviewFeedback {
  overallRating: number; // 1-5
  technicalSkills: number; // 1-5
  communication: number; // 1-5
  cultureFit: number; // 1-5
  comments: string;
  recommendation: 'strong_yes' | 'yes' | 'maybe' | 'no' | 'strong_no';
  submittedBy: string;
  submittedAt: string;
}

// Offer Letter Types
export interface OfferLetter {
  id: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  jobId: string;
  jobTitle: string;
  position: string;
  salary: number;
  currency: string;
  startDate: string;
  benefits?: string[];
  reportingManager: string;
  documentUrl?: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  expiryDate: string;
  sentDate?: string;
  acceptedDate?: string;
  rejectedDate?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
}

// Onboarding Types
export type OnboardingStep = 'pending' | 'in_progress' | 'completed' | 'skipped';

export interface OnboardingChecklist {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  department: string;
  startDate: string;
  completionStatus: number; // 0-100 percentage
  items: OnboardingItem[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface OnboardingItem {
  id: string;
  title: string;
  description: string;
  category: 'it_setup' | 'compliance' | 'training' | 'paperwork' | 'other';
  status: OnboardingStep;
  dueDate: string;
  assignedTo?: string;
  completedBy?: string;
  completedAt?: string;
  comments?: string;
}

// Document Types for Onboarding
export interface OnboardingDocument {
  id: string;
  employeeId: string;
  documentType: 'aadhar' | 'pan' | 'bank_details' | 'offer_letter' | 'nda' | 'contract' | 'other';
  documentName: string;
  fileUrl: string;
  uploadedBy: string;
  uploadedAt: string;
  verificationStatus: 'pending' | 'verified' | 'rejected';
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;
  expiryDate?: string;
}

// Onboarding Session Type
export interface OnboardingSession {
  id: string;
  employeeId: string;
  employeeName: string;
  sessionType: 'orientation' | 'team_intro' | 'system_training' | 'compliance' | 'other';
  sessionDate: string;
  sessionTime: string;
  facilitator: string;
  attendees: string[];
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
