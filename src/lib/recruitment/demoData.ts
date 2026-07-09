// Recruitment demo data + localStorage-backed service.
// The rest of the app runs in mock mode (NEXT_PUBLIC_MOCK_AUTH=true) with no
// recruitment backend, so this layer makes the whole recruitment module work
// offline AND stay in sync: jobs, applicants, interviews, offers and onboarding
// all read/write the same persisted store, so anything created in one page
// shows up everywhere (lists, detail pages, dashboard) and survives reloads.

import {
  JobRequisition,
  Applicant,
  Interview,
  OfferLetter,
  OnboardingChecklist,
  OnboardingDocument,
  InterviewFeedback,
  CandidateStatus,
} from './types';

// ---- Mock-mode detection (mirrors src/lib/api.ts) ----
export function isRecruitmentMockMode(): boolean {
  if (process.env.NEXT_PUBLIC_MOCK_AUTH === 'true') return true;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token') === 'mock-access-token';
  }
  return false;
}

// ---- Storage keys ----
const KEYS = {
  jobs: 'hr_recruitment_jobs',
  applicants: 'hr_recruitment_applicants',
  interviews: 'hr_recruitment_interviews',
  offers: 'hr_recruitment_offers',
  onboarding: 'hr_recruitment_onboarding',
  documents: 'hr_recruitment_documents',
};

const now = new Date();
const iso = (d: Date) => d.toISOString();
const addDays = (n: number) => {
  const d = new Date(now);
  d.setDate(d.getDate() + n);
  return d;
};
const nowIso = iso(now);

function currentUser(): string {
  if (typeof window === 'undefined') return 'HR Admin';
  const f = localStorage.getItem('user_firstName') || 'HR';
  const l = localStorage.getItem('user_lastName') || 'Admin';
  return `${f} ${l}`.trim();
}

// ---- Seed data (cross-referenced so modules stay consistent) ----
const seedJobs: JobRequisition[] = [
  {
    id: 'job-1',
    title: 'Senior Frontend Engineer',
    description:
      'Build and maintain our customer-facing React/Next.js applications. Work closely with design and backend teams to deliver delightful, accessible UIs.',
    department: 'Engineering',
    reportingTo: 'Engineering Manager',
    salary_min: 1200000,
    salary_max: 1800000,
    currency: 'INR',
    employmentType: 'full-time',
    location: 'Bangalore',
    requiredSkills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
    experience_years: 4,
    education: 'B.Tech / B.E. in Computer Science or equivalent',
    status: 'open',
    approvalStatus: 'approved',
    createdBy: 'HR Admin',
    createdAt: iso(addDays(-30)),
    updatedAt: iso(addDays(-20)),
    approvedBy: 'CTO',
    approvedAt: iso(addDays(-25)),
  },
  {
    id: 'job-2',
    title: 'Sales Executive',
    description:
      'Drive new business by managing the full sales cycle, from prospecting to close. Build long-term relationships with enterprise clients.',
    department: 'Sales',
    reportingTo: 'Sales Head',
    salary_min: 600000,
    salary_max: 900000,
    currency: 'INR',
    employmentType: 'full-time',
    location: 'Mumbai',
    requiredSkills: ['B2B Sales', 'Negotiation', 'CRM', 'Lead Generation'],
    experience_years: 2,
    education: 'MBA or Bachelor’s degree',
    status: 'open',
    approvalStatus: 'approved',
    createdBy: 'HR Admin',
    createdAt: iso(addDays(-22)),
    updatedAt: iso(addDays(-15)),
    approvedBy: 'Sales Head',
    approvedAt: iso(addDays(-18)),
  },
  {
    id: 'job-3',
    title: 'HR Manager',
    description:
      'Lead the people function: hiring, employee engagement, policy and performance management for a fast-growing team.',
    department: 'Human Resources',
    reportingTo: 'COO',
    salary_min: 900000,
    salary_max: 1300000,
    currency: 'INR',
    employmentType: 'full-time',
    location: 'Delhi',
    requiredSkills: ['Recruitment', 'Employee Relations', 'HRMS', 'Payroll'],
    experience_years: 5,
    education: 'MBA in HR',
    status: 'pending_approval',
    approvalStatus: 'pending',
    createdBy: 'HR Admin',
    createdAt: iso(addDays(-6)),
    updatedAt: iso(addDays(-6)),
  },
  {
    id: 'job-4',
    title: 'Backend Engineer',
    description:
      'Design and build scalable APIs and services. Own data models, performance and reliability of core platform services.',
    department: 'Engineering',
    reportingTo: 'Engineering Manager',
    salary_min: 1400000,
    salary_max: 2000000,
    currency: 'INR',
    employmentType: 'full-time',
    location: 'Remote',
    requiredSkills: ['Node.js', 'PostgreSQL', 'NestJS', 'AWS'],
    experience_years: 4,
    education: 'B.Tech / B.E. in Computer Science',
    status: 'draft',
    createdBy: 'HR Admin',
    createdAt: iso(addDays(-2)),
    updatedAt: iso(addDays(-2)),
  },
];

