# Recruitment & Onboarding Module

## Overview
Complete recruitment lifecycle management system from job posting to employee onboarding.

## Features Implemented

### 1. Job Requisition & Approval Workflow
- **Location**: `/recruitment/jobs`
- **Features**:
  - Create job requisitions with detailed specifications
  - Define salary ranges, skills, experience requirements
  - Submit for approval workflow
  - Track job status (draft, pending_approval, approved, open, filled, closed)
  - Edit and delete requisitions
  - View applicants for each job
  - Multi-level approval system

### 2. Applicant Tracking System (ATS)
- **Location**: `/recruitment/applicants`
- **Features**:
  - Track all job applications
  - Filter by job, status, source
  - Resume score/matching percentage
  - Candidate status pipeline (applied → screening → shortlisted → interview → offer → hired)
  - View and download resumes
  - Bulk shortlist/reject operations
  - Contact management (email, phone)

### 3. Resume Parsing & Candidate Scoring
- **API Integration**: `applicantAPI.parseResume()`
- **Features**:
  - Automatic resume parsing from uploaded files
  - AI-based candidate scoring (0-100%)
  - Extract skills, experience, education
  - Match with job requirements
  - Score calculation based on skill match

### 4. Interview Scheduling & Feedback
- **Location**: `/recruitment/interviews`
- **Features**:
  - Schedule interviews (phone, video, in-person, group)
  - Set interviewer teams
  - Generate meeting links
  - Interview reminders
  - Structured feedback collection:
    - Overall rating (1-5)
    - Technical skills assessment
    - Communication evaluation
    - Culture fit assessment
    - Recommendation (strong_yes/yes/maybe/no/strong_no)
  - Reschedule interviews
  - Cancel with reason tracking

### 5. Offer Letter Generation
- **API Integration**: `offerLetterAPI`
- **Features**:
  - Auto-generate offer letters
  - Customize salary, benefits, start date
  - Track offer status (draft, sent, accepted, rejected)
  - Offer expiry dates
  - Send via email
  - Accept/reject tracking
  - Revoke offers with reason

### 6. Digital Onboarding Checklist
- **Location**: `/recruitment/onboarding`
- **Features**:
  - Create digital checklists for new hires
  - Categories: IT Setup, Compliance, Training, Paperwork, Other
  - Task assignment to team members
  - Progress tracking (completion percentage)
  - Due date management
  - Status updates (pending → in_progress → completed)
  - Expandable task details
  - Add/remove tasks dynamically

### 7. Document Upload & Verification
- **Components**: `DocumentUploadSection.tsx`
- **Features**:
  - Upload required documents:
    - Aadhar Card
    - PAN Card
    - Bank Details
    - Offer Letter
    - NDA
    - Employment Contract
    - Other documents
  - Drag-and-drop support
  - File validation (PDF, JPG, PNG, DOC, DOCX)
  - Verification workflow
  - Admin approval/rejection with comments
  - Document expiry tracking
  - Download documents

## Technical Architecture

### Directory Structure
```
src/
├── app/(dashboard)/recruitment/
│   ├── page.tsx (Dashboard)
│   ├── layout.tsx
│   ├── jobs/
│   │   ├── page.tsx (List)
│   │   ├── create/page.tsx
│   │   └── [id]/page.tsx (Detail)
│   ├── applicants/
│   │   ├── page.tsx (List)
│   │   └── [id]/page.tsx (Detail)
│   ├── interviews/
│   │   └── page.tsx (List)
│   └── onboarding/
│       ├── page.tsx (List)
│       └── [id]/page.tsx (Detail)
├── components/recruitment/
│   ├── jobs/
│   │   ├── JobRequisitionForm.tsx
│   │   └── JobStatusBadge.tsx
│   ├── applicants/
│   │   └── ApplicantCard.tsx
│   ├── interviews/
│   └── onboarding/
│       ├── OnboardingChecklistView.tsx
│       └── DocumentUploadSection.tsx
└── lib/recruitment/
    ├── types.ts (TypeScript interfaces)
    ├── schemas.ts (Zod validation schemas)
    ├── api.ts (API endpoints)
    └── store.ts (Zustand store)
```

