import { Router } from 'express';
import { readCollection, writeCollection, genId, nowIso } from '../db';
import { requireAuth, requireRole, AuthedRequest } from '../auth';

const router = Router();
router.use(requireAuth);

// Leave type default balances (mirrors frontend src/lib/leaveData.ts).
const LEAVE_TYPES = [
  { code: 'CL', defaultBalance: 12 },
  { code: 'SL', defaultBalance: 8 },
  { code: 'EL', defaultBalance: 15 },
  { code: 'WFH', defaultBalance: 24 },
];

function countDays(start: string, end: string): number {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  const diff = Math.floor((e.getTime() - s.getTime()) / 86400000);
  return diff < 0 ? 0 : diff + 1;
}

/**
 * GET /leaves
 * ADMIN/HR see all requests; an EMPLOYEE sees only their own.
 */
router.get('/', (req: AuthedRequest, res) => {
  let leaves = readCollection('leaves');
  if (req.user?.role === 'EMPLOYEE') {
    leaves = leaves.filter((l: any) => String(l.employeeId) === String(req.user?.sub));
  }
  res.json(leaves);
});

/** POST /leaves — apply for leave. */
router.post('/', (req: AuthedRequest, res) => {
  const leaves = readCollection('leaves');
  const body = req.body || {};
  const leave = {
    id: genId('lv'),
    employeeId: body.employeeId || req.user?.sub,
    employeeName: body.employeeName || `${req.user?.firstName || ''} ${req.user?.lastName || ''}`.trim(),
    type: body.type,
    startDate: body.startDate,
    endDate: body.endDate,
    days: body.days || countDays(body.startDate, body.endDate),
    reason: body.reason || '',
    status: 'PENDING',
    appliedAt: nowIso(),
  };
  writeCollection('leaves', [leave, ...leaves]);
  res.status(201).json(leave);
});

/** PATCH /leaves/:id/status — approve / reject (ADMIN/HR). */
router.patch('/:id/status', requireRole('ADMIN', 'HR'), (req: AuthedRequest, res) => {
  const leaves = readCollection('leaves');
  const idx = leaves.findIndex((l: any) => l.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Leave request not found' });

  leaves[idx].status = req.body?.status; // APPROVED | REJECTED
  leaves[idx].reviewedBy = `${req.user?.firstName || ''} ${req.user?.lastName || ''}`.trim() || req.user?.role;
  leaves[idx].reviewedAt = nowIso();
  writeCollection('leaves', leaves);
  res.json(leaves[idx]);
});

/** GET /leaves/balance/:employeeId — remaining balance per leave type. */
router.get('/balance/:employeeId', (req, res) => {
  const approved = readCollection('leaves').filter(
    (l: any) => String(l.employeeId) === String(req.params.employeeId) && l.status === 'APPROVED'
  );
  const result: Record<string, { used: number; total: number; remaining: number }> = {};
  for (const t of LEAVE_TYPES) {
    const used = approved
      .filter((l: any) => l.type === t.code)
      .reduce((sum: number, l: any) => sum + (l.days || 0), 0);
    result[t.code] = { used, total: t.defaultBalance, remaining: Math.max(0, t.defaultBalance - used) };
  }
  res.json(result);
});

export default router;
