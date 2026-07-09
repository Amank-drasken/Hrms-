import { Router } from 'express';
import { readCollection, writeCollection, genId, nowIso } from '../db';
import { requireAuth, requireRole, AuthedRequest } from '../auth';

const router = Router();

// Recruitment is an ADMIN/HR area.
router.use(requireAuth, requireRole('ADMIN', 'HR'));

// ---------- helpers ----------
function findOr404(res: any, collection: string, id: string) {
  const rows = readCollection(collection);
  const row = rows.find((r: any) => r.id === id);
  if (!row) {
    res.status(404).json({ message: 'Not found' });
    return null;
  }
  return { rows, row };
}

function patchRow(collection: string, id: string, patch: any) {
  const rows = readCollection(collection);
  const idx = rows.findIndex((r: any) => r.id === id);
  if (idx === -1) return null;
  rows[idx] = { ...rows[idx], ...patch, id: rows[idx].id, updatedAt: nowIso() };
  writeCollection(collection, rows);
  return rows[idx];
}

function currentName(req: AuthedRequest) {
  return `${req.user?.firstName || ''} ${req.user?.lastName || ''}`.trim() || 'HR';
}

// =====================================================================
// JOB REQUISITIONS
// =====================================================================
router.get('/jobs', (req, res) => {
  let jobs = readCollection('jobs');
  const { status, department } = req.query as any;
  if (status) jobs = jobs.filter((j: any) => j.status === status);
  if (department) jobs = jobs.filter((j: any) => j.department === department);
  res.json(jobs);
});

router.post('/jobs', (req: AuthedRequest, res) => {
  const jobs = readCollection('jobs');
  const now = nowIso();
  const job = {
    id: genId('job'),
    ...req.body,
    status: req.body.status || 'draft',
    createdBy: currentName(req),
    createdAt: now,
    updatedAt: now,
  };
  writeCollection('jobs', [job, ...jobs]);
  res.status(201).json(job);
});

router.get('/jobs/:id', (req, res) => {
  const found = findOr404(res, 'jobs', req.params.id);
  if (found) res.json(found.row);
});

