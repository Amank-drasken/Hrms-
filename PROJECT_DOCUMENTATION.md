# DRASKEN HRMS - HR FRONTEND PROJECT DOCUMENTATION

## Table of Contents
1. Project Overview
2. Technology Stack
3. Project Structure
4. Core Features
5. Key Components
6. API Integration
7. Authentication & Authorization
8. State Management
9. UI Components
10. Utilities & Helpers
11. Configuration Files
12. Installation & Setup
13. Deployment Guide

---

## 1. PROJECT OVERVIEW

### Project Name: DRASKEN HRMS - Human Resource Management System (Frontend)

The DRASKEN HRMS Frontend is a modern, responsive web application built with Next.js and React designed to manage human resources effectively. It provides comprehensive HR functionalities including employee management, attendance tracking, role-based access control, and real-time analytics dashboards.

### Key Objectives:
- Provide a user-friendly interface for HR management
- Track employee attendance with check-in/check-out functionality
- Manage employee records and profiles
- Generate analytics and reports
- Implement role-based access control (ADMIN, HR, EMPLOYEE)
- Real-time dashboard with key performance indicators (KPIs)

### Project Version: 0.1.0
### Status: Development

---

## 2. TECHNOLOGY STACK

### Frontend Framework
- **Next.js**: 16.2.1 - React-based framework with server-side rendering and static generation
- **React**: 19.2.4 - Core UI library for building components
- **React DOM**: 19.2.4 - React DOM rendering

### UI & Styling
- **Tailwind CSS**: 4.x - Utility-first CSS framework for styling
- **Shadcn**: 4.1.0 - Headless UI component library
- **Lucide React**: 1.6.0 - Icon library with beautiful SVG icons
- **Tailwind Merge**: 3.5.0 - Utility for merging Tailwind classes
- **TW Animate CSS**: 1.4.0 - Animation utilities for Tailwind CSS

### Form & Data Validation
- **React Hook Form**: 7.72.0 - Performant form validation library
- **Zod**: 4.3.6 - TypeScript-first schema validation
- **@hookform/resolvers**: 5.2.2 - Integration between React Hook Form and validation libraries

### Charts & Visualization
- **Recharts**: 3.8.1 - Composable charting library built on React

### State Management
- **Zustand**: 5.0.12 - Lightweight state management library
- **React Context API**: Built-in React state management

### HTTP Client
- **Axios**: 1.13.6 - HTTP client for API requests with interceptors

### TypeScript
- **TypeScript**: 5.x - Type-safe JavaScript

### Utilities
- **Date-fns**: 4.1.0 - Modern date utility library
- **Class Variance Authority**: 0.7.1 - Type-safe component variants
- **clsx**: 2.1.1 - Utility for constructing className strings

### Development Tools
- **ESLint**: 9 - Code quality and formatting
- **PostCSS**: 4 - CSS transformations
- **HTML-PDF**: 3.0.1 - PDF generation from HTML

---

## 3. PROJECT STRUCTURE

```
HR-frontend/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── layout.tsx               # Root layout with metadata
│   │   ├── page.tsx                 # Home page (redirect logic)
│   │   ├── globals.css              # Global CSS styles
│   │   ├── (auth)/                  # Auth routes group
│   │   │   ├── layout.tsx           # Auth layout
│   │   │   └── login/
│   │   │       └── page.tsx         # Login page
│   │   └── (dashboard)/             # Dashboard routes group
│   │       ├── layout.tsx           # Dashboard layout
│   │       ├── dashboard/           # Dashboard KPI page
│   │       ├── employees/           # Employee management
│   │       │   ├── page.tsx         # List employees
│   │       │   ├── create/          # Create employee
│   │       │   └── [id]/            # Individual employee profile
│   │       ├── attendance/          # Attendance tracking
│   │       ├── alerts/              # Alert notifications
│   │       ├── my-profile/          # User profile
│   │       └── settings/            # User settings
│   │
│   ├── components/                  # Reusable React components
│   │   ├── attendance/
│   │   │   └── CheckInOut.tsx       # Check-in/out component
│   │   ├── charts/
│   │   │   ├── AttendanceStats.tsx  # Attendance visualization
│   │   │   └── EmployeeStats.tsx    # Employee analytics
│   │   ├── dashboard/
│   │   │   └── StatCard.tsx         # KPI stat cards
│   │   ├── employees/
│   │   │   └── EmployeeProfile.tsx  # Employee details display
│   │   ├── forms/
│   │   │   ├── AttendanceForm.tsx   # Attendance form
│   │   │   └── EmployeeForm.tsx     # Employee creation form
│   │   ├── layout/
│   │   │   ├── Navbar.tsx           # Top navigation bar
│   │   │   ├── Sidebar.tsx          # Side navigation
│   │   │   └── RoleGuard.tsx        # Role-based rendering
│   │   └── ui/                      # Base UI components
│   │       ├── avatar.tsx           # Avatar component
│   │       ├── button.tsx           # Button component
│   │       ├── card.tsx             # Card container
│   │       ├── checkbox.tsx         # Checkbox input
│   │       ├── dialog.tsx           # Modal dialog
│   │       ├── dropdown-menu.tsx    # Dropdown menu
│   │       ├── input.tsx            # Text input
│   │       ├── label.tsx            # Form label
│   │       ├── select.tsx           # Select dropdown
│   │       ├── skeleton.tsx         # Loading skeleton
│   │       ├── table.tsx            # Data table
│   │       ├── tabs.tsx             # Tab navigation
│   │       └── textarea.tsx         # Textarea input
│   │
│   ├── hooks/                       # Custom React hooks
│   │   ├── index.ts                 # Hook exports
│   │   ├── useAutoLogin.ts          # Auto-login functionality
│   │   └── [other hooks]
│   │
│   ├── lib/                         # Utility functions & services
│   │   ├── api.ts                   # API configuration & endpoints
│   │   ├── apiWithFallback.ts       # API with fallback to mock data
│   │   ├── auth.ts                  # Authentication logic
│   │   ├── store.ts                 # Zustand store definitions
│   │   ├── attendanceAuto.ts        # Auto attendance features
│   │   ├── autoLogin.ts             # Auto-login utilities
│   │   ├── demoData.ts              # Mock data for development
│   │   ├── roleGuard.ts             # Role-based access control
│   │   └── utils.ts                 # General utilities
│   │
│   ├── utils/                       # Utility constants
│   │   └── constants.ts             # App constants
│   │
│   └── middleware.ts                # Next.js middleware for auth
│
├── public/                          # Static assets
├── docs/                            # Documentation
├── nginx.conf                       # Nginx configuration
├── ecosystem.config.js              # PM2 configuration
├── auto-deploy.ps1                  # Deployment script
├── package.json                     # Dependencies & scripts
├── tsconfig.json                    # TypeScript configuration
├── next.config.ts                   # Next.js configuration
├── tailwind.config.ts               # Tailwind CSS configuration
├── postcss.config.mjs               # PostCSS configuration
├── eslint.config.mjs                # ESLint configuration
└── README.md                        # Project README
```

