// Role-based access control helper
export type UserRole = 'ADMIN' | 'HR' | 'EMPLOYEE';

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  ADMIN: ['view_all_employees', 'create_employee', 'delete_employee', 'manage_attendance', 'view_analytics'],
  HR: ['view_employees', 'create_employee', 'manage_attendance', 'view_analytics'],
  EMPLOYEE: ['view_own_attendance', 'check_in_out'],
};

export const getUserRole = (): UserRole | null => {
  if (typeof window !== 'undefined') {
    const role = localStorage.getItem('user_role');
    return role as UserRole | null;
  }
  return null;
};

export const hasRole = (requiredRole: UserRole): boolean => {
  const userRole = getUserRole();
  return userRole === requiredRole;
};

export const hasAnyRole = (requiredRoles: UserRole[]): boolean => {
  const userRole = getUserRole();
  return userRole ? requiredRoles.includes(userRole) : false;
};

export const canAccessPage = (requiredRoles: UserRole[]): boolean => {
  return hasAnyRole(requiredRoles);
};

export const canPerformAction = (action: string): boolean => {
  const userRole = getUserRole();
  if (!userRole) return false;
  const permissions = ROLE_PERMISSIONS[userRole];
  return permissions.includes(action);
};