router.put('/jobs/:id', (req, res) => {
  const updated = patchRow('jobs', req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Job not found' });
  res.json(updated);
});

router.delete('/jobs/:id', (req, res) => {
  const rows = readCollection('jobs');
  const next = rows.filter((r: any) => r.id !== req.params.id);
  writeCollection('jobs', next);
  res.json({ message: 'Job deleted' });
});

router.post('/jobs/:id/submit-approval', (req, res) => {
  const updated = patchRow('jobs', req.params.id, { status: 'pending_approval', approvalStatus: 'pending' });
  if (!updated) return res.status(404).json({ message: 'Job not found' });
  res.json(updated);
});

router.post('/jobs/:id/approve', (req: AuthedRequest, res) => {
  const updated = patchRow('jobs', req.params.id, {
    status: 'open', approvalStatus: 'approved', approvedBy: currentName(req), approvedAt: nowIso(),
  });
  if (!updated) return res.status(404).json({ message: 'Job not found' });
  res.json(updated);
});

router.post('/jobs/:id/reject', (req, res) => {
  const updated = patchRow('jobs', req.params.id, {
    status: 'rejected', approvalStatus: 'rejected', rejectionReason: req.body?.reason,
  });
  if (!updated) return res.status(404).json({ message: 'Job not found' });
  res.json(updated);
});

// Applicants for a job
router.get('/jobs/:id/applicants', (req, res) => {
  const applicants = readCollection('applicants').filter((a: any) => a.jobId === req.params.id);
  res.json(applicants);
});

// =====================================================================
// APPLICANTS
// =====================================================================
router.get('/applicants', (_req, res) => {
  res.json(readCollection('applicants'));
});

router.post('/applicants', (req, res) => {
  const applicants = readCollection('applicants');
  let jobTitle = req.body.jobTitle;
  if (!jobTitle && req.body.jobId) {
    jobTitle = readCollection('jobs').find((j: any) => j.id === req.body.jobId)?.title || '';
  }
  const now = nowIso();
  const applicant = {
    id: genId('app'),
    ...req.body,
    jobTitle,
    status: req.body.status || 'applied',
    appliedDate: req.body.appliedDate || now,
    createdAt: now,
    updatedAt: now,
  };
  writeCollection('applicants', [applicant, ...applicants]);
  res.status(201).json(applicant);
});

router.get('/applicants/:id', (req, res) => {
  const found = findOr404(res, 'applicants', req.params.id);
  if (found) res.json(found.row);
});

router.put('/applicants/:id', (req, res) => {
  const updated = patchRow('applicants', req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Applicant not found' });
  res.json(updated);
});

router.patch('/applicants/:id/status', (req, res) => {
  const updated = patchRow('applicants', req.params.id, { status: req.body?.status });
  if (!updated) return res.status(404).json({ message: 'Applicant not found' });

  // Cross-module sync: when hired, auto-create an onboarding checklist.
  if (req.body?.status === 'hired') {
    ensureOnboarding(updated);
  }
  res.json(updated);
});

router.delete('/applicants/:id', (req, res) => {
  const rows = readCollection('applicants');
  writeCollection('applicants', rows.filter((r: any) => r.id !== req.params.id));
  res.json({ message: 'Applicant deleted' });
});

// Interviews / offers for a specific applicant
router.get('/applicants/:id/interviews', (req, res) => {
  res.json(readCollection('interviews').filter((i: any) => i.applicantId === req.params.id));
});

router.post('/applicants/:id/interviews', (req, res) => {
  const interviews = readCollection('interviews');
  const applicant = readCollection('applicants').find((a: any) => a.id === req.params.id);
  const now = nowIso();
  const interview = {
    id: genId('int'),
    applicantId: req.params.id,
    applicantName: applicant ? `${applicant.firstName} ${applicant.lastName}` : req.body.applicantName,
    jobId: applicant?.jobId || req.body.jobId,
    jobTitle: applicant?.jobTitle || req.body.jobTitle,
    status: 'scheduled',
    ...req.body,
    createdAt: now,
    updatedAt: now,
  };
  writeCollection('interviews', [interview, ...interviews]);
  if (applicant) patchRow('applicants', applicant.id, { status: 'interview_scheduled' });
  res.status(201).json(interview);
});

router.get('/applicants/:id/offers', (req, res) => {
  res.json(readCollection('offers').filter((o: any) => o.applicantId === req.params.id));
});

router.post('/applicants/:id/offers', (req, res) => {
  const offers = readCollection('offers');
  const applicant = readCollection('applicants').find((a: any) => a.id === req.params.id);
  const now = nowIso();
  const offer = {
    id: genId('off'),
    applicantId: req.params.id,
    applicantName: applicant ? `${applicant.firstName} ${applicant.lastName}` : req.body.applicantName,
    applicantEmail: applicant?.email,
    jobId: applicant?.jobId,
    jobTitle: applicant?.jobTitle,
    position: req.body.position || applicant?.jobTitle,
    status: 'draft',
    ...req.body,
    createdAt: now,
    updatedAt: now,
  };
  writeCollection('offers', [offer, ...offers]);
  if (applicant) patchRow('applicants', applicant.id, { status: 'offer_extended' });
  res.status(201).json(offer);
});

// =====================================================================
// INTERVIEWS
// =====================================================================
router.get('/interviews', (_req, res) => {
  res.json(readCollection('interviews'));
});

router.get('/interviews/:id', (req, res) => {
  const found = findOr404(res, 'interviews', req.params.id);
  if (found) res.json(found.row);
});

router.put('/interviews/:id/reschedule', (req, res) => {
  const updated = patchRow('interviews', req.params.id, { ...req.body, status: 'scheduled' });
  if (!updated) return res.status(404).json({ message: 'Interview not found' });
  res.json(updated);
});

router.post('/interviews/:id/cancel', (req, res) => {
  const updated = patchRow('interviews', req.params.id, { status: 'cancelled', notes: req.body?.reason });
  if (!updated) return res.status(404).json({ message: 'Interview not found' });
  res.json(updated);
});

router.post('/interviews/:id/feedback', (req: AuthedRequest, res) => {
  const updated = patchRow('interviews', req.params.id, {
    feedback: { ...req.body, submittedBy: req.body.submittedBy || currentName(req), submittedAt: nowIso() },
    status: 'completed',
  });
  if (!updated) return res.status(404).json({ message: 'Interview not found' });
  res.json(updated);
});

router.get('/interviews/:id/feedback', (req, res) => {
  const found = findOr404(res, 'interviews', req.params.id);
  if (found) res.json(found.row.feedback || null);
});

// =====================================================================
// OFFERS
// =====================================================================
router.get('/offers', (_req, res) => {
  res.json(readCollection('offers'));
});

router.get('/offers/:id', (req, res) => {
  const found = findOr404(res, 'offers', req.params.id);
  if (found) res.json(found.row);
});

router.put('/offers/:id', (req, res) => {
  const updated = patchRow('offers', req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'Offer not found' });
  res.json(updated);
});

router.post('/offers/:id/send', (req, res) => {
  const updated = patchRow('offers', req.params.id, { status: 'sent', sentDate: nowIso() });
  if (!updated) return res.status(404).json({ message: 'Offer not found' });
  res.json(updated);
});

router.post('/offers/:id/accept', (req, res) => {
  const updated = patchRow('offers', req.params.id, { status: 'accepted', acceptedDate: nowIso() });
  if (!updated) return res.status(404).json({ message: 'Offer not found' });
  res.json(updated);
});

router.post('/offers/:id/reject', (req, res) => {
  const updated = patchRow('offers', req.params.id, { status: 'rejected', rejectionReason: req.body?.reason });
  if (!updated) return res.status(404).json({ message: 'Offer not found' });
  res.json(updated);
});

// =====================================================================
// ONBOARDING
// =====================================================================
function recompute(c: any) {
  const total = c.items?.length || 0;
  const done = c.items?.filter((i: any) => i.status === 'completed').length || 0;
  c.completionStatus = total > 0 ? Math.round((done / total) * 100) : 0;
  return c;
}

function ensureOnboarding(applicant: any) {
  const lists = readCollection('onboarding');
  if (lists.some((c: any) => c.employeeId === applicant.id)) return;
  const job = readCollection('jobs').find((j: any) => j.id === applicant.jobId);
  const now = nowIso();
  const checklist = {
    id: genId('onb'),
    employeeId: applicant.id,
    employeeName: `${applicant.firstName} ${applicant.lastName}`,
    employeeEmail: applicant.email,
    department: job?.department || 'General',
    startDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    completionStatus: 0,
    items: [
      { id: genId('oi'), title: 'Issue laptop & accessories', description: 'Hardware allocation', category: 'it_setup', status: 'pending', dueDate: new Date().toISOString().split('T')[0] },
      { id: genId('oi'), title: 'Create email & system accounts', description: 'Provision SSO', category: 'it_setup', status: 'pending', dueDate: new Date().toISOString().split('T')[0] },
      { id: genId('oi'), title: 'Sign employment contract', description: 'Digital signature', category: 'paperwork', status: 'pending', dueDate: new Date().toISOString().split('T')[0] },
    ],
    createdAt: now,
    updatedAt: now,
  };
  writeCollection('onboarding', [checklist, ...lists]);
}

router.get('/onboarding/checklists', (_req, res) => {
  res.json(readCollection('onboarding').map(recompute));
});

router.post('/onboarding/checklists', (req, res) => {
  const lists = readCollection('onboarding');
  const now = nowIso();
  const checklist = recompute({
    id: genId('onb'),
    ...req.body,
    completionStatus: 0,
    items: req.body.items || [],
    createdAt: now,
    updatedAt: now,
  });
  writeCollection('onboarding', [checklist, ...lists]);
  res.status(201).json(checklist);
});

router.get('/onboarding/checklists/:id', (req, res) => {
  const found = findOr404(res, 'onboarding', req.params.id);
  if (found) res.json(recompute(found.row));
});

router.get('/onboarding/employee/:employeeId', (req, res) => {
  const c = readCollection('onboarding').find((x: any) => x.employeeId === req.params.employeeId);
  res.json(c ? recompute(c) : null);
});

router.patch('/onboarding/checklists/:id/items/:itemId', (req: AuthedRequest, res) => {
  const lists = readCollection('onboarding');
  const idx = lists.findIndex((c: any) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Checklist not found' });
  lists[idx].items = lists[idx].items.map((it: any) =>
    it.id === req.params.itemId
      ? {
          ...it,
          status: req.body.status,
          completedAt: req.body.status === 'completed' ? nowIso() : undefined,
          completedBy: req.body.status === 'completed' ? currentName(req) : undefined,
        }
      : it
  );
  recompute(lists[idx]);
  lists[idx].updatedAt = nowIso();
  writeCollection('onboarding', lists);
  res.json(lists[idx]);
});

router.post('/onboarding/checklists/:id/items', (req, res) => {
  const lists = readCollection('onboarding');
  const idx = lists.findIndex((c: any) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Checklist not found' });
  const item = { id: genId('oi'), status: 'pending', ...req.body };
  lists[idx].items = [...lists[idx].items, item];
  recompute(lists[idx]);
  writeCollection('onboarding', lists);
  res.status(201).json(lists[idx]);
});

router.delete('/onboarding/checklists/:id/items/:itemId', (req, res) => {
  const lists = readCollection('onboarding');
  const idx = lists.findIndex((c: any) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Checklist not found' });
  lists[idx].items = lists[idx].items.filter((it: any) => it.id !== req.params.itemId);
  recompute(lists[idx]);
  writeCollection('onboarding', lists);
  res.json(lists[idx]);
});

router.post('/onboarding/checklists/:id/complete', (req, res) => {
  const lists = readCollection('onboarding');
  const idx = lists.findIndex((c: any) => c.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Checklist not found' });
  lists[idx].items = lists[idx].items.map((it: any) => ({ ...it, status: 'completed', completedAt: it.completedAt || nowIso() }));
  recompute(lists[idx]);
  lists[idx].completedAt = nowIso();
  writeCollection('onboarding', lists);
  res.json(lists[idx]);
});

// ---------- Onboarding documents ----------
router.get('/onboarding/:employeeId/documents', (req, res) => {
  res.json(readCollection('documents').filter((d: any) => d.employeeId === req.params.employeeId));
});

router.post('/onboarding/:employeeId/documents', (req: AuthedRequest, res) => {
  // NOTE: real file upload would use multer; here we just record metadata.
  const docs = readCollection('documents');
  const doc = {
    id: genId('doc'),
    employeeId: req.params.employeeId,
    documentType: req.body?.documentType || 'other',
    documentName: req.body?.documentName || 'document',
    fileUrl: '#',
    uploadedBy: currentName(req),
    uploadedAt: nowIso(),
    verificationStatus: 'pending',
  };
  writeCollection('documents', [doc, ...docs]);
  res.status(201).json(doc);
});

router.post('/onboarding/documents/:documentId/verify', (req: AuthedRequest, res) => {
  const updated = patchRow('documents', req.params.documentId, {
    verificationStatus: 'verified', verifiedBy: currentName(req), verifiedAt: nowIso(),
  });
  if (!updated) return res.status(404).json({ message: 'Document not found' });
  res.json(updated);
});

router.post('/onboarding/documents/:documentId/reject', (req, res) => {
  const updated = patchRow('documents', req.params.documentId, {
    verificationStatus: 'rejected', rejectionReason: req.body?.reason,
  });
  if (!updated) return res.status(404).json({ message: 'Document not found' });
  res.json(updated);
});

router.delete('/onboarding/documents/:documentId', (req, res) => {
  const docs = readCollection('documents');
  writeCollection('documents', docs.filter((d: any) => d.id !== req.params.documentId));
  res.json({ message: 'Document deleted' });
});

export default router;
