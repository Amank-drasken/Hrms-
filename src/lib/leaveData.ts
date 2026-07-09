// Leave & Payroll demo data + localStorage-backed service
// Works in demo/mock mode without a backend. When a real backend is wired up,
// swap the localStorage helpers for the leaveAPI / payrollAPI calls in api.ts.

export type LeaveTypeCode = 'CL' | 'SL' | 'EL' | 'WFH';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface LeaveType {
  code: LeaveTypeCode;
  label: string;
  description: string;
  defaultBalance: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: LeaveTypeCode;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  days: number;
  reason: string;
  status: LeaveStatus;
  appliedAt: string; // ISO
  reviewedBy?: string;
  reviewedAt?: string;
}

export const LEAVE_TYPES: LeaveType[] = [
  { code: 'CL', label: 'Casual Leave', description: 'Short-notice personal time off', defaultBalance: 12 },
  { code: 'SL', label: 'Sick Leave', description: 'Medical / health related leave', defaultBalance: 8 },
  { code: 'EL', label: 'Earned Leave', description: 'Accrued / privilege leave', defaultBalance: 15 },
  { code: 'WFH', label: 'Work From Home', description: 'Remote working day', defaultBalance: 24 },
];

export const getLeaveTypeLabel = (code: LeaveTypeCode): string =>
  LEAVE_TYPES.find((t) => t.code === code)?.label || code;

const STORAGE_KEY = 'hr_leave_requests';

// ---- Demo seed data ----
const today = new Date();
const iso = (d: Date) => d.toISOString().split('T')[0];
const addDays = (base: Date, n: number) => {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
};

const demoLeaves: LeaveRequest[] = [
  {
    id: 'lv-demo-001',
    employeeId: '2-demo-002',
    employeeName: 'Sarah Smith',
    type: 'CL',
    startDate: iso(addDays(today, 3)),
    endDate: iso(addDays(today, 4)),
    days: 2,
    reason: 'Family function out of town.',
    status: 'PENDING',
    appliedAt: new Date().toISOString(),
  },
  {
    id: 'lv-demo-002',
    employeeId: '3-demo-003',
    employeeName: 'Michael Johnson',
    type: 'SL',
    startDate: iso(addDays(today, -2)),
    endDate: iso(addDays(today, -2)),
    days: 1,
    reason: 'Fever and rest advised by doctor.',
    status: 'APPROVED',
    appliedAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    reviewedBy: 'HR',
    reviewedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: 'lv-demo-003',
    employeeId: '4-demo-004',
    employeeName: 'Emily Williams',
    type: 'WFH',
    startDate: iso(addDays(today, 1)),
    endDate: iso(addDays(today, 1)),
    days: 1,
    reason: 'Plumber visit at home.',
    status: 'PENDING',
    appliedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'lv-demo-004',
    employeeId: '5-demo-005',
    employeeName: 'Robert Brown',
    type: 'EL',
    startDate: iso(addDays(today, -10)),
    endDate: iso(addDays(today, -6)),
    days: 5,
    reason: 'Annual vacation with family.',
    status: 'REJECTED',
    appliedAt: new Date(Date.now() - 12 * 86400000).toISOString(),
    reviewedBy: 'HR',
    reviewedAt: new Date(Date.now() - 11 * 86400000).toISOString(),
  },
];

function readAll(): LeaveRequest[] {
  if (typeof window === 'undefined') return demoLeaves;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoLeaves));
      return demoLeaves;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : demoLeaves;
  } catch {
    return demoLeaves;
  }
}

function writeAll(leaves: LeaveRequest[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leaves));
}

/** Inclusive business-agnostic day count between two ISO dates. */
export function countDays(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
  const diff = Math.floor((end.getTime() - start.getTime()) / 86400000);
  return diff < 0 ? 0 : diff + 1;
}

export const leaveService = {
  getAll(): LeaveRequest[] {
    return readAll();
  },

  getForEmployee(employeeId: string): LeaveRequest[] {
    return readAll().filter((l) => String(l.employeeId) === String(employeeId));
  },

  getPending(): LeaveRequest[] {
    return readAll().filter((l) => l.status === 'PENDING');
  },

  create(input: Omit<LeaveRequest, 'id' | 'status' | 'appliedAt' | 'days'> & { days?: number }): LeaveRequest {
    const all = readAll();
    const newLeave: LeaveRequest = {
      ...input,
      days: input.days ?? countDays(input.startDate, input.endDate),
      id: `lv-${Date.now()}`,
      status: 'PENDING',
      appliedAt: new Date().toISOString(),
    };
    writeAll([newLeave, ...all]);
    return newLeave;
  },

  updateStatus(id: string, status: LeaveStatus, reviewedBy = 'Manager'): void {
    const all = readAll().map((l) =>
      l.id === id
        ? { ...l, status, reviewedBy, reviewedAt: new Date().toISOString() }
        : l
    );
    writeAll(all);
  },

  /** Remaining balance per leave type for an employee (approved days deducted). */
  getBalance(employeeId: string): Record<LeaveTypeCode, { used: number; total: number; remaining: number }> {
    const approved = readAll().filter(
      (l) => String(l.employeeId) === String(employeeId) && l.status === 'APPROVED'
    );
    const result = {} as Record<LeaveTypeCode, { used: number; total: number; remaining: number }>;
    for (const t of LEAVE_TYPES) {
      const used = approved
        .filter((l) => l.type === t.code)
        .reduce((sum, l) => sum + (l.days || 0), 0);
      result[t.code] = {
        used,
        total: t.defaultBalance,
        remaining: Math.max(0, t.defaultBalance - used),
      };
    }
    return result;
  },
};
