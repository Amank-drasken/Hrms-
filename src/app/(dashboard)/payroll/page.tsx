'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  generatePayslips,
  downloadPayslip,
  formatCurrency,
  type Payslip,
} from '@/lib/payrollData';
import { Wallet, Download, IndianRupee, TrendingUp, Receipt } from 'lucide-react';
import { format } from 'date-fns';

export default function PayrollPage() {
  const router = useRouter();
  const [payslips, setPayslips] = useState<Payslip[]>([]);
  const [selected, setSelected] = useState<Payslip | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login');
      return;
    }
    const employeeId = localStorage.getItem('user_id') || 'me';
    const firstName = localStorage.getItem('user_firstName') || 'Me';
    const lastName = localStorage.getItem('user_lastName') || '';
    const name = `${firstName} ${lastName}`.trim();

    const slips = generatePayslips(employeeId, name);
    setPayslips(slips);
    // Default to the latest fully paid slip for the breakdown view
    setSelected(slips.find((s) => s.status === 'PAID') || slips[0] || null);
  }, [router]);

  const latestPaid = payslips.find((s) => s.status === 'PAID');

  return (
    <div className='min-h-screen bg-background p-8'>
      {/* Header */}
      <div className='mb-8'>
        <div className='flex items-center gap-3'>
          <Wallet className='text-emerald-500' size={32} />
          <h1 className='text-4xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent'>
            Payroll
          </h1>
        </div>
        <p className='text-muted-foreground'>View payslips and salary breakdown</p>
      </div>

      {/* KPI cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        <div className='p-6 rounded-xl border border-border bg-card'>
          <div className='flex items-center gap-2 mb-2 text-muted-foreground'>
            <IndianRupee size={18} />
            <span className='text-sm'>Latest Net Pay</span>
          </div>
          <p className='text-3xl font-bold text-foreground'>
            {latestPaid ? formatCurrency(latestPaid.netPay) : '—'}
          </p>
          <p className='text-xs text-muted-foreground mt-1'>{latestPaid?.month}</p>
        </div>
        <div className='p-6 rounded-xl border border-border bg-card'>
          <div className='flex items-center gap-2 mb-2 text-muted-foreground'>
            <TrendingUp size={18} />
            <span className='text-sm'>Gross Earnings</span>
          </div>
          <p className='text-3xl font-bold text-foreground'>
            {latestPaid ? formatCurrency(latestPaid.grossEarnings) : '—'}
          </p>
          <p className='text-xs text-muted-foreground mt-1'>Per month</p>
        </div>
        <div className='p-6 rounded-xl border border-border bg-card'>
          <div className='flex items-center gap-2 mb-2 text-muted-foreground'>
            <Receipt size={18} />
            <span className='text-sm'>Total Deductions</span>
          </div>
          <p className='text-3xl font-bold text-foreground'>
            {latestPaid ? formatCurrency(latestPaid.totalDeductions) : '—'}
          </p>
          <p className='text-xs text-muted-foreground mt-1'>PF + Tax + TDS</p>
        </div>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        {/* Payslip list */}
        <div className='lg:col-span-2 bg-card rounded-xl border border-border overflow-hidden shadow-lg'>
          <div className='p-6 border-b border-border flex items-center gap-2'>
            <Receipt className='w-5 h-5 text-emerald-500' />
            <h3 className='text-lg font-semibold text-foreground'>Payslips</h3>
          </div>
          <div className='overflow-x-auto'>
            <Table>
              <TableHeader>
                <TableRow className='border-border hover:bg-transparent'>
                  <TableHead className='font-semibold text-muted-foreground bg-card'>Month</TableHead>
                  <TableHead className='font-semibold text-muted-foreground bg-card'>Paid On</TableHead>
                  <TableHead className='font-semibold text-muted-foreground bg-card'>Net Pay</TableHead>
                  <TableHead className='font-semibold text-muted-foreground bg-card'>Status</TableHead>
                  <TableHead className='font-semibold text-muted-foreground bg-card text-right'>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payslips.map((s) => (
                  <TableRow
                    key={s.id}
                    onClick={() => setSelected(s)}
                    className={`border-border cursor-pointer transition-colors ${
                      selected?.id === s.id ? 'bg-muted/60' : 'hover:bg-muted/40'
                    }`}
                  >
                    <TableCell className='py-3 font-semibold text-foreground'>{s.month}</TableCell>
                    <TableCell className='py-3 text-sm text-muted-foreground'>
                      {s.status === 'PAID' ? format(new Date(s.paidOn), 'MMM dd, yyyy') : '—'}
                    </TableCell>
                    <TableCell className='py-3 font-medium text-foreground'>
                      {formatCurrency(s.netPay)}
                    </TableCell>
                    <TableCell className='py-3'>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border ${
                          s.status === 'PAID'
                            ? 'bg-emerald-500/20 text-emerald-600 border-emerald-500/40'
                            : 'bg-amber-500/20 text-amber-600 border-amber-500/40'
                        }`}
                      >
                        {s.status}
                      </span>
                    </TableCell>
                    <TableCell className='py-3 text-right'>
                      <Button
                        size='sm'
                        variant='outline'
                        disabled={s.status !== 'PAID'}
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadPayslip(s);
                        }}
                      >
                        <Download className='w-3.5 h-3.5 mr-1' />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Salary breakdown */}
        <div className='bg-card rounded-xl border border-border overflow-hidden shadow-lg h-fit'>
          <div className='p-6 border-b border-border'>
            <h3 className='text-lg font-semibold text-foreground'>Salary Breakdown</h3>
            <p className='text-xs text-muted-foreground mt-1'>
              {selected ? selected.month : 'Select a payslip'}
            </p>
          </div>
          {selected ? (
            <div className='p-6 space-y-5'>
              <div>
                <p className='text-xs font-semibold text-emerald-600 uppercase mb-2'>Earnings</p>
                <div className='space-y-2 text-sm'>
                  <Row label='Basic' value={formatCurrency(selected.breakdown.basic)} />
                  <Row label='HRA' value={formatCurrency(selected.breakdown.hra)} />
                  <Row label='DA' value={formatCurrency(selected.breakdown.da)} />
                  <Row
                    label='Special Allowance'
                    value={formatCurrency(selected.breakdown.specialAllowance)}
                  />
                  <Row
                    label='Gross Earnings'
                    value={formatCurrency(selected.grossEarnings)}
                    bold
                  />
                </div>
              </div>

              <div>
                <p className='text-xs font-semibold text-red-600 uppercase mb-2'>Deductions</p>
                <div className='space-y-2 text-sm'>
                  <Row label='Provident Fund (PF)' value={formatCurrency(selected.breakdown.pf)} />
                  <Row
                    label='Professional Tax'
                    value={formatCurrency(selected.breakdown.professionalTax)}
                  />
                  <Row label='TDS' value={formatCurrency(selected.breakdown.tds)} />
                  <Row
                    label='Total Deductions'
                    value={formatCurrency(selected.totalDeductions)}
                    bold
                  />
                </div>
              </div>

              <div className='flex items-center justify-between p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30'>
                <span className='font-semibold text-foreground'>Net Pay</span>
                <span className='text-xl font-bold text-emerald-600'>
                  {formatCurrency(selected.netPay)}
                </span>
              </div>

              <Button
                className='w-full bg-emerald-600 hover:bg-emerald-700'
                disabled={selected.status !== 'PAID'}
                onClick={() => downloadPayslip(selected)}
              >
                <Download className='w-4 h-4 mr-1.5' />
                Download Payslip
              </Button>
            </div>
          ) : (
            <div className='p-8 text-center text-muted-foreground text-sm'>
              No payslip selected
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div
      className={`flex items-center justify-between ${
        bold ? 'pt-2 border-t border-border font-semibold text-foreground' : 'text-muted-foreground'
      }`}
    >
      <span>{label}</span>
      <span className={bold ? 'text-foreground' : 'text-foreground'}>{value}</span>
    </div>
  );
}
