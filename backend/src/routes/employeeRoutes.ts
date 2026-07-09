import { Router } from 'express';
import { readCollection, writeCollection, nowIso } from '../db';
import { requireAuth, requireRole, AuthedRequest } from '../auth';

const router = Router();

function publicUser(u: any) {
  if (!u) return u;
  const { passwordHash, ...rest } = u;
  return rest;
}

// All employee routes require authentication.
router.use(requireAuth);

/** GET /employees — list all employees (ADMIN/HR). */
router.get('/', requireRole('ADMIN', 'HR'), (_req, res) => {
  const employees = readCollection('employees').map(publicUser);
  res.json(employees);
});

/** GET /employees/locations/all — locations list. */
router.get('/locations/all', (_req, res) => {
  res.json(readCollection('locations'));
});

/** GET /employees/:id */
router.get('/:id', (req: AuthedRequest, res) => {
  const employees = readCollection('employees');
  const emp = employees.find((e: any) => e.id === req.params.id);
  if (!emp) return res.status(404).json({ message: 'Employee not found' });

  // Employees can only view their own record; ADMIN/HR can view anyone.
  if (req.user?.role === 'EMPLOYEE' && req.user.sub !== emp.id) {
    return res.status(403).json({ message: 'Not allowed' });
  }
  res.json(publicUser(emp));
});

/** PUT /employees/:id */
router.put('/:id', (req: AuthedRequest, res) => {
  const employees = readCollection('employees');
  const idx = employees.findIndex((e: any) => e.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: 'Employee not found' });

  // Employees can edit only their own profile; ADMIN/HR can edit anyone.
  if (req.user?.role === 'EMPLOYEE' && req.user.sub !== req.params.id) {
    return res.status(403).json({ message: 'Not allowed' });
  }

  // Never let the password hash or id be overwritten through this route.
  const { passwordHash, id, ...safe } = req.body || {};
  employees[idx] = { ...employees[idx], ...safe, id: employees[idx].id, updatedAt: nowIso() };
  writeCollection('employees', employees);
  res.json(publicUser(employees[idx]));
});

/** DELETE /employees/:id (ADMIN only). */
router.delete('/:id', requireRole('ADMIN'), (req, res) => {
  const employees = readCollection('employees');
  const next = employees.filter((e: any) => e.id !== req.params.id);
  if (next.length === employees.length) {
    return res.status(404).json({ message: 'Employee not found' });
  }
  writeCollection('employees', next);
  res.json({ message: 'Employee deleted' });
});

export default router;
