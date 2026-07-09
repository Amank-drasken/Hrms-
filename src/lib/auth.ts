import { authAPI } from './api';
import { autoCheckOut, clearAttendanceSession } from './attendanceAuto';

export interface LoginResponse {
  message: string;
  access_token: string;
}

export const persistAuthSession = (token: string, userData: any, email: string) => {
  console.warn('🔐 persistAuthSession called with token:', token);
  
  // Ensure window is defined for client-side only
  if (typeof window === 'undefined') {
    console.warn('⚠️ Window is undefined - persistAuthSession cannot run on server');
    return;
  }
  
  // Store in localStorage - ensure it's actually saved
  try {
    localStorage.setItem('access_token', token);
    const verifyToken = localStorage.getItem('access_token');
    console.warn('✅ Token stored in localStorage. Verified:', verifyToken === token ? 'YES' : 'NO');
    
    if (verifyToken !== token) {
      console.error('❌ Token verification failed! Stored:', verifyToken, 'Expected:', token);
    }
  } catch (e) {
    console.error('❌ Failed to store token in localStorage:', e);
  }

  // Also set as cookie for middleware
  try {
    document.cookie = `access_token=${token}; path=/; max-age=86400; SameSite=Lax`;
    console.log('✅ Token stored in cookie');
  } catch (e) {
    console.error('❌ Failed to store token in cookie:', e);
  }

  // Store complete user data as JSON for profile pages
  try {
    localStorage.setItem('user_data', JSON.stringify(userData));
    localStorage.setItem('user_id', String(userData.id || ''));
    localStorage.setItem('user_firstName', userData.firstName || '');
    localStorage.setItem('user_lastName', userData.lastName || '');
    localStorage.setItem('user_email', userData.email || email);
    console.log('✅ User data stored in localStorage');
  } catch (e) {
    console.error('❌ Failed to store user data in localStorage:', e);
  }

  // Extract role from multiple sources
  let userRole = userData.role;

  // Try JWT payload if userData doesn't have role
  if (!userRole && token) {
    try {
      const parts = token.split('.');
      if (parts.length >= 2) {
        const decoded = JSON.parse(atob(parts[1]));
        console.log('🔐 JWT Decoded:', decoded);
        
        // Try multiple role field names
        userRole = decoded.role 
          || decoded.userRole 
          || decoded.user_role
          || decoded.roles?.[0]
          || decoded.permissions?.[0]
          || userData.role;
        
        if (userRole) {
          console.log('✅ Role found in JWT:', userRole);
        }
      }
    } catch (e) {
      console.error('❌ Failed to decode JWT', e);
    }
  }

  console.log('Final User Role:', userRole);

  // Fallback: Set default roles based on email for testing
  if (!userRole) {
    console.warn('No role found in response, using fallback logic');
    // Hardcode role for specific test accounts
    if (email === 'aman@test.com') userRole = 'EMPLOYEE';
    else if (email === 'admin@test.com') userRole = 'ADMIN';
    else if (email === 'hr@test.com') userRole = 'HR';
    // New test accounts
    else if (email === 'rajesh@company.com') userRole = 'ADMIN';
    else if (email === 'priya@company.com') userRole = 'HR';
    else if (email === 'amit@company.com') userRole = 'EMPLOYEE';
    else if (email === 'neha@company.com') userRole = 'EMPLOYEE';
    else if (email === 'vikram@company.com') userRole = 'EMPLOYEE';
    // Existing users
    else if (email === 'vansh@gmail.com') userRole = 'ADMIN';
    else userRole = 'EMPLOYEE'; // default fallback
  }

  if (userRole) {
    try {
      localStorage.setItem('user_role', userRole);
      console.log('✅ Role set to:', userRole);
    } catch (e) {
      console.error('❌ Failed to store user role:', e);
    }
  }
};

