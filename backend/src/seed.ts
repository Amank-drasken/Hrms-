/**
 * First-run seed data. Mirrors the demo accounts the frontend already knows
 * about (see src/lib/auth.ts) so you can log in immediately.
 *
 * Default password for every seeded account: "password123"
 */
import bcrypt from 'bcryptjs';
import { seedIfEmpty, nowIso } from './db';

const pw = (plain: string) => bcrypt.hashSync(plain, 10);

export function runSeed() {
  const now = nowIso();

  // ---- Users / Employees ----
  seedIfEmpty('employees', [
    {
      id: 'emp-admin', firstName: 'Rajesh', lastName: 'Kumar', email: 'admin@test.com',
      passwordHash: pw('password123'), role: 'ADMIN', phone: '+91-90000-00001',
      department: 'Engineering', location: 'Bangalore', dob: '1988-04-12',
      currentAddress: 'Bangalore', permanentAddress: 'Bangalore', maritalStatus: 'Married',
      bloodGroup: 'O+', physicallyHandicapped: false, nationality: 'Indian',
      status: 'Active', createdAt: now, updatedAt: now,
    },
    {
      id: 'emp-hr', firstName: 'Priya', lastName: 'Sharma', email: 'hr@test.com',
      passwordHash: pw('password123'), role: 'HR', phone: '+91-90000-00002',
      department: 'Human Resources', location: 'Delhi', dob: '1990-09-05',
      currentAddress: 'Delhi', permanentAddress: 'Delhi', maritalStatus: 'Single',
      bloodGroup: 'A+', physicallyHandicapped: false, nationality: 'Indian',
      status: 'Active', createdAt: now, updatedAt: now,
    },
    {
      id: 'emp-1', firstName: 'Amit', lastName: 'Verma', email: 'amit@company.com',
      passwordHash: pw('password123'), role: 'EMPLOYEE', phone: '+91-90000-00003',
      department: 'Sales', location: 'Mumbai', dob: '1994-01-20',
      currentAddress: 'Mumbai', permanentAddress: 'Mumbai', maritalStatus: 'Single',
      bloodGroup: 'B+', physicallyHandicapped: false, nationality: 'Indian',
      status: 'Active', createdAt: now, updatedAt: now,
    },
  ]);

  // ---- Locations ----
  seedIfEmpty('locations', [
    { id: 'loc-1', name: 'Bangalore Office' },
    { id: 'loc-2', name: 'Delhi Office' },
    { id: 'loc-3', name: 'Mumbai Office' },
  ]);

  // ---- Departments ----
  seedIfEmpty('departments', [
    { id: 'dept-1', name: 'Engineering' },
    { id: 'dept-2', name: 'Sales' },
    { id: 'dept-3', name: 'Human Resources' },
    { id: 'dept-4', name: 'Marketing' },
  ]);

  // ---- Attendance (empty to start) ----
  seedIfEmpty('attendance', []);

  // ---- Recruitment ----
  seedIfEmpty('jobs', [
    {
      id: 'job-1', title: 'Senior Frontend Engineer', description: 'Build React/Next.js apps.',
      department: 'Engineering', reportingTo: 'Engineering Manager', salary_min: 1200000,
      salary_max: 1800000, currency: 'INR', employmentType: 'full-time', location: 'Bangalore',
      requiredSkills: ['React', 'Next.js', 'TypeScript'], experience_years: 4,
      education: 'B.Tech CS', status: 'open', approvalStatus: 'approved',
      createdBy: 'HR Admin', createdAt: now, updatedAt: now,
    },
  ]);
  seedIfEmpty('applicants', []);
  seedIfEmpty('interviews', []);
  seedIfEmpty('offers', []);
  seedIfEmpty('onboarding', []);
  seedIfEmpty('documents', []);

  // ---- Leaves & Payroll ----
  seedIfEmpty('leaves', []);
  seedIfEmpty('payslips', []);

  console.log('✅ Seed data ready (default password: "password123")');
}