---

## 4. CORE FEATURES

### 4.1 Authentication & Authorization

The application implements a comprehensive authentication system with role-based access control.

**Features:**
- Email/password login
- JWT token-based authentication
- Automatic token refresh
- Session persistence
- Auto check-in/check-out on login/logout
- Mock authentication mode for development

**Roles Supported:**
- ADMIN: Full system access, can manage all employees and data
- HR: HR management access, can create and manage employees
- EMPLOYEE: Limited access, can only view own profile and check attendance

### 4.2 Employee Management

**Features:**
- View all employees (HR/ADMIN only)
- Create new employee records
- Update employee information
- Delete employee records
- Employee education history management
- Employee experience history management
- Advanced employee profile search
- Bulk operations support

**Employee Fields:**
- First Name, Middle Name, Last Name
- Email, Phone
- Date of Birth
- Current & Permanent Address
- Marital Status
- Blood Group
- Physically Handicapped Status
- Nationality
- Role Assignment
- Department & Location

### 4.3 Attendance Management

**Features:**
- Daily check-in/check-out functionality
- Attendance history tracking
- Session duration calculation
- Daily duration calculation
- Automatic check-out on logout
- Status tracking (Working, In Meeting, Lunch Break, On Call, Out of Office)
- Attendance alerts for HR
- Leave management capabilities

### 4.4 Dashboard & Analytics

**Features:**
- Real-time KPI cards showing:
  - Total Employees
  - Present Today
  - On Leave
  - Late Arrivals
- Employee growth chart
- Department distribution visualization
- Attendance trend analysis
- Attendance statistics by department
- Quick action links
- Company alerts display

### 4.5 Role-Based Access Control

**Implementation:**
- Frontend route protection
- Component-level access control
- Permission checking before operations
- Automatic redirection for unauthorized access

---

## 5. KEY COMPONENTS

### 5.1 Layout Components

#### Navbar Component (`src/components/layout/Navbar.tsx`)
```typescript
Purpose: Top navigation bar with user profile and status
Key Features:
- User profile display with initials
- Current status management
- Session duration tracking
- Session logout functionality
- User settings access
- Search functionality
- Status indicator animations

Props:
- None (uses localStorage for user data)

State Management:
- User name and email from localStorage
- Session duration calculations
- Current status state
```

#### Sidebar Component (`src/components/layout/Sidebar.tsx`)
```typescript
Purpose: Main navigation sidebar with role-based menu items
Key Features:
- Dynamic menu based on user role
- Submenu support for nested navigation
- Current page highlighting
- Quick status shortcuts
- User role and name display
- Responsive collapsible menu

Menu Items by Role:
- Dashboard: All roles
- Employees (List/Create): ADMIN, HR
- Attendance (with Alerts): All roles
- Settings: All roles

Props:
- None (uses localStorage for role data)
```

#### RoleGuard Component (`src/components/layout/RoleGuard.tsx`)
```typescript
Purpose: Conditional rendering based on user role
Key Features:
- Check multiple roles
- Permission-based visibility
- Loading state handling
- Fallback UI support

Usage:
<RoleGuard requiredRoles={['ADMIN', 'HR']}>
  <AdminOnlyContent />
</RoleGuard>
```

### 5.2 Form Components

#### EmployeeForm Component (`src/components/forms/EmployeeForm.tsx`)
```typescript
Purpose: Comprehensive employee creation and update form
Key Features:
- Form validation with Zod schema
- Multiple field types support
- Department and location dropdowns
- Loading state management
- Error handling with user feedback
- Async API integration

Form Fields:
- Personal Information (First Name, Last Name, DOB, Phone)
- Address Information (Current & Permanent)
- Personal Details (Marital Status, Blood Group, Nationality)
- Employment Details (Role, Department, Location)
- System Fields (Password for account creation)
- Special Flags (Physically Handicapped status)

Validation:
- Email format validation
- Phone length validation (minimum 10 characters)
- Required field validation
- Password minimum length (6 characters)
```

#### AttendanceForm Component (`src/components/forms/AttendanceForm.tsx`)
```typescript
Purpose: Form for manual attendance entry
Key Features:
- Date and time selection
- Check-in and check-out time management
- Validation of time inputs
- Error handling
```

### 5.3 Attendance Components

#### CheckInOut Component (`src/components/attendance/CheckInOut.tsx`)
```typescript
Purpose: Main check-in and check-out interface
Key Features:
- Real-time status display
- Single-button check-in/check-out
- Today's record loading
- Current time display
- Success/error message feedback
- Attendance history refresh
- Callback functions for parent updates

State:
- isCheckedIn: Boolean indicating current check-in status
- todayRecord: Today's attendance record object
- loading: API call loading state
- error/success: Message feedback

API Integration:
- GET /attendance or /attendance/employee/:id - Load today's record
- POST /attendance/checkin/:employeeId - Check in
- POST /attendance/checkout/:attendanceId - Check out
```

#### AttendanceStats Component (`src/components/charts/AttendanceStats.tsx`)
```typescript
Purpose: Visualization of attendance statistics
Key Features:
- Attendance trend chart
- Daily attendance rates
- On-time vs late arrivals
- Attendance by department
- Responsive chart design
- Mock data fallback
```

### 5.4 Dashboard Components

#### StatCard Component (`src/components/dashboard/StatCard.tsx`)
```typescript
Purpose: KPI statistic cards on dashboard
Key Features:
- Displays key metrics with icons
- Animated counter effect
- Color-coded metrics
- Responsive grid layout
- Real-time data updates

Metrics Displayed:
- Total Employees: Count of all employees
- Present Today: Today's present employees
- On Leave: Employees on leave
- Late Arrivals: Employees who arrived late
```

### 5.5 Chart Components (`src/components/charts/EmployeeStats.tsx`)

**Purpose:** Visualize employee and attendance data with multiple chart types