const seedApplicants: Applicant[] = [
  {
    id: 'app-1', firstName: 'Aarav', lastName: 'Sharma', email: 'aarav.sharma@example.com',
    phone: '+91-98200-11001', jobId: 'job-1', jobTitle: 'Senior Frontend Engineer',
    appliedDate: iso(addDays(-18)), status: 'shortlisted', source: 'linkedin',
    yearsOfExperience: 5, currentCompany: 'Webscale Inc', currentPosition: 'Frontend Engineer',
    skills: ['React', 'Next.js', 'TypeScript'], resume_score: 88,
    resumeUrl: '#', createdAt: iso(addDays(-18)), updatedAt: iso(addDays(-10)),
  },
  {
    id: 'app-2', firstName: 'Diya', lastName: 'Patel', email: 'diya.patel@example.com',
    phone: '+91-98200-11002', jobId: 'job-1', jobTitle: 'Senior Frontend Engineer',
    appliedDate: iso(addDays(-16)), status: 'interview_scheduled', source: 'referral',
    yearsOfExperience: 6, currentCompany: 'PixelCraft', currentPosition: 'Senior UI Engineer',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Testing'], resume_score: 92,
    resumeUrl: '#', createdAt: iso(addDays(-16)), updatedAt: iso(addDays(-5)),
  },
  {
    id: 'app-3', firstName: 'Rohan', lastName: 'Mehta', email: 'rohan.mehta@example.com',
    phone: '+91-98200-11003', jobId: 'job-2', jobTitle: 'Sales Executive',
    appliedDate: iso(addDays(-12)), status: 'applied', source: 'website',
    yearsOfExperience: 3, currentCompany: 'GrowthLabs', currentPosition: 'Sales Associate',
    skills: ['B2B Sales', 'CRM', 'Negotiation'], resume_score: 75,
    resumeUrl: '#', createdAt: iso(addDays(-12)), updatedAt: iso(addDays(-12)),
  },
  {
    id: 'app-4', firstName: 'Ananya', lastName: 'Iyer', email: 'ananya.iyer@example.com',
    phone: '+91-98200-11004', jobId: 'job-2', jobTitle: 'Sales Executive',
    appliedDate: iso(addDays(-26)), status: 'hired', source: 'job_portal',
    yearsOfExperience: 4, currentCompany: 'MarketEdge', currentPosition: 'Account Executive',
    skills: ['B2B Sales', 'Lead Generation', 'CRM'], resume_score: 81,
    resumeUrl: '#', createdAt: iso(addDays(-26)), updatedAt: iso(addDays(-3)),
  },
  {
    id: 'app-5', firstName: 'Karan', lastName: 'Gupta', email: 'karan.gupta@example.com',
    phone: '+91-98200-11005', jobId: 'job-1', jobTitle: 'Senior Frontend Engineer',
    appliedDate: iso(addDays(-9)), status: 'screening', source: 'website',
    yearsOfExperience: 3, currentCompany: 'Appify', currentPosition: 'Frontend Developer',
    skills: ['React', 'JavaScript', 'CSS'], resume_score: 68,
    resumeUrl: '#', createdAt: iso(addDays(-9)), updatedAt: iso(addDays(-8)),
  },
  {
    id: 'app-6', firstName: 'Sneha', lastName: 'Reddy', email: 'sneha.reddy@example.com',
    phone: '+91-98200-11006', jobId: 'job-3', jobTitle: 'HR Manager',
    appliedDate: iso(addDays(-14)), status: 'offer_extended', source: 'linkedin',
    yearsOfExperience: 7, currentCompany: 'PeopleFirst', currentPosition: 'HR Lead',
    skills: ['Recruitment', 'Employee Relations', 'Payroll', 'HRMS'], resume_score: 85,
    resumeUrl: '#', createdAt: iso(addDays(-14)), updatedAt: iso(addDays(-4)),
  },
];

