import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { readCollection, writeCollection, genId, nowIso } from '../db';
import { signToken, requireAuth, AuthedRequest, Role } from '../auth';

const router = Router();

// Strip the password hash before returning a user to the client.
function publicUser(u: any) {
  if (!u) return u;
  const { passwordHash, ...rest } = u;
  return rest;
}

/**
 * POST /auth/login
 * Frontend expects: { message, access_token, employee }
 * The JWT payload carries the role so the frontend can decode it.
 */
router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const employees = readCollection('employees');
  const user = employees.find((e: any) => e.email?.toLowerCase() === String(email).toLowerCase());
  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const ok = bcrypt.compareSync(password, user.passwordHash || '');
  if (!ok) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const access_token = signToken({
    sub: user.id,
    email: user.email,
    role: user.role as Role,
    firstName: user.firstName,
    lastName: user.lastName,
  });

  return res.json({
    message: 'Login successful',
    access_token,
    employee: publicUser(user),
  });
});

/**
 * POST /auth/register
 * Used by the frontend's "Create Employee" flow.
 */
router.post('/register', requireAuth, (req: AuthedRequest, res) => {
  // Only ADMIN/HR can create employees.
  if (req.user && req.user.role === 'EMPLOYEE') {
    return res.status(403).json({ message: 'Not allowed to create employees' });
  }

  const body = req.body || {};
  if (!body.email || !body.password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const employees = readCollection('employees');
  if (employees.some((e: any) => e.email?.toLowerCase() === String(body.email).toLowerCase())) {
    return res.status(409).json({ message: 'An employee with this email already exists' });
  }

  const now = nowIso();
  const newEmployee = {
    id: genId('emp'),
    firstName: body.firstName || '',
    lastName: body.lastName || '',
    email: body.email,
    passwordHash: bcrypt.hashSync(body.password, 10),
    role: (body.role as Role) || 'EMPLOYEE',
    phone: body.phone || '',
    dob: body.dob || '',
    currentAddress: body.currentAddress || '',
    permanentAddress: body.permanentAddress || '',
    maritalStatus: body.maritalStatus || '',
    bloodGroup: body.bloodGroup || '',
    physicallyHandicapped: !!body.physicallyHandicapped,
    nationality: body.nationality || '',
    departmentId: body.departmentId,
    locationId: body.locationId,
    department: body.department || '',
    location: body.location || '',
    status: 'Active',
    createdAt: now,
    updatedAt: now,
  };

  writeCollection('employees', [newEmployee, ...employees]);
  return res.status(201).json(publicUser(newEmployee));
});

/** GET /auth/me — convenience endpoint to fetch the current user. */
router.get('/me', requireAuth, (req: AuthedRequest, res) => {
  const employees = readCollection('employees');
  const user = employees.find((e: any) => e.id === req.user?.sub);
  return res.json(publicUser(user));
});

export default router;