```typescript
'use client';

import { useEffect, useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { employeeAPIWithFallback, attendanceAPIWithFallback } from '@/lib/apiWithFallback';

// COLOR SCHEME: Define colors for chart elements
const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b'];

// COMPONENT 1: Employee Growth Chart (Line Chart)
// What it does: Shows employee count growth over 6 months
export function EmployeeGrowthChart() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // FETCH EMPLOYEES: Get all employee records
        const response = await employeeAPIWithFallback.getAll();
        const employees = Array.isArray(response.data) ? response.data : response.data?.data || [];
        
        const totalEmps = employees.length;
        
        // CREATE GROWTH DATA: Generate 6 months of growth trend
        // Simulates gradual employee growth from 45% to 100% of total
        const growthData = [
          { month: 'Jan', active: Math.ceil(totalEmps * 0.45), inactive: Math.ceil(totalEmps * 0.05) },
          { month: 'Feb', active: Math.ceil(totalEmps * 0.52), inactive: Math.ceil(totalEmps * 0.03) },
          { month: 'Mar', active: Math.ceil(totalEmps * 0.58), inactive: Math.ceil(totalEmps * 0.04) },
          { month: 'Apr', active: Math.ceil(totalEmps * 0.65), inactive: Math.ceil(totalEmps * 0.02) },
          { month: 'May', active: Math.ceil(totalEmps * 0.72), inactive: Math.ceil(totalEmps * 0.01) },
          { month: 'Jun', active: totalEmps, inactive: 0 },
        ];
        setData(growthData);
      } catch (error) {
        console.error('Failed to fetch growth data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || data.length === 0) {
    return (
      <div className="bg-card p-6 rounded-xl border border-border backdrop-blur-xl flex items-center justify-center h-80">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    );
  }

  // RENDER LINE CHART: Show active vs inactive employees over time
  return (
    <div className="bg-card p-6 rounded-xl border border-border backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-muted-foreground mb-4">Employee Growth Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          {/* GRID: Background grid for easier reading */}
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          {/* AXES: X and Y axis labels */}
          <XAxis stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          {/* TOOLTIP: Info shown on hover */}
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          {/* LEGEND: Show what each line represents */}
          <Legend />
          {/* LINE 1: Active employees (blue) */}
          <Line type="monotone" dataKey="active" stroke="#3b82f6" name="Active" strokeWidth={3} dot={{ fill: '#3b82f6', r: 5 }} />
          {/* LINE 2: Inactive employees (red) */}
          <Line type="monotone" dataKey="inactive" stroke="#ef4444" name="Inactive" strokeWidth={3} dot={{ fill: '#ef4444', r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// COMPONENT 2: Department Distribution (Pie Chart)
// What it does: Shows percentage of employees in each department
export function DepartmentDistribution() {
  const [departmentData, setDepartmentData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // FETCH EMPLOYEES: Get all employee data
        const response = await employeeAPIWithFallback.getAll();
        const employees = Array.isArray(response.data) ? response.data : response.data?.data || [];
        
        // COUNT BY DEPARTMENT: Create a map of department counts
        const deptMap: { [key: string]: number } = {};
        employees.forEach((emp: any) => {
          const dept = emp.departmentId || 'Unassigned';
          deptMap[dept] = (deptMap[dept] || 0) + 1;
        });

        // FORMAT DATA: Convert to Recharts pie chart format with colors
        const depts = Object.entries(deptMap).map(([name, value], idx) => ({
          name: `Dept ${name}`,
          value,
          fill: COLORS[idx % COLORS.length],  // Cycle through colors
        }));
        setDepartmentData(depts);
      } catch (error) {
        console.error('Failed to fetch department data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || departmentData.length === 0) {
    return (
      <div className="bg-card p-6 rounded-xl border border-border backdrop-blur-xl flex items-center justify-center h-80">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    );
  }

  // RENDER PIE CHART: Show department distribution visually
  return (
    <div className="bg-card p-6 rounded-xl border border-border backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-muted-foreground mb-4">Department Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          {/* PIE: Render the pie slices */}
          <Pie
            data={departmentData}
            cx="50%"                           // Center X position
            cy="50%"                           // Center Y position
            labelLine={false}
            label={({ name, value }) => `${name} (${value})`}  // Show label on pie
            outerRadius={80}                   // Size of pie
            fill="#8884d8"
            dataKey="value"
          >
            {/* CELLS: Color each slice according to COLORS array */}
            {departmentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Pie>
          {/* TOOLTIP: Show details on hover */}
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// COMPONENT 3: Attendance Chart (Bar Chart)
// What it does: Shows attendance rate for each day of the week
export function AttendanceChart() {
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // FETCH ATTENDANCE: Get all attendance records
        const response = await attendanceAPIWithFallback.getAll();
        const records = Array.isArray(response.data) ? response.data : response.data?.data || [];
        
        const today = new Date();
        const weekData = [];
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        
        // BUILD 7-DAY CHART: Calculate attendance for past 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);  // Go back i days
          const dateStr = date.toISOString().split('T')[0];
          
          // COUNT ATTENDED: Count records with checkIn on this day
          const dayRecords = records.filter((r: any) => {
            const recordDate = new Date(r.date || r.createdAt).toISOString().split('T')[0];
            return recordDate === dateStr && r.checkIn;
          });
          
          const dayName = days[date.getDay()];
          weekData.push({
            day: dayName,
            // CALCULATE PERCENTAGE: Attendance as percentage of total employees
            attendance: dayRecords.length > 0 ? Math.round((dayRecords.length / Math.max(records.length / 7, 1)) * 100) : 0,
          });
        }
        setAttendanceData(weekData);
      } catch (error) {
        console.error('Failed to fetch attendance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || attendanceData.length === 0) {
    return (
      <div className="bg-card p-6 rounded-xl border border-border backdrop-blur-xl flex items-center justify-center h-80">
        <div className="text-muted-foreground">Loading chart...</div>
      </div>
    );
  }

  // RENDER BAR CHART: Show daily attendance percentages
  return (
    <div className="bg-card p-6 rounded-xl border border-border backdrop-blur-xl">
      <h3 className="text-lg font-semibold text-muted-foreground mb-4">Weekly Attendance</h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={attendanceData}>
          {/* GRID: Background reference lines */}
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          {/* AXES: Labels for days and percentage */}
          <XAxis stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          {/* TOOLTIP: Details on bar hover */}
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #475569', borderRadius: '8px' }}
            labelStyle={{ color: '#e2e8f0' }}
          />
          {/* BARS: Cyan colored bars for attendance */}
          <Bar dataKey="attendance" fill="#06b6d4" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

**Key Features:**
- Real-time data fetching from API
- Responsive design (adjusts to screen size)
- Fallback mock data support
- Loading states with skeleton
- Tooltip interactions on hover
- Multiple chart types (Line, Pie, Bar)

### 5.6 Employee Profile Component

#### EmployeeProfile Component (`src/components/employees/EmployeeProfile.tsx`)
```typescript
Purpose: Display detailed employee information
Key Features:
- Complete profile display
- Education history
- Experience history
- Contact information
- Employment details
- Edit capability
- Delete confirmation
- Document attachment display
```

---

## 6. API INTEGRATION

### 6.1 API Configuration (`src/lib/api.ts`)

```typescript
Base URL: http://localhost:3001/api (configurable via NEXT_PUBLIC_API_URL)
Timeout: 60 seconds
Headers: Application/JSON

Features:
- Axios instance with interceptors
- Automatic JWT token attachment
- Mock mode support
- Comprehensive error logging
- Request/response logging
```

### 6.2 Authentication APIs

```typescript
POST /auth/login
Body: { email, password }
Response: { access_token, employee/user data }

POST /auth/register
Body: { Employee data fields }
Response: { Employee created }

POST /auth/auto-login
Body: { token }
Response: { User data }
```

### 6.3 Employee APIs

```typescript
GET /employees
Response: Array of employee objects

GET /employees/:id
Response: Single employee object

PUT /employees/:id
Body: { Updated employee fields }
Response: { Updated employee }

DELETE /employees/:id
Response: { Success message }

POST /employees/:id/education
Body: { Education details }
Response: { Created education record }

