'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { attendanceAPIWithFallback } from '@/lib/apiWithFallback';
import { employeeAPI } from '@/lib/api';
import { Clock, TrendingUp, Calendar, AlarmClock, CheckCircle2, XCircle } from 'lucide-react';
import { DepartmentAttendanceChart, AttendanceTrendChart } from '@/components/charts/AttendanceStats';
import { demoEmployees } from '@/lib/demoData';
import { format } from 'date-fns';

// ---- Office configuration ----
// Change this to set your company's on-time deadline (24h format).
const OFFICE_HOUR = 9;   // 9 AM
const OFFICE_MIN  = 30;  // 30 minutes  →  deadline = 9:30 AM

interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
}

export default function AttendancePage() {
  const router = useRouter();
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [employees, setEmployees]   = useState<any[]>([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [tick, setTick]             = useState(0);

  const fetchEmployees = async () => {
    try {
      const res = await employeeAPI.getAll();
      const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
      setEmployees(list.length ? list : demoEmployees);
    } catch {
      setEmployees(demoEmployees);
    }
  };

  const fetchAttendance = async () => {
    try {
      const res = await attendanceAPIWithFallback.getAll();
      let all: Attendance[] = [];
      if (Array.isArray(res.data)) all = res.data;
      else if (Array.isArray(res.data?.data)) all = res.data.data;
      else {
        const v = Object.values(res.data || {}).find(v => Array.isArray(v));
        all = Array.isArray(v) ? (v as Attendance[]) : [];
      }

      const role   = localStorage.getItem('user_role');
      const userId = localStorage.getItem('user_id');
      const filtered = (role === 'ADMIN' || role === 'HR')
        ? all
        : all.filter(a => String(a.employeeId) === userId);

      setAttendance(filtered);
    } catch {
      setAttendance([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!localStorage.getItem('access_token')) { router.push('/login'); return; }
    fetchEmployees();
    fetchAttendance();
    const iv = setInterval(fetchAttendance, 10000);
    return () => clearInterval(iv);
  }, [router]);

  // Live clock tick every second (for duration of still-logged-in users)
  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, []);

  // ---- helpers ----
  const getEmployeeName = (id: string) => {
    const e = employees.find(e => e.id === id);
    if (!e) return id;
    return e.firstName && e.lastName ? `${e.firstName} ${e.lastName}` : e.name || id;
  };

  /** Is checkIn after office deadline? */
  const isLate = (checkIn: string, date: string): boolean => {
    const d = toDateFromTimeString(checkIn, date);
    if (!d) return false;
    return d.getHours() > OFFICE_HOUR || (d.getHours() === OFFICE_HOUR && d.getMinutes() > OFFICE_MIN);
  };

  /** How many minutes late */
  const lateByMinutes = (checkIn: string, date: string): number => {
    const d = toDateFromTimeString(checkIn, date);
    if (!d) return 0;
    const deadline = new Date(d);
    deadline.setHours(OFFICE_HOUR, OFFICE_MIN, 0, 0);
    return Math.max(0, Math.floor((d.getTime() - deadline.getTime()) / 60000));
  };

  // ---- KPI stats ----
  const today = new Date().toISOString().split('T')[0];
  const todayRec = attendance.filter(a => a.date?.startsWith(today));
  const lateCount = todayRec.filter(a => isLate(a.checkIn, a.date)).length;

  const avgHours = (() => {
    const withBoth = attendance.filter(a => a.checkIn && a.checkOut);
    if (!withBoth.length) return '0h 0m';
    let mins = 0;
    withBoth.forEach(r => {
      const i = toDateFromTimeString(r.checkIn, r.date);
      const o = toDateFromTimeString(r.checkOut!, r.date);
      if (i && o) {
        let d = o.getTime() - i.getTime();
        if (d < 0) d += 86400000;
        mins += Math.floor(d / 60000);
      }
    });
    const avg = Math.floor(mins / withBoth.length);
    return `${Math.floor(avg / 60)}h ${avg % 60}m`;
  })();

  // Show newest record per employee (for the main table)
  const tableRecords = attendance
    .slice()
    .sort((a, b) => {
      const at = toDateFromTimeString(a.checkIn, a.date)?.getTime() || 0;
      const bt = toDateFromTimeString(b.checkIn, b.date)?.getTime() || 0;
      return bt - at;
    });

  const SkeletonLoader = () => (
    <>
      {[...Array(6)].map((_, i) => (
        <TableRow key={i} className='border-border'>
          {[...Array(8)].map((_, j) => (
            <TableCell key={j}><Skeleton className='h-4 w-20 bg-card' /></TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );

  return (
    <div className='min-h-screen bg-background p-8'>

      {/* Header */}
      <div className='flex items-center gap-3 mb-2'>
        <Clock className='text-emerald-400' size={32} />
        <h1 className='text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'>
          Attendance Tracker
        </h1>
      </div>
      <p className='text-muted-foreground mb-8'>
        Real-time login tracking · Office hours: on time by&nbsp;
        <span className='text-amber-400 font-semibold'>
          {OFFICE_HOUR}:{String(OFFICE_MIN).padStart(2,'0')} AM
        </span>
      </p>

      {/* KPI Cards */}
      <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
        <KpiCard color='emerald' label='Checked In Today'    value={todayRec.filter(a => a.checkIn).length}   sub='Active sessions' />
        <KpiCard color='blue'    label='Total Records Today' value={todayRec.length}                          sub='Updated live'    />
        <KpiCard color='red'     label='Late Today'          value={lateCount}
          sub={`after ${OFFICE_HOUR}:${String(OFFICE_MIN).padStart(2,'0')} AM`} />
        <KpiCard color='amber'   label='Avg. Duration'       value={avgHours}                                  sub='Per session'     />
      </div>

      {/* Charts */}
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
        <AttendanceTrendChart />
        <DepartmentAttendanceChart />
      </div>

      {/* Records Table */}
      <div className='bg-card rounded-xl border border-border overflow-hidden shadow-2xl'>
        <div className='p-6 border-b border-border flex items-center justify-between'>
          <div className='flex items-center gap-2'>
            <Calendar className='w-5 h-5 text-blue-400' />
            <h3 className='text-lg font-semibold text-foreground'>Attendance Records</h3>
          </div>
          <div className='flex items-center gap-2 text-xs text-muted-foreground'>
            <AlarmClock className='w-3.5 h-3.5 text-amber-400' />
            On-time deadline: {OFFICE_HOUR}:{String(OFFICE_MIN).padStart(2,'0')} AM
          </div>
        </div>

        <div className='overflow-x-auto'>
          <Table>
            <TableHeader>
              <TableRow className='border-border hover:bg-transparent'>
                <TableHead className='text-muted-foreground bg-card font-semibold'>Employee</TableHead>
                <TableHead className='text-muted-foreground bg-card font-semibold'>Date</TableHead>
                <TableHead className='text-muted-foreground bg-card font-semibold'>Check In</TableHead>
                <TableHead className='text-muted-foreground bg-card font-semibold'>Check Out</TableHead>
                <TableHead className='text-muted-foreground bg-card font-semibold'>Duration</TableHead>
                <TableHead className='text-muted-foreground bg-card font-semibold'>On Time?</TableHead>
                <TableHead className='text-muted-foreground bg-card font-semibold'>Session</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <SkeletonLoader />
              ) : tableRecords.length > 0 ? (
                tableRecords.map((record) => {
                  void tick; // re-render every second for live duration
                  const late   = isLate(record.checkIn, record.date);
                  const lateMins = late ? lateByMinutes(record.checkIn, record.date) : 0;

                  const duration = record.checkOut
                    ? calculateDuration(record.checkIn, record.checkOut, record.date)
                    : record.checkIn
                    ? calculateLiveDuration(record.checkIn, record.date) + ' 🟢'
                    : '-';

                  const stillIn = !!record.checkIn && !record.checkOut;

                  return (
                    <TableRow key={record.id} className='border-border hover:bg-muted/30 transition-colors'>
                      <TableCell className='font-semibold text-foreground py-3'>
                        {getEmployeeName(record.employeeId)}
                      </TableCell>
                      <TableCell className='text-muted-foreground py-3 text-sm'>
                        {format(new Date(record.date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className={`py-3 text-sm font-mono font-semibold ${late ? 'text-red-400' : 'text-emerald-400'}`}>
                        {formatTime(record.checkIn, record.date)}
                      </TableCell>
                      <TableCell className='text-muted-foreground py-3 text-sm font-mono'>
                        {record.checkOut ? formatTime(record.checkOut, record.date) : (
                          <span className='text-blue-400 animate-pulse'>Active</span>
                        )}
                      </TableCell>
                      <TableCell className='py-3'>
                        <span className='inline-flex items-center rounded-full bg-cyan-500/20 text-cyan-400 px-3 py-1 text-xs font-semibold border border-cyan-500/50'>
                          {duration}
                        </span>
                      </TableCell>
                      <TableCell className='py-3'>
                        {late ? (
                          <span className='inline-flex items-center gap-1.5 rounded-full bg-red-500/20 text-red-400 px-3 py-1 text-xs font-semibold border border-red-500/50'>
                            <XCircle className='w-3 h-3' />
                            Late {lateMins > 0 ? `(${lateMins}m)` : ''}
                          </span>
                        ) : (
                          <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 text-emerald-400 px-3 py-1 text-xs font-semibold border border-emerald-500/50'>
                            <CheckCircle2 className='w-3 h-3' />
                            On Time
                          </span>
                        )}
                      </TableCell>
                      <TableCell className='py-3'>
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${
                          stillIn
                            ? 'bg-blue-500/20 text-blue-400 border-blue-500/50'
                            : 'bg-gray-500/20 text-gray-400 border-gray-500/50'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${stillIn ? 'bg-blue-400 animate-pulse' : 'bg-gray-500'}`} />
                          {stillIn ? 'Logged In' : 'Logged Out'}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow className='border-border'>
                  <TableCell colSpan={7} className='text-center py-12'>
                    <div className='flex flex-col items-center gap-2'>
                      <Clock className='text-muted-foreground' size={32} />
                      <p className='text-muted-foreground'>No attendance records yet</p>
                      <p className='text-xs text-muted-foreground'>Records appear automatically when users log in</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className='border-t border-border px-6 py-4 bg-card flex items-center justify-between text-sm'>
          <p className='text-muted-foreground'>
            Total records: <span className='font-semibold text-foreground'>{attendance.length}</span>
            {lateCount > 0 && (
              <span className='ml-3 text-red-400 font-semibold'>· {lateCount} late today</span>
            )}
          </p>
          <div className='flex items-center gap-2 text-muted-foreground'>
            <TrendingUp size={16} />
            Live tracking enabled
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- Small KPI card ----
function KpiCard({ color, label, value, sub }: { color: string; label: string; value: any; sub: string }) {
  const colors: Record<string, string> = {
    emerald: 'from-emerald-900/30 to-emerald-800/30 border-emerald-700/50 text-emerald-400',
    blue:    'from-blue-900/30 to-blue-800/30 border-blue-700/50 text-blue-400',
    red:     'from-red-900/30 to-red-800/30 border-red-700/50 text-red-400',
    amber:   'from-amber-900/30 to-amber-800/30 border-amber-700/50 text-amber-400',
  };
  const cls = colors[color] || colors.blue;
  return (
    <div className={`bg-gradient-to-br ${cls} p-6 rounded-xl border backdrop-blur-xl`}>
      <p className='text-muted-foreground text-sm mb-2'>{label}</p>
      <p className={`text-3xl font-bold ${cls.split(' ').find(c => c.startsWith('text-'))}`}>{value}</p>
      <p className='text-xs text-muted-foreground mt-2'>{sub}</p>
    </div>
  );
}

// ---- Pure utility functions (no hooks — safe to define outside component) ----

function parseDateParts(s?: string) {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  return m ? { year: +m[1], month: +m[2], day: +m[3] } : null;
}

function toDateFromTimeString(timeString: string, dateString?: string): Date | null {
  if (!timeString) return null;
  if (/T|Z|^\d{4}-\d{2}-\d{2}/.test(timeString)) {
    const p = new Date(timeString);
    return isNaN(p.getTime()) ? null : p;
  }
  const ampm = timeString.match(/\b(AM|PM)\b/i);
  const cleaned = timeString.replace(/\s*(AM|PM)\s*/gi, '').trim();
  const parts = cleaned.split(':');
  if (parts.length < 2) return null;
  let h = parseInt(parts[0], 10);
  const min = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(min) || min < 0 || min > 59) return null;
  if (ampm) {
    const pm = ampm[1].toLowerCase() === 'pm';
    if (h === 12) h = pm ? 12 : 0;
    else if (pm) h += 12;
  }
  if (h < 0 || h > 23) return null;
  const dp = parseDateParts(dateString);
  if (dp) return new Date(dp.year, dp.month - 1, dp.day, h, min, 0, 0);
  const n = new Date();
  return new Date(n.getFullYear(), n.getMonth(), n.getDate(), h, min, 0, 0);
}

function calculateDuration(checkIn: string, checkOut: string, date?: string): string {
  const i = toDateFromTimeString(checkIn, date);
  const o = toDateFromTimeString(checkOut, date);
  if (!i || !o) return '-';
  let d = o.getTime() - i.getTime();
  if (d < 0) d += 86400000;
  const tot = Math.floor(d / 60000);
  return `${Math.floor(tot / 60)}h ${tot % 60}m`;
}

function calculateLiveDuration(checkIn: string, date?: string): string {
  const i = toDateFromTimeString(checkIn, date);
  if (!i) return '-';
  let d = Date.now() - i.getTime();
  if (d < 0) d += 86400000;
  const tot = Math.floor(d / 60000);
  return `${Math.floor(tot / 60)}h ${tot % 60}m`;
}

function formatTime(timeString: string, date?: string): string {
  if (!timeString || timeString === '-') return '-';
  const d = toDateFromTimeString(timeString, date);
  return d ? format(d, 'hh:mm a') : '-';
}
