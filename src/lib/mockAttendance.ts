/**
 * Mock attendance service for demo/mock mode.
 *
 * Stores real attendance records in localStorage so:
 * - Login  → auto check-in record saved with current time
 * - Logout → check-out time updated on that record
 * - Attendance page → reads these records and shows them
 */

const STORAGE_KEY = 'hr_mock_attendance';

export interface MockAttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;       // YYYY-MM-DD
  checkIn: string;    // "HH:MM AM/PM"
  checkOut?: string;  // "HH:MM AM/PM" — set on logout
}

function formatTime12(date: Date): string {
  let h = date.getHours();
  const m = String(date.getMinutes()).padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}

function genId(): string {
  return `att-mock-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

function readAll(): MockAttendanceRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeAll(records: MockAttendanceRecord[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

/**
 * Called on login — creates a check-in record for today.
 * If a record already exists for this employee today (without checkout), reuses it.
 * Returns the record id so logout can check-out the same record.
 */
export function mockCheckIn(employeeId: string, employeeName: string): string {
  const records = readAll();
  const today = todayStr();

  // Already checked in today — don't duplicate
  const existing = records.find(
    (r) => r.employeeId === employeeId && r.date === today && !r.checkOut
  );
  if (existing) return existing.id;

  const record: MockAttendanceRecord = {
    id: genId(),
    employeeId,
    employeeName,
    date: today,
    checkIn: formatTime12(new Date()),
  };

  writeAll([record, ...records]);
  return record.id;
}

/**
 * Called on logout — sets checkout time on the open record.
 */
export function mockCheckOut(recordId: string): void {
  const records = readAll();
  const updated = records.map((r) =>
    r.id === recordId ? { ...r, checkOut: formatTime12(new Date()) } : r
  );
  writeAll(updated);
}

/**
 * Returns all stored records — used by the attendance page in mock mode.
 */
export function getAllMockAttendance(): MockAttendanceRecord[] {
  return readAll();
}