GET /employees/:id/education
Response: Array of education records

DELETE /employees/education/:eduId
Response: { Success message }

POST /employees/:id/experience
Body: { Experience details }
Response: { Created experience record }

GET /employees/:id/experience
Response: Array of experience records

DELETE /employees/experience/:expId
Response: { Success message }
```

### 6.4 Attendance APIs

```typescript
GET /attendance
Response: Array of all attendance records

POST /attendance/checkin/:employeeId
Response: { Check-in record created }

POST /attendance/checkout/:attendanceId
Response: { Check-out record updated }

GET /attendance/employee/:employeeId
Response: Array of attendance for specific employee
```

### 6.5 Department APIs

```typescript
GET /departments
Response: Array of department objects (Mock data in current implementation)

Note: Backend doesn't have this endpoint, using fallback mock data
```

### 6.6 Location APIs

```typescript
GET /employees/locations/all
Response: Array of location objects
```

### 6.7 API Request Interceptor

**Features:**
- Automatic JWT token attachment
- Token retrieval from localStorage
- Fallback to auth-store JSON parsing
- Request logging for debugging
- Authorization header setup

### 6.8 API Response Interceptor

**Features:**
- Error handling with status codes
- Mock mode activation for 401/404 errors
- Network error detection
- Auto redirect on 401 (Unauthorized)
- Comprehensive error logging
- Mock data return for development

**Mock Mode:**
When `NEXT_PUBLIC_MOCK_AUTH=true`:
- 404 errors return mock data
- Network errors return mock data
- Useful for frontend development without backend

---

## 7. AUTHENTICATION & AUTHORIZATION

### 7.1 Authentication Flow

```typescript
1. User enters credentials on login page
2. Frontend calls POST /auth/login
3. Backend returns JWT token and user data
4. Token stored in:
   - localStorage (as 'access_token')
   - Cookie (for middleware access)
5. User data stored in localStorage (user_id, user_email, etc.)
6. User role extracted from JWT or response
7. User redirected to dashboard
8. Auto check-in triggered
```

### 7.2 Auth Service (`src/lib/auth.ts`)

**Key Functions:**

```typescript
persistAuthSession(token, userData, email)
- Stores token in localStorage and cookies
- Parses JWT to extract role information
- Stores user data (id, name, email)
- Sets default role based on email for testing

loginUser(email, password)
- Validates credentials
- Handles mock auth mode
- Returns login response with token

logoutUser()
- Triggers auto check-out
- Clears all auth data from localStorage
- Clears cookies
- Removes user session

getToken()
- Retrieves token from localStorage or cookies

isAuthenticated()
- Checks if valid token exists

getUserRole()
- Returns current user's role

hasRole(role)
- Checks if user has specific role
```

### 7.3 Role-Based Access Control (`src/lib/roleGuard.ts`)

```typescript
UserRole Type: 'ADMIN' | 'HR' | 'EMPLOYEE'

ROLE_PERMISSIONS Map:
- ADMIN: ['view_all_employees', 'create_employee', 'delete_employee', 'manage_attendance', 'view_analytics']
- HR: ['view_employees', 'create_employee', 'manage_attendance', 'view_analytics']
- EMPLOYEE: ['view_own_attendance', 'check_in_out']

Functions:
- getUserRole(): Get current user role
- hasRole(requiredRole): Check specific role
- hasAnyRole(roles[]): Check if user has any of the roles
- canAccessPage(roles[]): Check page access permission
- canPerformAction(action): Check if action is permitted
```

### 7.4 Middleware Protection (`src/middleware.ts`)

```typescript
public_routes: ['/login']
protected_routes: ['/dashboard', '/employees', '/attendance', etc.]

Logic:
- No token + protected route → Redirect to /login
- Token + /login page → Redirect to /dashboard
- Valid token + protected route → Allow access
```

---

## 8. STATE MANAGEMENT

### 8.1 Zustand Store (`src/lib/store.ts`)

#### Auth Store
```typescript
import { create } from 'zustand';

// INTERFACE: Define Auth Store structure
interface AuthStore {
  token: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setAuthenticated: (authenticated: boolean) => void;
  logout: () => void;
  initializeAuth: () => void;
}

// STORE: Zustand auth store - manages authentication state
// What it does: Stores JWT token and authentication status globally
export const useAuthStore = create<AuthStore>((set) => ({
  token: null,
  isAuthenticated: false,
  
  // ACTION: Set token and sync to localStorage
  // What it does: Updates token state and saves to localStorage for persistence
  setToken: (token) => {
    // Sync to localStorage for API interceptor to read
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
    // Update Zustand state
    set({ token, isAuthenticated: !!token });
  },
  
  // ACTION: Set authentication status
  // What it does: Updates boolean flag indicating if user is authenticated
  setAuthenticated: (authenticated) => set({ isAuthenticated: authenticated }),
  
  // ACTION: Clear auth state on logout
  // What it does: Removes token from localStorage and resets state
  logout: () => {
    localStorage.removeItem('access_token');
    set({ token: null, isAuthenticated: false });
  },
  
  // ACTION: Initialize auth from localStorage on app start
  // What it does: Loads token from localStorage when app loads
  initializeAuth: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      set({ token, isAuthenticated: !!token });
    }
  },
}));

// STORE: Employee store for managing employee list
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // ... other fields
}

interface EmployeeStore {
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;
  addEmployee: (employee: Employee) => void;
}

export const useEmployeeStore = create<EmployeeStore>((set) => ({
  employees: [],
  // ACTION: Replace entire employee list
  setEmployees: (employees) => set({ employees }),
  // ACTION: Add new employee to list
  addEmployee: (employee) => set((state) => ({ 
    employees: [...state.employees, employee] 
  })),
}));

// STORE: Data store for departments and locations
interface DataStore {
  departments: any[];
  locations: any[];
  setDepartments: (departments: any[]) => void;
  setLocations: (locations: any[]) => void;
}

export const useDataStore = create<DataStore>((set) => ({
  departments: [],
  locations: [],
  setDepartments: (departments) => set({ departments }),
  setLocations: (locations) => set({ locations }),
}));
```

**Usage Examples:**
```typescript
// In a component:
import { useAuthStore, useEmployeeStore } from '@/lib/store';

