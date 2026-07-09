import { attendanceAPI } from './api';
import { mockCheckIn, mockCheckOut } from './mockAttendance';

const formatTimeReadable = (timeString?: string): string => {
  if (!timeString) return 'N/A';
  try {
    const parts = timeString.split(':');
    let hours = parseInt(parts[0]);
    const minutes = parts[1];
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  } catch {
    return timeString;
  }
};

function isMock(): boolean {
  if (process.env.NEXT_PUBLIC_MOCK_AUTH === 'true') return true;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token') === 'mock-access-token';
  }
  return false;
}

/**
 * Auto check-in when employee logs in.
 * Mock mode: saves a real localStorage record with current time.
 * Real mode: calls the backend checkin endpoint.
 */
export const autoCheckIn = async (employeeId: string): Promise<boolean> => {
  try {
    if (isMock()) {
      // Build the employee name from localStorage (set by persistAuthSession).
      const firstName = localStorage.getItem('user_firstName') || '';
      const lastName  = localStorage.getItem('user_lastName')  || '';
      const name = `${firstName} ${lastName}`.trim() || employeeId;

      const recordId = mockCheckIn(employeeId, name);
      // Store the record id so logout can check-out this exact record.
      sessionStorage.setItem('currentAttendanceId', recordId);
      console.log(`✅ Mock check-in saved — id: ${recordId}`);
      return true;
    }

    const response = await attendanceAPI.checkIn(employeeId);
    if (response.data?.id) {
      sessionStorage.setItem('currentAttendanceId', response.data.id);
      console.log(`✅ Check-in at ${formatTimeReadable(response.data.checkIn)}`);
    }
    return true;
  } catch (error) {
    console.error('❌ Auto check-in failed:', error);
    return false;
  }
};

/**
 * Auto check-out when employee logs out.
 * Mock mode: updates the localStorage record with current time.
 * Real mode: calls the backend checkout endpoint.
 */
export const autoCheckOut = async (): Promise<boolean> => {
  try {
    const attendanceId = sessionStorage.getItem('currentAttendanceId');
    if (!attendanceId) return true;

    if (isMock()) {
      mockCheckOut(attendanceId);
      sessionStorage.removeItem('currentAttendanceId');
      console.log(`✅ Mock check-out saved — id: ${attendanceId}`);
      return true;
    }

    const response = await attendanceAPI.checkOut(attendanceId);
    if (response.data) {
      console.log(`✅ Check-out at ${formatTimeReadable(response.data.checkOut)}`);
    }
    sessionStorage.removeItem('currentAttendanceId');
    return true;
  } catch (error) {
    console.error('❌ Auto check-out failed:', error);
    return false;
  }
};

export const getCurrentAttendanceId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('currentAttendanceId');
};

export const clearAttendanceSession = (): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem('currentAttendanceId');
  }
};