### File Architecture

#### Types (`lib/recruitment/types.ts`)
- JobRequisition
- Applicant
- Interview & InterviewFeedback
- OfferLetter
- OnboardingChecklist & OnboardingItem
- OnboardingDocument

#### Schemas (`lib/recruitment/schemas.ts`)
- JobRequisitionSchema
- ApplicantFilterSchema
- InterviewScheduleSchema
- InterviewFeedbackSchema
- OfferLetterSchema
- OnboardingChecklistItemSchema
- DocumentUploadSchema

#### API (`lib/recruitment/api.ts`)
- `jobRequisitionAPI` - Job management endpoints
- `applicantAPI` - Applicant tracking endpoints
- `interviewAPI` - Interview scheduling endpoints
- `offerLetterAPI` - Offer letter management
- `onboardingAPI` - Onboarding checklist management
- `onboardingDocumentAPI` - Document upload & verification

#### Store (`lib/recruitment/store.ts`)
- Zustand store for managing recruitment state
- Separate slices for jobs, applicants, interviews, offers, checklists, documents
- UI state management (loading, errors, filters)

### Components

#### JobRequisitionForm
- Controlled form with React Hook Form
- Zod validation
- Dynamic skill management
- Salary validation

#### JobStatusBadge
- Status visualization
- Color-coded by status
- Icon indicators

#### ApplicantCard & ApplicantTable
- Dual view modes (grid/table)
- Resume score display
- Contact quick actions
- Status badges

#### OnboardingChecklistView
- Progress bar visualization
- Expandable task details
- Category filtering
- Dynamic item management

#### DocumentUploadSection
- Drag-drop file upload
- Document type selection
- Verification workflow
- Admin approval/rejection interface

## API Endpoints

All endpoints are prefixed with `/recruitment/`

### Jobs
- `GET /jobs` - List all jobs
- `GET /jobs/:id` - Get job details
- `POST /jobs` - Create job
- `PUT /jobs/:id` - Update job
- `DELETE /jobs/:id` - Delete job
- `POST /jobs/:id/submit-approval` - Submit for approval
- `POST /jobs/:id/approve` - Approve job
- `POST /jobs/:id/reject` - Reject job

### Applicants
- `GET /applicants` - List all applicants
- `GET /applicants/:id` - Get applicant details
- `GET /jobs/:jobId/applicants` - Get job applicants
- `POST /applicants` - Create applicant
- `PUT /applicants/:id` - Update applicant
- `PATCH /applicants/:id/status` - Update status
- `POST /applicants/parse-resume` - Parse resume
- `POST /applicants/shortlist` - Bulk shortlist
- `POST /applicants/reject` - Bulk reject
- `DELETE /applicants/:id` - Delete applicant

### Interviews
- `GET /interviews` - List interviews
- `GET /applicants/:applicantId/interviews` - Get applicant interviews
- `GET /interviews/:id` - Get interview details
- `POST /applicants/:applicantId/interviews` - Schedule interview
- `PUT /interviews/:id/reschedule` - Reschedule interview
- `POST /interviews/:id/cancel` - Cancel interview
- `POST /interviews/:id/feedback` - Submit feedback
- `GET /interviews/:id/feedback` - Get feedback
- `POST /interviews/:id/send-reminder` - Send reminder

### Offers
- `GET /offers` - List offers
- `GET /applicants/:applicantId/offers` - Get applicant offers
- `GET /offers/:id` - Get offer details
- `POST /applicants/:applicantId/offers` - Generate offer
- `PUT /offers/:id` - Update offer
- `POST /offers/:id/send` - Send offer
- `POST /offers/:id/accept` - Accept offer
- `POST /offers/:id/reject` - Reject offer
- `POST /offers/:id/revoke` - Revoke offer
- `GET /offers/:id/document` - Get offer PDF