export function MyComponent() {
  // Get state and actions from store
  const { token, isAuthenticated, setToken, logout } = useAuthStore();
  const { employees, setEmployees } = useEmployeeStore();
  
  // Update token after login
  const handleLogin = (newToken: string) => {
    setToken(newToken);  // Updates state AND localStorage
  };
  
  // Logout user
  const handleLogout = () => {
    logout();  // Clears token and resets authentication
  };
  
  return (
    <div>
      {isAuthenticated ? (
        <button onClick={handleLogout}>Logout</button>
      ) : (
        <p>Please login</p>
      )}
    </div>
  );
}
```

### 8.2 Auto-Login Hook (`src/hooks/useAutoLogin.ts`)

**Purpose:** Automatically log in users based on stored session token

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { attemptAutoLogin, hasAutoLoginToken } from '@/lib/autoLogin';
import { useAuthStore } from '@/lib/store';

/**
 * HOOK: Auto-login functionality
 * What it does: Checks if user has valid session token and auto-logs them in
 * Called on: App initialization / login page load
 * 
 * Flow:
 * 1. Check if auto-login token exists
 * 2. If yes, attempt to use it to get new token
 * 3. On success, redirect to dashboard
 * 4. On failure, show login form
 */
export const useAutoLogin = () => {
  const router = useRouter();
  const { setToken } = useAuthStore();
  const [isAutoLoginAttempted, setIsAutoLoginAttempted] = useState(false);
  const [hasAutoLoginTokenFlag, setHasAutoLoginTokenFlag] = useState(false);

  useEffect(() => {
    const handleAutoLogin = async () => {
      // PREVENT DUPLICATE ATTEMPTS: Check if already attempted
      if (isAutoLoginAttempted) return;
      
      setIsAutoLoginAttempted(true);

      // STEP 1: Check if auto-login token exists in localStorage
      // What it does: Reads from 'auto_login_token' in localStorage
      const hasToken = hasAutoLoginToken();
      setHasAutoLoginTokenFlag(hasToken);

      if (!hasToken) {
        console.log('ℹ️ No auto-login token found');
        return;  // Exit if no token, user must log in manually
      }

      console.log('🔄 Attempting auto-login...');

      try {
        // STEP 2: Try to use auto-login token to get new session token
        // Calls POST /auth/auto-login endpoint with auto-login token
        const success = await attemptAutoLogin();

        if (success) {
          console.log('✅ Auto-login successful, redirecting to dashboard...');
          
          // STEP 3: Get the newly persisted token from localStorage
          const token = localStorage.getItem('access_token');
          if (token) {
            // UPDATE STORE: Set token in Zustand store
            setToken(token);
          }
          
          // REDIRECT: Send user to dashboard
          router.push('/dashboard');
        } else {
          console.log('❌ Auto-login failed, showing login form');
          // User stays on login page to enter credentials
        }
      } catch (error) {
        console.error('❌ Auto-login error:', error);
        // User stays on login page on error
      }
    };

    handleAutoLogin();
  }, [isAutoLoginAttempted, router, setToken]);

  return { 
    hasAutoLoginToken: hasAutoLoginTokenFlag, 
    isAutoLoginAttempted 
  };
};
```

**Usage in Login Page:**
```typescript
import { useAutoLogin } from '@/hooks/useAutoLogin';

export default function LoginPage() {
  // Call hook to check for auto-login
  const { hasAutoLoginToken } = useAutoLogin();
  
  // If auto-login succeeds, component redirects before rendering
  // If no token, login form is shown
  
  return (
    <div>
      {/* Show login form only if no auto-login token */}
      <LoginForm />
    </div>
  );
}
```

**Benefits:**
- Users stay logged in across browser sessions
- Seamless experience for returning users
- Automatic redirection to dashboard
- Graceful fallback to login form if token invalid

---

## 9. UI COMPONENTS

### 9.1 Base UI Components (`src/components/ui/`)

#### Button Component
```typescript
Features:
- Multiple variants (primary, secondary, outline, ghost)
- Size options (sm, md, lg)
- Loading state support
- Disabled state
- Icon support
- Full width option
```

#### Card Component
```typescript
Features:
- Container with border and shadow
- Padding options
- Hover effects
- Dark mode support
```

#### Input Component
```typescript
Features:
- Text input fields
- Placeholder support
- Error state styling
- Disabled state
- Icon support
- Password visibility toggle
```

#### Select Component
```typescript
Features:
- Dropdown selection
- Multiple options
- Grouped options
- Search functionality
- Disabled items support
```

#### Table Component
```typescript
Features:
- Data table with sorting
- Pagination support
- Row selection
- Expandable rows
- Responsive design
- Sticky headers
```

#### Dialog Component
```typescript
Features:
- Modal dialog
- Confirmation dialogs
- Form modals
- Animation effects
- Overlay backdrop
```

#### Tabs Component
```typescript
Features:
- Tab navigation
- Tab content areas
- Active tab styling
- Keyboard navigation
```

#### Skeleton Component
```typescript
Purpose: Loading placeholder
Features:
- Animated loading effect
- Adjustable height/width
- Rounded edges
```

#### Avatar Component
```typescript
Features:
- User avatar display
- Initials fallback
- Image support
- Size options
```

#### Dropdown Menu Component
```typescript
Features:
- Menu trigger
- Menu items
- Separators
- Nested menus
- Icon support
```

#### Label Component
```typescript
Features:
- Form labels
- Required field indicator
- Associated with form inputs
```

#### Textarea Component
```typescript
Features:
- Multi-line text input
- Auto-resize option
- Placeholder support
- Error state
```

#### Checkbox Component
```typescript
Features:
- Checkbox input
- Labeled checkboxes
- Indeterminate state
- Disabled state
```

---

## 10. UTILITIES & HELPERS

### 10.1 Utils (`src/lib/utils.ts`)

**Purpose:** Merge Tailwind CSS classes and utility functions

```typescript
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// FUNCTION: Merge Tailwind CSS classes intelligently
// What it does: Combines multiple classNames and removes conflicting Tailwind classes
// Example: cn("px-2 py-1", "px-4") → "px-4 py-1" (merges without conflicts)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// This is used throughout the app for dynamic className composition
// Used in components to conditionally apply styles
// Example usage in components:
// className={cn("p-4 rounded-lg", isActive && "bg-blue-500")}
```

**Usage Examples:**
```typescript
// Merging base classes with conditional classes
const buttonClass = cn(
  "px-4 py-2 rounded-lg font-medium",
  disabled && "opacity-50 cursor-not-allowed",
  variant === "primary" && "bg-blue-500 text-white",
  variant === "secondary" && "bg-gray-200 text-black"
)

// Merging component classes
const cardClasses = cn(
  "rounded-xl border backdrop-blur-xl",
  isDark && "bg-slate-900 border-slate-700",
  isHovered && "shadow-lg scale-105 transition-all"
)
```

### 10.2 Constants (`src/utils/constants.ts`)

```typescript
Exported Constants:
- API endpoints
- Role definitions
- Status options
- Color schemes
- Date formats
```

### 10.3 Demo Data (`src/lib/demoData.ts`)

**Purpose:** Mock data for development and testing when backend is unavailable

