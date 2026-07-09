import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { runSeed } from './seed';
import authRoutes from './routes/authRoutes';
import employeeRoutes from './routes/employeeRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import recruitmentRoutes from './routes/recruitmentRoutes';
import leaveRoutes from './routes/leaveRoutes';
import payrollRoutes from './routes/payrollRoutes';

const app = express();
const PORT = Number(process.env.PORT) || 5000;

// ---- CORS ----
const origins = (process.env.CORS_ORIGINS || 'http://localhost:3001,http://localhost:3000')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: origins.length ? origins : true,
    credentials: true,
  })
);

app.use(express.json({ limit: '5mb' }));

// Tiny request logger (helpful while developing).
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method} ${req.url}`);
  next();
});

// ---- Seed demo data on first run ----
runSeed();

// ---- Health check ----
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// ---- Mount all routes under /api (matches NEXT_PUBLIC_API_URL) ----
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/payroll', payrollRoutes);

// ---- 404 + error handlers ----
app.use((_req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('❌ Server error:', err);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n🚀 HR backend running at http://localhost:${PORT}`);
  console.log(`   Health:   http://localhost:${PORT}/api/health`);
  console.log(`   CORS:     ${origins.join(', ')}`);
  console.log(`   Login as: admin@test.com / password123 (ADMIN)`);
  console.log(`             hr@test.com / password123 (HR)`);
  console.log(`             amit@company.com / password123 (EMPLOYEE)\n`);
});
