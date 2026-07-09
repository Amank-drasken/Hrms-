import { Router } from 'express';
import { readCollection } from '../db';
import { requireAuth, AuthedRequest } from '../auth';

const router = Router();
router.use(requireAuth);

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Generate payslips deterministically from a monthly CTC.
 * Mirrors the frontend's src/lib/payrollData.ts so output matches.
 */
function generatePayslips(employeeId: string, employeeName: string, monthlyCtc = 75000, count = 6) {
  const slips = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

    const basic = Math.round(monthlyCtc * 0.45);
    const hra = Math.round(basic * 0.4);
    const da = Math.round(basic * 0.1);
    const specialAllowance = monthlyCtc - basic - hra - da;
    const pf = Math.round(basic * 0.12);
    const professionalTax = 200;
    const tds = Math.round(monthlyCtc * 0.05);
    const grossEarnings = basic + hra + da + specialAllowance;
    const totalDeductions = pf + professionalTax + tds;

    slips.push({
      id: `pay-${monthKey}-${employeeId}`,
      employeeId,
      employeeName,
      month: `${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
      monthKey,
      paidOn: new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString(),
      breakdown: { basic, hra, da, specialAllowance, pf, professionalTax, tds },
      grossEarnings,
      totalDeductions,
      netPay: grossEarnings - totalDeductions,
      status: i === 0 ? 'PROCESSING' : 'PAID',
    });
  }
  return slips;
}

/** GET /payroll/payslips/:employeeId */
router.get('/payslips/:employeeId', (req: AuthedRequest, res) => {
  // Employees can only see their own payslips.
  if (req.user?.role === 'EMPLOYEE' && req.user.sub !== req.params.employeeId) {
    return res.status(403).json({ message: 'Not allowed' });
  }

  const employee = readCollection('employees').find((e: any) => e.id === req.params.employeeId);
  const name = employee ? `${employee.firstName} ${employee.lastName}`.trim() : 'Employee';
  // Allow a per-employee CTC override if present, else default.
  const ctc = employee?.monthlyCtc || 75000;
  res.json(generatePayslips(req.params.employeeId, name, ctc));
});

/** GET /payroll/payslips/:employeeId/:monthKey — a single payslip. */
router.get('/payslips/:employeeId/:monthKey', (req: AuthedRequest, res) => {
  if (req.user?.role === 'EMPLOYEE' && req.user.sub !== req.params.employeeId) {
    return res.status(403).json({ message: 'Not allowed' });
  }
  const employee = readCollection('employees').find((e: any) => e.id === req.params.employeeId);
  const name = employee ? `${employee.firstName} ${employee.lastName}`.trim() : 'Employee';
  const ctc = employee?.monthlyCtc || 75000;
  const slip = generatePayslips(req.params.employeeId, name, ctc, 12).find(
    (s) => s.monthKey === req.params.monthKey
  );
  if (!slip) return res.status(404).json({ message: 'Payslip not found' });
  res.json(slip);
});

export default router;