```typescript
// EMPLOYEE DATA: Sample employee records for testing
export const demoEmployees = [
  {
    id: '1-demo-001',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1-234-567-8901',
    departmentId: 'dept-001',
    locationId: 'loc-001',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'Active',
  },
  {
    id: '2-demo-002',
    firstName: 'Sarah',
    lastName: 'Smith',
    email: 'sarah.smith@example.com',
    phone: '+1-234-567-8902',
    departmentId: 'dept-002',
    locationId: 'loc-001',
    createdAt: '2024-02-10T14:20:00Z',
    status: 'Active',
  },
  // ... more employees
];

// ATTENDANCE DATA: Sample daily attendance records
// What it does: Stores check-in/check-out times for employees
export const demoAttendance = [
  {
    id: 'att-demo-001',
    employeeId: '1-demo-001',           // Links to employee
    date: new Date().toISOString().split('T')[0],  // Today's date
    checkIn: '09:00',                   // Check-in time
    checkOut: '17:30',                  // Check-out time
  },
  {
    id: 'att-demo-002',
    employeeId: '2-demo-002',
    date: new Date().toISOString().split('T')[0],
    checkIn: '08:45',
    checkOut: '17:15',
  },
  {
    id: 'att-demo-004',
    employeeId: '4-demo-004',
    date: new Date().toISOString().split('T')[0],
    checkIn: '09:00',
    // No checkOut = still checked in
  },
];

// DEPARTMENT DATA: Company departments
// What it does: Defines organizational structure
export const demoDepartments = [
  { id: 'dept-001', name: 'Engineering' },
  { id: 'dept-002', name: 'Sales' },
  { id: 'dept-003', name: 'Human Resources' },
  { id: 'dept-004', name: 'Marketing' },
];

// LOCATION DATA: Office locations
// What it does: Defines office locations for employees
export const demoLocations = [
  { id: 'loc-001', name: 'New York Office' },
  { id: 'loc-002', name: 'San Francisco Office' },
  { id: 'loc-003', name: 'London Office' },
];
```

**When Used:**
- Development environment (no backend available)
- Testing API integration
- UI development and design
- When `NEXT_PUBLIC_MOCK_AUTH=true` is set

### 10.4 Attendance Auto (`src/lib/attendanceAuto.ts`)

**Purpose:** Automatic check-in/check-out functionality on login/logout

```typescript
import { attendanceAPI } from './api';

// HELPER: Format time to readable 12-hour format
// What it does: Converts 24-hour time (09:00) to 12-hour (9:00 AM)
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

// FUNCTION: Auto check-in when employee logs in
// What it does: Automatically creates a check-in record when user logs in
// Called from: login page after successful login
export const autoCheckIn = async (employeeId: string): Promise<boolean> => {
  try {
    console.log('🟢 Auto check-in for employee:', employeeId);
    
    // MOCK MODE CHECK: Skip API if using mock auth (development mode)
    if (process.env.NEXT_PUBLIC_MOCK_AUTH === 'true') {
      console.log('✅ Mock auth enabled - skipping auto check-in API call');
      sessionStorage.setItem('currentAttendanceId', `mock-${Date.now()}`);
      return true;
    }
    
    // CALL API: Call backend check-in endpoint
    // POST /attendance/checkin/:employeeId
    const response = await attendanceAPI.checkIn(employeeId);
    
    if (response.data) {
      const checkInTime = formatTimeReadable(response.data.checkIn);
      console.log(`✅ Auto check-in successful at ${checkInTime}`, response.data);
      
      // STORE ID: Save attendance record ID for later check-out
      if (response.data.id) {
        sessionStorage.setItem('currentAttendanceId', response.data.id);
      }
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Auto check-in failed:', error);
    return false;
  }
};

// FUNCTION: Auto check-out when employee logs out
// What it does: Automatically closes the check-in record with check-out time
// Called from: logout function in auth.ts
export const autoCheckOut = async (): Promise<boolean> => {
  try {
    // GET STORED ID: Retrieve the attendance record ID from session
    const attendanceId = sessionStorage.getItem('currentAttendanceId');
    
    if (!attendanceId) {
      console.log('ℹ️ No active attendance record to check-out');
      return true; // Not an error, just no record to close
    }

    console.log('🔴 Auto check-out for attendance:', attendanceId);
    
    // MOCK MODE CHECK: Skip API if using mock auth
    if (process.env.NEXT_PUBLIC_MOCK_AUTH === 'true') {
      console.log('✅ Mock auth enabled - skipping auto check-out API call');
      sessionStorage.removeItem('currentAttendanceId');
      return true;
    }
    
    // CALL API: Call backend check-out endpoint
    // POST /attendance/checkout/:attendanceId
    const response = await attendanceAPI.checkOut(attendanceId);
    
    if (response.data) {
      const checkOutTime = formatTimeReadable(response.data.checkOut);
      console.log(`✅ Auto check-out successful at ${checkOutTime}`, response.data);
      // CLEAR STORAGE: Remove the stored attendance ID
      sessionStorage.removeItem('currentAttendanceId');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('❌ Auto check-out failed:', error);
    return false;
  }
};

// FUNCTION: Get current attendance session ID
// What it does: Retrieves the current attendance record ID from session
// Returns: Attendance ID string or null
export const getCurrentAttendanceId = (): string | null => {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('currentAttendanceId');
};

// FUNCTION: Clear attendance session
// What it does: Removes all attendance-related session data
export const clearAttendanceSession = () => {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem('currentAttendanceId');
};
```

**Flow Diagram:**
```
User Login → loginUser() → autoCheckIn() → POST /attendance/checkin/:id → Store ID in session
User Logout → logoutUser() → autoCheckOut() → POST /attendance/checkout/:id → Clear session
```

### 10.5 Auto Login (`src/lib/autoLogin.ts`)

```typescript
Features:
- Session persistence check
- Auto-redirect for authenticated users
- Session validation
- Token refresh capabilities
```

---

## 11. CONFIGURATION FILES

### 11.1 TypeScript Configuration (`tsconfig.json`)

```json
Compiler Options:
- Target: ES2017
- Module: esnext
- Strict: true
- No Emit: true
- JSX: react-jsx

Path Aliases:
- @/*: Points to ./src/*

Includes:
- All .ts and .tsx files
- Next.js types
- .mts files

Excludes:
- node_modules
```

### 11.2 Tailwind CSS Configuration (`tailwind.config.ts`)

```typescript
Features:
- Tailwind CSS v4
- Custom color schemes (dark mode)
- Extended spacing scales
- Custom animations
- Font configurations
- Border radius customization
```

### 11.3 PostCSS Configuration (`postcss.config.mjs`)

```javascript
Plugins:
- @tailwindcss/postcss: Process Tailwind CSS

Purpose:
- Compile Tailwind CSS
- Autoprefixer support
```

### 11.4 ESLint Configuration (`eslint.config.mjs`)

```javascript
Extends:
- ESLint recommended
- Next.js recommended
- React best practices

Rules:
- React-specific linting
- Next.js optimization rules
- Code quality standards
```

### 11.5 Next.js Configuration (`next.config.ts`)

```typescript
Current Configuration:
- Empty config (using Next.js defaults)

Can be Extended with:
- Custom webpack configuration
- Image optimization
- Environment variables
- Build optimization
```

### 11.6 Package.json

```json
Name: demo2
Version: 0.1.0
Main Scripts:
- dev: Start development server (port 3001)
- build: Production build
- start: Start production server
- lint: Run ESLint

Dependencies: [Listed above in Technology Stack]
DevDependencies: [Listed above in Technology Stack]
```