### Onboarding
- `GET /onboarding/checklists` - List checklists
- `GET /onboarding/employee/:employeeId` - Get employee checklist
- `GET /onboarding/checklists/:id` - Get checklist details
- `POST /onboarding/checklists` - Create checklist
- `PATCH /onboarding/checklists/:id/items/:itemId` - Update item status
- `POST /onboarding/checklists/:id/items` - Add item
- `DELETE /onboarding/checklists/:id/items/:itemId` - Remove item
- `POST /onboarding/checklists/:id/complete` - Complete onboarding

### Documents
- `GET /onboarding/:employeeId/documents` - List documents
- `POST /onboarding/:employeeId/documents` - Upload document
- `POST /onboarding/documents/:docId/verify` - Verify document
- `POST /onboarding/documents/:docId/reject` - Reject document
- `DELETE /onboarding/documents/:docId` - Delete document

## State Management (Zustand)

All recruitment state is managed in `useRecruitmentStore`:

```typescript
// Separate state for each module
- jobRequisitions: JobRequisition[]
- applicants: Applicant[]
- interviews: Interview[]
- offers: OfferLetter[]
- onboardingChecklists: OnboardingChecklist[]
- documents: OnboardingDocument[]

// UI State
- isLoading: boolean
- error: string | null
- filters: FilterState
```

## Navigation Integration

Added to Sidebar (`components/layout/Sidebar.tsx`):
```
Recruitment (icon: Briefcase)
├── Dashboard
├── Job Requisitions
├── Applicants (ATS)
├── Interviews
└── Onboarding
```

## Usage Examples

### Create Job Requisition
```typescript
const newJob = await jobRequisitionAPI.create({
  title: 'Senior Developer',
  description: '...',
  department: 'Engineering',
  // ... other fields
});
```

### Schedule Interview
```typescript
const interview = await interviewAPI.schedule(applicantId, {
  interviewType: 'video',
  scheduledDate: '2024-06-01',
  scheduledTime: '10:00',
  duration: 60,
  interviewers: [...]
});
```

### Upload Onboarding Document
```typescript
await onboardingDocumentAPI.upload(employeeId, file, 'aadhar');
```

## Validation Schemas

All forms use Zod schemas for validation:
- Form validation happens on client-side
- Error messages are user-friendly
- Backend API should validate again

## Status Workflows

### Job Status Flow
```
draft → pending_approval → approved → open → filled/closed
       ↘ rejected
```

### Applicant Status Flow
```
applied → screening → shortlisted → interview_scheduled → offer_extended → hired
       ↘ rejected (at any stage)
```

### Interview Status Flow
```
scheduled → completed → (with feedback)
         ↘ cancelled → pending_feedback
```

### Offer Status Flow
```
draft → sent → accepted/rejected
    ↘ expired/revoked
```

### Onboarding Item Status Flow
```
pending → in_progress → completed
       ↘ skipped
```

### Document Verification Flow
```
pending → verified/rejected
```

## Features to Complete

These features are ready for backend integration:
- [x] Job requisition creation and management
- [x] Applicant tracking system
- [x] Interview scheduling
- [x] Offer letter generation
- [x] Onboarding checklists
- [x] Document upload and verification
- [ ] Resume parsing (requires backend AI integration)
- [ ] Automatic email notifications
- [ ] Interview feedback reports
- [ ] Onboarding progress reports
- [ ] Candidate analytics dashboard

## Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Performance Considerations

- Pages use React hooks for data fetching
- Zustand for efficient state management
- Lazy loading for large lists
- Pagination ready (implement in backend)
- Search and filter done on frontend initially
- Can move to backend for large datasets

## Accessibility

- All forms have proper labels
- Color contrast meets WCAG standards
- Keyboard navigation support
- Screen reader friendly
- Semantic HTML structure

## Future Enhancements

1. **Analytics Dashboard**: Hiring funnel analysis, time-to-hire metrics
2. **Email Integration**: Auto-send offers, interview reminders
3. **Calendar Integration**: Sync interviews with calendar apps
4. **Bulk Operations**: Import candidates from job portals
5. **Custom Workflows**: Configurable approval workflows
6. **Interview Recordings**: Store and playback video interviews
7. **Candidate Pooling**: Maintain candidate database across cycles
8. **Integration**: ATS APIs, email platforms, calendar services