const seedInterviews: Interview[] = [
  {
    id: 'int-1', applicantId: 'app-2', applicantName: 'Diya Patel', jobId: 'job-1',
    jobTitle: 'Senior Frontend Engineer', interviewType: 'video', status: 'scheduled',
    scheduledDate: iso(addDays(2)).split('T')[0], scheduledTime: '11:00', duration: 60,
    interviewers: [{ id: 'emp-10', name: 'Engineering Manager', email: 'em@example.com' }],
    meetingLink: 'https://meet.example.com/diya-frontend',
    createdAt: iso(addDays(-5)), updatedAt: iso(addDays(-5)),
  },
  {
    id: 'int-2', applicantId: 'app-1', applicantName: 'Aarav Sharma', jobId: 'job-1',
    jobTitle: 'Senior Frontend Engineer', interviewType: 'in-person', status: 'completed',
    scheduledDate: iso(addDays(-3)).split('T')[0], scheduledTime: '15:00', duration: 45,
    interviewers: [{ id: 'emp-11', name: 'Tech Lead', email: 'lead@example.com' }],
    feedback: {
      overallRating: 4, technicalSkills: 4, communication: 5, cultureFit: 4,
      comments: 'Strong React fundamentals and good communication. Recommended to proceed.',
      recommendation: 'yes', submittedBy: 'Tech Lead', submittedAt: iso(addDays(-2)),
    },
    createdAt: iso(addDays(-8)), updatedAt: iso(addDays(-2)),
  },
];

const seedOffers: OfferLetter[] = [
  {
    id: 'off-1', applicantId: 'app-6', applicantName: 'Sneha Reddy',
    applicantEmail: 'sneha.reddy@example.com', jobId: 'job-3', jobTitle: 'HR Manager',
    position: 'HR Manager', salary: 1150000, currency: 'INR',
    startDate: iso(addDays(20)).split('T')[0], reportingManager: 'COO',
    benefits: ['Health Insurance', 'Annual Bonus'], status: 'sent',
    expiryDate: iso(addDays(7)).split('T')[0], sentDate: iso(addDays(-4)),
    createdAt: iso(addDays(-4)), updatedAt: iso(addDays(-4)),
  },
  {
    id: 'off-2', applicantId: 'app-4', applicantName: 'Ananya Iyer',
    applicantEmail: 'ananya.iyer@example.com', jobId: 'job-2', jobTitle: 'Sales Executive',
    position: 'Sales Executive', salary: 780000, currency: 'INR',
    startDate: iso(addDays(-1)).split('T')[0], reportingManager: 'Sales Head',
    benefits: ['Health Insurance', 'Sales Incentives'], status: 'accepted',
    expiryDate: iso(addDays(-8)).split('T')[0], sentDate: iso(addDays(-12)),
    acceptedDate: iso(addDays(-9)), createdAt: iso(addDays(-12)), updatedAt: iso(addDays(-9)),
  },
];