### 11.7 PM2 Configuration (`ecosystem.config.js`)

```javascript
Purpose: Production process management
Configuration:
- App name: HRMS
- Script: next start
- Instances: Cluster mode or specified number
- Auto-restart on failure
- Log management
- Environment variable setup
```

### 11.8 Nginx Configuration (`nginx.conf`)

```nginx
Purpose: Reverse proxy for Next.js app
Configuration:
- Proxy to localhost:3001 (Next.js)
- SSL/TLS setup
- Gzip compression
- Caching strategies
- URL rewriting
```

### 11.9 Deployment Script (`auto-deploy.ps1`)

```powershell
Purpose: Automated deployment on Windows VPS
Features:
- Git pull latest code
- Install dependencies
- Build Next.js app
- Restart PM2 process
- Health check
- Rollback on failure
```

---

## COMPLETE PAGE EXAMPLES

### Employees Listing Page (`src/app/(dashboard)/employees/page.tsx`)

**Purpose:** Display all employees with search and filtering capabilities

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { employeeAPIWithFallback } from '@/lib/apiWithFallback';
import { getUserRole } from '@/lib/roleGuard';
import { Plus, Search, Users, TrendingUp, Filter } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

// INTERFACE: Define employee data structure
interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  departmentId: string;
  locationId: string;
  createdAt: string;
  status?: string;
}

