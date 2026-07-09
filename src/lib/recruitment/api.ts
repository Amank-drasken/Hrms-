import api from '../api';
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
import { recruitmentDemo, isRecruitmentMockMode } from './demoData';

// When the app runs in mock mode (NEXT_PUBLIC_MOCK_AUTH=true or a mock token),
// recruitment has no backend, so every call is served from a persistent,
// localStorage-backed demo store. This keeps the whole module functional offline
// and in sync (create in one page → visible everywhere). When a real backend is
// available, the same calls hit /recruitment/* as before.
const mock = () => isRecruitmentMockMode();

// Job Requisition API
export const jobRequisitionAPI = {
  getAll: async (filters?: { status?: string; department?: string }) => {
    if (mock()) return recruitmentDemo.jobsGetAll(filters);
    const response = await api.get<JobRequisition[]>('/recruitment/jobs', { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    if (mock()) return recruitmentDemo.jobsGetById(id);
    const response = await api.get<JobRequisition>(`/recruitment/jobs/${id}`);
    return response.data;
  },

  create: async (data: Omit<JobRequisition, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (mock()) return recruitmentDemo.jobsCreate(data);
    const response = await api.post<JobRequisition>('/recruitment/jobs', data);
    return response.data;
  },

  update: async (id: string, data: Partial<JobRequisition>) => {
    if (mock()) return recruitmentDemo.jobsUpdate(id, data);
    const response = await api.put<JobRequisition>(`/recruitment/jobs/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    if (mock()) return recruitmentDemo.jobsDelete(id);
    await api.delete(`/recruitment/jobs/${id}`);
  },

  submitForApproval: async (id: string) => {
    if (mock()) return recruitmentDemo.jobsSubmitForApproval(id);
    const response = await api.post(`/recruitment/jobs/${id}/submit-approval`, {});
    return response.data;
  },

  approve: async (id: string, comments?: string) => {
    if (mock()) return recruitmentDemo.jobsApprove(id);
    const response = await api.post(`/recruitment/jobs/${id}/approve`, { comments });
    return response.data;
  },

  reject: async (id: string, reason: string) => {
    if (mock()) return recruitmentDemo.jobsReject(id, reason);
    const response = await api.post(`/recruitment/jobs/${id}/reject`, { reason });
    return response.data;
  },
};

// Applicant/ATS API
export const applicantAPI = {
  getByJob: async (jobId: string, filters?: any) => {
    if (mock()) return recruitmentDemo.applicantsGetByJob(jobId);
    const response = await api.get<Applicant[]>(`/recruitment/jobs/${jobId}/applicants`, {
      params: filters,
    });
    return response.data;
  },

  getAll: async (filters?: any) => {
    if (mock()) return recruitmentDemo.applicantsGetAll();
    const response = await api.get<Applicant[]>('/recruitment/applicants', { params: filters });
    return response.data;
  },

  getById: async (id: string) => {
    if (mock()) return recruitmentDemo.applicantsGetById(id);
    const response = await api.get<Applicant>(`/recruitment/applicants/${id}`);
    return response.data;
  },

  create: async (data: Omit<Applicant, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (mock()) return recruitmentDemo.applicantsCreate(data);
    const response = await api.post<Applicant>('/recruitment/applicants', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Applicant>) => {
    if (mock()) return recruitmentDemo.applicantsUpdate(id, data);
    const response = await api.put<Applicant>(`/recruitment/applicants/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, status: CandidateStatus) => {
    if (mock()) return recruitmentDemo.applicantsUpdateStatus(id, status);
    const response = await api.patch<Applicant>(`/recruitment/applicants/${id}/status`, {
      status,
    });
    return response.data;
  },

  parseResume: async (fileData: FormData) => {
    const response = await api.post('/recruitment/applicants/parse-resume', fileData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  shortlist: async (applicantIds: string[]) => {
    if (mock()) {
      return applicantIds.map((id) => recruitmentDemo.applicantsUpdateStatus(id, 'shortlisted'));
    }
    const response = await api.post('/recruitment/applicants/shortlist', { applicantIds });
    return response.data;
  },

  reject: async (applicantIds: string[], reason: string) => {
    if (mock()) {
      return applicantIds.map((id) => recruitmentDemo.applicantsUpdate(id, { status: 'rejected', notes: reason }));
    }
    const response = await api.post('/recruitment/applicants/reject', { applicantIds, reason });
    return response.data;
  },

  delete: async (id: string) => {
    if (mock()) return recruitmentDemo.applicantsDelete(id);
    await api.delete(`/recruitment/applicants/${id}`);
  },
};

// Interview API
export const interviewAPI = {
  getAll: async (filters?: any) => {
    if (mock()) return recruitmentDemo.interviewsGetAll();
    const response = await api.get<Interview[]>('/recruitment/interviews', { params: filters });
    return response.data;
  },

  getByApplicant: async (applicantId: string) => {
    if (mock()) return recruitmentDemo.interviewsGetByApplicant(applicantId);
    const response = await api.get<Interview[]>(`/recruitment/applicants/${applicantId}/interviews`);
    return response.data;
  },

  getById: async (id: string) => {
    if (mock()) return recruitmentDemo.interviewsGetById(id);
    const response = await api.get<Interview>(`/recruitment/interviews/${id}`);
    return response.data;
  },

  schedule: async (applicantId: string, data: any) => {
    if (mock()) return recruitmentDemo.interviewsSchedule(applicantId, data);
    const response = await api.post<Interview>(`/recruitment/applicants/${applicantId}/interviews`, data);
    return response.data;
  },

  reschedule: async (id: string, data: any) => {
    if (mock()) return recruitmentDemo.interviewsUpdate(id, data);
    const response = await api.put<Interview>(`/recruitment/interviews/${id}/reschedule`, data);
    return response.data;
  },

  cancel: async (id: string, reason?: string) => {
    if (mock()) return recruitmentDemo.interviewsCancel(id, reason);
    const response = await api.post(`/recruitment/interviews/${id}/cancel`, { reason });
    return response.data;
  },

  submitFeedback: async (id: string, feedback: InterviewFeedback) => {
    if (mock()) return recruitmentDemo.interviewsSubmitFeedback(id, feedback);
    const response = await api.post(`/recruitment/interviews/${id}/feedback`, feedback);
    return response.data;
  },

  getFeedback: async (id: string) => {
    if (mock()) return recruitmentDemo.interviewsGetById(id).feedback;
    const response = await api.get<InterviewFeedback>(`/recruitment/interviews/${id}/feedback`);
    return response.data;
  },

  sendReminder: async (id: string) => {
    if (mock()) return { success: true };
    const response = await api.post(`/recruitment/interviews/${id}/send-reminder`, {});
    return response.data;
  },
};

// Offer Letter API
export const offerLetterAPI = {
  getAll: async (filters?: any) => {
    if (mock()) return recruitmentDemo.offersGetAll();
    const response = await api.get<OfferLetter[]>('/recruitment/offers', { params: filters });
    return response.data;
  },

  getByApplicant: async (applicantId: string) => {
    if (mock()) return recruitmentDemo.offersGetByApplicant(applicantId);
    const response = await api.get<OfferLetter[]>(`/recruitment/applicants/${applicantId}/offers`);
    return response.data;
  },

  getById: async (id: string) => {
    if (mock()) return recruitmentDemo.offersGetById(id);
    const response = await api.get<OfferLetter>(`/recruitment/offers/${id}`);
    return response.data;
  },

  generate: async (applicantId: string, data: any) => {
    if (mock()) return recruitmentDemo.offersGenerate(applicantId, data);
    const response = await api.post<OfferLetter>(`/recruitment/applicants/${applicantId}/offers`, data);
    return response.data;
  },

  update: async (id: string, data: any) => {
    if (mock()) return recruitmentDemo.offersUpdate(id, data);
    const response = await api.put<OfferLetter>(`/recruitment/offers/${id}`, data);
    return response.data;
  },

  send: async (id: string) => {
    if (mock()) return recruitmentDemo.offersUpdate(id, { status: 'sent', sentDate: new Date().toISOString() });
    const response = await api.post(`/recruitment/offers/${id}/send`, {});
    return response.data;
  },

  accept: async (id: string) => {
    if (mock()) return recruitmentDemo.offersUpdate(id, { status: 'accepted', acceptedDate: new Date().toISOString() });
    const response = await api.post(`/recruitment/offers/${id}/accept`, {});
    return response.data;
  },

  reject: async (id: string, reason: string) => {
    if (mock()) return recruitmentDemo.offersUpdate(id, { status: 'rejected', rejectionReason: reason });
    const response = await api.post(`/recruitment/offers/${id}/reject`, { reason });
    return response.data;
  },

  revoke: async (id: string, reason: string) => {
    if (mock()) return recruitmentDemo.offersUpdate(id, { status: 'expired', rejectionReason: reason });
    const response = await api.post(`/recruitment/offers/${id}/revoke`, { reason });
    return response.data;
  },

  getDocument: async (id: string) => {
    const response = await api.get(`/recruitment/offers/${id}/document`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

// Onboarding API
export const onboardingAPI = {
  getAll: async (filters?: any) => {
    if (mock()) return recruitmentDemo.onboardingGetAll();
    const response = await api.get<OnboardingChecklist[]>('/recruitment/onboarding/checklists', {
      params: filters,
    });
    return response.data;
  },

  getByEmployee: async (employeeId: string) => {
    if (mock()) return recruitmentDemo.onboardingGetByEmployee(employeeId);
    const response = await api.get<OnboardingChecklist>(`/recruitment/onboarding/employee/${employeeId}`);
    return response.data;
  },

  getById: async (id: string) => {
    if (mock()) return recruitmentDemo.onboardingGetById(id);
    const response = await api.get<OnboardingChecklist>(`/recruitment/onboarding/checklists/${id}`);
    return response.data;
  },

  create: async (employeeId: string, data: any) => {
    if (mock()) return recruitmentDemo.onboardingCreate(employeeId, data);
    const response = await api.post<OnboardingChecklist>('/recruitment/onboarding/checklists', {
      employeeId,
      ...data,
    });
    return response.data;
  },

  updateItemStatus: async (checklistId: string, itemId: string, status: string) => {
    if (mock()) return recruitmentDemo.onboardingUpdateItemStatus(checklistId, itemId, status);
    const response = await api.patch(
      `/recruitment/onboarding/checklists/${checklistId}/items/${itemId}`,
      { status }
    );
    return response.data;
  },

  addItem: async (checklistId: string, item: any) => {
    if (mock()) return recruitmentDemo.onboardingAddItem(checklistId, item);
    const response = await api.post(
      `/recruitment/onboarding/checklists/${checklistId}/items`,
      item
    );
    return response.data;
  },

  removeItem: async (checklistId: string, itemId: string) => {
    if (mock()) return recruitmentDemo.onboardingRemoveItem(checklistId, itemId);
    await api.delete(`/recruitment/onboarding/checklists/${checklistId}/items/${itemId}`);
  },

  complete: async (id: string) => {
    if (mock()) return recruitmentDemo.onboardingComplete(id);
    const response = await api.post(`/recruitment/onboarding/checklists/${id}/complete`, {});
    return response.data;
  },
};

// Onboarding Documents API
export const onboardingDocumentAPI = {
  getAll: async (employeeId: string) => {
    if (mock()) return recruitmentDemo.documentsGetAll(employeeId);
    const response = await api.get<OnboardingDocument[]>(
      `/recruitment/onboarding/${employeeId}/documents`
    );
    return response.data;
  },

  upload: async (employeeId: string, file: File, documentType: string) => {
    if (mock()) return recruitmentDemo.documentsUpload(employeeId, file, documentType);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('documentType', documentType);
    formData.append('documentName', file.name);

    const response = await api.post<OnboardingDocument>(
      `/recruitment/onboarding/${employeeId}/documents`,
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    );
    return response.data;
  },

  verify: async (documentId: string) => {
    if (mock()) return recruitmentDemo.documentsVerify(documentId);
    const response = await api.post(`/recruitment/onboarding/documents/${documentId}/verify`, {});
    return response.data;
  },

  reject: async (documentId: string, reason: string) => {
    if (mock()) return recruitmentDemo.documentsReject(documentId, reason);
    const response = await api.post(`/recruitment/onboarding/documents/${documentId}/reject`, {
      reason,
    });
    return response.data;
  },

  delete: async (documentId: string) => {
    if (mock()) return recruitmentDemo.documentsDelete(documentId);
    await api.delete(`/recruitment/onboarding/documents/${documentId}`);
  },
};
