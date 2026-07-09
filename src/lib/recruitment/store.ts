import { create } from 'zustand';
import {
  JobRequisition,
  Applicant,
  Interview,
  OfferLetter,
  OnboardingChecklist,
  OnboardingDocument,
} from './types';

interface RecruitmentStore {
  // Job Requisitions
  jobRequisitions: JobRequisition[];
  selectedJob: JobRequisition | null;
  setJobRequisitions: (jobs: JobRequisition[]) => void;
  setSelectedJob: (job: JobRequisition | null) => void;
  addJobRequisition: (job: JobRequisition) => void;
  updateJobRequisition: (job: JobRequisition) => void;
  removeJobRequisition: (jobId: string) => void;

  // Applicants
  applicants: Applicant[];
  selectedApplicant: Applicant | null;
  setApplicants: (applicants: Applicant[]) => void;
  setSelectedApplicant: (applicant: Applicant | null) => void;
  addApplicant: (applicant: Applicant) => void;
  updateApplicant: (applicant: Applicant) => void;
  removeApplicant: (applicantId: string) => void;

  // Interviews
  interviews: Interview[];
  selectedInterview: Interview | null;
  setInterviews: (interviews: Interview[]) => void;
  setSelectedInterview: (interview: Interview | null) => void;
  addInterview: (interview: Interview) => void;
  updateInterview: (interview: Interview) => void;
  removeInterview: (interviewId: string) => void;

  // Offer Letters
  offers: OfferLetter[];
  selectedOffer: OfferLetter | null;
  setOffers: (offers: OfferLetter[]) => void;
  setSelectedOffer: (offer: OfferLetter | null) => void;
  addOffer: (offer: OfferLetter) => void;
  updateOffer: (offer: OfferLetter) => void;
  removeOffer: (offerId: string) => void;

  // Onboarding
  onboardingChecklists: OnboardingChecklist[];
  selectedChecklist: OnboardingChecklist | null;
  setOnboardingChecklists: (checklists: OnboardingChecklist[]) => void;
  setSelectedChecklist: (checklist: OnboardingChecklist | null) => void;
  addOnboardingChecklist: (checklist: OnboardingChecklist) => void;
  updateOnboardingChecklist: (checklist: OnboardingChecklist) => void;
  removeOnboardingChecklist: (checklistId: string) => void;

  // Documents
  documents: OnboardingDocument[];
  setDocuments: (documents: OnboardingDocument[]) => void;
  addDocument: (doc: OnboardingDocument) => void;
  updateDocument: (doc: OnboardingDocument) => void;
  removeDocument: (docId: string) => void;

  // UI State
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
  filters: {
    jobStatus?: string;
    candidateStatus?: string;
    interviewStatus?: string;
    department?: string;
    searchTerm?: string;
  };
  setFilters: (filters: any) => void;
  clearAll: () => void;
}

