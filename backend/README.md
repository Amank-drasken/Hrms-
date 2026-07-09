# HR Portal — Standalone Backend

A self-contained backend for the HR Portal frontend. It implements every API
endpoint the frontend calls (auth, employees, attendance, recruitment, leaves,
payroll) and matches the exact request/response shapes the frontend expects.

> This folder is completely independent of the frontend. If you don't want it,
> just delete the whole `backend/` folder — the frontend keeps working in its
> built-in mock mode.

## Why this is easy to run

- **No database to install.** Data is stored as JSON files under `backend/data/`.
- **Pure Node + TypeScript + Express.** Just `npm install` and run.
- Swap the JSON store (`src/db.ts`) for a real ORM (Prisma/Postgres) later
  without touching the route handlers.

## 1. Install & run

```bash
cd backend
npm install
copy .env.example .env      # Windows (use "cp" on macOS/Linux)
npm run dev
```

The server starts at `http://localhost:5000` and seeds demo data on first run.

Health check: open `http://localhost:5000/api/health`

## 2. Demo logins (password for all: `password123`)

| Email               | Role     |
|---------------------|----------|
| admin@test.com      | ADMIN    |
| hr@test.com         | HR       |
| amit@company.com    | EMPLOYEE |

## 3. Connect the frontend to this backend

In the **frontend root** `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_MOCK_AUTH=false
```

Then restart the frontend (`npm run dev`). It now talks to this backend.

To go back to the offline/demo mode, set `NEXT_PUBLIC_MOCK_AUTH=true` again.

## 4. What's implemented

| Area         | Endpoints |
|--------------|-----------|
| Auth         | `POST /api/auth/login`, `POST /api/auth/register`, `GET /api/auth/me` |
| Employees    | `GET/PUT/DELETE /api/employees`, `GET /api/employees/:id`, `GET /api/employees/locations/all` |
| Attendance   | `GET /api/attendance`, `GET /api/attendance/employee/:id`, `POST /api/attendance/checkin/:id`, `POST /api/attendance/checkout/:id` |
| Recruitment  | full CRUD for `/api/recruitment/jobs`, `/applicants`, `/interviews`, `/offers`, `/onboarding/*` |
| Leaves       | `GET/POST /api/leaves`, `PATCH /api/leaves/:id/status`, `GET /api/leaves/balance/:employeeId` |
| Payroll      | `GET /api/payroll/payslips/:employeeId`, `GET /api/payroll/payslips/:employeeId/:monthKey` |

## 5. Notes / next steps

- **Auth:** JWT in the `Authorization: Bearer <token>` header. The role is
  embedded in the token so the frontend can read it (same as before).
- **File uploads:** resume / onboarding document upload currently records
  metadata only. Add `multer` + storage (disk or S3) to store real files.
- **Leaves & Payroll on the frontend:** those pages currently use the browser's
  localStorage. To use this backend instead, replace the `leaveService` /
  payroll helper calls with axios calls to the endpoints above. The data shapes
  already match, so it's a small change.
- **Production:** `npm run build` then `npm start`. Set a strong `JWT_SECRET`
  and restrict `CORS_ORIGINS` to your real frontend domain.

## 6. Reset data

Delete the JSON files in `backend/data/` (or the whole folder). They are
re-seeded on the next start.
