// Payroll demo data + helpers
// Generates payslips for the current user. Swap generatePayslips for a real
// payrollAPI call when a backend is available.

export interface PayslipBreakdown {
  basic: number;
  hra: number;
  da: number;
  specialAllowance: number;
  pf: number;
  professionalTax: number;
  tds: number;
}

export interface Payslip {
  id: string;
  employeeId: string;
  employeeName: string;
  month: string; // e.g. "May 2026"
  monthKey: string; // e.g. "2026-05"
  paidOn: string; // ISO date
  breakdown: PayslipBreakdown;
  grossEarnings: number;
  totalDeductions: number;
  netPay: number;
  status: 'PAID' | 'PROCESSING';
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Generate the last `count` months of payslips for an employee.
 * Salary components are derived deterministically from a base monthly CTC.
 */
export function generatePayslips(
  employeeId: string,
  employeeName: string,
  monthlyCtc = 75000,
  count = 6
): Payslip[] {
  const slips: Payslip[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthLabel = `${MONTH_NAMES[d.getMonth()]} ${d.getFullYear()}`;
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
    const netPay = grossEarnings - totalDeductions;

    slips.push({
      id: `pay-${monthKey}-${employeeId}`,
      employeeId,
      employeeName,
      month: monthLabel,
      monthKey,
      // Salary credited on the last day of the month
      paidOn: new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString(),
      breakdown: { basic, hra, da, specialAllowance, pf, professionalTax, tds },
      grossEarnings,
      totalDeductions,
      netPay,
      // Current month is still processing
      status: i === 0 ? 'PROCESSING' : 'PAID',
    });
  }

  return slips;
}

/** Build a printable HTML payslip and trigger the browser's print/save-as-PDF dialog. */
export function downloadPayslip(slip: Payslip): void {
  if (typeof window === 'undefined') return;
  const b = slip.breakdown;
  const row = (label: string, value: number) =>
    `<tr><td style="padding:6px 0">${label}</td><td style="padding:6px 0;text-align:right">${formatCurrency(value)}</td></tr>`;

  const html = `<!doctype html><html><head><meta charset="utf-8"/>
  <title>Payslip - ${slip.month}</title>
  <style>
    body{font-family:Arial,Helvetica,sans-serif;color:#1f2937;max-width:720px;margin:24px auto;padding:0 16px}
    h1{font-size:20px;margin:0 0 4px}
    .muted{color:#6b7280;font-size:13px}
    .grid{display:flex;gap:32px;margin-top:24px}
    .col{flex:1}
    h3{font-size:14px;border-bottom:2px solid #e5e7eb;padding-bottom:6px}
    table{width:100%;border-collapse:collapse;font-size:13px}
    .total{font-weight:bold;border-top:2px solid #e5e7eb}
    .net{margin-top:24px;background:#eff6ff;padding:16px;border-radius:8px;font-size:16px;font-weight:bold;display:flex;justify-content:space-between}
  </style></head><body>
    <h1>Payslip — ${slip.month}</h1>
    <div class="muted">${slip.employeeName} · Employee ID: ${slip.employeeId}</div>
    <div class="muted">Paid on: ${new Date(slip.paidOn).toLocaleDateString()}</div>
    <div class="grid">
      <div class="col">
        <h3>Earnings</h3>
        <table>
          ${row('Basic', b.basic)}
          ${row('HRA', b.hra)}
          ${row('DA', b.da)}
          ${row('Special Allowance', b.specialAllowance)}
          <tr class="total">${`<td style="padding:6px 0">Gross Earnings</td><td style="padding:6px 0;text-align:right">${formatCurrency(slip.grossEarnings)}</td>`}</tr>
        </table>
      </div>
      <div class="col">
        <h3>Deductions</h3>
        <table>
          ${row('Provident Fund (PF)', b.pf)}
          ${row('Professional Tax', b.professionalTax)}
          ${row('TDS', b.tds)}
          <tr class="total">${`<td style="padding:6px 0">Total Deductions</td><td style="padding:6px 0;text-align:right">${formatCurrency(slip.totalDeductions)}</td>`}</tr>
        </table>
      </div>
    </div>
    <div class="net"><span>Net Pay</span><span>${formatCurrency(slip.netPay)}</span></div>
    <p class="muted" style="margin-top:32px">This is a system-generated payslip and does not require a signature.</p>
    <script>window.onload=function(){window.print();}</script>
  </body></html>`;

  const win = window.open('', '_blank');
  if (win) {
    win.document.write(html);
    win.document.close();
  }
}