// Quick one-click mock login — no email/password needed.
export const quickMockLogin = (role: 'ADMIN' | 'HR' | 'EMPLOYEE') => {
  const MOCK_PROFILES = {
    ADMIN:    { id: 'mock-admin-1',    firstName: 'Rajesh',  lastName: 'Kumar',  email: 'admin@hrportal.com'    },
    HR:       { id: 'mock-hr-1',       firstName: 'Priya',   lastName: 'Sharma', email: 'hr@hrportal.com'       },
    EMPLOYEE: { id: 'mock-employee-1', firstName: 'Amit',    lastName: 'Verma',  email: 'emp@hrportal.com'      },
  };
  const profile = MOCK_PROFILES[role];
  const mockToken = 'mock-access-token';
  persistAuthSession(mockToken, { ...profile, role }, profile.email);
  return { message: 'Mock login successful', access_token: mockToken };
};

export const loginUser = async (email: string, password: string, role?: string): Promise<LoginResponse> => {
  console.warn('🔑 loginUser called with email:', email);
  const normalizedEmail = (email || '').trim().toLowerCase();
  const isMockAuthEnabled = process.env.NEXT_PUBLIC_MOCK_AUTH === 'true';

  const MOCK_ACCOUNTS: Record<string, { password: string; id: string; firstName: string; lastName: string; role: string }> = {
    'admin@hr.com': { password: 'Admin@123', id: 'mock-admin-1', firstName: 'Rajesh', lastName: 'Kumar', role: 'ADMIN' },
    'hr@hr.com': { password: 'Hr@123', id: 'mock-hr-1', firstName: 'Priya', lastName: 'Sharma', role: 'HR' },
    'emp@hr.com': { password: 'Emp@123', id: 'mock-employee-1', firstName: 'Amit', lastName: 'Verma', role: 'EMPLOYEE' },
  };

  const mockAccount = MOCK_ACCOUNTS[normalizedEmail];
  const isMockCredentialMatch = !!mockAccount && mockAccount.password === password;

  if (isMockAuthEnabled || isMockCredentialMatch) {
    const mockToken = 'mock-access-token';
    persistAuthSession(mockToken, { ...mockAccount, email: normalizedEmail }, normalizedEmail);
    return { message: 'Mock login successful', access_token: mockToken };
  }

  try {
    const response = await authAPI.login(normalizedEmail, password);
    const token = response.data.access_token;
    const userData = response.data.employee || response.data.user || response.data;

    console.log('Login Response:', response.data);
    console.log('User Data:', userData);

    persistAuthSession(token, userData, normalizedEmail);

    return response.data;
  } catch (error: any) {
    const fallbackAccount = MOCK_ACCOUNTS[normalizedEmail];
    const fallbackMatch = !!fallbackAccount && fallbackAccount.password === password;

    if (fallbackMatch) {
      const mockToken = 'mock-access-token';
      persistAuthSession(mockToken, { ...fallbackAccount, email: normalizedEmail }, normalizedEmail);
      return { message: 'Mock login successful', access_token: mockToken };
    }

    throw error;
  }
};

export const logoutUser = async () => {
  try {
    // Auto check-out when employee logs out
    await autoCheckOut();
    clearAttendanceSession();
  } catch (error) {
    console.error('Auto check-out error:', error);
  }

  // Clear localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_id');
  localStorage.removeItem('user_firstName');
  localStorage.removeItem('user_lastName');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_role');
  
  // Clear cookies
  if (typeof window !== 'undefined') {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    // Check localStorage first
    const localToken = localStorage.getItem('access_token');
    if (localToken) return localToken;
    
    // Check cookies
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [name, value] = cookie.trim().split('=');
      if (name === 'access_token') {
        return decodeURIComponent(value);
      }
    }
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const getUserRole = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('user_role');
  }
  return null;
};

export const hasRole = (role: string): boolean => {
  const userRole = getUserRole();
  return userRole === role;
};

export const hasAnyRole = (roles: string[]): boolean => {
  const userRole = getUserRole();
  return roles.includes(userRole || '');
};
