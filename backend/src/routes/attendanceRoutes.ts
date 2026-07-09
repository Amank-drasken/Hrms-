import { Router } from 'express';
import { readCollection, writeCollection, genId, nowIso } from '../db';
import { requireAuth, AuthedRequest } from '../auth';

const router = Router();
router.use(requireAuth);

/** GET /attendance — all records (frontend filters by role/user client-side). */
router.get('/', (_req, res) => {
  res.json(readCollection('attendance'));
});

/** GET /attendance/employee/:employeeId */
router.get('/employee/:employeeId', (req, res) => {
  const records = readCollection('attendance').filter(
    (a: any) => String(a.employeeId) === String(req.params.employeeId)
  );
  res.json(records);
});

/** POST /attendance/checkin/:employeeId */
router.post('/checkin/:employeeId', (req, res) => {
  const records = readCollection('attendance');
  const today = new Date().toISOString().split('T')[0];

  // Avoid duplicate open check-ins for the same day.
  const existing = records.find(
    (a: any) =>
      String(a.employeeId) === String(req.params.employeeId) &&
      a.date === today &&
      !a.checkOut
  );
  if (existing) {
    return res.json(existing);
  }

  const now = new Date();
  const record = {
    id: genId('att'),
    employeeId: req.params.employeeId,
    date: today,
    checkIn: now.toTimeString().slice(0, 5), // "HH:MM"
    checkOut: null,
    createdAt: nowIso(),
  };
  writeCollection('attendance', [record, ...records]);
  res.status(201).json(record);
});

/** POST /attendance/checkout/:attendanceId */
router.post('/checkout/:attendanceId', (req, res) => {
  const records = readCollection('attendance');
  const idx = records.findIndex((a: any) => a.id === req.params.attendanceId);
  if (idx === -1) return res.status(404).json({ message: 'Attendance record not found' });

  records[idx].checkOut = new Date().toTimeString().slice(0, 5);
  writeCollection('attendance', records);
  res.json(records[idx]);
});

export default router;