const seedOnboarding: OnboardingChecklist[] = [
  {
    id: 'onb-1', employeeId: 'app-4', employeeName: 'Ananya Iyer',
    employeeEmail: 'ananya.iyer@example.com', department: 'Sales',
    startDate: iso(addDays(-1)).split('T')[0], completionStatus: 0,
    items: [
      { id: 'oi-1', title: 'Issue laptop & accessories', description: 'Hardware allocation', category: 'it_setup', status: 'completed', dueDate: iso(addDays(-1)).split('T')[0], completedBy: 'IT Team', completedAt: iso(addDays(-1)) },
      { id: 'oi-2', title: 'Create email & system accounts', description: 'Provision SSO access', category: 'it_setup', status: 'completed', dueDate: iso(addDays(-1)).split('T')[0], completedBy: 'IT Team', completedAt: iso(addDays(-1)) },
      { id: 'oi-3', title: 'Sign employment contract', description: 'Digital signature on contract', category: 'paperwork', status: 'completed', dueDate: iso(addDays(0)).split('T')[0], completedBy: 'HR', completedAt: iso(addDays(0)) },
      { id: 'oi-4', title: 'Submit ID & bank documents', description: 'Aadhar, PAN, bank details', category: 'compliance', status: 'in_progress', dueDate: iso(addDays(3)).split('T')[0] },
      { id: 'oi-5', title: 'Sales tooling training', description: 'CRM and process walkthrough', category: 'training', status: 'pending', dueDate: iso(addDays(5)).split('T')[0] },
    ],
    createdAt: iso(addDays(-1)), updatedAt: nowIso,
  },
];

const seedDocuments: OnboardingDocument[] = [
  {
    id: 'doc-1', employeeId: 'app-4', documentType: 'offer_letter', documentName: 'Offer Letter - Ananya Iyer.pdf',
    fileUrl: '#', uploadedBy: 'HR', uploadedAt: iso(addDays(-1)), verificationStatus: 'verified',
    verifiedBy: 'HR', verifiedAt: iso(addDays(-1)),
  },
  {
    id: 'doc-2', employeeId: 'app-4', documentType: 'pan', documentName: 'PAN Card.pdf',
    fileUrl: '#', uploadedBy: 'Ananya Iyer', uploadedAt: iso(addDays(0)), verificationStatus: 'pending',
  },
];

// ---- Generic persistence helpers ----
function read<T>(key: string, seed: T[]): T[] {
  if (typeof window === 'undefined') return seed;
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) {
      localStorage.setItem(key, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : seed;
  } catch {
    return seed;
  }
}

