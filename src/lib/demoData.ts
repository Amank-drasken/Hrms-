// Demo data — exactly 3 users matching the 3 mock login accounts.
// Office hours: 9:30 AM. Anything after = Late.

export const demoEmployees = [
  {
    id: 'mock-admin-1',
    firstName: 'Rajesh',
    lastName: 'Kumar',
    email: 'admin@hr.com',
    phone: '+91-90000-00001',
    departmentId: 'dept-001',
    locationId: 'loc-001',
    role: 'ADMIN',
    status: 'Active',
    createdAt: '2024-01-01T09:00:00Z',
  },
  {
    id: 'mock-hr-1',
    firstName: 'Priya',
    lastName: 'Sharma',
    email: 'hr@hr.com',
    phone: '+91-90000-00002',
    departmentId: 'dept-003',
    locationId: 'loc-001',
    role: 'HR',
    status: 'Active',
    createdAt: '2024-01-01T09:00:00Z',
  },
  {
    id: 'mock-employee-1',
    firstName: 'Amit',
    lastName: 'Verma',
    email: 'emp@hr.com',
    phone: '+91-90000-00003',
    departmentId: 'dept-002',
    locationId: 'loc-002',
    role: 'EMPLOYEE',
    status: 'Active',
    createdAt: '2024-01-01T09:00:00Z',
  },
];

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

// Sample attendance — on time (≤9:30 AM) and late (>9:30 AM) examples.
export const demoAttendance = [
  // Today — Rajesh on time
  { id: 'att-d-001', employeeId: 'mock-admin-1',    date: today,     checkIn: '09:15 AM', checkOut: '06:30 PM' },
  // Today — Priya on time
  { id: 'att-d-002', employeeId: 'mock-hr-1',       date: today,     checkIn: '09:00 AM', checkOut: '06:00 PM' },
  // Today — Amit late
  { id: 'att-d-003', employeeId: 'mock-employee-1', date: today,     checkIn: '10:15 AM', checkOut: undefined  },
  // Yesterday
  { id: 'att-d-004', employeeId: 'mock-admin-1',    date: yesterday, checkIn: '09:20 AM', checkOut: '06:45 PM' },
  { id: 'att-d-005', employeeId: 'mock-hr-1',       date: yesterday, checkIn: '09:45 AM', checkOut: '06:00 PM' },
  { id: 'att-d-006', employeeId: 'mock-employee-1', date: yesterday, checkIn: '09:05 AM', checkOut: '05:30 PM' },
];

export const demoDepartments = [
  { id: 'dept-001', name: 'Engineering' },
  { id: 'dept-002', name: 'Sales' },
  { id: 'dept-003', name: 'Human Resources' },
  { id: 'dept-004', name: 'Marketing' },
];

export const demoLocations = [
  { id: 'loc-001', name: 'Head Office' },
  { id: 'loc-002', name: 'Branch Office' },
];
