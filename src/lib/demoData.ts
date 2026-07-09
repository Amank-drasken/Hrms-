// Demo data — mock accounts plus a few extra employees and attendance records.
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
  {
    id: 'mock-employee-2',
    firstName: 'Neha',
    lastName: 'Singh',
    email: 'neha@hr.com',
    phone: '+91-90000-00004',
    departmentId: 'dept-004',
    locationId: 'loc-002',
    role: 'EMPLOYEE',
    status: 'Active',
    createdAt: '2024-02-10T09:00:00Z',
  },
  {
    id: 'mock-employee-3',
    firstName: 'Vikram',
    lastName: 'Patel',
    email: 'vikram@hr.com',
    phone: '+91-90000-00005',
    departmentId: 'dept-005',
    locationId: 'loc-003',
    role: 'EMPLOYEE',
    status: 'Active',
    createdAt: '2024-02-15T09:00:00Z',
  },
];

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

// Sample attendance — on time (≤9:30 AM) and late (>9:30 AM) examples.
export const demoAttendance = [
  { id: 'att-d-001', employeeId: 'mock-admin-1', date: today, checkIn: '09:15 AM', checkOut: '06:30 PM' },
  { id: 'att-d-002', employeeId: 'mock-hr-1', date: today, checkIn: '09:00 AM', checkOut: '06:00 PM' },
  { id: 'att-d-003', employeeId: 'mock-employee-1', date: today, checkIn: '10:15 AM', checkOut: undefined },
  { id: 'att-d-004', employeeId: 'mock-employee-2', date: today, checkIn: '09:35 AM', checkOut: '05:50 PM' },
  { id: 'att-d-005', employeeId: 'mock-employee-3', date: today, checkIn: '10:20 AM', checkOut: undefined },
  { id: 'att-d-006', employeeId: 'mock-admin-1', date: yesterday, checkIn: '09:20 AM', checkOut: '06:45 PM' },
  { id: 'att-d-007', employeeId: 'mock-hr-1', date: yesterday, checkIn: '09:45 AM', checkOut: '06:00 PM' },
  { id: 'att-d-008', employeeId: 'mock-employee-1', date: yesterday, checkIn: '09:05 AM', checkOut: '05:30 PM' },
];

export const demoDepartments = [
  { id: 'dept-001', name: 'Engineering' },
  { id: 'dept-002', name: 'Sales' },
  { id: 'dept-003', name: 'Human Resources' },
  { id: 'dept-004', name: 'Marketing' },
  { id: 'dept-005', name: 'Operations' },
];

export const demoLocations = [
  { id: 'loc-001', name: 'Head Office' },
  { id: 'loc-002', name: 'Branch Office' },
  { id: 'loc-003', name: 'Remote' },
];

export const seedMockData = () => {
  if (typeof window === 'undefined') return;

  const isMockMode = process.env.NEXT_PUBLIC_MOCK_AUTH === 'true' || localStorage.getItem('access_token') === 'mock-access-token';
  if (!isMockMode) return;

  const alreadySeeded = localStorage.getItem('hr_mock_seeded') === 'true';
  if (alreadySeeded) return;

  localStorage.setItem('hr_mock_employees', JSON.stringify(demoEmployees));
  localStorage.setItem('hr_mock_attendance', JSON.stringify(demoAttendance));
  localStorage.setItem('hr_mock_departments', JSON.stringify(demoDepartments));
  localStorage.setItem('hr_mock_locations', JSON.stringify(demoLocations));
  localStorage.setItem('hr_mock_seeded', 'true');
};