function write<T>(key: string, data: T[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(data));
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function recomputeChecklist(c: OnboardingChecklist): OnboardingChecklist {
  const total = c.items?.length || 0;
  const done = c.items?.filter((i) => i.status === 'completed').length || 0;
  const completionStatus = total > 0 ? Math.round((done / total) * 100) : 0;
  return {
    ...c,
    completionStatus,
    completedAt: completionStatus === 100 ? c.completedAt || nowIso : undefined,
  };
}

// ---- Service ----
export const recruitmentDemo = {
  // Jobs
  jobsGetAll(filters?: { status?: string; department?: string }): JobRequisition[] {
    let jobs = read(KEYS.jobs, seedJobs);
    if (filters?.status) jobs = jobs.filter((j) => j.status === filters.status);
    if (filters?.department) jobs = jobs.filter((j) => j.department === filters.department);
    return jobs;
  },
  jobsGetById(id: string): JobRequisition {
    const job = read(KEYS.jobs, seedJobs).find((j) => j.id === id);
    if (!job) throw new Error('Job requisition not found');
    return job;
  },
  jobsCreate(data: Partial<JobRequisition>): JobRequisition {
    const jobs = read(KEYS.jobs, seedJobs);
    const job: JobRequisition = {
      id: uid('job'),
      title: data.title || 'Untitled Role',
      description: data.description || '',
      department: data.department || 'General',
      reportingTo: data.reportingTo || '',
      salary_min: Number(data.salary_min) || 0,
      salary_max: Number(data.salary_max) || 0,
      currency: data.currency || 'INR',
      employmentType: (data.employmentType as JobRequisition['employmentType']) || 'full-time',
      location: data.location || '',
      requiredSkills: data.requiredSkills || [],
      experience_years: Number(data.experience_years) || 0,
      education: data.education || '',
      status: data.status || 'draft',
      createdBy: currentUser(),
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    write(KEYS.jobs, [job, ...jobs]);
    return job;
  },
  jobsUpdate(id: string, data: Partial<JobRequisition>): JobRequisition {
    const jobs = read(KEYS.jobs, seedJobs);
    let updated: JobRequisition | undefined;
    const next = jobs.map((j) => {
      if (j.id === id) {
        updated = { ...j, ...data, id: j.id, updatedAt: nowIso };
        return updated;
      }
      return j;
    });
    if (!updated) throw new Error('Job requisition not found');
    write(KEYS.jobs, next);
    return updated;
  },
  jobsDelete(id: string): void {
    write(KEYS.jobs, read(KEYS.jobs, seedJobs).filter((j) => j.id !== id));
  },
  jobsSubmitForApproval(id: string): JobRequisition {
    return recruitmentDemo.jobsUpdate(id, { status: 'pending_approval', approvalStatus: 'pending' });
  },
  jobsApprove(id: string): JobRequisition {
    return recruitmentDemo.jobsUpdate(id, {
      status: 'open', approvalStatus: 'approved', approvedBy: currentUser(), approvedAt: nowIso,
    });
  },
  jobsReject(id: string, reason: string): JobRequisition {
    return recruitmentDemo.jobsUpdate(id, { status: 'rejected', approvalStatus: 'rejected', rejectionReason: reason });
  },

  // Applicants
  applicantsGetAll(): Applicant[] {
    return read(KEYS.applicants, seedApplicants);
  },
  applicantsGetByJob(jobId: string): Applicant[] {
    return read(KEYS.applicants, seedApplicants).filter((a) => a.jobId === jobId);
  },
  applicantsGetById(id: string): Applicant {
    const app = read(KEYS.applicants, seedApplicants).find((a) => a.id === id);
    if (!app) throw new Error('Applicant not found');
    return app;
  },
  applicantsCreate(data: Partial<Applicant>): Applicant {
    const applicants = read(KEYS.applicants, seedApplicants);
    let jobTitle = data.jobTitle || '';
    if (!jobTitle && data.jobId) {
      jobTitle = read(KEYS.jobs, seedJobs).find((j) => j.id === data.jobId)?.title || '';
    }
    const applicant: Applicant = {
      id: uid('app'),
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      email: data.email || '',
      phone: data.phone || '',
      jobId: data.jobId || '',
      jobTitle,
      appliedDate: data.appliedDate || nowIso,
      status: data.status || 'applied',
      source: data.source || 'website',
      yearsOfExperience: Number(data.yearsOfExperience) || 0,
      skills: data.skills || [],
      resume_score: data.resume_score,
      currentCompany: data.currentCompany,
      currentPosition: data.currentPosition,
      resumeUrl: data.resumeUrl,
      portfolioUrl: data.portfolioUrl,
      coverLetter: data.coverLetter,
      notes: data.notes,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    write(KEYS.applicants, [applicant, ...applicants]);
    return applicant;
  },
  applicantsUpdate(id: string, data: Partial<Applicant>): Applicant {
    const applicants = read(KEYS.applicants, seedApplicants);
    let updated: Applicant | undefined;
    const next = applicants.map((a) => {
      if (a.id === id) {
        updated = { ...a, ...data, id: a.id, updatedAt: nowIso };
        return updated;
      }
      return a;
    });
    if (!updated) throw new Error('Applicant not found');
    write(KEYS.applicants, next);
    return updated;
  },
  applicantsUpdateStatus(id: string, status: CandidateStatus): Applicant {
    const updated = recruitmentDemo.applicantsUpdate(id, { status });
    // Cross-module sync: when an applicant is hired, auto-create an onboarding
    // checklist for them if one doesn't already exist.
    if (status === 'hired') {
      recruitmentDemo.ensureOnboardingForApplicant(updated);
    }
    return updated;
  },
  applicantsDelete(id: string): void {
    write(KEYS.applicants, read(KEYS.applicants, seedApplicants).filter((a) => a.id !== id));
  },

  // Interviews
  interviewsGetAll(): Interview[] {
    return read(KEYS.interviews, seedInterviews);
  },
  interviewsGetByApplicant(applicantId: string): Interview[] {
    return read(KEYS.interviews, seedInterviews).filter((i) => i.applicantId === applicantId);
  },
  interviewsGetById(id: string): Interview {
    const itv = read(KEYS.interviews, seedInterviews).find((i) => i.id === id);
    if (!itv) throw new Error('Interview not found');
    return itv;
  },
  interviewsSchedule(applicantId: string, data: any): Interview {
    const interviews = read(KEYS.interviews, seedInterviews);
    const applicant = read(KEYS.applicants, seedApplicants).find((a) => a.id === applicantId);
    const interview: Interview = {
      id: uid('int'),
      applicantId,
      applicantName: applicant ? `${applicant.firstName} ${applicant.lastName}` : data.applicantName || '',
      jobId: applicant?.jobId || data.jobId || '',
      jobTitle: applicant?.jobTitle || data.jobTitle || '',
      interviewType: data.interviewType || 'video',
      status: 'scheduled',
      scheduledDate: data.scheduledDate,
      scheduledTime: data.scheduledTime,
      duration: Number(data.duration) || 30,
      interviewers: data.interviewers || [],
      meetingLink: data.meetingLink,
      notes: data.notes,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    write(KEYS.interviews, [interview, ...interviews]);
    // Keep applicant pipeline in sync
    if (applicant && applicant.status !== 'interview_scheduled') {
      recruitmentDemo.applicantsUpdate(applicantId, { status: 'interview_scheduled' });
    }
    return interview;
  },
  interviewsUpdate(id: string, data: Partial<Interview>): Interview {
    const interviews = read(KEYS.interviews, seedInterviews);
    let updated: Interview | undefined;
    const next = interviews.map((i) => {
      if (i.id === id) {
        updated = { ...i, ...data, id: i.id, updatedAt: nowIso };
        return updated;
      }
      return i;
    });
    if (!updated) throw new Error('Interview not found');
    write(KEYS.interviews, next);
    return updated;
  },
  interviewsCancel(id: string, reason?: string): Interview {
    return recruitmentDemo.interviewsUpdate(id, { status: 'cancelled', notes: reason });
  },
  interviewsSubmitFeedback(id: string, feedback: InterviewFeedback): Interview {
    return recruitmentDemo.interviewsUpdate(id, {
      feedback: { ...feedback, submittedBy: feedback.submittedBy || currentUser(), submittedAt: nowIso },
      status: 'completed',
    });
  },

  // Offers
  offersGetAll(): OfferLetter[] {
    return read(KEYS.offers, seedOffers);
  },
  offersGetByApplicant(applicantId: string): OfferLetter[] {
    return read(KEYS.offers, seedOffers).filter((o) => o.applicantId === applicantId);
  },
  offersGetById(id: string): OfferLetter {
    const offer = read(KEYS.offers, seedOffers).find((o) => o.id === id);
    if (!offer) throw new Error('Offer not found');
    return offer;
  },
  offersGenerate(applicantId: string, data: any): OfferLetter {
    const offers = read(KEYS.offers, seedOffers);
    const applicant = read(KEYS.applicants, seedApplicants).find((a) => a.id === applicantId);
    const offer: OfferLetter = {
      id: uid('off'),
      applicantId,
      applicantName: applicant ? `${applicant.firstName} ${applicant.lastName}` : data.applicantName || '',
      applicantEmail: applicant?.email || data.applicantEmail || '',
      jobId: applicant?.jobId || data.jobId || '',
      jobTitle: applicant?.jobTitle || data.jobTitle || '',
      position: data.position || applicant?.jobTitle || '',
      salary: Number(data.salary) || 0,
      currency: data.currency || 'INR',
      startDate: data.startDate,
      benefits: data.benefits || [],
      reportingManager: data.reportingManager || '',
      status: 'draft',
      expiryDate: data.expiryDate,
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    write(KEYS.offers, [offer, ...offers]);
    if (applicant) recruitmentDemo.applicantsUpdate(applicantId, { status: 'offer_extended' });
    return offer;
  },
  offersUpdate(id: string, data: Partial<OfferLetter>): OfferLetter {
    const offers = read(KEYS.offers, seedOffers);
    let updated: OfferLetter | undefined;
    const next = offers.map((o) => {
      if (o.id === id) {
        updated = { ...o, ...data, id: o.id, updatedAt: nowIso };
        return updated;
      }
      return o;
    });
    if (!updated) throw new Error('Offer not found');
    write(KEYS.offers, next);
    return updated;
  },

  // Onboarding
  onboardingGetAll(): OnboardingChecklist[] {
    return read(KEYS.onboarding, seedOnboarding).map(recomputeChecklist);
  },
  onboardingGetById(id: string): OnboardingChecklist {
    const c = read(KEYS.onboarding, seedOnboarding).find((x) => x.id === id);
    if (!c) throw new Error('Onboarding checklist not found');
    return recomputeChecklist(c);
  },
  onboardingGetByEmployee(employeeId: string): OnboardingChecklist | undefined {
    const c = read(KEYS.onboarding, seedOnboarding).find((x) => x.employeeId === employeeId);
    return c ? recomputeChecklist(c) : undefined;
  },
  ensureOnboardingForApplicant(applicant: Applicant): OnboardingChecklist {
    const lists = read(KEYS.onboarding, seedOnboarding);
    const existing = lists.find((c) => c.employeeId === applicant.id);
    if (existing) return recomputeChecklist(existing);
    const job = read(KEYS.jobs, seedJobs).find((j) => j.id === applicant.jobId);
    const checklist: OnboardingChecklist = {
      id: uid('onb'),
      employeeId: applicant.id,
      employeeName: `${applicant.firstName} ${applicant.lastName}`,
      employeeEmail: applicant.email,
      department: job?.department || 'General',
      startDate: iso(addDays(7)).split('T')[0],
      completionStatus: 0,
      items: [
        { id: uid('oi'), title: 'Issue laptop & accessories', description: 'Hardware allocation', category: 'it_setup', status: 'pending', dueDate: iso(addDays(7)).split('T')[0] },
        { id: uid('oi'), title: 'Create email & system accounts', description: 'Provision SSO access', category: 'it_setup', status: 'pending', dueDate: iso(addDays(7)).split('T')[0] },
        { id: uid('oi'), title: 'Sign employment contract', description: 'Digital signature on contract', category: 'paperwork', status: 'pending', dueDate: iso(addDays(8)).split('T')[0] },
        { id: uid('oi'), title: 'Submit ID & bank documents', description: 'Aadhar, PAN, bank details', category: 'compliance', status: 'pending', dueDate: iso(addDays(10)).split('T')[0] },
      ],
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    write(KEYS.onboarding, [checklist, ...lists]);
    return checklist;
  },
  onboardingCreate(employeeId: string, data: any): OnboardingChecklist {
    const lists = read(KEYS.onboarding, seedOnboarding);
    const checklist: OnboardingChecklist = {
      id: uid('onb'),
      employeeId,
      employeeName: data.employeeName || '',
      employeeEmail: data.employeeEmail || '',
      department: data.department || 'General',
      startDate: data.startDate || nowIso.split('T')[0],
      completionStatus: 0,
      items: data.items || [],
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    write(KEYS.onboarding, [checklist, ...lists]);
    return checklist;
  },
  onboardingUpdateItemStatus(checklistId: string, itemId: string, status: string): OnboardingChecklist {
    const lists = read(KEYS.onboarding, seedOnboarding);
    let updated: OnboardingChecklist | undefined;
    const next = lists.map((c) => {
      if (c.id !== checklistId) return c;
      const items = c.items.map((it) =>
        it.id === itemId
          ? { ...it, status: status as any, completedAt: status === 'completed' ? nowIso : undefined, completedBy: status === 'completed' ? currentUser() : undefined }
          : it
      );
      updated = recomputeChecklist({ ...c, items, updatedAt: nowIso });
      return updated;
    });
    if (!updated) throw new Error('Onboarding checklist not found');
    write(KEYS.onboarding, next);
    return updated;
  },
  onboardingAddItem(checklistId: string, item: any): OnboardingChecklist {
    const lists = read(KEYS.onboarding, seedOnboarding);
    let updated: OnboardingChecklist | undefined;
    const next = lists.map((c) => {
      if (c.id !== checklistId) return c;
      const newItem = {
        id: uid('oi'),
        title: item.title || 'New task',
        description: item.description || '',
        category: item.category || 'other',
        status: 'pending' as const,
        dueDate: item.dueDate || nowIso.split('T')[0],
        assignedTo: item.assignedTo,
      };
      updated = recomputeChecklist({ ...c, items: [...c.items, newItem], updatedAt: nowIso });
      return updated;
    });
    if (!updated) throw new Error('Onboarding checklist not found');
    write(KEYS.onboarding, next);
    return updated;
  },
  onboardingRemoveItem(checklistId: string, itemId: string): OnboardingChecklist {
    const lists = read(KEYS.onboarding, seedOnboarding);
    let updated: OnboardingChecklist | undefined;
    const next = lists.map((c) => {
      if (c.id !== checklistId) return c;
      updated = recomputeChecklist({ ...c, items: c.items.filter((it) => it.id !== itemId), updatedAt: nowIso });
      return updated;
    });
    if (!updated) throw new Error('Onboarding checklist not found');
    write(KEYS.onboarding, next);
    return updated;
  },
  onboardingComplete(id: string): OnboardingChecklist {
    const lists = read(KEYS.onboarding, seedOnboarding);
    let updated: OnboardingChecklist | undefined;
    const next = lists.map((c) => {
      if (c.id !== id) return c;
      const items = c.items.map((it) => ({ ...it, status: 'completed' as const, completedAt: it.completedAt || nowIso }));
      updated = recomputeChecklist({ ...c, items, completedAt: nowIso, updatedAt: nowIso });
      return updated;
    });
    if (!updated) throw new Error('Onboarding checklist not found');
    write(KEYS.onboarding, next);
    return updated;
  },

  // Documents
  documentsGetAll(employeeId: string): OnboardingDocument[] {
    return read(KEYS.documents, seedDocuments).filter((d) => d.employeeId === employeeId);
  },
  documentsUpload(employeeId: string, file: File, documentType: string): OnboardingDocument {
    const docs = read(KEYS.documents, seedDocuments);
    const doc: OnboardingDocument = {
      id: uid('doc'),
      employeeId,
      documentType: documentType as OnboardingDocument['documentType'],
      documentName: file?.name || 'document.pdf',
      fileUrl: '#',
      uploadedBy: currentUser(),
      uploadedAt: nowIso,
      verificationStatus: 'pending',
    };
    write(KEYS.documents, [doc, ...docs]);
    return doc;
  },
  documentsVerify(documentId: string): OnboardingDocument {
    const docs = read(KEYS.documents, seedDocuments);
    let updated: OnboardingDocument | undefined;
    const next = docs.map((d) => {
      if (d.id === documentId) {
        updated = { ...d, verificationStatus: 'verified', verifiedBy: currentUser(), verifiedAt: nowIso };
        return updated;
      }
      return d;
    });
    if (!updated) throw new Error('Document not found');
    write(KEYS.documents, next);
    return updated;
  },
  documentsReject(documentId: string, reason: string): OnboardingDocument {
    const docs = read(KEYS.documents, seedDocuments);
    let updated: OnboardingDocument | undefined;
    const next = docs.map((d) => {
      if (d.id === documentId) {
        updated = { ...d, verificationStatus: 'rejected', rejectionReason: reason };
        return updated;
      }
      return d;
    });
    if (!updated) throw new Error('Document not found');
    write(KEYS.documents, next);
    return updated;
  },
  documentsDelete(documentId: string): void {
    write(KEYS.documents, read(KEYS.documents, seedDocuments).filter((d) => d.id !== documentId));
  },
};