export const useRecruitmentStore = create<RecruitmentStore>((set) => ({
  // Job Requisitions
  jobRequisitions: [],
  selectedJob: null,
  setJobRequisitions: (jobs) => set({ jobRequisitions: jobs }),
  setSelectedJob: (job) => set({ selectedJob: job }),
  addJobRequisition: (job) =>
    set((state) => ({
      jobRequisitions: [...state.jobRequisitions, job],
    })),
  updateJobRequisition: (job) =>
    set((state) => ({
      jobRequisitions: state.jobRequisitions.map((j) => (j.id === job.id ? job : j)),
      selectedJob: state.selectedJob?.id === job.id ? job : state.selectedJob,
    })),
  removeJobRequisition: (jobId) =>
    set((state) => ({
      jobRequisitions: state.jobRequisitions.filter((j) => j.id !== jobId),
      selectedJob: state.selectedJob?.id === jobId ? null : state.selectedJob,
    })),

  // Applicants
  applicants: [],
  selectedApplicant: null,
  setApplicants: (applicants) => set({ applicants }),
  setSelectedApplicant: (applicant) => set({ selectedApplicant: applicant }),
  addApplicant: (applicant) =>
    set((state) => ({
      applicants: [...state.applicants, applicant],
    })),
  updateApplicant: (applicant) =>
    set((state) => ({
      applicants: state.applicants.map((a) => (a.id === applicant.id ? applicant : a)),
      selectedApplicant:
        state.selectedApplicant?.id === applicant.id ? applicant : state.selectedApplicant,
    })),
  removeApplicant: (applicantId) =>
    set((state) => ({
      applicants: state.applicants.filter((a) => a.id !== applicantId),
      selectedApplicant:
        state.selectedApplicant?.id === applicantId ? null : state.selectedApplicant,
    })),

  // Interviews
  interviews: [],
  selectedInterview: null,
  setInterviews: (interviews) => set({ interviews }),
  setSelectedInterview: (interview) => set({ selectedInterview: interview }),
  addInterview: (interview) =>
    set((state) => ({
      interviews: [...state.interviews, interview],
    })),
  updateInterview: (interview) =>
    set((state) => ({
      interviews: state.interviews.map((i) => (i.id === interview.id ? interview : i)),
      selectedInterview: state.selectedInterview?.id === interview.id ? interview : state.selectedInterview,
    })),
  removeInterview: (interviewId) =>
    set((state) => ({
      interviews: state.interviews.filter((i) => i.id !== interviewId),
      selectedInterview: state.selectedInterview?.id === interviewId ? null : state.selectedInterview,
    })),

  // Offer Letters
  offers: [],
  selectedOffer: null,
  setOffers: (offers) => set({ offers }),
  setSelectedOffer: (offer) => set({ selectedOffer: offer }),
  addOffer: (offer) =>
    set((state) => ({
      offers: [...state.offers, offer],
    })),
  updateOffer: (offer) =>
    set((state) => ({
      offers: state.offers.map((o) => (o.id === offer.id ? offer : o)),
      selectedOffer: state.selectedOffer?.id === offer.id ? offer : state.selectedOffer,
    })),
  removeOffer: (offerId) =>
    set((state) => ({
      offers: state.offers.filter((o) => o.id !== offerId),
      selectedOffer: state.selectedOffer?.id === offerId ? null : state.selectedOffer,
    })),

  // Onboarding
  onboardingChecklists: [],
  selectedChecklist: null,
  setOnboardingChecklists: (checklists) => set({ onboardingChecklists: checklists }),
  setSelectedChecklist: (checklist) => set({ selectedChecklist: checklist }),
  addOnboardingChecklist: (checklist) =>
    set((state) => ({
      onboardingChecklists: [...state.onboardingChecklists, checklist],
    })),
  updateOnboardingChecklist: (checklist) =>
    set((state) => ({
      onboardingChecklists: state.onboardingChecklists.map((c) =>
        c.id === checklist.id ? checklist : c
      ),
      selectedChecklist: state.selectedChecklist?.id === checklist.id ? checklist : state.selectedChecklist,
    })),
  removeOnboardingChecklist: (checklistId) =>
    set((state) => ({
      onboardingChecklists: state.onboardingChecklists.filter((c) => c.id !== checklistId),
      selectedChecklist: state.selectedChecklist?.id === checklistId ? null : state.selectedChecklist,
    })),

  // Documents
  documents: [],
  setDocuments: (documents) => set({ documents }),
  addDocument: (doc) =>
    set((state) => ({
      documents: [...state.documents, doc],
    })),
  updateDocument: (doc) =>
    set((state) => ({
      documents: state.documents.map((d) => (d.id === doc.id ? doc : d)),
    })),
  removeDocument: (docId) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== docId),
    })),

  // UI State
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  error: null,
  setError: (error) => set({ error }),
  filters: {},
  setFilters: (filters) => set({ filters }),

  clearAll: () =>
    set({
      jobRequisitions: [],
      applicants: [],
      interviews: [],
      offers: [],
      onboardingChecklists: [],
      documents: [],
      selectedJob: null,
      selectedApplicant: null,
      selectedInterview: null,
      selectedOffer: null,
      selectedChecklist: null,
      error: null,
      filters: {},
    }),
}));