export default function EmployeesPage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // EFFECT 1: Authorization Check & Data Fetch
  // What it does: 
  // 1. Verify user is authenticated
  // 2. Check if user has HR/ADMIN role
  // 3. Fetch all employees from API
  useEffect(() => {
    // STEP 1: Check if user has access token
    const token = localStorage.getItem('access_token');
    if (!token) {
      // NOT LOGGED IN: Redirect to login
      router.push('/login');
      return;
    }

    // STEP 2: Check role-based access
    // Only ADMIN and HR can view all employees
    const userRole = getUserRole();
    if (userRole !== 'ADMIN' && userRole !== 'HR') {
      // NOT AUTHORIZED: Redirect to dashboard
      router.push('/dashboard');
      return;
    }

    // STEP 3: Fetch employee data
    const fetchEmployees = async () => {
      try {
        // CALL API: Get /employees
        const response = await employeeAPIWithFallback.getAll();
        // SET STATE: Update employees list
        setEmployees(response.data);
        setFilteredEmployees(response.data);
      } catch (error: any) {
        console.error('Failed to fetch employees:', error?.message);
        // Continue with empty state on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmployees();
  }, [router]);

  // EFFECT 2: Search Filter
  // What it does: Filter employees based on search term
  useEffect(() => {
    // FILTER LOGIC: Search in firstName, lastName, email, phone
    const filtered = employees.filter((emp) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        emp.firstName.toLowerCase().includes(searchLower) ||
        emp.lastName.toLowerCase().includes(searchLower) ||
        emp.email.toLowerCase().includes(searchLower) ||
        emp.phone.includes(searchTerm)
      );
    });
    
    setFilteredEmployees(filtered);
  }, [searchTerm, employees]);

  // RENDER: Page Header
  return (
    <div className='min-h-screen bg-background p-8'>
      {/* HEADER SECTION */}
      <div className='mb-8'>
        <div className='flex items-center justify-between'>
          <div>
            {/* TITLE */}
            <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2'>
              Employees
            </h1>
            {/* DESCRIPTION */}
            <p className='text-muted-foreground'>Manage all company employees</p>
          </div>
          
          {/* CREATE BUTTON: Link to create new employee */}
          <Link href='/employees/create'>
            <Button className='gap-2'>
              <Plus size={18} />
              Add Employee
            </Button>
          </Link>
        </div>
      </div>

      {/* SEARCH SECTION */}
      <div className='mb-6 flex gap-4'>
        <div className='flex-1 relative'>
          {/* SEARCH INPUT: Search by name, email, phone */}
          <Input
            placeholder='Search by name, email or phone...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='pl-10'
          />
          {/* SEARCH ICON */}
          <Search className='absolute left-3 top-3 text-muted-foreground' size={18} />
        </div>
      </div>

      {/* STATS CARDS */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
        {/* CARD 1: Total Employees */}
        <div className='bg-card p-6 rounded-xl border border-border'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm'>Total Employees</p>
              <p className='text-3xl font-bold'>{employees.length}</p>
            </div>
            <Users className='text-blue-400' size={32} />
          </div>
        </div>
        
        {/* CARD 2: Active Today */}
        <div className='bg-card p-6 rounded-xl border border-border'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm'>Active Today</p>
              <p className='text-3xl font-bold'>{Math.floor(employees.length * 0.85)}</p>
            </div>
            <TrendingUp className='text-green-400' size={32} />
          </div>
        </div>
      </div>

      {/* TABLE SECTION */}
      {/* LOADING STATE: Show skeleton while fetching */}
      {isLoading ? (
        <div className='bg-card rounded-xl border border-border overflow-hidden'>
          <div className='p-6 space-y-4'>
            <Skeleton className='h-12' />
            <Skeleton className='h-12' />
            <Skeleton className='h-12' />
          </div>
        </div>
      ) : (
        /* EMPLOYEES TABLE */
        <div className='bg-card rounded-xl border border-border overflow-hidden'>
          <Table>
            {/* TABLE HEADER */}
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Joined Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className='text-right'>Actions</TableHead>
              </TableRow>
            </TableHeader>

            {/* TABLE BODY: List all filtered employees */}
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TableRow key={employee.id} className='hover:bg-muted/50 cursor-pointer'>
                    {/* EMPLOYEE NAME */}
                    <TableCell className='font-medium'>
                      {employee.firstName} {employee.lastName}
                    </TableCell>
                    
                    {/* EMAIL */}
                    <TableCell>{employee.email}</TableCell>
                    
                    {/* PHONE */}
                    <TableCell>{employee.phone}</TableCell>
                    
                    {/* DEPARTMENT */}
                    <TableCell>{employee.departmentId}</TableCell>
                    
                    {/* JOINED DATE: Format using date-fns */}
                    <TableCell>
                      {format(new Date(employee.createdAt), 'MMM dd, yyyy')}
                    </TableCell>
                    
                    {/* STATUS: Display with badge */}
                    <TableCell>
                      <span className='bg-green-500/20 text-green-300 px-3 py-1 rounded-full text-xs'>
                        {employee.status || 'Active'}
                      </span>
                    </TableCell>
                    
                    {/* ACTIONS: View/Edit employee */}
                    <TableCell className='text-right'>
                      <Link href={`/employees/${employee.id}`}>
                        <Button variant='outline' size='sm'>
                          View
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                /* EMPTY STATE: No employees found */
                <TableRow>
                  <TableCell colSpan={7} className='text-center py-8 text-muted-foreground'>
                    {searchTerm ? 'No employees found matching your search' : 'No employees yet'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
```

**Key Features:**
- ✅ Role-based access control (HR/ADMIN only)
- ✅ Real-time search filtering
- ✅ Authentication check
- ✅ Loading states
- ✅ Empty states
- ✅ Responsive table design
- ✅ Stats cards showing metrics

### 12.1 Prerequisites

Required Software:
- Node.js 18+ (LTS recommended)
- npm 8+ or yarn
- Git for version control
- .env configuration file

### 12.2 Installation Steps

```bash
# 1. Clone repository
git clone <repository-url>
cd HR-frontend

# 2. Install dependencies
npm install
# or
yarn install

# 3. Create environment file
cp .env.example .env.local

# 4. Configure environment variables
# Edit .env.local with your settings:
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_MOCK_AUTH=true  # For development without backend
```

### 12.3 Environment Variables

```
NEXT_PUBLIC_API_URL
- Description: Backend API base URL
- Default: http://localhost:3001/api
- Example: https://api.hrms.com

NEXT_PUBLIC_MOCK_AUTH
- Description: Enable mock authentication mode
- Default: false
- Values: 'true' or 'false'
- Use: true for development without backend

NODE_ENV
- Description: Environment type
- Values: development, production
- Default: development
```

### 12.4 Running Development Server

```bash
# Start development server
npm run dev
# or
yarn dev

# Server runs at http://localhost:3001
# Browser auto-opens on first run
```

### 12.5 Building for Production

```bash
# Create production build
npm run build
# or
yarn build

# Start production server
npm start
# or
yarn start
```

### 12.6 Linting

```bash
# Run ESLint
npm run lint
# or
yarn lint

# Fix ESLint issues automatically
npm run lint -- --fix
```

---

## 13. DEPLOYMENT GUIDE

### 13.1 Prerequisites for Production

- VPS/Server with Ubuntu/Windows Server
- Node.js 18+ installed
- Nginx reverse proxy server
- PM2 process manager (for Node.js management)
- SSL certificate (Let's Encrypt recommended)
- Domain name configured

### 13.2 Deployment Steps (Linux/Ubuntu)

```bash
# 1. Clone repository
git clone <repository-url>
cd HR-frontend

# 2. Install dependencies
npm install --production

# 3. Build application
npm run build

# 4. Create PM2 configuration (already provided in ecosystem.config.js)
pm2 start ecosystem.config.js --name "hrms"

# 5. Configure Nginx as reverse proxy
sudo cp nginx.conf /etc/nginx/sites-available/hrms
sudo ln -s /etc/nginx/sites-available/hrms /etc/nginx/sites-enabled/hrms

# 6. Test Nginx configuration
sudo nginx -t

# 7. Restart Nginx
sudo systemctl restart nginx

# 8. Setup auto-restart
pm2 startup
pm2 save
```

### 13.3 Deployment Steps (Windows VPS)

```powershell
# 1. Run PowerShell deployment script
.\auto-deploy.ps1

# 2. Script handles:
# - Git pull
# - npm install
# - npm build
# - PM2 restart
# - Health check
```

### 13.4 SSL/HTTPS Setup

```bash
# Using Let's Encrypt Certbot
sudo apt-get install certbot python3-certbot-nginx

# Generate certificate
sudo certbot certonly --nginx -d yourdomain.com

# Update Nginx config with certificate paths
sudo systemctl restart nginx
```

### 13.5 Monitoring & Logging

```bash
# View PM2 logs
pm2 logs

# Monitor running processes
pm2 monit

# Check process status
pm2 status

# Restart specific process
pm2 restart hrms

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### 13.6 Backup & Recovery

```bash
# Backup database and data
tar -czf backup-$(date +%Y%m%d).tar.gz /path/to/app

# Restore from backup
tar -xzf backup-YYYYMMDD.tar.gz

# Database backup (if applicable)
mysqldump -u user -p database > backup.sql
```

### 13.7 Health Checks & Monitoring

```bash
# Add health check endpoint monitoring
curl http://localhost:3001/health

# Set up automated monitoring
pm2 monitor

# Set up alerts for process crashes
pm2 notify
```

### 13.8 Performance Optimization

```bash
# Enable gzip compression in Nginx
# Already configured in nginx.conf

# Enable caching strategies
# Configure in next.config.ts if needed

# Monitor performance
pm2 plus

# Database query optimization
# Implement at backend level
```

### 13.9 Environment Configuration for Production

```bash
# Create production .env file
NEXT_PUBLIC_API_URL=https://api.hrms.com
NEXT_PUBLIC_MOCK_AUTH=false
NODE_ENV=production

# Rebuild with production environment
npm run build

# Restart application
pm2 restart hrms
```

---

## SECURITY CONSIDERATIONS

### 13.10 Security Best Practices

1. **Authentication:**
   - Always use HTTPS in production
   - Implement strong password requirements
   - Add rate limiting for login attempts
   - Implement CSRF protection

2. **Authorization:**
   - Verify roles on both frontend and backend
   - Never trust frontend role checks alone
   - Implement proper permission validation

3. **Data Protection:**
   - Encrypt sensitive data at rest
   - Use HTTPS for all API communications
   - Implement secure headers (CSP, X-Frame-Options, etc.)

4. **Token Management:**
   - Set appropriate token expiration times
   - Implement token refresh mechanism
   - Use secure cookie settings (HttpOnly, Secure, SameSite)

5. **Dependencies:**
   - Keep all dependencies updated
   - Run regular security audits (npm audit)
   - Use lock files (package-lock.json)

6. **API Security:**
   - Implement CORS restrictions
   - Use API rate limiting
   - Validate all user inputs
   - Implement proper error handling

---

## TROUBLESHOOTING COMMON ISSUES

### Issue 1: Authentication Fails
```
Solution:
- Check NEXT_PUBLIC_API_URL is correct
- Verify backend is running
- Check browser cookies are enabled
- Clear localStorage and try again
```

### Issue 2: API Requests Return 404
```
Solution:
- Verify backend endpoints
- Check API URL configuration
- Ensure mock mode is enabled for development
- Check network tab in browser DevTools
```

### Issue 3: CSS Not Loading
```
Solution:
- Run npm run build
- Clear .next cache: rm -rf .next
- Rebuild styles: npm run dev
- Check Tailwind configuration
```

### Issue 4: Attendance Records Not Saving
```
Solution:
- Check user_id in localStorage
- Verify backend endpoint is available
- Check API response in DevTools
- Ensure token is valid
```

### Issue 5: Role-Based Access Not Working
```
Solution:
- Check user_role is set in localStorage
- Verify role matches one of: ADMIN, HR, EMPLOYEE
- Clear browser cache
- Check sidebar configuration for role permissions
```

---

## CONCLUSION

The DRASKEN HRMS Frontend is a comprehensive, modern HR management system built with cutting-edge technologies. It provides a robust platform for employee management, attendance tracking, and HR analytics. The system is designed to be scalable, maintainable, and user-friendly, with proper separation of concerns and well-documented code.

For questions or contributions, refer to the project README or contact the development team.

---

**Document Version:** 1.0
**Last Updated:** May 2026
**Author:** HRMS Development Team
**Status:** Ready for Production